import React, { useCallback, useContext, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type DragCancelEvent,
  type Modifier,
} from "@dnd-kit/core";
import type { FlattenedNode } from "@vscode-file-tree/core";

// ─── Types ──────────────────────────────────────────────

export interface DragState {
  dragIds: string[];
  /** The node the pointer is directly over */
  overId: string | null;
  /** The resolved folder target (after bubble-up from files). null = root drop. */
  resolvedTargetId: string | null;
  overPosition: "into" | "before" | "after" | null;
  /** All node IDs that should show drop-target highlight (folder + visible descendants, or all for root) */
  dropTargetIds: Set<string>;
  /** Whether this is a root-level drop (empty space) */
  isRootDrop: boolean;
}

export interface TreeDndContextProps<T = Record<string, unknown>> {
  children: React.ReactNode;
  flatNodes: FlattenedNode<T>[];
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  expand: (id: string) => void;
  onMove?: (params: { dragIds: string[]; targetId: string; targetIndex: number }) => void;
  onDragStateChange?: (state: DragState | null) => void;
}

// ─── DnD State Context ─────────────────────────────────

const DndStateContext = React.createContext<DragState | null>(null);

export function useDndState() {
  return useContext(DndStateContext);
}

// ─── Auto-expand timer ──────────────────────────────────

const AUTO_EXPAND_DELAY = 500;

// ─── Drag overlay modifier ─────────────────────────────
// Matches VS Code's setDragImage(el, -10, -10) behavior:
// positions the pill badge near the cursor instead of at the dragged row's position.

const snapToCursor: Modifier = ({ transform, activatorEvent, activeNodeRect }) => {
  if (!activatorEvent || !activeNodeRect) return transform;

  const event = activatorEvent as PointerEvent;
  // Calculate the offset from the element's top-left to where the click happened
  const offsetX = event.clientX - activeNodeRect.left;
  const offsetY = event.clientY - activeNodeRect.top;

  return {
    ...transform,
    // Shift overlay so it appears at cursor position, offset by -10px like VS Code
    x: transform.x + offsetX - 10,
    y: transform.y + offsetY - 10,
  };
};

// ─── Helpers ────────────────────────────────────────────

function isDescendantOf<T>(
  nodeId: string,
  ancestorId: string,
  flatNodes: FlattenedNode<T>[],
): boolean {
  const node = flatNodes.find((n) => n.node.id === nodeId);
  return node ? node.meta.ancestorIds.includes(ancestorId) : false;
}

/**
 * Resolves the drop target folder for a given node.
 * - If the node is a folder: returns the node itself
 * - If the node is a file: bubbles up to its parent folder
 * - Returns null if bubbled to root (no parent)
 * This matches VS Code's TreeDragOverBubble behavior.
 */
function resolveDropFolder<T>(
  nodeId: string,
  flatNodes: FlattenedNode<T>[],
): string | null {
  const node = flatNodes.find((n) => n.node.id === nodeId);
  if (!node) return null;
  if (node.meta.isFolder) return nodeId;
  // Bubble up: file → parent folder. null means root.
  return node.meta.parentId ?? null;
}

/**
 * Computes the set of node IDs that should be highlighted as drop targets.
 * This includes the resolved folder and ALL its visible (expanded) descendants.
 * Matches VS Code's feedback = range(start, start + renderNodeCount) behavior.
 */
function computeDropTargetIds<T>(
  folderId: string,
  flatNodes: FlattenedNode<T>[],
): Set<string> {
  const ids = new Set<string>();
  ids.add(folderId);
  for (const fn of flatNodes) {
    if (fn.meta.ancestorIds.includes(folderId)) {
      ids.add(fn.node.id);
    }
  }
  return ids;
}

/**
 * Computes all visible node IDs for a root-level drop.
 * Matches VS Code's feedback = [-1] (whole list) behavior.
 */
function computeAllNodeIds<T>(flatNodes: FlattenedNode<T>[]): Set<string> {
  return new Set(flatNodes.map((fn) => fn.node.id));
}

// ─── DndContext Wrapper ─────────────────────────────────

