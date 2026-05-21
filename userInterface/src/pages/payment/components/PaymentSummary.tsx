import type { PaymentSummary as PaymentSummaryValue } from "../types/payment.type";
import { formatCurrency } from "../utils/payment.utils";

interface PaymentSummaryProps {
  summary: PaymentSummaryValue;
}

const PaymentSummary = ({ summary }: PaymentSummaryProps) => {
  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between text-slate-600">
        <span>Tạm tính</span>
        <strong className="text-slate-950">
          {formatCurrency(summary.subtotal)}
        </strong>
      </div>
      {summary.vat > 0 ? (
        <div className="flex items-center justify-between text-slate-600">
          <span>VAT</span>
          <strong className="text-slate-950">
            {formatCurrency(summary.vat)}
          </strong>
        </div>
      ) : null}
      <div className="flex items-center justify-between text-base font-bold text-slate-950">
        <span>Tổng cộng</span>
        <span className="text-2xl text-[#ff5a2f]">
          {formatCurrency(summary.total)}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
