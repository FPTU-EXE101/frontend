import { useCallback, useEffect, useMemo, useState } from "react";
import appointmentApi from "@/apis/appointmentAPI";
import { getBackendErrorMessage } from "@/utils/getBackendErrorMessage";
import invoiceApi from "@/apis/invoiceAPI";
import itemApi from "@/apis/itemsAPI";
import medicalRecordApi from "@/apis/medicalRecordAPI";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import type { Appointment } from "@/types/appointment.type";
import type { CreateInvoice } from "@/types/invoice.type";
import type { CreateMedicalRecordRequest } from "@/types/medicalRecord.type";
import type { Items } from "@/types/item.type";
import type { Pet } from "@/types/pet.type";
import type { User } from "@/types/user.type";
import type {
  AppointmentPOS,
  CartItem,
  InvoiceCreateResponseData,
} from "../types/payment.type";
import {
  calculateTotal,
  getInvoiceAppointmentId,
  getInvoiceId,
  isConfirmedAppointment,
  isProductItem,
  isServiceItem,
  mapCartToCreateInvoiceDetails,
  normalizeList,
  toDateOnly,
  toAppointmentDateTime,
} from "../utils/payment.utils";
import { useDebounce } from "@/hooks/useDebounce";

interface UsePOSPaymentOptions {
  initialAppointmentId?: string;
}

