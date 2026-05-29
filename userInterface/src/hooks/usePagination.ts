import { useEffect, useMemo, useState } from "react";

type UsePaginationResult<T> = {
  currentPage: number;
  pageItems: T[];
  pageSize: number;
  totalItems: number;
  totalPages: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  goNext: () => void;
  goPrevious: () => void;
  setCurrentPage: (page: number) => void;
};

export function usePagination<T>(
  items: T[],
  pageSize = 12,
): UsePaginationResult<T> {
  const [currentPage, setCurrentPageState] = useState(1);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPageState(1);
  }, [items, pageSize]);

  const setCurrentPage = (page: number) => {
    setCurrentPageState(Math.min(Math.max(page, 1), totalPages));
  };

  const pageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [currentPage, items, pageSize]);

  return {
    currentPage,
    pageItems,
    pageSize,
    totalItems,
    totalPages,
    canGoNext: currentPage < totalPages,
    canGoPrevious: currentPage > 1,
    goNext: () => setCurrentPage(currentPage + 1),
    goPrevious: () => setCurrentPage(currentPage - 1),
    setCurrentPage,
  };
}
