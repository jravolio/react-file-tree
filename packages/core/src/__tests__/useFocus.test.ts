import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFocus } from "../useFocus";

const visibleIds = ["a", "b", "c", "d", "e"];

describe("useFocus", () => {
  it("starts with no focus", () => {
    const { result } = renderHook(() => useFocus());
    expect(result.current.focusedId).toBeNull();
  });

  it("focuses a specific node", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focus("b"));
    expect(result.current.focusedId).toBe("b");
  });

  it("focuses next item", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focus("b"));
    act(() => result.current.focusNext(visibleIds));
    expect(result.current.focusedId).toBe("c");
  });

  it("does not move past last item on focusNext", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focus("e"));
    act(() => result.current.focusNext(visibleIds));
    expect(result.current.focusedId).toBe("e");
  });

  it("focuses previous item", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focus("c"));
    act(() => result.current.focusPrev(visibleIds));
    expect(result.current.focusedId).toBe("b");
  });

  it("does not move past first item on focusPrev", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focus("a"));
    act(() => result.current.focusPrev(visibleIds));
    expect(result.current.focusedId).toBe("a");
  });

  it("focuses first item", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focus("d"));
    act(() => result.current.focusFirst(visibleIds));
    expect(result.current.focusedId).toBe("a");
  });

  it("focuses last item", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focus("b"));
    act(() => result.current.focusLast(visibleIds));
    expect(result.current.focusedId).toBe("e");
  });

  it("focuses first item when no current focus on focusNext", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focusNext(visibleIds));
    expect(result.current.focusedId).toBe("a");
  });

  it("focuses last item when no current focus on focusPrev", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focusPrev(visibleIds));
    expect(result.current.focusedId).toBe("e");
  });

  it("handles empty visible list", () => {
    const { result } = renderHook(() => useFocus());
    act(() => result.current.focusNext([]));
    expect(result.current.focusedId).toBeNull();
  });
});