export const usePOSPayment = ({
  initialAppointmentId = "",
}: UsePOSPaymentOptions = {}) => {
  const [items, setItems] = useState<Items[]>([]);
  const [appointments, setAppointments] = useState<AppointmentPOS[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentPOS | null>(null);
  const [medicalRecordForm, setMedicalRecordForm] = useState({
    diagnosis: "",
    medicalRecordNote: "",
    prescription: "",
    treatment: "",
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentSearchTerm, setAppointmentSearchTerm] = useState("");
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lastInvoiceId, setLastInvoiceId] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const debouncedAppointmentSearchTerm = useDebounce(appointmentSearchTerm);

  const fetchItems = useCallback(async (signal?: AbortSignal) => {
    setLoadingItems(true);
    setError("");

    try {
      const response = await itemApi.getAllItems({ signal });
      setItems(normalizeList<Items>(response?.data));
    } catch (err) {
      if (signal?.aborted) return;
      console.error(err);
      setError(getBackendErrorMessage(err));
    } finally {
      if (!signal?.aborted) {
        setLoadingItems(false);
      }
    }
  }, []);

  const fetchAppointments = useCallback(async (signal?: AbortSignal) => {
    setLoadingAppointments(true);
    setError("");

    try {
      const [appointmentResponse, invoiceResponse] = await Promise.all([
        appointmentApi.getAllAppointments({ signal }),
        invoiceApi.getAllInvoices({ signal }),
      ]);

      const appointmentData = normalizeList<Appointment>(
        appointmentResponse?.data,
      );
      const invoiceData = normalizeList<unknown>(invoiceResponse?.data);
      const invoicedAppointmentIds = new Set(
        invoiceData.map(getInvoiceAppointmentId).filter(Boolean),
      );

      const payableAppointments = appointmentData.filter(
        (appointment) =>
          isConfirmedAppointment(appointment) &&
          !invoicedAppointmentIds.has(appointment.id),
      );

      const petIds = Array.from(
        new Set(payableAppointments.map((appointment) => appointment.petId)),
      ).filter(Boolean);
      const customerIds = Array.from(
        new Set(
          payableAppointments.map((appointment) => appointment.customerId),
        ),
      ).filter(Boolean);

      const [petResponses, customerResponses] = await Promise.all([
        Promise.allSettled(petIds.map((id) => petApi.getPetById(id, { signal }))),
        Promise.allSettled(
          customerIds.map((id) => userApi.getUserById(id, { signal })),
        ),
      ]);

      const petNames = petResponses.reduce<Record<string, string>>(
        (result, response) => {
          if (response.status === "fulfilled") {
            const pet = response.value?.data as Pet | undefined;
            if (pet?.id) result[pet.id] = pet.name;
          }
          return result;
        },
        {},
      );

      const customerNames = customerResponses.reduce<Record<string, string>>(
        (result, response) => {
          if (response.status === "fulfilled") {
            const user = response.value?.data as User | undefined;
            if (user?.id) {
              result[user.id] =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.userName ||
                user.email ||
                user.id;
            }
          }
          return result;
        },
        {},
      );

      const appointmentPOSItems = payableAppointments.map<AppointmentPOS>(
        (appointment) => ({
          appointmentDate: toAppointmentDateTime(appointment),
          appointmentNote: appointment.appointmentNote,
          customerId: appointment.customerId,
          customerName:
            customerNames[appointment.customerId] || appointment.customerId,
          endTime: appointment.endTime,
          id: appointment.id,
          paymentStatus: "Chưa thanh toán",
          petId: appointment.petId,
          petName: petNames[appointment.petId] || appointment.petId,
          startTime: appointment.startTime,
          status: appointment.status,
        }),
      );

      setAppointments(appointmentPOSItems);

      if (initialAppointmentId) {
        const initialAppointment = appointmentPOSItems.find(
          (appointment) => appointment.id === initialAppointmentId,
        );
        if (initialAppointment) {
          setSelectedAppointment(initialAppointment);
        }
      }
    } catch (err) {
      if (signal?.aborted) return;
      console.error(err);
      setError(getBackendErrorMessage(err));
    } finally {
      if (!signal?.aborted) {
        setLoadingAppointments(false);
      }
    }
  }, [initialAppointmentId]);

  useEffect(() => {
    const controller = new AbortController();

    fetchItems(controller.signal);
    fetchAppointments(controller.signal);

    return () => controller.abort();
  }, [fetchAppointments, fetchItems]);

  const visibleAppointments = useMemo(() => {
    const query = debouncedAppointmentSearchTerm.trim().toLowerCase();
    if (!query) return appointments;

    return appointments.filter((appointment) => {
      const searchable = [
        appointment.id,
        appointment.petName,
        appointment.customerName,
        appointment.appointmentDate,
        appointment.appointmentNote,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [appointments, debouncedAppointmentSearchTerm]);

  const filteredItems = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [debouncedSearchTerm, items]);

  const serviceItems = useMemo(
    () => filteredItems.filter(isServiceItem),
    [filteredItems],
  );

  const productItems = useMemo(
    () => filteredItems.filter(isProductItem),
    [filteredItems],
  );

  const summary = useMemo(() => calculateTotal(cartItems), [cartItems]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0),
    [cartItems],
  );

  const handleSelectAppointment = (appointment: AppointmentPOS) => {
    setSelectedAppointment(appointment);
    setMedicalRecordForm({
      diagnosis: "",
      medicalRecordNote: "",
      prescription: "",
      treatment: "",
    });
    setError("");
  };

  const handleMedicalRecordFieldChange = (
    field: keyof Pick<
      CreateMedicalRecordRequest,
      "diagnosis" | "treatment" | "prescription" | "medicalRecordNote"
    >,
    value: string,
  ) => {
    setMedicalRecordForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAddItem = (item: Items) => {
    setCartItems((current) => {
      const existed = current.find((cartItem) => cartItem.item.id === item.id);

      if (existed) {
        return current.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...current, { item, quantity: 1 }];
    });
  };

  const handleIncreaseQuantity = (itemId: string) => {
    setCartItems((current) =>
      current.map((cartItem) =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      ),
    );
  };

  const handleDecreaseQuantity = (itemId: string) => {
    setCartItems((current) =>
      current
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((current) =>
      current.filter((cartItem) => cartItem.item.id !== itemId),
    );
  };

  const resetCart = () => {
    setCartItems([]);
  };

  const handleCreateAndConfirmInvoice = async () => {
    if (paying) return;

    setError("");
    setSuccess("");

    if (cartItems.length === 0) {
      setError("Vui lòng chọn ít nhất một item");
      return;
    }

    const payingAppointment = selectedAppointment;

    if (payingAppointment && !isConfirmedAppointment(payingAppointment)) {
      setError("Chỉ có thể thanh toán lịch hẹn đã xác nhận.");
      return;
    }

    if (payingAppointment && !medicalRecordForm.diagnosis.trim()) {
      setError("Vui lòng nhập chẩn đoán y tế.");
      return;
    }

    const details = mapCartToCreateInvoiceDetails(cartItems);
    const payload: CreateInvoice = payingAppointment
      ? {
          appointmentId: payingAppointment.id,
          customerId: payingAppointment.customerId,
          details,
          petId: payingAppointment.petId,
        }
      : {
          details,
        };

    setPaying(true);

    let invoiceId = "";

    try {
      const invoiceResponse = await invoiceApi.createInvoice(payload);
      const responseData = invoiceResponse?.data as InvoiceCreateResponseData;
      invoiceId =
        responseData.id || responseData.data?.id || getInvoiceId(responseData);

      if (!invoiceId) {
        throw new Error("Không lấy được invoice id từ response.");
      }
    } catch (err) {
      console.error(err);
      setError(getBackendErrorMessage(err));
      setPaying(false);
      return;
    }

    try {
      await invoiceApi.confirmInvoice(invoiceId);
      setLastInvoiceId(invoiceId);
      if (payingAppointment) {
        if (!payingAppointment.petId) {
          setError("Không thể cập nhật lịch hẹn vì thiếu petId.");
          return;
        }

        try {
          await medicalRecordApi.createMedicalRecord({
            appointmentId: payingAppointment.id,
            createAt: new Date().toISOString(),
            diagnosis: medicalRecordForm.diagnosis.trim(),
            medicalRecordNote: medicalRecordForm.medicalRecordNote.trim(),
            petId: payingAppointment.petId,
            prescription: medicalRecordForm.prescription.trim(),
            treatment: medicalRecordForm.treatment.trim(),
          });

          await appointmentApi.updateAppointment(payingAppointment.id, {
            appointmentDate: toDateOnly(payingAppointment.appointmentDate),
            appointmentNote:
              payingAppointment.appointmentNote?.trim() || "Không có ghi chú",
            customerId: payingAppointment.customerId,
            endTime: payingAppointment.endTime,
            petId: payingAppointment.petId,
            startTime: payingAppointment.startTime,
            status: 1,
          });
        } catch (err) {
          console.error(err);
          setError(getBackendErrorMessage(err));
          return;
        }

        resetCart();
        setSelectedAppointment(null);
        setMedicalRecordForm({
          diagnosis: "",
          medicalRecordNote: "",
          prescription: "",
          treatment: "",
        });
        setAppointmentSearchTerm("");
        setAppointments((current) =>
          current.filter(
            (appointment) => appointment.id !== payingAppointment.id,
          ),
        );
        await fetchAppointments();
      } else {
        resetCart();
      }
      setSuccess("Thanh toán thành công.");
    } catch (err) {
      console.error(err);
      setError(getBackendErrorMessage(err));
    } finally {
      setPaying(false);
    }
  };

  return {
    appointmentSearchTerm,
    appointments,
    cartItems,
    error,
    fetchAppointments,
    fetchItems,
    handleAddItem,
    handleCreateAndConfirmInvoice,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleMedicalRecordFieldChange,
    handleRemoveItem,
    handleSelectAppointment,
    lastInvoiceId,
    loadingAppointments,
    loadingItems,
    medicalRecordForm,
    paying,
    productItems,
    resetCart,
    searchTerm,
    selectedAppointment,
    serviceItems,
    setAppointmentSearchTerm,
    setSearchTerm,
    success,
    summary,
    totalQuantity,
    visibleAppointments,
  };
};
