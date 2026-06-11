import { CreditCard, Loader2 } from "lucide-react";
// ,Printer 
import type {
  AppointmentPOS,
  CartItem,
  PaymentSummary as PaymentSummaryValue,
} from "../types/payment.type";
import type { CreateMedicalRecordRequest } from "@/types/medicalRecord.type";
import CartItemRow from "./CartItemRow";
import PaymentSummary from "./PaymentSummary";
import SelectedAppointmentCard from "./SelectedAppointmentCard";

interface CartSidebarProps {
  cartItems: CartItem[];
  lastInvoiceId: string;
  medicalRecordForm: Pick<
    CreateMedicalRecordRequest,
    "diagnosis" | "treatment" | "prescription" | "medicalRecordNote"
  >;
  paying: boolean;
  selectedAppointment: AppointmentPOS | null;
  summary: PaymentSummaryValue;
  totalQuantity: number;
  onCreateAndConfirmInvoice: () => void;
  onDecreaseQuantity: (itemId: string) => void;
  onIncreaseQuantity: (itemId: string) => void;
  onMedicalRecordFieldChange: (
    field: keyof Pick<
      CreateMedicalRecordRequest,
      "diagnosis" | "treatment" | "prescription" | "medicalRecordNote"
    >,
    value: string,
  ) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartSidebar = ({
  cartItems,
  // lastInvoiceId,
  medicalRecordForm,
  paying,
  selectedAppointment,
  summary,
  totalQuantity,
  onCreateAndConfirmInvoice,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onMedicalRecordFieldChange,
  onRemoveItem,
}: CartSidebarProps) => {
  const paymentDisabled = paying || cartItems.length === 0;
  const medicalRecordFields = [
    {
      field: "diagnosis",
      label: "Chuẩn đoán",
      placeholder: "Nhập chẩn đoán...",
      required: true,
      value: medicalRecordForm.diagnosis,
    },
    {
      field: "treatment",
      label: "Hướng điều trị",
      placeholder: "Nhập hướng điều trị...",
      required: false,
      value: medicalRecordForm.treatment,
    },
    {
      field: "prescription",
      label: "Đơn thuốc",
      placeholder: "Nhập đơn thuốc...",
      required: false,
      value: medicalRecordForm.prescription,
    },
    {
      field: "medicalRecordNote",
      label: "Ghi chú hồ sơ y tế",
      placeholder: "Nhập ghi chú hồ sơ y tế...",
      required: false,
      value: medicalRecordForm.medicalRecordNote,
    },
  ] as const;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6 xl:self-start">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-950">Đơn hàng</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {totalQuantity} item
        </span>
      </div>

      <div className="mb-5">
        {selectedAppointment ? (
          <div className="space-y-3">
            <SelectedAppointmentCard appointment={selectedAppointment} compact />
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-bold text-slate-950">
                  Hồ sơ y tế
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Thông tin này sẽ được lưu vào medical record của thú cưng.
                </p>
              </div>
              {medicalRecordFields.map((item) => (
                <label key={item.field} className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                    {item.label}
                    {item.required ? (
                      <span className="ml-1 text-[#D56756]">*</span>
                    ) : null}
                  </span>
                  <textarea
                    name={item.field}
                    value={item.value}
                    onChange={(event) =>
                      onMedicalRecordFieldChange(item.field, event.target.value)
                    }
                    placeholder={item.placeholder}
                    className="min-h-20 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#D56756] focus:ring-2 focus:ring-[#D56756]/15"
                  />
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-950">Khách vãng lai</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Không chọn lịch hẹn: hóa đơn sẽ được tạo cho khách vãng lai
            </p>
          </div>
        )}
      </div>

      <div className="min-h-32 space-y-3">
        {cartItems.length > 0 ? (
          cartItems.map((cartItem) => (
            <CartItemRow
              key={cartItem.item.id}
              cartItem={cartItem}
              onDecreaseQuantity={onDecreaseQuantity}
              onIncreaseQuantity={onIncreaseQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))
        ) : (
          <div className="flex min-h-28 items-center justify-center text-sm font-medium text-slate-500">
            Chưa có item nào
          </div>
        )}
      </div>

      <div className="my-6 border-t border-slate-200" />

      <PaymentSummary summary={summary} />

      <button
        type="button"
        disabled={paymentDisabled}
        onClick={onCreateAndConfirmInvoice}
        className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff8a4c] to-[#38bdb2] text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-100"
      >
        {paying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        {paying ? "Đang xử lý..." : "Thanh toán"}
      </button>

      {/* <button
        type="button"
        disabled={!lastInvoiceId}
        onClick={() => window.print()}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-100 text-sm font-bold text-slate-400 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-100"
      >
        <Printer className="h-4 w-4" />
        In hóa đơn
      </button> */}
    </aside>
  );
};

export default CartSidebar;
