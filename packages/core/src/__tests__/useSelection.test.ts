import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSelection } from "../useSelection";

const visibleIds = ["a", "b", "c", "d", "e"];

describe("useSelection", () => {
  it("starts with no selection", () => {
    const { result } = renderHook(() => useSelection());
    expect(result.current.selectedIds.size).toBe(0);
  });

  it("selects a single item (replaces previous)", () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.select("a"));
    expect(result.current.selectedIds).toEqual(new Set(["a"]));
    act(() => result.current.select("b"));
    expect(result.current.selectedIds).toEqual(new Set(["b"]));
  });

  it("toggles selection (Ctrl+Click)", () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.select("a"));
    act(() => result.current.toggleSelect("b"));
    expect(result.current.selectedIds).toEqual(new Set(["a", "b"]));
    act(() => result.current.toggleSelect("a"));
    expect(result.current.selectedIds).toEqual(new Set(["b"]));
  });

  it("range selects (Shift+Click)", () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.select("b")); // sets anchor to b
    act(() => result.current.rangeSelect("d", visibleIds));
    expect(result.current.selectedIds).toEqual(new Set(["b", "c", "d"]));
  });

  it("range selects backwards", () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.select("d")); // sets anchor to d
    act(() => result.current.rangeSelect("b", visibleIds));
    expect(result.current.selectedIds).toEqual(new Set(["b", "c", "d"]));
  });

  it("selects all visible items", () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.selectAll(visibleIds));
    expect(result.current.selectedIds).toEqual(new Set(visibleIds));
  });

  it("clears selection", () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.selectAll(visibleIds));
    act(() => result.current.clearSelection());
    expect(result.current.selectedIds.size).toBe(0);
  });

  it("handles range select with no anchor", () => {
    const { result } = renderHook(() => useSelection());
    act(() => result.current.rangeSelect("c", visibleIds));
    expect(result.current.selectedIds).toEqual(new Set(["c"]));
  });
});
