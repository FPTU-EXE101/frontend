import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Dễ dàng sử dụng",
    description:
      "Giao diện thân thiện, dễ sử dụng cho mọi đối tượng người dùng.",
  },
  {
    icon: Shield,
    title: "Bảo mật cao",
    description: "Dữ liệu được mã hóa và bảo vệ với công nghệ tiên tiến nhất.",
  },
  {
    icon: Zap,
    title: "Hiệu suất cao",
    description:
      "Xử lý nhanh chóng với hiệu năng tối ưu cho trải nghiệm tốt nhất.",
  },
];

const benefits = [
  "Tiết kiệm thời gian và chi phí",
  "Tăng hiệu quả công việc",
  "Dễ dàng quản lý và theo dõi",
  "Hỗ trợ 24/7",
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Giải pháp quản lý
              <span className="text-blue-600"> thông minh</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Nền tảng toàn diện giúp bạn quản lý công việc hiệu quả hơn, tiết
              kiệm thời gian và tối ưu hóa quy trình làm việc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg">
                Bắt đầu ngay <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 aspect-video flex items-center justify-center">
              <p className="text-gray-500 text-lg">Demo Image / Video</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Những tính năng giúp bạn làm việc hiệu quả hơn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Tại sao chọn chúng tôi?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Chúng tôi cung cấp giải pháp toàn diện với nhiều lợi ích vượt
                trội, giúp doanh nghiệp của bạn phát triển bền vững.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8">
                Đăng ký ngay
              </Button>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg aspect-square flex items-center justify-center">
              <p className="text-gray-500 text-lg">Illustration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Sẵn sàng bắt đầu chưa?</h2>
            <p className="text-xl mb-8 opacity-90">
              Tham gia cùng hàng ngàn người dùng đã tin tưởng sử dụng sản phẩm
              của chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                Dùng thử miễn phí
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
