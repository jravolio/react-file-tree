import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTreeState } from "../useTreeState";

describe("useTreeState", () => {
  it("starts with no expanded nodes by default", () => {
    const { result } = renderHook(() => useTreeState());
    expect(result.current.expandedIds.size).toBe(0);
  });

  it("starts with defaultExpandedIds", () => {
    const defaults = new Set(["a", "b"]);
    const { result } = renderHook(() => useTreeState({ defaultExpandedIds: defaults }));
    expect(result.current.expandedIds).toEqual(defaults);
  });

  it("expands a node", () => {
    const { result } = renderHook(() => useTreeState());
    act(() => result.current.expand("folder1"));
    expect(result.current.expandedIds.has("folder1")).toBe(true);
  });

  it("collapses a node", () => {
    const { result } = renderHook(() => useTreeState({
      defaultExpandedIds: new Set(["folder1"]),
    }));
    act(() => result.current.collapse("folder1"));
    expect(result.current.expandedIds.has("folder1")).toBe(false);
  });

  it("toggles a node", () => {
    const { result } = renderHook(() => useTreeState());
    act(() => result.current.toggle("folder1"));
    expect(result.current.expandedIds.has("folder1")).toBe(true);
    act(() => result.current.toggle("folder1"));
    expect(result.current.expandedIds.has("folder1")).toBe(false);
  });

  it("collapses all nodes", () => {
    const { result } = renderHook(() => useTreeState({
      defaultExpandedIds: new Set(["a", "b", "c"]),
    }));
    act(() => result.current.collapseAll());
    expect(result.current.expandedIds.size).toBe(0);
  });

  it("sets expanded IDs directly", () => {
    const { result } = renderHook(() => useTreeState());
    act(() => result.current.setExpanded(new Set(["x", "y"])));
    expect(result.current.expandedIds).toEqual(new Set(["x", "y"]));
  });

  describe("controlled mode", () => {
    it("uses provided expandedIds", () => {
      const controlled = new Set(["ctrl1"]);
      const { result } = renderHook(() => useTreeState({ expandedIds: controlled }));
      expect(result.current.expandedIds).toBe(controlled);
    });

    it("calls onExpandChange instead of mutating state", () => {
      const onExpandChange = vi.fn();
      const controlled = new Set(["ctrl1"]);
      const { result } = renderHook(() =>
        useTreeState({ expandedIds: controlled, onExpandChange }),
      );
      act(() => result.current.expand("ctrl2"));
      expect(onExpandChange).toHaveBeenCalledWith(new Set(["ctrl1", "ctrl2"]));
    });

    it("calls onExpandChange on collapse", () => {
      const onExpandChange = vi.fn();
      const controlled = new Set(["ctrl1", "ctrl2"]);
      const { result } = renderHook(() =>
        useTreeState({ expandedIds: controlled, onExpandChange }),
      );
      act(() => result.current.collapse("ctrl1"));
      expect(onExpandChange).toHaveBeenCalledWith(new Set(["ctrl2"]));
    });
  });
});
