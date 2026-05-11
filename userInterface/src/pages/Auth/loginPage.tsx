import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-[#f7efe6] lg:block">
        <img
          src="https://media.istockphoto.com/id/1595889544/photo/happy-asian-woman-enjoying-her-dog-pet-in-the-home-friendship-pet-and-human-lifestyle-concept.jpg?s=612x612&w=0&k=20&c=RzOk8_uohin9q0rFKtuCFkEiMnejfTGltdPA8ePPDlM="
          alt="Pet owner with pet"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffffffcc] to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-md rounded-3xl border border-white/30 bg-white/80 p-8 shadow-2xl backdrop-blur">
          <p className="text-3xl font-semibold text-slate-950">
            Hơn cả một dịch vụ, chúng tôi chăm sóc những thành viên trong gia
            đình bạn.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            PetHub SaaS cho Pet Shop & Phòng khám thú y
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-[#fff8f2] px-6 py-10 md:px-12 md:py-14">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay về trang chủ
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center lg:text-left">
               <img
                  src="/logoPethub.png"
                  alt="PetHub"
                  className="w-auto max-w-none object-contain h-12 sm:h-14"
                  decoding="async"
                />
             
              <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                Chào mừng trở lại!
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Đăng nhập để quản lý lịch hẹn, hồ sơ và vận hành PetHub.
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
