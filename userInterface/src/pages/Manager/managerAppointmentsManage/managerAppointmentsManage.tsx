import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Home, Plus } from "lucide-react";
import appointmentApi from "@/apis/appointmentAPI";
import reminderApi from "@/apis/appointmentReminderAPI";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import { Button } from "@/components/ui/button";
import type { Appointment, CreateAppointmentRequest } from "@/types/appointment.type";
import type { AppointmentRemind } from "@/types/appointmentRemind.type";
import type { AppointmentStatus, ReminderStatus } from "@/types/enum.type";
import type { Pet } from "@/types/pet.type";
import type { User } from "@/types/user.type";
import type { UserProfileValues } from "@/types/userProfile.type";
import { DEFAULT_FORM } from "./appointment.constants";
import AppointmentCalendar from "./components/AppointmentCalendar";
import AppointmentFormModal from "./components/AppointmentFormModal";
import AppointmentList from "./components/AppointmentList";
import type { AppointmentFormState, StatusFilter } from "./types";
import {
  addThirtyMinutes,
  formatDateLabel,
  normalizeDateKey,
  normalizeList,
  normalizeTime,
  toDateKey,
  toDateTimeInput,
  toTimeInput,
} from "./utils";

const ManagerAppointmentsManage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<AppointmentRemind[]>([]);
  const [petNames, setPetNames] = useState<Record<string, string>>({});
  const [customerNames, setCustomerNames] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(new Date()));
  const [viewDate, setViewDate] = useState(() => new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<AppointmentFormState | null>(null);
  const [users, setUsers] = useState<UserProfileValues[]>([]);
  const [customerInputMode, setCustomerInputMode] = useState<
    "manual" | "email"
  >("manual");
  const [userSearch, setUserSearch] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<UserProfileValues | null>(
    null,
  );
  const [ownerPets, setOwnerPets] = useState<Pet[]>([]);
  const [ownerPetsLoading, setOwnerPetsLoading] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const [appointmentResponse, reminderResponse] = await Promise.all([
        appointmentApi.getAllAppointments(),
        reminderApi.getAllReminders(),
      ]);

      const appointmentData = normalizeList<Appointment>(
        appointmentResponse?.data,
      );
      const reminderData = normalizeList<AppointmentRemind>(
        reminderResponse?.data,
      );

      setAppointments(appointmentData);
      setReminders(reminderData);
      await loadRelatedNames(appointmentData);
    } catch (err) {
      console.error(err);
      setError("Không tải được danh sách lịch hẹn. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedNames = async (appointmentData: Appointment[]) => {
    const petIds = Array.from(
      new Set(appointmentData.map((appointment) => appointment.petId)),
    ).filter(Boolean);
    const customerIds = Array.from(
      new Set(appointmentData.map((appointment) => appointment.customerId)),
    ).filter(Boolean);

    const [petResponses, customerResponses] = await Promise.all([
      Promise.allSettled(petIds.map((id) => petApi.getPetById(id))),
      Promise.allSettled(customerIds.map((id) => userApi.getUserById(id))),
    ]);

    setPetNames(
      petResponses.reduce<Record<string, string>>((result, response) => {
        if (response.status === "fulfilled") {
          const pet = response.value?.data as Pet | undefined;
          if (pet?.id) result[pet.id] = pet.name;
        }
        return result;
      }, {}),
    );

    setCustomerNames(
      customerResponses.reduce<Record<string, string>>((result, response) => {
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
      }, {}),
    );
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response?.data ?? []);
      } catch (err) {
        console.error("Không tải được danh sách người dùng", err);
      }
    };

    loadUsers();
  }, []);

  const reminderByAppointmentId = useMemo(
    () =>
      reminders.reduce<Record<string, AppointmentRemind>>((result, reminder) => {
        result[reminder.appointmentId] = reminder;
        return result;
      }, {}),
    [reminders],
  );

  const appointmentsByDate = useMemo(
    () =>
      appointments.reduce<Record<string, Appointment[]>>((result, appointment) => {
        const key = normalizeDateKey(appointment.appointmentDate);
        result[key] = [...(result[key] ?? []), appointment];
        return result;
      }, {}),
    [appointments],
  );

  const visibleAppointments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return (appointmentsByDate[selectedDate] ?? [])
      .filter((appointment) =>
        statusFilter === "all" ? true : appointment.status === statusFilter,
      )
      .filter((appointment) => {
        if (!query) return true;
        const searchable = [
          appointment.appointmentNote,
          appointment.customerId,
          appointment.petId,
          petNames[appointment.petId],
          customerNames[appointment.customerId],
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchable.includes(query);
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [
    appointmentsByDate,
    customerNames,
    petNames,
    searchTerm,
    selectedDate,
    statusFilter,
  ]);

  const statusCounts = useMemo(
    () =>
      appointments.reduce<Record<AppointmentStatus, number>>(
        (result, appointment) => {
          result[appointment.status] += 1;
          return result;
        },
        { 0: 0, 1: 0, 2: 0 },
      ),
    [appointments],
  );

  const ownerOptions = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    if (!query) return [];

    return users
      .filter((user) => {
        const email = user.email?.toString?.() ?? "";
        const userName = user.userName?.toString?.() ?? "";
        return (
          email.toLowerCase().includes(query) ||
          userName.toLowerCase().includes(query)
        );
      })
      .slice(0, 6);
  }, [userSearch, users]);

  const bookedSlots = useMemo(() => {
    if (!form?.appointmentDate) return [];

    return appointments
      .filter((appointment) => {
        const isSameDate =
          normalizeDateKey(appointment.appointmentDate) === form.appointmentDate;
        const isActive = appointment.status === 0 || appointment.status === 1;
        const isCurrentAppointment = form.id === appointment.id;
        return isSameDate && isActive && !isCurrentAppointment;
      })
      .map((appointment) => toTimeInput(appointment.startTime));
  }, [appointments, form]);

  const openCreateForm = () => {
    setCustomerInputMode("manual");
    setUserSearch("");
    setSelectedOwner(null);
    setOwnerPets([]);
    setForm({
      ...DEFAULT_FORM,
      appointmentDate: selectedDate,
    });
  };

  const openEditForm = (appointment: Appointment) => {
    const reminder = reminderByAppointmentId[appointment.id];
    setCustomerInputMode("manual");
    setUserSearch("");
    setSelectedOwner(null);
    setOwnerPets([]);
    setForm({
      id: appointment.id,
      customerId: appointment.customerId,
      petId: appointment.petId,
      appointmentDate: normalizeDateKey(appointment.appointmentDate),
      startTime: toTimeInput(appointment.startTime),
      endTime: toTimeInput(appointment.endTime),
      appointmentNote: appointment.appointmentNote,
      reminderId: reminder?.id,
      reminderTime: toDateTimeInput(reminder?.reminderTime ?? ""),
      reminderStatus: reminder?.status ?? 0,
    });
  };

  const updateForm = (field: keyof AppointmentFormState, value: string) => {
    setForm((current) => {
      if (!current) return current;
      if (field === "startTime") {
        return {
          ...current,
          startTime: value,
          endTime: value ? addThirtyMinutes(value) : "",
        };
      }
      if (field === "appointmentDate") {
        return {
          ...current,
          appointmentDate: value,
          startTime: "",
          endTime: "",
        };
      }
      return { ...current, [field]: value };
    });
  };

  const updateReminderStatus = (status: ReminderStatus) => {
    setForm((current) =>
      current ? { ...current, reminderStatus: status } : current,
    );
  };

  const closeForm = () => {
    if (!saving) setForm(null);
  };

  const handleCustomerInputModeChange = (mode: "manual" | "email") => {
    setCustomerInputMode(mode);
    setUserSearch("");
    setSelectedOwner(null);
    setOwnerPets([]);
    setForm((current) =>
      current
        ? {
            ...current,
            customerId: "",
            petId: "",
          }
        : current,
    );
  };

  const handleOwnerSearchChange = (value: string) => {
    setUserSearch(value);
    setSelectedOwner(null);
    setOwnerPets([]);
    setForm((current) =>
      current ? { ...current, customerId: "", petId: "" } : current,
    );
  };

  const handleOwnerSelect = async (owner: UserProfileValues) => {
    setSelectedOwner(owner);
    setUserSearch("");
    setOwnerPets([]);
    setError("");
    setForm((current) =>
      current
        ? {
            ...current,
            customerId: owner.id,
            petId: "",
          }
        : current,
    );

    if (!owner.id) {
      setError("Khách hàng chưa có ID hợp lệ.");
      return;
    }

    try {
      setOwnerPetsLoading(true);
      const response = await petApi.getPetByCustomerId(owner.id);
      setOwnerPets(response?.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Không tải được thú cưng của khách hàng này.");
    } finally {
      setOwnerPetsLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 2500);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");

    if (bookedSlots.includes(form.startTime)) {
      setSaving(false);
      setError("Khung giờ này đã có lịch hẹn. Vui lòng chọn khung giờ khác.");
      return;
    }

    const payload: CreateAppointmentRequest = {
      customerId: form.customerId.trim(),
      petId: form.petId.trim(),
      appointmentDate: form.appointmentDate,
      startTime: normalizeTime(form.startTime),
      endTime: normalizeTime(form.endTime),
      appointmentNote: form.appointmentNote.trim() || "Không có ghi chú",
    };

    try {
      const appointmentResponse = form.id
        ? await appointmentApi.updateAppointment(form.id, payload)
        : await appointmentApi.createAppointment(payload);

      const savedAppointment =
        (appointmentResponse?.data as Appointment | undefined) ?? null;
      const appointmentId = form.id || savedAppointment?.id;

      if (appointmentId && form.reminderTime) {
        if (form.reminderId) {
          await reminderApi.updateReminder(form.reminderId, {
            appointmentId,
            reminderTime: form.reminderTime,
            status: form.reminderStatus,
          });
        } else {
          await reminderApi.createRemind({
            appointmentId,
            reminderTime: form.reminderTime,
          });
        }
      }

      setForm(null);
      setSelectedDate(form.appointmentDate);
      showSuccess(
        form.id ? "Cập nhật lịch hẹn thành công." : "Tạo lịch hẹn thành công.",
      );
      await loadAppointments();
    } catch (err) {
      console.error(err);
      setError("Lưu lịch hẹn thất bại. Vui lòng kiểm tra dữ liệu và thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAppointment = async (appointment: Appointment) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa lịch hẹn này không?");
    if (!confirmed) return;

    setDeletingId(appointment.id);
    setError("");

    try {
      await appointmentApi.deleteAppointment(appointment.id);
      setAppointments((current) =>
        current.filter((item) => item.id !== appointment.id),
      );
      setReminders((current) =>
        current.filter((item) => item.appointmentId !== appointment.id),
      );
      showSuccess("Đã xóa lịch hẹn.");
    } catch (err) {
      console.error(err);
      setError("Xóa lịch hẹn thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteReminder = async (reminder: AppointmentRemind) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa nhắc lịch này không?");
    if (!confirmed) return;

    setError("");

    try {
      await reminderApi.deleteReminder(reminder.id);
      setReminders((current) => current.filter((item) => item.id !== reminder.id));
      showSuccess("Đã xóa nhắc lịch.");
    } catch (err) {
      console.error(err);
      setError("Xóa nhắc lịch thất bại. Vui lòng thử lại.");
    }
  };

  const moveMonth = (step: number) => {
    setViewDate(
      (current) => new Date(current.getFullYear(), current.getMonth() + step, 1),
    );
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Home className="h-4 w-4" />
            <span>/</span>
            <span className="text-slate-900">Lịch hẹn</span>
          </div>
          <h1 className="text-3xl font-semibold text-slate-950">Lịch hẹn</h1>
          <p className="mt-2 text-sm text-slate-600">
            Quản lý lịch hẹn khách hàng
          </p>
        </div>

        <Button
          onClick={openCreateForm}
          className="h-11 rounded-full bg-[#D56756] px-6 text-white hover:bg-[#b2483c]"
        >
          <Plus className="h-4 w-4" />
          Thêm lịch hẹn mới
        </Button>
      </section>

      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[28rem_1fr]">
        <AppointmentCalendar
          appointmentsByDate={appointmentsByDate}
          selectedDate={selectedDate}
          statusCounts={statusCounts}
          viewDate={viewDate}
          onMoveMonth={moveMonth}
          onSelectDate={setSelectedDate}
        />

        <AppointmentList
          customerNames={customerNames}
          deletingId={deletingId}
          loading={loading}
          petNames={petNames}
          reminderByAppointmentId={reminderByAppointmentId}
          searchTerm={searchTerm}
          selectedDayTitle={formatDateLabel(selectedDate)}
          statusFilter={statusFilter}
          visibleAppointments={visibleAppointments}
          onCreate={openCreateForm}
          onDeleteAppointment={handleDeleteAppointment}
          onDeleteReminder={handleDeleteReminder}
          onEdit={openEditForm}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {form && (
        <AppointmentFormModal
          bookedSlots={bookedSlots}
          customerInputMode={customerInputMode}
          form={form}
          ownerOptions={ownerOptions}
          ownerPets={ownerPets}
          ownerPetsLoading={ownerPetsLoading}
          saving={saving}
          selectedOwner={selectedOwner}
          userSearch={userSearch}
          onClose={closeForm}
          onCustomerInputModeChange={handleCustomerInputModeChange}
          onOwnerSelect={handleOwnerSelect}
          onOwnerSearchChange={handleOwnerSearchChange}
          onSubmit={handleSubmit}
          onUpdateForm={updateForm}
          onUpdateReminderStatus={updateReminderStatus}
        />
      )}
    </div>
  );
};

export default ManagerAppointmentsManage;
