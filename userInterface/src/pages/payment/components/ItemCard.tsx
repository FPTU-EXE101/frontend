import { Plus } from "lucide-react";
import type { POSItem } from "../types/payment.type";
import { formatCurrency, getItemTypeLabel } from "../utils/payment.utils";

interface ItemCardProps {
  item: POSItem;
  onAddItem: (item: POSItem) => void;
}

const ItemCard = ({ item, onAddItem }: ItemCardProps) => {
  return (
    <article className="flex min-h-24 items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#D56756]/40 hover:shadow-sm">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold text-slate-950">
          {item.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500">
          {getItemTypeLabel(item.type)}
        </p>
        <p className="mt-3 text-lg font-bold text-slate-950">
          {formatCurrency(item.price)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAddItem(item)}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#D56756]"
        aria-label={`Thêm ${item.name}`}
      >
        <Plus className="h-5 w-5" />
      </button>
    </article>
  );
};

export default ItemCard;
