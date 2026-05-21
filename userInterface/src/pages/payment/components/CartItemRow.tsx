import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../types/payment.type";
import {
  calculateSubtotal,
  formatCurrency,
  getItemTypeLabel,
} from "../utils/payment.utils";

interface CartItemRowProps {
  cartItem: CartItem;
  onDecreaseQuantity: (itemId: string) => void;
  onIncreaseQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItemRow = ({
  cartItem,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onRemoveItem,
}: CartItemRowProps) => {
  const subtotal = calculateSubtotal(cartItem);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-950">
            {cartItem.item.name}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {getItemTypeLabel(cartItem.item.type)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemoveItem(cartItem.item.id)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Xóa ${cartItem.item.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-950">
          {formatCurrency(subtotal)}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecreaseQuantity(cartItem.item.id)}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#D56756] hover:text-[#D56756]"
            aria-label={`Giảm số lượng ${cartItem.item.name}`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-7 text-center text-sm font-bold text-slate-950">
            {cartItem.quantity}
          </span>
          <button
            type="button"
            onClick={() => onIncreaseQuantity(cartItem.item.id)}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#D56756] hover:text-[#D56756]"
            aria-label={`Tăng số lượng ${cartItem.item.name}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemRow;
