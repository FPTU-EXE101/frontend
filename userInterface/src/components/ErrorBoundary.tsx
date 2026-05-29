import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff8f2] px-4 py-10">
        <div className="w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-[#D56756]">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-semibold text-slate-950">
            Đã có lỗi xảy ra.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Vui lòng tải lại trang hoặc quay về trang chủ để tiếp tục.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={this.handleReload}
              className="flex-1 rounded-full bg-[#D56756] text-white hover:bg-[#b34c47]"
            >
              <RefreshCw className="h-4 w-4" />
              Tải lại trang
            </Button>
            <Button
              asChild
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Về trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
