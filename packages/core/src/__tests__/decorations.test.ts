import { describe, it, expect } from "vitest";
import type { TreeNode, TreeDecoration, DecorationProvider } from "../types";

// Replicate the decoration resolution logic from FileTree for testing
function resolveDecorations<T>(
  nodes: TreeNode<T>[],
  providers: DecorationProvider<T>[],
): Map<string, TreeDecoration> {
  const map = new Map<string, TreeDecoration>();

  function walk(nodeList: TreeNode<T>[]) {
    for (const node of nodeList) {
      for (const provider of providers) {
        const dec = provider.getDecoration(node);
        if (dec) {
          const existing = map.get(node.id);
          if (existing) {
            map.set(node.id, {
              color: existing.color || dec.color,
              badge: existing.badge || dec.badge,
              tooltip: existing.tooltip || dec.tooltip,
            });
          } else {
            map.set(node.id, { ...dec });
          }
        }
      }
      if (node.children) walk(node.children);
    }
  }

  walk(nodes);
  return map;
}

// Folder aggregation: count decorated descendants
function aggregateFolderDecorations<T>(
  nodes: TreeNode<T>[],
  decorations: Map<string, TreeDecoration>,
): Map<string, TreeDecoration> {
  const result = new Map(decorations);

  function countDecorated(node: TreeNode<T>): number {
    if (!node.children) return decorations.has(node.id) ? 1 : 0;
    let count = 0;
    for (const child of node.children) {
      count += countDecorated(child);
    }
    if (count > 0 && !result.has(node.id)) {
      result.set(node.id, { badge: String(count) });
    } else if (count > 0 && result.has(node.id)) {
      const existing = result.get(node.id)!;
      result.set(node.id, { ...existing, badge: String(count) });
    }
    return count + (decorations.has(node.id) ? 1 : 0);
  }

  for (const node of nodes) {
    countDecorated(node);
  }

  return result;
}

const sampleTree: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "src/app.ts", name: "app.ts" },
      { id: "src/utils.ts", name: "utils.ts" },
      { id: "src/index.ts", name: "index.ts" },
    ],
  },
  { id: "readme.md", name: "readme.md" },
];

describe("decoration resolution", () => {
  it("resolves decorations from a single provider", () => {
    const provider: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name === "app.ts") return { color: "modified", badge: "M" };
        return null;
      },
    };

    const result = resolveDecorations(sampleTree, [provider]);
    expect(result.get("src/app.ts")).toEqual({ color: "modified", badge: "M" });
    expect(result.has("src/utils.ts")).toBe(false);
  });

  it("returns empty map with no providers", () => {
    const result = resolveDecorations(sampleTree, []);
    expect(result.size).toBe(0);
  });

  it("resolves decorations for nested nodes", () => {
    const provider: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name.endsWith(".ts")) return { color: "modified", badge: "M" };
        return null;
      },
    };

    const result = resolveDecorations(sampleTree, [provider]);
    expect(result.has("src/app.ts")).toBe(true);
    expect(result.has("src/utils.ts")).toBe(true);
    expect(result.has("src/index.ts")).toBe(true);
    expect(result.has("readme.md")).toBe(false);
  });
});

describe("multiple provider merging", () => {
  it("merges decorations from multiple providers (first wins for color)", () => {
    const gitProvider: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name === "app.ts") return { color: "modified", badge: "M" };
        return null;
      },
      priority: 1,
    };

    const errorProvider: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name === "app.ts") return { color: "deleted", tooltip: "Has errors" };
        return null;
      },
      priority: 0,
    };

    // gitProvider first (higher priority), its color wins
    const result = resolveDecorations(sampleTree, [gitProvider, errorProvider]);
    const dec = result.get("src/app.ts");
    expect(dec).toBeDefined();
    expect(dec!.color).toBe("modified"); // first provider's color wins
    expect(dec!.badge).toBe("M"); // from gitProvider
    expect(dec!.tooltip).toBe("Has errors"); // from errorProvider (filled gap)
  });

  it("fills gaps from secondary providers", () => {
    const p1: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name === "utils.ts") return { badge: "!" };
        return null;
      },
    };

    const p2: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name === "utils.ts") return { color: "untracked", tooltip: "New file" };
        return null;
      },
    };

    const result = resolveDecorations(sampleTree, [p1, p2]);
    const dec = result.get("src/utils.ts");
    expect(dec!.badge).toBe("!");
    expect(dec!.color).toBe("untracked");
    expect(dec!.tooltip).toBe("New file");
  });
});

describe("folder decoration aggregation", () => {
  it("propagates child decoration count to parent folder", () => {
    const provider: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name === "app.ts") return { color: "modified", badge: "M" };
        if (node.name === "utils.ts") return { color: "untracked", badge: "U" };
        return null;
      },
    };

    const base = resolveDecorations(sampleTree, [provider]);
    const result = aggregateFolderDecorations(sampleTree, base);

    // src folder should get aggregated badge
    const srcDec = result.get("src");
    expect(srcDec).toBeDefined();
    expect(srcDec!.badge).toBe("2"); // 2 decorated children
  });

  it("does not add folder decoration when no children are decorated", () => {
    const provider: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name === "readme.md") return { color: "modified", badge: "M" };
        return null;
      },
    };

    const base = resolveDecorations(sampleTree, [provider]);
    const result = aggregateFolderDecorations(sampleTree, base);

    expect(result.has("src")).toBe(false);
  });

  it("counts all nested descendants", () => {
    const deepTree: TreeNode[] = [
      {
        id: "root",
        name: "root",
        children: [
          {
            id: "sub",
            name: "sub",
            children: [
              { id: "sub/a.ts", name: "a.ts" },
              { id: "sub/b.ts", name: "b.ts" },
            ],
          },
        ],
      },
    ];

    const provider: DecorationProvider = {
      getDecoration: (node) => {
        if (node.name.endsWith(".ts")) return { color: "modified", badge: "M" };
        return null;
      },
    };

    const base = resolveDecorations(deepTree, [provider]);
    const result = aggregateFolderDecorations(deepTree, base);

    expect(result.get("sub")!.badge).toBe("2");
    expect(result.get("root")!.badge).toBe("2");
  });
});
