import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Easy to Use",
    description:
      "User-friendly interface designed for all types of users with intuitive navigation.",
  },
  {
    icon: Shield,
    title: "High Security",
    description:
      "Data encrypted and protected with the most advanced security technology.",
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Fast processing with optimized performance for the best user experience.",
  },
];

const benefits = [
  "Save time and costs",
  "Increase work efficiency",
  "Easy management and tracking",
  "24/7 support",
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Management
              <span className="text-gray-700"> Solution</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive platform that helps you manage work more
              efficiently, save time, and optimize your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg bg-gray-900 hover:bg-gray-800 text-white"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center">
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
              Key Features
            </h2>
            <p className="text-xl text-gray-600">
              Features that help you work more efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className="bg-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">
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
                Why Choose Us?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We provide comprehensive solutions with outstanding benefits to
                help your business grow sustainably.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-gray-900 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="mt-8 bg-gray-900 hover:bg-gray-800 text-white"
              >
                Sign Up Now
              </Button>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg aspect-square flex items-center justify-center">
              <p className="text-gray-500 text-lg">Illustration</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust our product
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg bg-white text-gray-900 hover:bg-gray-100"
              >
                Try for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
