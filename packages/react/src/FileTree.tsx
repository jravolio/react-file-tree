import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  flattenTree,
  useTreeState,
  useSelection,
  useFocus,
  useVirtualList,
  useKeyboardNavigation,
  TreeContext,
  type TreeNode,
  type FlattenedNode,
  type FileTreeHandle,
  type TreeDecoration,
  type DecorationProvider,
  type IconTheme,
  type TreeContextValue,
} from "@vscode-file-tree/core";
import { TreeNodeRow } from "./TreeNodeRow";
import { DraggableTreeNodeRow } from "./DraggableTreeNodeRow";
import { TreeDndContext } from "./DragAndDrop";
import "./styles.css";

export interface FileTreeProps<T = Record<string, unknown>> {
  /** Tree data — array of root nodes */
  data: TreeNode<T>[];
  /** Height of the tree container in pixels */
  height?: number;
  /** Width of the tree container in pixels or CSS string */
  width?: number | string;
  /** Height of each row in pixels */
  rowHeight?: number;
  /** Indent size per depth level in pixels */
  indentSize?: number;
  /** Number of overscan rows above/below viewport */
  overscanCount?: number;
  /** Enable compact folder paths */
  compactFolders?: boolean;
  /** Enable drag and drop */
  enableDragAndDrop?: boolean;

  /** Controlled expanded IDs */
  expandedIds?: Set<string>;
  onExpandChange?: (ids: Set<string>) => void;
  defaultExpandedIds?: Set<string>;

  /** Controlled selected IDs */
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;

  /** Callbacks */
  onNodeClick?: (params: { node: TreeNode<T>; isFolder: boolean; isExpanded: boolean }) => void;
  onMove?: (params: { dragIds: string[]; targetId: string; targetIndex: number }) => void;
  onNavigateToSegment?: (node: FlattenedNode<T>, segmentIndex: number) => void;

  /** Decoration providers */
  decorationProviders?: DecorationProvider<T>[];

  /** Icon theme */
  iconTheme?: IconTheme;

  /** Custom icon renderer — overrides iconTheme */
  renderIcon?: (node: FlattenedNode<T>) => React.ReactNode;

  /** Accessible label for the tree */
  "aria-label"?: string;

  /** Additional CSS class names */
  className?: string;
}

