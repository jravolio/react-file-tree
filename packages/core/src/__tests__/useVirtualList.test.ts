import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVirtualList } from "../useVirtualList";

describe("useVirtualList", () => {
  const defaultOptions = {
    itemCount: 100,
    rowHeight: 32,
    containerHeight: 320, // fits 10 rows
    overscanCount: 3,
  };

  it("calculates initial visible range from top", () => {
    const { result } = renderHook(() => useVirtualList(defaultOptions));
    // Visible: 0-9, overscan: 0-12
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(13); // 10 visible + 3 overscan below
  });

  it("calculates total height", () => {
    const { result } = renderHook(() => useVirtualList(defaultOptions));
    expect(result.current.totalHeight).toBe(100 * 32); // 3200
  });

  it("updates visible range on scroll", () => {
    const { result } = renderHook(() => useVirtualList(defaultOptions));
    // Scroll down 5 rows (160px)
    act(() => result.current.onScroll(160));
    // Visible: 5-14, with overscan: 2-17
    expect(result.current.startIndex).toBe(2);
    expect(result.current.endIndex).toBe(18);
  });

  it("clamps start to 0 when near top", () => {
    const { result } = renderHook(() => useVirtualList(defaultOptions));
    act(() => result.current.onScroll(32)); // scroll 1 row
    expect(result.current.startIndex).toBe(0); // can't go below 0
  });

  it("clamps end to itemCount", () => {
    const { result } = renderHook(() => useVirtualList(defaultOptions));
    // Scroll to near bottom
    act(() => result.current.onScroll(2880)); // row 90
    expect(result.current.endIndex).toBe(100); // can't exceed itemCount
  });

  it("returns correct virtualItems with offsets", () => {
    const { result } = renderHook(() => useVirtualList(defaultOptions));
    const items = result.current.virtualItems;
    expect(items.length).toBe(result.current.endIndex - result.current.startIndex);
    expect(items[0].index).toBe(0);
    expect(items[0].offsetTop).toBe(0);
    expect(items[1].index).toBe(1);
    expect(items[1].offsetTop).toBe(32);
  });

  it("handles zero items", () => {
    const { result } = renderHook(() =>
      useVirtualList({ ...defaultOptions, itemCount: 0 }),
    );
    expect(result.current.totalHeight).toBe(0);
    expect(result.current.virtualItems.length).toBe(0);
  });

  it("handles items fewer than viewport", () => {
    const { result } = renderHook(() =>
      useVirtualList({ ...defaultOptions, itemCount: 3 }),
    );
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(3);
    expect(result.current.virtualItems.length).toBe(3);
  });

  it("respects custom overscanCount", () => {
    const { result } = renderHook(() =>
      useVirtualList({ ...defaultOptions, overscanCount: 0 }),
    );
    // Only visible rows: 0-9
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(10);
  });

  it("varies visible range with different container heights", () => {
    const { result } = renderHook(() =>
      useVirtualList({ ...defaultOptions, containerHeight: 160, overscanCount: 0 }),
    );
    // 160px / 32px = 5 visible rows
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(5);
  });

  it("varies visible range with different row heights", () => {
    const { result } = renderHook(() =>
      useVirtualList({ ...defaultOptions, rowHeight: 64, overscanCount: 0 }),
    );
    // 320px / 64px = 5 visible rows
    expect(result.current.startIndex).toBe(0);
    expect(result.current.endIndex).toBe(5);
  });
});
