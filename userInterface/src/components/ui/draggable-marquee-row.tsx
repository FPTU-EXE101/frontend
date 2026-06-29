import { Fragment, useEffect, useRef, type ReactNode } from "react";

// Tốc độ tự chạy (px/giây). Giữ cảm giác trôi nhẹ như motion cũ.
const MARQUEE_SPEED = 45;

type DraggableMarqueeRowProps<T> = {
  items: T[];
  direction: "left" | "right";
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  /** Class khoảng cách giữa các thẻ (mặc định theo breakpoint). */
  gapClassName?: string;
  className?: string;
};

/**
 * Dải thẻ tự trôi vô hạn (marquee) nhưng cho phép người dùng bấm-giữ kéo
 * qua lại bằng chuột để xem dễ hơn. Tự chạy lại khi thả ra; tôn trọng
 * prefers-reduced-motion; cảm ứng/trackpad dùng cuộn ngang gốc.
 */
export function DraggableMarqueeRow<T>({
  items,
  direction,
  renderItem,
  getKey,
  gapClassName = "gap-4 sm:gap-5 lg:gap-6",
  className = "",
}: DraggableMarqueeRowProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Vị trí cuộn dạng float — nguồn sự thật để tránh việc scrollLeft bị làm
  // tròn về số nguyên làm mất phần cộng dồn nhỏ mỗi frame khiến đứng yên.
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const duplicatedItems = [...items, ...items];

  // Đưa vị trí về khoảng [0, half) để lặp vô hạn liền mạch (nội dung được
  // nhân đôi nên vị trí v và v+half cho hình ảnh giống hệt nhau).
  const wrap = (value: number, half: number) => {
    if (half <= 0) return value;
    const v = value % half;
    return v < 0 ? v + half : v;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const dir = direction === "right" ? -1 : 1;
    let raf = 0;
    let last = performance.now();
    posRef.current = el.scrollLeft;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (!prefersReducedMotion && !pausedRef.current && !draggingRef.current) {
        const half = el.scrollWidth / 2;
        posRef.current = wrap(posRef.current + dir * MARQUEE_SPEED * dt, half);
        el.scrollLeft = posRef.current;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;

    pausedRef.current = true;
    // Chỉ tự kéo bằng con trỏ chuột; cảm ứng/trackpad dùng cuộn ngang gốc.
    if (event.pointerType === "mouse") {
      draggingRef.current = true;
      dragStartRef.current = { x: event.clientX, scrollLeft: el.scrollLeft };
      el.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el || !draggingRef.current) return;

    const delta = event.clientX - dragStartRef.current.x;
    const next = wrap(
      dragStartRef.current.scrollLeft - delta,
      el.scrollWidth / 2,
    );
    el.scrollLeft = next;
    posRef.current = next;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    draggingRef.current = false;
    pausedRef.current = false;
    // Đồng bộ lại vị trí float theo scrollLeft thực (đề phòng cuộn cảm ứng).
    if (el) {
      posRef.current = el.scrollLeft;
    }
    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div
      ref={scrollRef}
      className={`no-scrollbar cursor-grab touch-pan-x select-none overflow-x-auto py-2 active:cursor-grabbing ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <div className={`flex w-max ${gapClassName}`}>
        {duplicatedItems.map((item, index) => (
          <Fragment key={getKey(item, index)}>
            {renderItem(item, index)}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
