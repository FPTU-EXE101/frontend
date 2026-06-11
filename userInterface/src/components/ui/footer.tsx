import {
  Facebook,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import { TbBrandTiktok } from "react-icons/tb";

import { Link } from "react-router-dom";

const companyLinks = [
  { name: "Về chúng tôi", href: "/about-us", icon: Info },
  // { name: "Blog", href: "/blog", icon: BookOpen },
  // { name: "Liên hệ", href: "/contact", icon: Phone },
];

const supportLinks = [
  { name: "Trung tâm trợ giúp", href: "/help", icon: HelpCircle },
  { name: "Điều khoản", href: "/terms", icon: Info },
  { name: "Bảo mật", href: "/privacy", icon: Shield },
];

const connectInfo = [
  { icon: Phone, label: "Hotline:", value: "1900-PETHUB" },
  { icon: Mail, label: "Email:", value: "pethub0103@gmail.com" },
  { icon: MapPin, label: "Địa chỉ:", value: "TP. Hồ Chí Minh, Việt Nam" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590569546938",
    icon: Facebook,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@pethub.vn",
    icon: TbBrandTiktok,
  },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#5f1b13_0%,#7c2419_45%,#9f3d31_100%)] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] opacity-20 [background-size:48px_48px]" />
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="relative grid gap-10 xl:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center">
                <img
                  src="/Artboard 5.svg"
                  alt="PetHub"
                  className="h-auto w-[170px] object-contain brightness-0 invert md:w-[210px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/75">
              Giải pháp quản lý Pet Shop & phòng khám thú y toàn diện, hiện đại
              và nhân văn.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#7c2419]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white/90">
              Công ty
            </h4>
            <ul className="space-y-4 text-sm text-white/80">
              {companyLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name} className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-white transition group-hover:bg-white/15">
                      <Icon className="h-4 w-4" />
                    </span>
                    <Link
                      to={item.href}
                      className="transition hover:text-white hover:underline hover:decoration-white/40 hover:underline-offset-4"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white/90">
              Hỗ trợ
            </h4>
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
                      className="transition hover:text-white hover:underline hover:decoration-white/40 hover:underline-offset-4"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white/90">
              Kết nối
            </h4>
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

        <div className="relative mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/70">
          © 2026 PetHub. Thiết kế với tình yêu dành cho thú cưng.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
