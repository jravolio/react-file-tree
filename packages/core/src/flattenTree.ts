import type { TreeNode, FlattenedNode } from "./types";

export interface FlattenOptions {
  expandedIds: Set<string>;
  compactFolders?: boolean;
}

/**
 * Flattens a nested tree structure into a visible-node array,
 * respecting expansion state and optional compact folder compression.
 */
export function flattenTree<T = Record<string, unknown>>(
  roots: TreeNode<T>[],
  options: FlattenOptions,
): FlattenedNode<T>[] {
  const { expandedIds, compactFolders = true } = options;
  const result: FlattenedNode<T>[] = [];

  function walk(
    nodes: TreeNode<T>[],
    depth: number,
    parentId: string | undefined,
    ancestorIds: string[],
  ) {
    for (const node of nodes) {
      const isFolder = Array.isArray(node.children);
      const isExpanded = isFolder && expandedIds.has(node.id);

      // Try to build a compact path if enabled
      if (compactFolders && isFolder && node.children) {
        const compactPath = tryBuildCompactPath(node, expandedIds);
        if (compactPath.length > 1) {
          const terminalNode = compactPath[compactPath.length - 1];
          const terminalExpanded = expandedIds.has(terminalNode.id);

          // Collect all IDs in the compact chain for ancestor tracking
          const chainIds = compactPath.map((n) => n.id);
          const chainAncestors = [...ancestorIds, ...chainIds.slice(0, -1)];

          result.push({
            node: terminalNode,
            meta: {
              isFolder: true,
              depth,
              parentId,
              ancestorIds,
            },
            isExpanded: terminalExpanded,
            compactPath,
          });

          if (terminalExpanded && terminalNode.children) {
            walk(terminalNode.children, depth + 1, terminalNode.id, [
              ...chainAncestors,
              terminalNode.id,
            ]);
          }
          continue;
        }
      }

      result.push({
        node,
        meta: {
          isFolder,
          depth,
          parentId,
          ancestorIds,
        },
        isExpanded: isExpanded ?? false,
      });

      if (isExpanded && node.children) {
        walk(node.children, depth + 1, node.id, [...ancestorIds, node.id]);
      }
    }
  }

  walk(roots, 0, undefined, []);
  return result;
}

/**
 * Attempts to build a compact path starting from the given node.
 * A compact path is a chain of single-child folders.
 * Returns the chain of nodes if compactable, or a single-element array if not.
 */
function tryBuildCompactPath<T>(
  node: TreeNode<T>,
  expandedIds: Set<string>,
): TreeNode<T>[] {
  const path: TreeNode<T>[] = [node];
  let current = node;

  while (true) {
    if (!current.children || current.children.length !== 1) break;
    const onlyChild = current.children[0];
    if (!Array.isArray(onlyChild.children)) break; // child must also be a folder
    if (!expandedIds.has(current.id)) break; // parent must be expanded to compact
    path.push(onlyChild);
    current = onlyChild;
  }

  return path;
}
