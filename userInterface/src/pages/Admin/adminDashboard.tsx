import { LayoutDashboard, UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#D56756]/10 text-[#B24C40]">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          Dashboard Admin
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Theo dõi và quản lý tài khoản Manager trong hệ thống PetHub.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#D56756]/10 text-[#B24C40]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">
                Tạo tài khoản Manager
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Cấp tài khoản quản lý mới cho cửa hàng.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="mt-5 bg-[#D56756] text-white hover:bg-[#B24C40]"
          >
            <Link to="/admin/managers/new">Tạo Manager</Link>
          </Button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-100 text-slate-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-950">
                Quản lý tài khoản Manager
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Xem danh sách và thông tin tài khoản Manager.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="mt-5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          >
            <Link to="/admin/managers">Xem danh sách</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
