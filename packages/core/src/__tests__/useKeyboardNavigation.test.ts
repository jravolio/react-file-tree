import { describe, it, expect, vi } from "vitest";
import type { FlattenedNode } from "../types";
import type { UseKeyboardNavigationOptions } from "../useKeyboardNavigation";

function makeFlatNode(
  id: string,
  name: string,
  overrides: Partial<FlattenedNode> = {},
): FlattenedNode {
  return {
    node: { id, name },
    meta: {
      isFolder: false,
      depth: 0,
      parentId: undefined,
      ancestorIds: [],
    },
    isExpanded: false,
    ...overrides,
  };
}

function makeFolder(
  id: string,
  name: string,
  parentId: string | undefined,
  isExpanded: boolean,
): FlattenedNode {
  return {
    node: { id, name, children: [] },
    meta: {
      isFolder: true,
      depth: parentId ? 1 : 0,
      parentId,
      ancestorIds: parentId ? [parentId] : [],
    },
    isExpanded,
  };
}

function createMockOptions(
  overrides: Partial<UseKeyboardNavigationOptions> = {},
): UseKeyboardNavigationOptions {
  const flatNodes = [
    makeFolder("src", "src", undefined, true),
    makeFolder("src/app", "app", "src", false),
    makeFlatNode("src/main.ts", "main.ts", {
      meta: { isFolder: false, depth: 1, parentId: "src", ancestorIds: ["src"] },
    }),
    makeFlatNode("readme.md", "readme.md"),
  ];

  return {
    flatNodes,
    visibleIds: flatNodes.map((n) => n.node.id),
    focusedId: "src/app",
    focus: vi.fn(),
    focusNext: vi.fn(),
    focusPrev: vi.fn(),
    focusFirst: vi.fn(),
    focusLast: vi.fn(),
    expand: vi.fn(),
    collapse: vi.fn(),
    toggle: vi.fn(),
    select: vi.fn(),
    toggleSelect: vi.fn(),
    rangeSelect: vi.fn(),
    selectAll: vi.fn(),
    clearSelection: vi.fn(),
    onNodeClick: vi.fn(),
    selectedIds: new Set(["src/app"]),
    expandedIds: new Set(["src"]),
    ...overrides,
  };
}

function makeKeyEvent(key: string, modifiers: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return {
    key,
    preventDefault: vi.fn(),
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    ...modifiers,
  } as unknown as KeyboardEvent;
}

import { renderHook } from "@testing-library/react";
import { useKeyboardNavigation } from "../useKeyboardNavigation";

function getHandler(overrides: Partial<UseKeyboardNavigationOptions> = {}) {
  const opts = createMockOptions(overrides);
  const { result } = renderHook(() => useKeyboardNavigation(opts));
  return { handler: result.current.handleKeyDown, opts };
}

