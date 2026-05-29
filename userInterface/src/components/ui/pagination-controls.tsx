import { Button } from "@/components/ui/button";

type PaginationControlsProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentPage: number;
  onNext: () => void;
  onPrevious: () => void;
  totalItems: number;
  totalPages: number;
};

export function PaginationControls({
  canGoNext,
  canGoPrevious,
  currentPage,
  onNext,
  onPrevious,
  totalItems,
  totalPages,
}: PaginationControlsProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row">
      <span>
        Trang {currentPage} / {totalPages} · {totalItems} mục
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="rounded-full"
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onNext}
          disabled={!canGoNext}
          className="rounded-full"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
