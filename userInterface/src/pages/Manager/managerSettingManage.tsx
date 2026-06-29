import { Info, Lock, Store } from "lucide-react";

import { useManagerStore } from "@/hooks/useManagerStore";

const emptyText = "Chưa cập nhật";

const ReadOnlyField = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div>
    <p className="text-sm font-medium text-slate-700">{label}</p>
    <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900">
      {value ? value : <span className="text-slate-400">{emptyText}</span>}
    </div>
  </div>
);

const ManagerSettingManage = () => {
  const {
    data: store,
    isLoading,
    isError,
    isStoreIdMissing,
  } = useManagerStore();

  return (
    <div className="min-h-[calc(100vh-3rem)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8DED9] text-[#B24C40]">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Thông tin cửa hàng
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Xem thông tin cửa hàng của bạn.
            </p>
          </div>
        </div>

        {isStoreIdMissing ? (
          <div className="rounded-[20px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
            Không tìm thấy cửa hàng gắn với tài khoản của bạn. Vui lòng đăng nhập
            lại.
          </div>
        ) : isLoading ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            Không tải được thông tin cửa hàng. Vui lòng thử lại sau.
          </div>
        ) : (
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
            {/* Ghi chú: thông tin chỉ xem, muốn đổi thì liên hệ PetHub */}
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#f0d8d0] bg-[#fff6f2] px-4 py-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#D56756]" />
              <p className="text-sm leading-6 text-slate-700">
                Thông tin cửa hàng chỉ dùng để{" "}
                <span className="font-semibold text-slate-900">xem</span>. Nếu
                muốn thay đổi, vui lòng liên hệ{" "}
                <span className="font-semibold text-[#B24C40]">PetHub</span> qua
                email{" "}
                <a
                  href="mailto:support@pethub.vn"
                  className="font-semibold text-[#D56756] underline-offset-2 hover:underline"
                >
                  support@pethub.vn
                </a>{" "}
                để được hỗ trợ.
              </p>
            </div>

            <div className="space-y-5">
              <ReadOnlyField label="Tên cửa hàng" value={store?.name} />
              <ReadOnlyField label="Địa chỉ" value={store?.address} />
              <ReadOnlyField label="Số điện thoại" value={store?.phone} />
              {/* <ReadOnlyField label="Email" value={store?.email} /> */}
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              Thông tin được quản lý bởi PetHub, không thể chỉnh sửa trực tiếp.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerSettingManage;
