import { useReducer, useCallback, useMemo } from "react";
import type { TreeExpansionAction } from "./types";

interface TreeExpansionState {
  expandedIds: Set<string>;
}

function expansionReducer(
  state: TreeExpansionState,
  action: TreeExpansionAction,
): TreeExpansionState {
  switch (action.type) {
    case "EXPAND": {
      if (state.expandedIds.has(action.id)) return state;
      const next = new Set(state.expandedIds);
      next.add(action.id);
      return { expandedIds: next };
    }
    case "COLLAPSE": {
      if (!state.expandedIds.has(action.id)) return state;
      const next = new Set(state.expandedIds);
      next.delete(action.id);
      return { expandedIds: next };
    }
    case "TOGGLE": {
      const next = new Set(state.expandedIds);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      return { expandedIds: next };
    }
    case "COLLAPSE_ALL":
      return { expandedIds: new Set() };
    case "SET_EXPANDED":
      return { expandedIds: action.ids };
  }
}

export interface UseTreeStateOptions {
  /** Controlled expanded IDs — if provided, component is in controlled mode */
  expandedIds?: Set<string>;
  /** Callback for controlled mode */
  onExpandChange?: (expandedIds: Set<string>) => void;
  /** Default expanded IDs for uncontrolled mode */
  defaultExpandedIds?: Set<string>;
}

export function useTreeState(options: UseTreeStateOptions = {}) {
  const { expandedIds: controlledIds, onExpandChange, defaultExpandedIds } = options;
  const isControlled = controlledIds !== undefined;

  const [internalState, dispatch] = useReducer(expansionReducer, {
    expandedIds: defaultExpandedIds ?? new Set(),
  });

  const expandedIds = isControlled ? controlledIds : internalState.expandedIds;

  const dispatchExpansion = useCallback(
    (action: TreeExpansionAction) => {
      if (isControlled && onExpandChange) {
        // Compute the next state and notify the consumer
        const next = expansionReducer({ expandedIds: controlledIds }, action);
        onExpandChange(next.expandedIds);
      } else {
        dispatch(action);
      }
    },
    [isControlled, onExpandChange, controlledIds],
  );

  const expand = useCallback(
    (id: string) => dispatchExpansion({ type: "EXPAND", id }),
    [dispatchExpansion],
  );

  const collapse = useCallback(
    (id: string) => dispatchExpansion({ type: "COLLAPSE", id }),
    [dispatchExpansion],
  );

  const toggle = useCallback(
    (id: string) => dispatchExpansion({ type: "TOGGLE", id }),
    [dispatchExpansion],
  );

  const collapseAll = useCallback(
    () => dispatchExpansion({ type: "COLLAPSE_ALL" }),
    [dispatchExpansion],
  );

  const setExpanded = useCallback(
    (ids: Set<string>) => dispatchExpansion({ type: "SET_EXPANDED", ids }),
    [dispatchExpansion],
  );

  return useMemo(
    () => ({
      expandedIds,
      expand,
      collapse,
      toggle,
      collapseAll,
      setExpanded,
    }),
    [expandedIds, expand, collapse, toggle, collapseAll, setExpanded],
  );
}
