import { CreditCard, Loader2 } from "lucide-react";
// ,Printer 
import type {
  AppointmentPOS,
  CartItem,
  PaymentSummary as PaymentSummaryValue,
} from "../types/payment.type";
import CartItemRow from "./CartItemRow";
import PaymentSummary from "./PaymentSummary";
import SelectedAppointmentCard from "./SelectedAppointmentCard";

interface CartSidebarProps {
  cartItems: CartItem[];
  lastInvoiceId: string;
  paying: boolean;
  selectedAppointment: AppointmentPOS | null;
  summary: PaymentSummaryValue;
  totalQuantity: number;
  onCreateAndConfirmInvoice: () => void;
  onDecreaseQuantity: (itemId: string) => void;
  onIncreaseQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartSidebar = ({
  cartItems,
  // lastInvoiceId,
  paying,
  selectedAppointment,
  summary,
  totalQuantity,
  onCreateAndConfirmInvoice,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
}: CartSidebarProps) => {
  const paymentDisabled = paying || cartItems.length === 0;

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
          <SelectedAppointmentCard appointment={selectedAppointment} compact />
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
