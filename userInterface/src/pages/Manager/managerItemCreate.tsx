import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import itemApi from "@/apis/itemsAPI";
import type { CreateItemRequest } from "@/types/item.type";

interface ManagerItemCreateProps {
  itemType: "service" | "product";
}

const itemTypeMeta = {
  service: {
    title: "Thêm dịch vụ mới",
    description:
      "Tạo dịch vụ mới để khách hàng có thể đặt lịch chăm sóc thú cưng.",
    backPath: "/manager/services",
    successMessage: "Dịch vụ đã được tạo thành công.",
    typeValue: 0 as const,
  },
  product: {
    title: "Thêm sản phẩm mới",
    description: "Tạo sản phẩm mới để khách hàng có thể đặt mua cho thú cưng.",
    backPath: "/manager/products",
    successMessage: "Sản phẩm đã được tạo thành công.",
    typeValue: 1 as const,
  },
};

const ManagerItemCreate = ({ itemType }: ManagerItemCreateProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const meta = itemTypeMeta[itemType];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Vui lòng nhập tên.");
      return;
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Vui lòng nhập giá hợp lệ lớn hơn 0.");
      return;
    }

    const payload: CreateItemRequest = {
      name: name.trim(),
      price: parsedPrice,
      type: meta.typeValue,
    };

    try {
      setLoading(true);
      await itemApi.createItem(payload);
      setSuccess(meta.successMessage);
      setName("");
      setPrice("");
      setTimeout(() => {
        navigate(meta.backPath);
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Không tạo được mục mới. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-950">
            {meta.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{meta.description}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="item-name">
                Tên {itemType === "service" ? "dịch vụ" : "sản phẩm"}
              </FieldLabel>
              <Input
                id="item-name"
                name="name"
                placeholder="Nhập tên..."
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="item-price">Giá</FieldLabel>
              <Input
                id="item-price"
                name="price"
                type="number"
                placeholder="Nhập giá..."
                min="0"
                step="1000"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
              <FieldDescription>
                Giá được nhập bằng số, đơn vị là VND.
              </FieldDescription>
            </Field>

            {error ? (
              <FieldDescription className="text-sm text-rose-700">
                {error}
              </FieldDescription>
            ) : null}
            {success ? (
              <FieldDescription className="text-sm text-emerald-700">
                {success}
              </FieldDescription>
            ) : null}

            <Field>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  className="rounded-full bg-[#D56756] px-5 py-3 text-base font-semibold text-white hover:bg-[#b2483c]"
                  disabled={loading}
                >
                  {loading ? "Đang tạo..." : "Lưu mục"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 hover:bg-slate-100"
                  onClick={() => navigate(meta.backPath)}
                >
                  Quay lại
                </Button>
              </div>
            </Field>
          </FieldGroup>
        </form>
      </section>
    </div>
  );
};

export const ManagerServiceCreate = () => (
  <ManagerItemCreate itemType="service" />
);
export const ManagerProductCreate = () => (
  <ManagerItemCreate itemType="product" />
);
