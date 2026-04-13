import { createContext, useContext } from "react";
import type { TreeNode, FlattenedNode } from "./types";

export interface TreeContextValue<T = Record<string, unknown>> {
  // Data
  flatNodes: FlattenedNode<T>[];
  visibleIds: string[];
  nodesById: Map<string, TreeNode<T>>;

  // Expansion
  expandedIds: Set<string>;
  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggle: (id: string) => void;
  collapseAll: () => void;

  // Selection
  selectedIds: Set<string>;
  select: (id: string) => void;
  toggleSelect: (id: string) => void;
  rangeSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // Focus
  focusedId: string | null;
  focus: (id: string) => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;

  // Configuration
  compactFolders: boolean;
  indentSize: number;
}

export const TreeContext = createContext<TreeContextValue | null>(null);

export function useTreeContext<T = Record<string, unknown>>(): TreeContextValue<T> {
  const ctx = useContext(TreeContext);
  if (!ctx) {
    throw new Error("useTreeContext must be used within a <FileTree> provider");
  }
  return ctx as unknown as TreeContextValue<T>;
}
