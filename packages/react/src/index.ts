export { FileTree } from "./FileTree";
export type { FileTreeProps } from "./FileTree";
export { TreeNodeRow } from "./TreeNodeRow";
export type { TreeNodeRowProps } from "./TreeNodeRow";

// Re-export core types for convenience
export type {
  TreeNode,
  FlattenedNode,
  TreeDecoration,
  DecorationProvider,
  IconTheme,
  IconValue,
  FileTreeHandle,
} from "@vscode-file-tree/core";

export { useTreeContext } from "@vscode-file-tree/core";

export { TreeDndContext, useTreeDnd } from "./DragAndDrop";
export type { TreeDndContextProps, DragState } from "./DragAndDrop";
