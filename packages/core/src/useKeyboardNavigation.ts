import { useCallback, useRef } from "react";
import type { FlattenedNode } from "./types";

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

function isCtrlOrMeta(e: KeyboardEvent): boolean {
  return IS_MAC ? e.metaKey : e.ctrlKey;
}

export interface UseKeyboardNavigationOptions<T = Record<string, unknown>> {
  flatNodes: FlattenedNode<T>[];
  visibleIds: string[];
  focusedId: string | null;

  // Focus actions
  focus: (id: string) => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;

  // Expansion actions
  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggle: (id: string) => void;

  // Selection actions
  select: (id: string) => void;
  toggleSelect: (id: string) => void;
  rangeSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // Callbacks
  onNodeClick?: (params: { node: FlattenedNode<T>["node"]; isFolder: boolean; isExpanded: boolean }) => void;

  // State
  selectedIds: Set<string>;
  expandedIds: Set<string>;
}

export interface TypeaheadState {
  buffer: string;
  timeout: ReturnType<typeof setTimeout> | null;
}

export function useKeyboardNavigation<T = Record<string, unknown>>(
  options: UseKeyboardNavigationOptions<T>,
) {
  const typeaheadRef = useRef<TypeaheadState>({ buffer: "", timeout: null });

  const getFlatNode = useCallback(
    (id: string) => options.flatNodes.find((n) => n.node.id === id),
    [options.flatNodes],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const {
        focusedId,
        visibleIds,
        focus,
        focusNext,
        focusPrev,
        focusFirst,
        focusLast,
        expand,
        collapse,
        toggle,
        select,
        rangeSelect,
        selectAll,
        clearSelection,
        onNodeClick,
        expandedIds,
      } = options;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (e.shiftKey && focusedId) {
            // Extend selection downward
            const idx = visibleIds.indexOf(focusedId);
            if (idx < visibleIds.length - 1) {
              const nextId = visibleIds[idx + 1];
              focus(nextId);
              rangeSelect(nextId);
            }
          } else {
            focusNext();
            // If no modifier, set single selection to focused item
            if (!isCtrlOrMeta(e)) {
              const idx = focusedId ? visibleIds.indexOf(focusedId) : -1;
              const nextIdx = idx < visibleIds.length - 1 ? idx + 1 : idx;
              if (nextIdx >= 0 && nextIdx < visibleIds.length) {
                select(visibleIds[nextIdx]);
              }
            }
          }
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          if (e.shiftKey && focusedId) {
            const idx = visibleIds.indexOf(focusedId);
            if (idx > 0) {
              const prevId = visibleIds[idx - 1];
              focus(prevId);
              rangeSelect(prevId);
            }
          } else {
            focusPrev();
            if (!isCtrlOrMeta(e)) {
              const idx = focusedId ? visibleIds.indexOf(focusedId) : -1;
              const prevIdx = idx > 0 ? idx - 1 : idx;
              if (prevIdx >= 0 && prevIdx < visibleIds.length) {
                select(visibleIds[prevIdx]);
              }
            }
          }
          break;
        }

        case "ArrowRight": {
          e.preventDefault();
          if (!focusedId) break;
          const rightNode = getFlatNode(focusedId);
          if (!rightNode) break;
          if (rightNode.meta.isFolder) {
            if (!rightNode.isExpanded) {
              expand(focusedId);
            } else {
              // Move to first child
              const idx = visibleIds.indexOf(focusedId);
              if (idx < visibleIds.length - 1) {
                focus(visibleIds[idx + 1]);
                select(visibleIds[idx + 1]);
              }
            }
          }
          break;
        }

        case "ArrowLeft": {
          e.preventDefault();
          if (!focusedId) break;
          const leftNode = getFlatNode(focusedId);
          if (!leftNode) break;
          if (leftNode.meta.isFolder && leftNode.isExpanded) {
            collapse(focusedId);
          } else if (leftNode.meta.parentId) {
            // Move to parent
            focus(leftNode.meta.parentId);
            select(leftNode.meta.parentId);
          }
          break;
        }

        case "Enter": {
          e.preventDefault();
          if (!focusedId) break;
          const enterNode = getFlatNode(focusedId);
          if (!enterNode) break;
          if (enterNode.meta.isFolder) {
            toggle(focusedId);
            onNodeClick?.({ node: enterNode.node, isFolder: true, isExpanded: !expandedIds.has(focusedId) });
          } else {
            onNodeClick?.({ node: enterNode.node, isFolder: false, isExpanded: false });
          }
          break;
        }

        case "Escape": {
          e.preventDefault();
          clearSelection();
          break;
        }

        case "Home": {
          e.preventDefault();
          focusFirst();
          if (!e.shiftKey) {
            if (visibleIds.length > 0) select(visibleIds[0]);
          }
          break;
        }

        case "End": {
          e.preventDefault();
          focusLast();
          if (!e.shiftKey) {
            if (visibleIds.length > 0) select(visibleIds[visibleIds.length - 1]);
          }
          break;
        }

        case "a": {
          if (isCtrlOrMeta(e)) {
            e.preventDefault();
            selectAll();
          } else {
            handleTypeahead(e.key);
          }
          break;
        }

        default: {
          // Typeahead search for single printable characters
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            handleTypeahead(e.key);
          }
          break;
        }
      }
    },
    [options, getFlatNode],
  );

  const handleTypeahead = useCallback(
    (char: string) => {
      const { visibleIds, flatNodes, focus, select } = options;
      const state = typeaheadRef.current;

      if (state.timeout) clearTimeout(state.timeout);
      state.buffer += char.toLowerCase();

      // Find next match starting after current focus
      const currentIdx = options.focusedId ? visibleIds.indexOf(options.focusedId) : -1;
      const searchOrder = [
        ...visibleIds.slice(currentIdx + 1),
        ...visibleIds.slice(0, currentIdx + 1),
      ];

      for (const id of searchOrder) {
        const node = flatNodes.find((n) => n.node.id === id);
        if (node && node.node.name.toLowerCase().startsWith(state.buffer)) {
          focus(id);
          select(id);
          break;
        }
      }

      state.timeout = setTimeout(() => {
        state.buffer = "";
        state.timeout = null;
      }, 500);
    },
    [options],
  );

  return { handleKeyDown };
}