export function TreeDndContext<T = Record<string, unknown>>(props: TreeDndContextProps<T>) {
  const {
    children,
    flatNodes,
    selectedIds,
    expandedIds,
    expand,
    onMove,
    onDragStateChange,
  } = props;

  const [dragState, setDragState] = useState<DragState | null>(null);
  const autoExpandTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastOverId = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const clearAutoExpand = useCallback(() => {
    if (autoExpandTimer.current) {
      clearTimeout(autoExpandTimer.current);
      autoExpandTimer.current = null;
    }
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id);
      const dragIds = selectedIds.has(id) ? [...selectedIds] : [id];
      const state: DragState = {
        dragIds,
        overId: null,
        resolvedTargetId: null,
        overPosition: null,
        dropTargetIds: new Set(),
        isRootDrop: false,
      };
      setDragState(state);
      onDragStateChange?.(state);
    },
    [selectedIds, onDragStateChange],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const overId = event.over ? String(event.over.id) : null;

      if (!dragState) return;

      // Resolve the actual drop target folder (bubble up from files to parent folder)
      let resolvedTargetId = overId ? resolveDropFolder(overId, flatNodes) : null;
      let isRootDrop = false;

      // If overId exists but resolvedTargetId is null, it means a root-level file
      // bubbled up past all parents → treat as root drop
      if (overId && resolvedTargetId === null) {
        isRootDrop = true;
      }

      // If pointer is over empty space (no overId), also treat as root drop
      if (!overId && dragState.overId !== null) {
        // Pointer left all droppables — could be empty space
        // Keep last state (don't flicker to root on every gap between rows)
      }

      // Auto-expand logic — expand resolved target folder after delay
      const autoExpandTarget = resolvedTargetId;
      if (autoExpandTarget && autoExpandTarget !== lastOverId.current) {
        clearAutoExpand();
        lastOverId.current = autoExpandTarget;

        if (!expandedIds.has(autoExpandTarget)) {
          const isInvalid = dragState.dragIds.some(
            (did) => did === autoExpandTarget || isDescendantOf(autoExpandTarget, did, flatNodes),
          );
          if (!isInvalid) {
            autoExpandTimer.current = setTimeout(() => {
              expand(autoExpandTarget);
            }, AUTO_EXPAND_DELAY);
          }
        }
      } else if (!autoExpandTarget) {
        clearAutoExpand();
        lastOverId.current = null;
      }

      // Determine drop position and validity
      let overPosition: "into" | "before" | "after" | null = null;
      let dropTargetIds = new Set<string>();

      if (isRootDrop) {
        // Root drop: highlight all items (VS Code's feedback = [-1])
        const allDraggedAreRoot = dragState.dragIds.every((did) => {
          const node = flatNodes.find((n) => n.node.id === did);
          return node && !node.meta.parentId;
        });
        // Don't allow root drop if all items are already at root (no-op move)
        if (!allDraggedAreRoot) {
          overPosition = "into";
          dropTargetIds = computeAllNodeIds(flatNodes);
        }
      } else if (resolvedTargetId) {
        // Check for invalid drop (dropping into self or own descendant)
        const isInvalid = dragState.dragIds.some(
          (did) => did === resolvedTargetId || isDescendantOf(resolvedTargetId, did, flatNodes),
        );

        if (!isInvalid) {
          overPosition = "into";
          // Compute all rows to highlight: folder + all visible descendants
          dropTargetIds = computeDropTargetIds(resolvedTargetId, flatNodes);
        }
      }

      const newState: DragState = {
        ...dragState,
        overId,
        resolvedTargetId: isRootDrop ? null : resolvedTargetId,
        overPosition,
        dropTargetIds,
        isRootDrop,
      };
      setDragState(newState);
      onDragStateChange?.(newState);
    },
    [dragState, flatNodes, expandedIds, expand, clearAutoExpand, onDragStateChange],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      clearAutoExpand();
      lastOverId.current = null;

      if (dragState && dragState.overPosition) {
        if (dragState.isRootDrop) {
          // Root drop: use empty string or first root node as target
          const rootNodes = flatNodes.filter((n) => !n.meta.parentId);
          if (rootNodes.length > 0) {
            const isInvalid = dragState.dragIds.every((did) => {
              const node = flatNodes.find((n) => n.node.id === did);
              return node && !node.meta.parentId;
            });
            if (!isInvalid) {
              onMove?.({
                dragIds: dragState.dragIds,
                targetId: "",  // empty string signals root drop
                targetIndex: 0,
              });
            }
          }
        } else if (dragState.resolvedTargetId) {
          const targetId = dragState.resolvedTargetId;
          const idx = flatNodes.findIndex((n) => n.node.id === targetId);
          const targetIndex = idx >= 0 ? idx : 0;

          const isInvalid = dragState.dragIds.some(
            (did) => did === targetId || isDescendantOf(targetId, did, flatNodes),
          );

          if (!isInvalid) {
            onMove?.({
              dragIds: dragState.dragIds,
              targetId,
              targetIndex,
            });
          }
        }
      }

      setDragState(null);
      onDragStateChange?.(null);
    },
    [dragState, flatNodes, clearAutoExpand, onMove, onDragStateChange],
  );

  const handleDragCancel = useCallback(
    (_event: DragCancelEvent) => {
      clearAutoExpand();
      lastOverId.current = null;
      setDragState(null);
      onDragStateChange?.(null);
    },
    [clearAutoExpand, onDragStateChange],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <DndStateContext.Provider value={dragState}>
        {children}
      </DndStateContext.Provider>
      <DragOverlay dropAnimation={null} modifiers={[snapToCursor]}>
        {dragState && (
          <div className="vft-drag-overlay">
            <span>
              {flatNodes.find((n) => n.node.id === dragState.dragIds[0])?.node.name ?? ""}
            </span>
            {dragState.dragIds.length > 1 && (
              <span className="vft-drag-count">{dragState.dragIds.length}</span>
            )}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Hook for making a tree row draggable + droppable ───

export interface UseTreeDndOptions {
  id: string;
}

export function useTreeDnd(options: UseTreeDndOptions) {
  const { id } = options;

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id });

  const {
    setNodeRef: setDropRef,
    isOver,
  } = useDroppable({
    id,
    disabled: false,
  });

  // Merge refs
  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef],
  );

  return {
    setNodeRef,
    dragAttributes,
    dragListeners,
    isDragging,
    isOver,
  };
}
