import React, { memo, useCallback } from "react";
import type { FlattenedNode, TreeNode, TreeDecoration } from "@vscode-file-tree/core";

export interface TreeNodeRowProps<T = Record<string, unknown>> {
  flatNode: FlattenedNode<T>;
  isSelected: boolean;
  isFocused: boolean;
  indentSize: number;
  rowHeight: number;
  offsetTop: number;
  decoration?: TreeDecoration | null;
  renderIcon?: (node: FlattenedNode<T>) => React.ReactNode;

  onSelect: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onRangeSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onNodeClick?: (params: { node: TreeNode<T>; isFolder: boolean; isExpanded: boolean }) => void;
  onFocus: (id: string) => void;

  // Compact path
  onNavigateToSegment?: (node: FlattenedNode<T>, segmentIndex: number) => void;
}

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

function TreeNodeRowInner<T = Record<string, unknown>>(props: TreeNodeRowProps<T>) {
  const {
    flatNode,
    isSelected,
    isFocused,
    indentSize,
    rowHeight,
    offsetTop,
    decoration,
    renderIcon,
    onSelect,
    onToggleSelect,
    onRangeSelect,
    onToggleExpand,
    onNodeClick,
    onFocus,
    onNavigateToSegment,
  } = props;

  const { node, meta, isExpanded, compactPath } = flatNode;
  const indent = meta.depth * indentSize;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const ctrlOrMeta = IS_MAC ? e.metaKey : e.ctrlKey;
      if (e.shiftKey) {
        onRangeSelect(node.id);
      } else if (ctrlOrMeta) {
        onToggleSelect(node.id);
      } else {
        onSelect(node.id);
      }
      onFocus(node.id);

      // Toggle folder expansion on single click
      if (meta.isFolder) {
        onToggleExpand(node.id);
        onNodeClick?.({ node, isFolder: true, isExpanded: !isExpanded });
      } else {
        onNodeClick?.({ node, isFolder: false, isExpanded: false });
      }
    },
    [node, meta.isFolder, isExpanded, onSelect, onToggleSelect, onRangeSelect, onFocus, onToggleExpand, onNodeClick],
  );

  const classNames = [
    "vft-row",
    isSelected && "vft-row--selected",
    isFocused && "vft-row--focused",
    decoration?.color && `vft-decoration-${decoration.color}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      role="treeitem"
      aria-expanded={meta.isFolder ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={meta.depth + 1}
      data-id={node.id}
      style={{
        height: rowHeight,
        top: offsetTop,
        paddingLeft: indent,
      }}
      onClick={handleClick}
      tabIndex={-1}
    >
      {/* Indent guides */}
      <div className="vft-indent-guides" aria-hidden="true">
        {Array.from({ length: meta.depth }, (_, i) => (
          <div
            key={i}
            className="vft-indent-guide"
            style={{ left: i * indentSize + indentSize / 2 }}
          />
        ))}
      </div>

      {/* Twistie */}
      <div
        className={`vft-twistie ${
          meta.isFolder
            ? isExpanded
              ? "vft-twistie--expanded"
              : ""
            : "vft-twistie--hidden"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16">
          <path d="M6 4l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.4" />
        </svg>
      </div>

      {/* Icon */}
      <div className="vft-icon" aria-hidden="true">
        {renderIcon ? renderIcon(flatNode) : null}
      </div>

      {/* Label */}
      <div className="vft-label">
        {compactPath && compactPath.length > 1 ? (
          <span className="vft-label-name">
            {compactPath.map((segment, i) => (
              <React.Fragment key={segment.id}>
                {i > 0 && <span className="vft-compact-separator">/</span>}
                <span
                  className="vft-compact-segment"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToSegment?.(flatNode, i);
                  }}
                >
                  {segment.name}
                </span>
              </React.Fragment>
            ))}
          </span>
        ) : (
          <span className="vft-label-name">{node.name}</span>
        )}
      </div>

      {/* Decoration badge */}
      {decoration?.badge && (
        <span className="vft-badge" title={decoration.tooltip}>
          {decoration.badge}
        </span>
      )}
    </div>
  );
}

// Custom memo comparator to avoid re-renders on reference changes
export const TreeNodeRow = memo(TreeNodeRowInner, (prev, next) => {
  return (
    prev.flatNode === next.flatNode &&
    prev.isSelected === next.isSelected &&
    prev.isFocused === next.isFocused &&
    prev.offsetTop === next.offsetTop &&
    prev.decoration === next.decoration &&
    prev.indentSize === next.indentSize &&
    prev.rowHeight === next.rowHeight
  );
}) as typeof TreeNodeRowInner;
