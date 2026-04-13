export type {
  TreeNode,
  TreeNodeData,
  FlattenedNode,
  TreeState,
  TreeExpansionAction,
  SelectionAction,
  FocusAction,
  TreeDecoration,
  DecorationProvider,
  IconTheme,
  IconValue,
  FileTreeHandle,
} from "./types";

export { flattenTree } from "./flattenTree";
export type { FlattenOptions } from "./flattenTree";

export { useTreeState } from "./useTreeState";
export type { UseTreeStateOptions } from "./useTreeState";

export { useSelection } from "./useSelection";
export type { UseSelectionOptions } from "./useSelection";

export { useFocus } from "./useFocus";

export { TreeContext, useTreeContext } from "./TreeContext";
export type { TreeContextValue } from "./TreeContext";

export { useVirtualList } from "./useVirtualList";
export type { UseVirtualListOptions, VirtualListResult, VirtualItem } from "./useVirtualList";

export { useKeyboardNavigation } from "./useKeyboardNavigation";
export type { UseKeyboardNavigationOptions } from "./useKeyboardNavigation";

export { fuzzyMatch } from "./fuzzyMatch";
export type { FuzzyMatchResult } from "./fuzzyMatch";

export { resolveIcon } from "./resolveIcon";