function FileTreeInner<T = Record<string, unknown>>(
  props: FileTreeProps<T>,
  ref: React.ForwardedRef<FileTreeHandle>,
) {
  const {
    data,
    height = 400,
    width = "100%",
    rowHeight = 22,
    indentSize = 16,
    overscanCount = 5,
    compactFolders = true,
    enableDragAndDrop = false,
    expandedIds: controlledExpandedIds,
    onExpandChange,
    defaultExpandedIds,
    selectedIds: controlledSelectedIds,
    onSelectionChange,
    onNodeClick,
    onMove,
    onNavigateToSegment,
    decorationProviders,
    renderIcon,
    className,
    ...restProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Core state hooks
  const treeState = useTreeState({
    expandedIds: controlledExpandedIds,
    onExpandChange,
    defaultExpandedIds,
  });

  const selection = useSelection({
    selectedIds: controlledSelectedIds,
    onSelectionChange,
  });

  const focusState = useFocus();

  // Flatten tree
  const flatNodes = useMemo(
    () =>
      flattenTree(data, {
        expandedIds: treeState.expandedIds,
        compactFolders,
      }) as FlattenedNode<T>[],
    [data, treeState.expandedIds, compactFolders],
  );

  const visibleIds = useMemo(() => flatNodes.map((n) => n.node.id), [flatNodes]);

  const nodesById = useMemo(() => {
    const map = new Map<string, TreeNode<T>>();
    function walk(nodes: TreeNode<T>[]) {
      for (const node of nodes) {
        map.set(node.id, node);
        if (node.children) walk(node.children);
      }
    }
    walk(data);
    return map;
  }, [data]);

  // Virtual list
  const virtualList = useVirtualList({
    itemCount: flatNodes.length,
    rowHeight,
    containerHeight: height,
    overscanCount,
  });

  // Resolve decorations
  const decorations = useMemo(() => {
    if (!decorationProviders || decorationProviders.length === 0) return new Map();
    const map = new Map<string, TreeDecoration>();
    for (const flatNode of flatNodes) {
      for (const provider of decorationProviders) {
        const dec = provider.getDecoration(flatNode.node);
        if (dec) {
          const existing = map.get(flatNode.node.id);
          if (existing) {
            map.set(flatNode.node.id, {
              color: existing.color || dec.color,
              badge: existing.badge || dec.badge,
              tooltip: existing.tooltip || dec.tooltip,
            });
          } else {
            map.set(flatNode.node.id, dec);
          }
        }
      }
    }
    return map;
  }, [flatNodes, decorationProviders]);

  // Keyboard navigation
  const { handleKeyDown } = useKeyboardNavigation({
    flatNodes: flatNodes as FlattenedNode[],
    visibleIds,
    focusedId: focusState.focusedId,
    focus: focusState.focus,
    focusNext: () => focusState.focusNext(visibleIds),
    focusPrev: () => focusState.focusPrev(visibleIds),
    focusFirst: () => focusState.focusFirst(visibleIds),
    focusLast: () => focusState.focusLast(visibleIds),
    expand: treeState.expand,
    collapse: treeState.collapse,
    toggle: treeState.toggle,
    select: selection.select,
    toggleSelect: selection.toggleSelect,
    rangeSelect: (id: string) => selection.rangeSelect(id, visibleIds),
    selectAll: () => selection.selectAll(visibleIds),
    clearSelection: selection.clearSelection,
    onNodeClick: onNodeClick as ((params: { node: TreeNode; isFolder: boolean; isExpanded: boolean }) => void) | undefined,
    selectedIds: selection.selectedIds,
    expandedIds: treeState.expandedIds,
  });

  // Attach keyboard handler
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown as EventListener);
    return () => el.removeEventListener("keydown", handleKeyDown as EventListener);
  }, [handleKeyDown]);

  // Scroll handler
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      virtualList.onScroll((e.target as HTMLDivElement).scrollTop);
    },
    [virtualList],
  );

  // Imperative handle
  useImperativeHandle(ref, () => ({
    open: treeState.expand,
    close: treeState.collapse,
    select: (ids: string[]) => {
      selection.clearSelection();
      for (const id of ids) selection.toggleSelect(id);
    },
    scrollTo: (id: string) => {
      const idx = visibleIds.indexOf(id);
      if (idx >= 0) virtualList.scrollToIndex(idx, "smooth");
    },
    focus: (id: string) => {
      focusState.focus(id);
      const idx = visibleIds.indexOf(id);
      if (idx >= 0) virtualList.scrollToIndex(idx, "smooth");
    },
  }));

  // Build context value
  const contextValue: TreeContextValue<T> = useMemo(
    () => ({
      flatNodes,
      visibleIds,
      nodesById,
      expandedIds: treeState.expandedIds,
      expand: treeState.expand,
      collapse: treeState.collapse,
      toggle: treeState.toggle,
      collapseAll: treeState.collapseAll,
      selectedIds: selection.selectedIds,
      select: selection.select,
      toggleSelect: selection.toggleSelect,
      rangeSelect: (id: string) => selection.rangeSelect(id, visibleIds),
      selectAll: () => selection.selectAll(visibleIds),
      clearSelection: selection.clearSelection,
      focusedId: focusState.focusedId,
      focus: focusState.focus,
      focusNext: () => focusState.focusNext(visibleIds),
      focusPrev: () => focusState.focusPrev(visibleIds),
      focusFirst: () => focusState.focusFirst(visibleIds),
      focusLast: () => focusState.focusLast(visibleIds),
      compactFolders,
      indentSize,
    }),
    [
      flatNodes,
      visibleIds,
      nodesById,
      treeState,
      selection,
      focusState,
      compactFolders,
      indentSize,
    ],
  );

  const treeContent = (
    <div
      className="vft-scroll-container"
      ref={virtualList.scrollRef}
      onScroll={handleScroll}
    >
      <div
        className="vft-virtual-content"
        style={{ height: virtualList.totalHeight }}
      >
        {virtualList.virtualItems.map((vItem) => {
          const flatNode = flatNodes[vItem.index];
          if (!flatNode) return null;
          const RowComponent = enableDragAndDrop ? DraggableTreeNodeRow : TreeNodeRow;
          return (
            <RowComponent
              key={flatNode.node.id}
              flatNode={flatNode}
              isSelected={selection.selectedIds.has(flatNode.node.id)}
              isFocused={focusState.focusedId === flatNode.node.id}
              indentSize={indentSize}
              rowHeight={rowHeight}
              offsetTop={vItem.offsetTop}
              decoration={decorations.get(flatNode.node.id)}
              renderIcon={renderIcon}
              onSelect={selection.select}
              onToggleSelect={selection.toggleSelect}
              onRangeSelect={(id) => selection.rangeSelect(id, visibleIds)}
              onToggleExpand={treeState.toggle}
              onNodeClick={onNodeClick}
              onFocus={focusState.focus}
              onNavigateToSegment={onNavigateToSegment}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <TreeContext.Provider value={contextValue as unknown as TreeContextValue}>
      <div
        ref={containerRef}
        className={`vft-tree ${isDragging ? "vft-tree--dragging" : ""} ${className || ""}`}
        role="tree"
        aria-label={restProps["aria-label"] || "File tree"}
        tabIndex={0}
        style={{
          height,
          width: typeof width === "number" ? `${width}px` : width,
        }}
      >
        {enableDragAndDrop ? (
          <TreeDndContext
            flatNodes={flatNodes as FlattenedNode[]}
            selectedIds={selection.selectedIds}
            expandedIds={treeState.expandedIds}
            expand={treeState.expand}
            onMove={onMove}
            onDragStateChange={(state) => setIsDragging(state !== null)}
          >
            {treeContent}
          </TreeDndContext>
        ) : (
          treeContent
        )}
      </div>
    </TreeContext.Provider>
  );
}

export const FileTree = forwardRef(FileTreeInner) as <T = Record<string, unknown>>(
  props: FileTreeProps<T> & { ref?: React.ForwardedRef<FileTreeHandle> },
) => React.ReactElement;
