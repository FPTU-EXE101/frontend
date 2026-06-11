import { ChevronRight, Home, Loader2, Search } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import AppointmentSelector from "./components/AppointmentSelector";
import CartSidebar from "./components/CartSidebar";
import ItemSection from "./components/ItemSection";
import SelectedAppointmentCard from "./components/SelectedAppointmentCard";
import { usePOSPayment } from "./hooks/usePOSPayment";
import type { PaymentLocationState } from "./types/payment.type";

interface POSPaymentPageProps {
  appointmentId?: string;
}

const POSPaymentPage = ({ appointmentId }: POSPaymentPageProps) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const locationState = (location.state ?? {}) as PaymentLocationState;

  const initialAppointmentId =
    appointmentId ||
    locationState.appointmentId ||
    searchParams.get("appointmentId") ||
    "";

  const payment = usePOSPayment({ initialAppointmentId });

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-950 sm:p-6 lg:p-8">
      <div className="mb-7">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Thanh toán</span>
        </div>
        <h1 className="text-2xl font-bold tracking-normal text-slate-950">
          Thanh toán (POS)
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Tính tiền nhanh cho khách hàng
        </p>
      </div>

      {payment.success && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {payment.success}
        </div>
      )}

      {payment.error && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 whitespace-pre-line">
          {payment.error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24.5rem]">
        <main className="space-y-4">
          <AppointmentSelector
            appointments={payment.visibleAppointments}
            loading={payment.loadingAppointments}
            searchTerm={payment.appointmentSearchTerm}
            selectedAppointment={payment.selectedAppointment}
            onSearchChange={payment.setAppointmentSearchTerm}
            onSelectAppointment={payment.handleSelectAppointment}
          />

          {payment.selectedAppointment ? (
            <SelectedAppointmentCard appointment={payment.selectedAppointment} />
          ) : null}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={payment.searchTerm}
                onChange={(event) => payment.setSearchTerm(event.target.value)}
                placeholder="Tìm dịch vụ hoặc sản phẩm..."
                className="h-12 w-full rounded-full border border-slate-300 bg-white pl-12 pr-5 text-sm text-slate-700 outline-none transition focus:border-[#D56756] focus:ring-2 focus:ring-[#D56756]/15"
              />
            </div>
          </section>

          {payment.loadingItems ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex min-h-[20rem] items-center justify-center gap-3 text-sm font-medium text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-[#D56756]" />
                Đang tải item...
              </div>
            </section>
          ) : (
            <>
              <ItemSection
                emptyText="Không có dịch vụ"
                items={payment.serviceItems}
                title="Dịch vụ"
                onAddItem={payment.handleAddItem}
              />
              <ItemSection
                emptyText="Không có sản phẩm"
                items={payment.productItems}
                title="Sản phẩm"
                onAddItem={payment.handleAddItem}
              />
            </>
          )}
        </main>

        <CartSidebar
          cartItems={payment.cartItems}
          lastInvoiceId={payment.lastInvoiceId}
          medicalRecordForm={payment.medicalRecordForm}
          paying={payment.paying}
          selectedAppointment={payment.selectedAppointment}
          summary={payment.summary}
          totalQuantity={payment.totalQuantity}
          onCreateAndConfirmInvoice={payment.handleCreateAndConfirmInvoice}
          onDecreaseQuantity={payment.handleDecreaseQuantity}
          onIncreaseQuantity={payment.handleIncreaseQuantity}
          onMedicalRecordFieldChange={payment.handleMedicalRecordFieldChange}
          onRemoveItem={payment.handleRemoveItem}
        />
      </div>
    </div>
  );
};

export default POSPaymentPage;
