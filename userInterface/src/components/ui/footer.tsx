import {
  BookOpen,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const companyLinks = [
  { name: "Về chúng tôi", href: "/about", icon: Info },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Liên hệ", href: "/contact", icon: Phone },
];

const supportLinks = [
  { name: "Trung tâm trợ giúp", href: "/help", icon: HelpCircle },
  { name: "Điều khoản", href: "/terms", icon: Info },
  { name: "Bảo mật", href: "/privacy", icon: Shield },
];

const connectInfo = [
  { icon: Phone, label: "Hotline:", value: "1900-PETHUB" },
  { icon: Mail, label: "Email:", value: "support@pethub.vn" },
  { icon: MapPin, label: "Địa chỉ:", value: "TP. Hồ Chí Minh, Việt Nam" },
];

function Footer() {
  return (
    <footer className="bg-[#7c2419] text-white">
     
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 xl:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center">
                <img
                  src="/logoPethub.png"
                  alt="PetHub"
                  className="w-auto max-w-none object-contain h-9 md:h-10 brightness-0 invert"
                  decoding="async"
                />
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/75">
              Giải pháp quản lý Pet Shop & phòng khám thú y toàn diện, hiện đại
              và nhân văn.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Công ty</h4>
            <ul className="space-y-4 text-sm text-white/80">
              {companyLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <Link
                      to={item.href}
                      className="transition hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm text-white/80">
              {supportLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <Link
                      to={item.href}
                      className="transition hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Kết nối</h4>
            <div className="space-y-4 text-sm text-white/80">
              {connectInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="text-sm text-white/80">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/70">
          © 2026 PetHub. Thiết kế với tình yêu dành cho thú cưng.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
