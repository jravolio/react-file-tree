import React from "react";
import { useTreeDnd, useDndState } from "./DragAndDrop";
import type { TreeNodeRowProps } from "./TreeNodeRow";

/**
 * Wrapper that makes a TreeNodeRow draggable and droppable via @dnd-kit.
 * Renders the same visual row but attaches DnD listeners and refs.
 */
export function DraggableTreeNodeRow<T = Record<string, unknown>>(
  props: TreeNodeRowProps<T>,
) {
  const { flatNode, isSelected, isFocused, indentSize, rowHeight, offsetTop, decoration, renderIcon, onSelect, onToggleSelect, onRangeSelect, onToggleExpand, onNodeClick, onFocus, onNavigateToSegment } = props;
  const { node, meta, isExpanded, compactPath } = flatNode;
  const indent = meta.depth * indentSize;

  const IS_MAC =
    typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  const { setNodeRef, dragAttributes, dragListeners, isDragging, isOver } = useTreeDnd({
    id: node.id,
  });

  // Check if this node should be highlighted as a drop target.
  // Uses dropTargetIds from context — includes the resolved folder + all visible descendants
  // (VS Code's "bubble" behavior: files bubble up to parent folder, folders highlight entire subtree)
  const dndState = useDndState();
  const isDropTarget = dndState?.dropTargetIds.has(node.id) ?? false;

  const handleClick = (e: React.MouseEvent) => {
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
  };

  const classNames = [
    "vft-row",
    isSelected && "vft-row--selected",
    isFocused && "vft-row--focused",
    isDragging && "vft-row--dragging",
    isDropTarget && "vft-row--drop-target",
    decoration?.color && `vft-decoration-${decoration.color}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      {...dragAttributes}
      {...dragListeners}
      className={classNames}
      role="treeitem"
      aria-expanded={meta.isFolder ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-level={meta.depth + 1}
      data-id={node.id}
      tabIndex={-1}
      style={{
        height: rowHeight,
        top: offsetTop,
        paddingLeft: indent,
        opacity: isDragging ? 0.4 : 1,
      }}
      onClick={handleClick}
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
        onPointerDown={meta.isFolder ? (e) => e.stopPropagation() : undefined}
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
            {compactPath.map((segment: { id: string; name: string }, i: number) => (
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
