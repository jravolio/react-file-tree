import { useState, useCallback, useMemo, useRef } from "react";

export interface UseVirtualListOptions {
  /** Total number of items */
  itemCount: number;
  /** Height of each row in pixels */
  rowHeight: number;
  /** Height of the scroll container in pixels */
  containerHeight: number;
  /** Number of extra rows to render above/below the viewport */
  overscanCount?: number;
}

export interface VirtualListResult {
  /** Index of the first rendered item */
  startIndex: number;
  /** Index of the last rendered item (exclusive) */
  endIndex: number;
  /** Total height of the virtual content area */
  totalHeight: number;
  /** Items to render with their offsets */
  virtualItems: VirtualItem[];
  /** Handler for scroll events */
  onScroll: (scrollTop: number) => void;
  /** Programmatic scroll to an index */
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
  /** Current scroll offset */
  scrollTop: number;
  /** Ref callback for the scroll container */
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export interface VirtualItem {
  index: number;
  offsetTop: number;
}

export function useVirtualList(options: UseVirtualListOptions): VirtualListResult {
  const { itemCount, rowHeight, containerHeight, overscanCount = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const totalHeight = itemCount * rowHeight;

  const { startIndex, endIndex } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / rowHeight);
    const visibleEnd = Math.ceil((scrollTop + containerHeight) / rowHeight);

    const start = Math.max(0, visibleStart - overscanCount);
    const end = Math.min(itemCount, visibleEnd + overscanCount);

    return { startIndex: start, endIndex: end };
  }, [scrollTop, rowHeight, containerHeight, overscanCount, itemCount]);

  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * rowHeight,
      });
    }
    return items;
  }, [startIndex, endIndex, rowHeight]);

  const onScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const targetTop = index * rowHeight;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: targetTop, behavior });
      }
    },
    [rowHeight],
  );

  return {
    startIndex,
    endIndex,
    totalHeight,
    virtualItems,
    onScroll,
    scrollToIndex,
    scrollTop,
    scrollRef,
  };
}
