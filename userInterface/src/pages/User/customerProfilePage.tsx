import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import appointmentApi from "@/apis/appointmentAPI";
import petApi from "@/apis/petAPI";
import userApi from "@/apis/userAPI";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";
import type { Appointment } from "@/types/appointment.type";
import type { CustomerProfile } from "@/types/customerProfile.type";
import type { Pet } from "@/types/pet.type";
import {
  getMembershipTier,
  membershipTierOrder,
  type MembershipTier,
} from "@/utils/membershipTier";

type CustomerProfileData = {
  profile: CustomerProfile | null;
  pets: Pet[];
  appointments: Appointment[];
};

const getResponseData = <T,>(value: unknown): T | null => {
  if (!value || typeof value !== "object") return null;

  const axiosData = (value as { data?: unknown }).data;
  if (!axiosData) return null;

  if (typeof axiosData === "object" && "data" in axiosData) {
    return ((axiosData as { data?: T }).data ?? null) as T | null;
  }

  return axiosData as T;
};

const getDisplayName = (
  profile: CustomerProfile | null,
  fallbackName: string,
) => {
  const fullName = profile?.fullName?.trim();
  const combinedName = `${profile?.lastName ?? ""} ${
    profile?.firstName ?? ""
  }`.trim();

  return fullName || combinedName || profile?.userName || fallbackName;
};

const formatDate = (value?: string) => {
  if (!value) return "Chưa có dữ liệu";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có dữ liệu";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const FieldRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value?: string | null;
}) => (
  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#D56756] shadow-sm">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">
        {value || "Chưa có dữ liệu"}
      </p>
    </div>
  </div>
);

