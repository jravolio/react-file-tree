import type { TreeNode } from "@vscode-file-tree/core";

/**
 * Deep clone a tree structure.
 */
function cloneTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : undefined,
  }));
}

/**
 * Remove nodes by IDs from a tree, returning [remainingTree, removedNodes].
 */
function removeNodes(
  nodes: TreeNode[],
  idsToRemove: Set<string>,
): [TreeNode[], TreeNode[]] {
  const removed: TreeNode[] = [];
  const remaining: TreeNode[] = [];

  for (const node of nodes) {
    if (idsToRemove.has(node.id)) {
      removed.push(node);
    } else {
      const newNode = { ...node };
      if (node.children) {
        const [childRemaining, childRemoved] = removeNodes(node.children, idsToRemove);
        newNode.children = childRemaining;
        removed.push(...childRemoved);
      }
      remaining.push(newNode);
    }
  }

  return [remaining, removed];
}

/**
 * Insert nodes into a target folder in the tree.
 */
function insertIntoFolder(
  nodes: TreeNode[],
  targetFolderId: string,
  nodesToInsert: TreeNode[],
): TreeNode[] {
  return nodes.map((node) => {
    if (node.id === targetFolderId && node.children) {
      return {
        ...node,
        children: [...node.children, ...nodesToInsert],
      };
    }
    if (node.children) {
      return {
        ...node,
        children: insertIntoFolder(node.children, targetFolderId, nodesToInsert),
      };
    }
    return node;
  });
}

/**
 * Find a node by ID in the tree.
 */
function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find the parent folder ID of a node.
 */
function findParentId(
  nodes: TreeNode[],
  targetId: string,
  parentId: string | null = null,
): string | null {
  for (const node of nodes) {
    if (node.id === targetId) return parentId;
    if (node.children) {
      const found = findParentId(node.children, targetId, node.id);
      if (found !== null) return found;
    }
  }
  return null;
}

/**
 * Move nodes to a target location in the tree.
 * If targetId is a folder, inserts into it.
 * If targetId is a file, inserts into its parent folder after it.
 */
export function moveNodes(
  tree: TreeNode[],
  dragIds: string[],
  targetId: string,
): TreeNode[] {
  const cloned = cloneTree(tree);
  const targetNode = findNode(cloned, targetId);
  if (!targetNode) return cloned;

  const idsToMove = new Set(dragIds);

  // Don't move a node into itself or its descendants
  if (idsToMove.has(targetId)) return cloned;

  // Remove dragged nodes from tree
  const [treeWithout, movedNodes] = removeNodes(cloned, idsToMove);
  if (movedNodes.length === 0) return cloned;

  // Determine where to insert
  if (targetNode.children !== undefined) {
    // Target is a folder — insert into it
    return insertIntoFolder(treeWithout, targetId, movedNodes);
  } else {
    // Target is a file — insert into parent folder
    const parentId = findParentId(cloned, targetId);
    if (parentId) {
      return insertIntoFolder(treeWithout, parentId, movedNodes);
    } else {
      // Root level — append to root
      return [...treeWithout, ...movedNodes];
    }
  }
}
