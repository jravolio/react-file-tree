import { useReducer, useCallback, useMemo } from "react";
import type { SelectionAction } from "./types";

interface SelectionState {
  selectedIds: Set<string>;
  anchorId: string | null;
}

function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case "SELECT":
      return {
        selectedIds: new Set([action.id]),
        anchorId: action.id,
      };
    case "TOGGLE_SELECT": {
      const next = new Set(state.selectedIds);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return {
        selectedIds: next,
        anchorId: action.id,
      };
    }
    case "RANGE_SELECT": {
      const { id, visibleIds } = action;
      const anchor = state.anchorId;
      if (!anchor) {
        return { selectedIds: new Set([id]), anchorId: id };
      }
      const anchorIndex = visibleIds.indexOf(anchor);
      const targetIndex = visibleIds.indexOf(id);
      if (anchorIndex === -1 || targetIndex === -1) {
        return { selectedIds: new Set([id]), anchorId: id };
      }
      const start = Math.min(anchorIndex, targetIndex);
      const end = Math.max(anchorIndex, targetIndex);
      const rangeIds = visibleIds.slice(start, end + 1);
      return {
        selectedIds: new Set(rangeIds),
        anchorId: anchor, // anchor stays the same for range select
      };
    }
    case "SELECT_ALL":
      return {
        selectedIds: new Set(action.visibleIds),
        anchorId: state.anchorId,
      };
    case "CLEAR":
      return {
        selectedIds: new Set(),
        anchorId: null,
      };
  }
}

export interface UseSelectionOptions {
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  defaultSelectedIds?: Set<string>;
}

export function useSelection(options: UseSelectionOptions = {}) {
  const { selectedIds: controlledIds, onSelectionChange, defaultSelectedIds } = options;
  const isControlled = controlledIds !== undefined;

  const [internalState, dispatch] = useReducer(selectionReducer, {
    selectedIds: defaultSelectedIds ?? new Set(),
    anchorId: null,
  });

  const selectedIds = isControlled ? controlledIds : internalState.selectedIds;
  const anchorId = internalState.anchorId;

  const dispatchSelection = useCallback(
    (action: SelectionAction) => {
      if (isControlled && onSelectionChange) {
        const next = selectionReducer(
          { selectedIds: controlledIds, anchorId: internalState.anchorId },
          action,
        );
        onSelectionChange(next.selectedIds);
        // Still dispatch internally to track anchorId
        dispatch(action);
      } else {
        dispatch(action);
      }
    },
    [isControlled, onSelectionChange, controlledIds, internalState.anchorId],
  );

  const select = useCallback(
    (id: string) => dispatchSelection({ type: "SELECT", id }),
    [dispatchSelection],
  );

  const toggleSelect = useCallback(
    (id: string) => dispatchSelection({ type: "TOGGLE_SELECT", id }),
    [dispatchSelection],
  );

  const rangeSelect = useCallback(
    (id: string, visibleIds: string[]) =>
      dispatchSelection({ type: "RANGE_SELECT", id, visibleIds }),
    [dispatchSelection],
  );

  const selectAll = useCallback(
    (visibleIds: string[]) => dispatchSelection({ type: "SELECT_ALL", visibleIds }),
    [dispatchSelection],
  );

  const clearSelection = useCallback(
    () => dispatchSelection({ type: "CLEAR" }),
    [dispatchSelection],
  );

  return useMemo(
    () => ({
      selectedIds,
      anchorId,
      select,
      toggleSelect,
      rangeSelect,
      selectAll,
      clearSelection,
    }),
    [selectedIds, anchorId, select, toggleSelect, rangeSelect, selectAll, clearSelection],
  );
}