const StatCard = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
  tone: string;
}) => (
  <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const tierStyles: Record<
  MembershipTier,
  {
    card: string;
    badge: string;
    progress: string;
    icon: string;
  }
> = {
  Bronze: {
    card: "border-amber-700/35 bg-[linear-gradient(135deg,#fffaf3_0%,#fff_48%,#f7e4cf_100%)]",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    progress: "bg-amber-700",
    icon: "bg-amber-100 text-amber-800",
  },
  Silver: {
    card: "border-slate-300 bg-[linear-gradient(135deg,#f8fafc_0%,#fff_52%,#e2e8f0_100%)]",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    progress: "bg-slate-500",
    icon: "bg-slate-100 text-slate-600",
  },
  Gold: {
    card: "border-yellow-400/60 bg-[linear-gradient(135deg,#fffbeb_0%,#fff_48%,#fef3c7_100%)]",
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    progress: "bg-yellow-500",
    icon: "bg-yellow-100 text-yellow-700",
  },
  Platinum: {
    card: "border-cyan-300 bg-[linear-gradient(135deg,#ecfeff_0%,#fff_45%,#dbeafe_100%)] shadow-[0_24px_70px_rgba(14,165,233,0.16)]",
    badge: "bg-cyan-100 text-cyan-800 border-cyan-200",
    progress: "bg-gradient-to-r from-cyan-500 to-blue-600",
    icon: "bg-cyan-100 text-cyan-700",
  },
};

const tierBenefits: Record<MembershipTier, string[]> = {
  Bronze: ["Thành viên mới"],
  Silver: ["Ưu tiên đặt lịch"],
  Gold: ["Ưu tiên hỗ trợ khách hàng"],
  Platinum: ["Ưu tiên đặt lịch", "Ưu tiên hỗ trợ", "Nhận ưu đãi đặc biệt"],
};

const tierStart: Record<MembershipTier, number> = {
  Bronze: 0,
  Silver: 11,
  Gold: 31,
  Platinum: 61,
};

const getAppointmentsToNextTier = (
  totalAppointments: number,
  nextTier: MembershipTier | null,
) => {
  if (!nextTier) return 0;
  return Math.max(0, tierStart[nextTier] - totalAppointments);
};

const MembershipCard = ({
  totalAppointments,
}: {
  totalAppointments: number;
}) => {
  const membership = getMembershipTier(totalAppointments);
  const currentIndex = membershipTierOrder.indexOf(membership.tier);
  const styles = tierStyles[membership.tier];
  const appointmentsToNextTier = getAppointmentsToNextTier(
    totalAppointments,
    membership.nextTier,
  );

  return (
    <section
      className={`rounded-[28px] border p-6 shadow-sm ${styles.card}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${styles.icon}`}
            >
              <span aria-hidden="true">{membership.icon}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Thành viên thân thiết
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                {membership.tier} Member
              </h2>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${styles.badge}`}
            >
              {membership.tier}
            </span>
            <span className="text-sm font-medium text-slate-600">
              Tổng lịch hẹn:{" "}
              <span className="font-bold text-slate-950">
                {totalAppointments}
              </span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm lg:max-w-xs">
          {membership.nextTier ? (
            <>
              Còn{" "}
              <span className="font-bold text-slate-950">
                {appointmentsToNextTier}
              </span>{" "}
              lịch hẹn nữa để đạt {membership.nextTier}.
            </>
          ) : (
            "Bạn đang ở hạng cao nhất của PetHub."
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Tiến độ hạng hiện tại</span>
          <span>{Math.round(membership.progressPercent)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/80 shadow-inner">
          <div
            className={`h-full rounded-full ${styles.progress}`}
            style={{ width: `${membership.progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Quyền lợi</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {tierBenefits[membership.tier].map((benefit) => (
              <li key={benefit} className="flex gap-2">
                <span className="text-[#D56756]">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Hành trình thành viên
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {membershipTierOrder.map((tier, index) => {
              const reached = index <= currentIndex;
              return (
                <div
                  key={tier}
                  className={`rounded-2xl border px-3 py-3 text-center text-xs font-bold ${
                    reached
                      ? `${tierStyles[tier].badge} shadow-sm`
                      : "border-slate-200 bg-white/70 text-slate-400"
                  }`}
                >
                  {tier} {reached ? "✓" : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function CustomerProfilePage() {
  const currentUser = getCurrentUser();
  const userId = currentUser?.userId ?? "";

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.customerProfile(userId),
    queryFn: async ({ signal }): Promise<CustomerProfileData> => {
      if (!userId) {
        throw new Error(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        );
      }

      const [profileResponse, petsResponse, appointmentsResponse] =
        await Promise.all([
          userApi.getUserById(userId, { signal }),
          petApi.getPetByCustomerId(userId, { signal }),
          appointmentApi.getAppointmentsByCustomerId(userId, { signal }),
        ]);

      return {
        profile: getResponseData<CustomerProfile>(profileResponse),
        pets: getResponseData<Pet[]>(petsResponse) ?? [],
        appointments:
          getResponseData<Appointment[]>(appointmentsResponse) ?? [],
      };
    },
    enabled: Boolean(userId),
  });

  const profile = data?.profile ?? null;
  const displayName = getDisplayName(profile, currentUser?.name ?? "Customer");
  const email = profile?.email || currentUser?.email || "";
  const role = profile?.role || currentUser?.role || "Customer";
  const createdDate = profile?.createAt || profile?.createdAt;
  const initial = displayName.trim().charAt(0).toUpperCase() || "C";
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Không tải được hồ sơ cá nhân. Vui lòng thử lại sau.";

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col gap-6">
        <header className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col  gap-5 md:flex-row md:items-center md:justify-between">
            <div >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-[#B24C40]">
                <User className="h-4 w-4" />
                Hồ sơ khách hàng
              </div>
              <h1 className="text-3xl font-semibold text-slate-950">
                Hồ sơ cá nhân
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Xin chào, <span className="font-semibold">{displayName}</span>.
                Theo dõi thông tin cá nhân, thú cưng, lịch hẹn và trạng thái tài
                khoản của bạn.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#D56756] text-xl font-bold text-white shadow-sm">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-950">
                  {displayName}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {email || "Chưa có email"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-rose-100" />
            <p>Đang tải hồ sơ cá nhân...</p>
          </div>
        ) : !userId ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
            Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
          </div>
        ) : isError ? (
          <div className="flex items-start gap-3 rounded-[28px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <>
            <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#D56756] text-3xl font-bold text-white shadow-sm">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <h2 className="break-words text-2xl font-bold text-slate-950">
                      {displayName}
                    </h2>
                    <p className="mt-1 break-words text-sm text-slate-500">
                      {email || "Chưa có email"}
                    </p>
                    {profile?.emailConfirmed ? (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Email đã xác nhận
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                  <FieldRow icon={User} label="Họ tên" value={displayName} />
                  <FieldRow icon={Mail} label="Email" value={email} />
                  <FieldRow
                    icon={Phone}
                    label="Số điện thoại"
                    value={profile?.phoneNumber || profile?.phone}
                  />
                  <FieldRow
                    icon={MapPin}
                    label="Địa chỉ"
                    value={profile?.address}
                  />
                  <FieldRow icon={ShieldCheck} label="Vai trò" value={role} />
                  <FieldRow
                    icon={CalendarDays}
                    label="Ngày tạo tài khoản"
                    value={formatDate(createdDate)}
                  />
                </div>
              </div>

              <aside className="flex flex-col gap-4">
                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-950">
                    Thao tác nhanh
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Xem danh sách thú cưng và lịch hẹn hiện có của bạn.
                  </p>
                  <div className="mt-5 grid gap-3">
                    <Button
                      asChild
                      className="rounded-full bg-[#D56756] text-white hover:bg-[#b34c47]"
                    >
                      <Link to="/user/pet">Xem thú cưng</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-[#D56756] text-slate-800 hover:bg-[#f7e7e2]"
                    >
                      <Link to="/user/booking">Xem lịch hẹn</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-slate-200 text-slate-800 hover:bg-slate-50"
                    >
                      <Link to="/user/invoices">
                        <CreditCard className="h-4 w-4" />
                        Xem hóa đơn
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-950">
                    Mẹo sử dụng
                  </h2>

                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>
                      • Cập nhật thông tin cá nhân để phòng khám liên hệ dễ dàng
                      hơn.
                    </li>
                    <li>
                      • Thêm thú cưng để quản lý hồ sơ và lịch sử chăm sóc.
                    </li>
                    <li>
                      • Theo dõi lịch hẹn để không bỏ lỡ các dịch vụ đã đặt.
                    </li>
                  </ul>
                </div>
              </aside>
            </section>
            <MembershipCard
              totalAppointments={data?.appointments.length ?? 0}
            />

            <section className="grid gap-4 md:grid-cols-2">
              <StatCard
                icon={Heart}
                label="Thú cưng của tôi"
                value={data?.pets.length ?? 0}
                tone="bg-rose-50 text-[#D56756]"
              />
              <StatCard
                icon={CalendarDays}
                label="Lịch hẹn của tôi"
                value={data?.appointments.length ?? 0}
                tone="bg-sky-50 text-sky-600"
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
