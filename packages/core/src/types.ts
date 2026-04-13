/** Generic tree node that consumers provide */
export interface TreeNode<T = Record<string, unknown>> {
  /** Unique identifier for this node */
  id: string;
  /** Display name */
  name: string;
  /** Children nodes — presence indicates this is a folder */
  children?: TreeNode<T>[];
  /** Consumer-provided custom data */
  data?: T;
}

/** Metadata attached to each node for internal use */
export interface TreeNodeData {
  /** Whether this node is a folder (has children array) */
  isFolder: boolean;
  /** Depth level in the tree (0 = root) */
  depth: number;
  /** Parent node ID, undefined for root nodes */
  parentId: string | undefined;
  /** IDs of all ancestors from root to parent */
  ancestorIds: string[];
}

/** A node in the flattened visible-node array used for rendering */
export interface FlattenedNode<T = Record<string, unknown>> {
  /** The original tree node */
  node: TreeNode<T>;
  /** Computed metadata */
  meta: TreeNodeData;
  /** Whether this folder node is currently expanded */
  isExpanded: boolean;
  /** The compact path segments if this node is part of a compressed chain */
  compactPath?: TreeNode<T>[];
}

/** The complete tree state managed internally */
export interface TreeState {
  /** Set of expanded node IDs */
  expandedIds: Set<string>;
  /** Set of selected node IDs */
  selectedIds: Set<string>;
  /** The focused node ID */
  focusedId: string | null;
  /** Anchor node ID for range selection */
  anchorId: string | null;
}

/** Actions for tree expansion state */
export type TreeExpansionAction =
  | { type: "EXPAND"; id: string }
  | { type: "COLLAPSE"; id: string }
  | { type: "TOGGLE"; id: string }
  | { type: "COLLAPSE_ALL" }
  | { type: "SET_EXPANDED"; ids: Set<string> };

/** Actions for selection state */
export type SelectionAction =
  | { type: "SELECT"; id: string }
  | { type: "TOGGLE_SELECT"; id: string }
  | { type: "RANGE_SELECT"; id: string; visibleIds: string[] }
  | { type: "SELECT_ALL"; visibleIds: string[] }
  | { type: "CLEAR" };

/** Actions for focus state */
export type FocusAction =
  | { type: "FOCUS"; id: string }
  | { type: "FOCUS_NEXT"; visibleIds: string[] }
  | { type: "FOCUS_PREV"; visibleIds: string[] }
  | { type: "FOCUS_FIRST"; visibleIds: string[] }
  | { type: "FOCUS_LAST"; visibleIds: string[] };

/** Decoration applied to a tree item */
export interface TreeDecoration {
  color?: string;
  badge?: string;
  tooltip?: string;
}

/** Provider that resolves decorations for tree items */
export interface DecorationProvider<T = Record<string, unknown>> {
  getDecoration(node: TreeNode<T>): TreeDecoration | null;
  priority?: number;
}

/** Icon resolver — either a CSS class name string or a component type */
export type IconValue = string | ((...args: unknown[]) => unknown);

/** Icon theme definition */
export interface IconTheme {
  fileExtensions: Record<string, IconValue>;
  fileNames: Record<string, IconValue>;
  folderNames: Record<string, IconValue>;
  folderNamesExpanded: Record<string, IconValue>;
  defaultFile: IconValue;
  defaultFolder: IconValue;
  defaultFolderExpanded: IconValue;
}

/** Imperative API exposed via ref */
export interface FileTreeHandle {
  open(id: string): void;
  close(id: string): void;
  select(ids: string[]): void;
  scrollTo(id: string): void;
  focus(id: string): void;
}
