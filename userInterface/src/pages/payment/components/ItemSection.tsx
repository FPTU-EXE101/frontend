import type { POSItem } from "../types/payment.type";
import ItemCard from "./ItemCard";

interface ItemSectionProps {
  emptyText: string;
  items: POSItem[];
  title: string;
  onAddItem: (item: POSItem) => void;
}

const ItemSection = ({
  emptyText,
  items,
  title,
  onAddItem,
}: ItemSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-slate-950">{title}</h2>
        <span className="text-xs font-medium text-slate-500">
          {items.length} item
        </span>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onAddItem={onAddItem} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-28 items-center justify-center text-center text-sm font-medium text-slate-500">
          {emptyText}
        </div>
      )}
    </section>
  );
};

export default ItemSection;