describe("useKeyboardNavigation", () => {
  describe("ArrowDown", () => {
    it("calls focusNext and selects next item", () => {
      const { handler, opts } = getHandler();
      handler(makeKeyEvent("ArrowDown"));
      expect(opts.focusNext).toHaveBeenCalled();
    });
  });

  describe("ArrowUp", () => {
    it("calls focusPrev", () => {
      const { handler, opts } = getHandler();
      handler(makeKeyEvent("ArrowUp"));
      expect(opts.focusPrev).toHaveBeenCalled();
    });
  });

  describe("ArrowRight", () => {
    it("expands a collapsed folder", () => {
      const { handler, opts } = getHandler({ focusedId: "src/app" });
      handler(makeKeyEvent("ArrowRight"));
      expect(opts.expand).toHaveBeenCalledWith("src/app");
    });

    it("moves to first child when folder is already expanded", () => {
      const { handler, opts } = getHandler({ focusedId: "src" });
      handler(makeKeyEvent("ArrowRight"));
      expect(opts.focus).toHaveBeenCalledWith("src/app");
    });

    it("does nothing on a file node", () => {
      const { handler, opts } = getHandler({ focusedId: "src/main.ts" });
      handler(makeKeyEvent("ArrowRight"));
      expect(opts.expand).not.toHaveBeenCalled();
      expect(opts.focus).not.toHaveBeenCalled();
    });
  });

  describe("ArrowLeft", () => {
    it("collapses an expanded folder", () => {
      const { handler, opts } = getHandler({ focusedId: "src" });
      handler(makeKeyEvent("ArrowLeft"));
      expect(opts.collapse).toHaveBeenCalledWith("src");
    });

    it("moves to parent when on a collapsed folder", () => {
      const { handler, opts } = getHandler({ focusedId: "src/app" });
      handler(makeKeyEvent("ArrowLeft"));
      expect(opts.focus).toHaveBeenCalledWith("src");
    });

    it("moves to parent when on a file", () => {
      const { handler, opts } = getHandler({ focusedId: "src/main.ts" });
      handler(makeKeyEvent("ArrowLeft"));
      expect(opts.focus).toHaveBeenCalledWith("src");
    });
  });

  describe("Enter", () => {
    it("toggles folder expansion and fires onNodeClick for folder", () => {
      const { handler, opts } = getHandler({ focusedId: "src" });
      handler(makeKeyEvent("Enter"));
      expect(opts.toggle).toHaveBeenCalledWith("src");
      expect(opts.onNodeClick).toHaveBeenCalledWith({
        node: { id: "src", name: "src", children: [] },
        isFolder: true,
        isExpanded: false, // src was expanded, so after toggle it's collapsed
      });
    });

    it("fires onNodeClick on a file", () => {
      const { handler, opts } = getHandler({ focusedId: "src/main.ts" });
      handler(makeKeyEvent("Enter"));
      expect(opts.onNodeClick).toHaveBeenCalledWith({
        node: { id: "src/main.ts", name: "main.ts" },
        isFolder: false,
        isExpanded: false,
      });
    });
  });

  describe("Escape", () => {
    it("clears selection", () => {
      const { handler, opts } = getHandler();
      handler(makeKeyEvent("Escape"));
      expect(opts.clearSelection).toHaveBeenCalled();
    });
  });

  describe("Home / End", () => {
    it("Home focuses first item", () => {
      const { handler, opts } = getHandler();
      handler(makeKeyEvent("Home"));
      expect(opts.focusFirst).toHaveBeenCalled();
    });

    it("End focuses last item", () => {
      const { handler, opts } = getHandler();
      handler(makeKeyEvent("End"));
      expect(opts.focusLast).toHaveBeenCalled();
    });
  });

  describe("Ctrl+A / Cmd+A", () => {
    it("selects all visible items", () => {
      const { handler, opts } = getHandler();
      handler(makeKeyEvent("a", { ctrlKey: true }));
      expect(opts.selectAll).toHaveBeenCalled();
    });
  });

  describe("Shift+Arrow", () => {
    it("Shift+Down extends selection", () => {
      const { handler, opts } = getHandler({ focusedId: "src/app" });
      handler(makeKeyEvent("ArrowDown", { shiftKey: true }));
      expect(opts.focus).toHaveBeenCalledWith("src/main.ts");
      expect(opts.rangeSelect).toHaveBeenCalledWith("src/main.ts");
    });

    it("Shift+Up extends selection", () => {
      const { handler, opts } = getHandler({ focusedId: "src/app" });
      handler(makeKeyEvent("ArrowUp", { shiftKey: true }));
      expect(opts.focus).toHaveBeenCalledWith("src");
      expect(opts.rangeSelect).toHaveBeenCalledWith("src");
    });
  });

  describe("F2 key", () => {
    it("is a no-op (no error, no action)", () => {
      const { handler, opts } = getHandler({ focusedId: "readme.md" });
      handler(makeKeyEvent("F2"));
      // Should not throw and no callbacks should fire
      expect(opts.toggle).not.toHaveBeenCalled();
      expect(opts.onNodeClick).not.toHaveBeenCalled();
    });
  });

  describe("Delete key", () => {
    it("is a no-op (no error, no action)", () => {
      const { handler, opts } = getHandler({
        selectedIds: new Set(["src/app", "readme.md"]),
      });
      handler(makeKeyEvent("Delete"));
      // Should not throw and no callbacks should fire
      expect(opts.onNodeClick).not.toHaveBeenCalled();
    });
  });
});
