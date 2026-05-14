import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Scissors, Edit3, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import itemApi from "@/apis/itemsAPI";
import type { Items } from "@/types/item.type";

const isServiceItem = (item: Items) => {
  const typeValue = String(item.type).toLowerCase();
  return typeValue === "service" || typeValue === "0";
};

const formatPrice = (value: number) => value.toLocaleString("vi-VN") + "đ";

const ManagerServicesManage = () => {
  const [items, setItems] = useState<Items[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const response = await itemApi.getAllItems();
        setItems(response?.data ?? []);
      } catch {
        setError("Không tải được danh sách dịch vụ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const filteredServices = useMemo(
    () =>
      items.filter(
        (item) =>
          isServiceItem(item) &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [items, searchTerm],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                <Scissors className="h-4 w-4" />
              </span>
              <span>Danh mục</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-950">
              Quản lý Dịch vụ
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Tổng số {filteredServices.length} dịch vụ
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[24rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm dịch vụ theo tên..."
                className="pl-12"
              />
            </div>
            <Button className="h-11 whitespace-nowrap bg-[#D56756] text-white hover:bg-[#b2483c]">
              <Link to="/manager/services/new">+ Thêm dịch vụ mới</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[3fr_1fr_1fr_1fr] gap-0 border-b border-slate-200 bg-[#F8F1E4] px-6 py-4 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-700">
          <span>Tên dịch vụ</span>
          <span>Giá</span>
          <span>Loại</span>
          <span className="text-right">Hành động</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Đang tải dịch vụ...
          </div>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center gap-0 border-b border-slate-200 px-6 py-5 text-sm text-slate-700 last:border-b-0"
            >
              <div>
                <p className="font-semibold text-slate-950">{item.name}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Dịch vụ chăm sóc thú cưng
                </p>
              </div>
              <div className="font-medium text-slate-950">
                {formatPrice(item.price)}
              </div>
              <div>
                <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Dịch vụ
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="h-9 w-9 rounded-full p-0 text-slate-700 hover:bg-slate-100"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-9 w-9 rounded-full p-0 text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-500">
            Không có dịch vụ nào phù hợp.
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default ManagerServicesManage;
