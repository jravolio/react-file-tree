import { useReducer, useCallback, useMemo } from "react";
import type { FocusAction } from "./types";

interface FocusState {
  focusedId: string | null;
}

function focusReducer(state: FocusState, action: FocusAction): FocusState {
  switch (action.type) {
    case "FOCUS":
      return { focusedId: action.id };
    case "FOCUS_NEXT": {
      const { visibleIds } = action;
      if (visibleIds.length === 0) return state;
      if (state.focusedId === null) return { focusedId: visibleIds[0] };
      const currentIndex = visibleIds.indexOf(state.focusedId);
      if (currentIndex === -1) return { focusedId: visibleIds[0] };
      if (currentIndex >= visibleIds.length - 1) return state; // already at last item
      return { focusedId: visibleIds[currentIndex + 1] };
    }
    case "FOCUS_PREV": {
      const { visibleIds } = action;
      if (visibleIds.length === 0) return state;
      if (state.focusedId === null) return { focusedId: visibleIds[visibleIds.length - 1] };
      const currentIndex = visibleIds.indexOf(state.focusedId);
      if (currentIndex === -1) return { focusedId: visibleIds[0] };
      if (currentIndex <= 0) return state; // already at first item
      return { focusedId: visibleIds[currentIndex - 1] };
    }
    case "FOCUS_FIRST": {
      const { visibleIds } = action;
      if (visibleIds.length === 0) return state;
      return { focusedId: visibleIds[0] };
    }
    case "FOCUS_LAST": {
      const { visibleIds } = action;
      if (visibleIds.length === 0) return state;
      return { focusedId: visibleIds[visibleIds.length - 1] };
    }
  }
}

export function useFocus() {
  const [state, dispatch] = useReducer(focusReducer, { focusedId: null });

  const focus = useCallback(
    (id: string) => dispatch({ type: "FOCUS", id }),
    [],
  );

  const focusNext = useCallback(
    (visibleIds: string[]) => dispatch({ type: "FOCUS_NEXT", visibleIds }),
    [],
  );

  const focusPrev = useCallback(
    (visibleIds: string[]) => dispatch({ type: "FOCUS_PREV", visibleIds }),
    [],
  );

  const focusFirst = useCallback(
    (visibleIds: string[]) => dispatch({ type: "FOCUS_FIRST", visibleIds }),
    [],
  );

  const focusLast = useCallback(
    (visibleIds: string[]) => dispatch({ type: "FOCUS_LAST", visibleIds }),
    [],
  );

  return useMemo(
    () => ({
      focusedId: state.focusedId,
      focus,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
    }),
    [state.focusedId, focus, focusNext, focusPrev, focusFirst, focusLast],
  );
}
