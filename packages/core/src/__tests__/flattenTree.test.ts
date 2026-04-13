import { describe, it, expect } from "vitest";
import { flattenTree } from "../flattenTree";
import type { TreeNode } from "../types";

const sampleTree: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "src/app",
        name: "app",
        children: [
          { id: "src/app/index.ts", name: "index.ts" },
          { id: "src/app/utils.ts", name: "utils.ts" },
        ],
      },
      { id: "src/main.ts", name: "main.ts" },
    ],
  },
  { id: "package.json", name: "package.json" },
  {
    id: "tests",
    name: "tests",
    children: [{ id: "tests/app.test.ts", name: "app.test.ts" }],
  },
];

describe("flattenTree", () => {
  it("returns only root-level items when nothing is expanded", () => {
    const result = flattenTree(sampleTree, {
      expandedIds: new Set(),
      compactFolders: false,
    });
    expect(result.map((n) => n.node.id)).toEqual(["src", "package.json", "tests"]);
  });

  it("includes children of expanded folders", () => {
    const result = flattenTree(sampleTree, {
      expandedIds: new Set(["src"]),
      compactFolders: false,
    });
    expect(result.map((n) => n.node.id)).toEqual([
      "src",
      "src/app",
      "src/main.ts",
      "package.json",
      "tests",
    ]);
  });

  it("expands nested folders correctly", () => {
    const result = flattenTree(sampleTree, {
      expandedIds: new Set(["src", "src/app"]),
      compactFolders: false,
    });
    expect(result.map((n) => n.node.id)).toEqual([
      "src",
      "src/app",
      "src/app/index.ts",
      "src/app/utils.ts",
      "src/main.ts",
      "package.json",
      "tests",
    ]);
  });

  it("sets correct depth for nested items", () => {
    const result = flattenTree(sampleTree, {
      expandedIds: new Set(["src", "src/app"]),
      compactFolders: false,
    });
    const depths = result.map((n) => [n.node.id, n.meta.depth]);
    expect(depths).toEqual([
      ["src", 0],
      ["src/app", 1],
      ["src/app/index.ts", 2],
      ["src/app/utils.ts", 2],
      ["src/main.ts", 1],
      ["package.json", 0],
      ["tests", 0],
    ]);
  });

  it("sets correct parentId for items", () => {
    const result = flattenTree(sampleTree, {
      expandedIds: new Set(["src", "src/app"]),
      compactFolders: false,
    });
    expect(result.find((n) => n.node.id === "src")!.meta.parentId).toBeUndefined();
    expect(result.find((n) => n.node.id === "src/app")!.meta.parentId).toBe("src");
    expect(result.find((n) => n.node.id === "src/app/index.ts")!.meta.parentId).toBe("src/app");
  });

  it("marks folder nodes correctly", () => {
    const result = flattenTree(sampleTree, {
      expandedIds: new Set(["src"]),
      compactFolders: false,
    });
    expect(result.find((n) => n.node.id === "src")!.meta.isFolder).toBe(true);
    expect(result.find((n) => n.node.id === "src/main.ts")!.meta.isFolder).toBe(false);
  });

  it("sets isExpanded correctly", () => {
    const result = flattenTree(sampleTree, {
      expandedIds: new Set(["src"]),
      compactFolders: false,
    });
    expect(result.find((n) => n.node.id === "src")!.isExpanded).toBe(true);
    expect(result.find((n) => n.node.id === "src/app")!.isExpanded).toBe(false);
    expect(result.find((n) => n.node.id === "tests")!.isExpanded).toBe(false);
  });

  it("handles empty children arrays", () => {
    const tree: TreeNode[] = [
      { id: "empty", name: "empty", children: [] },
      { id: "file.ts", name: "file.ts" },
    ];
    const result = flattenTree(tree, {
      expandedIds: new Set(["empty"]),
      compactFolders: false,
    });
    expect(result.map((n) => n.node.id)).toEqual(["empty", "file.ts"]);
    expect(result[0].meta.isFolder).toBe(true);
  });

  it("handles deeply nested structures", () => {
    const deep: TreeNode[] = [
      {
        id: "a",
        name: "a",
        children: [
          {
            id: "b",
            name: "b",
            children: [
              {
                id: "c",
                name: "c",
                children: [{ id: "d", name: "d" }],
              },
            ],
          },
        ],
      },
    ];
    const result = flattenTree(deep, {
      expandedIds: new Set(["a", "b", "c"]),
      compactFolders: false,
    });
    expect(result.map((n) => n.node.id)).toEqual(["a", "b", "c", "d"]);
    expect(result[3].meta.depth).toBe(3);
    expect(result[3].meta.ancestorIds).toEqual(["a", "b", "c"]);
  });

  describe("compact folders", () => {
    it("compresses single-child folder chains", () => {
      const tree: TreeNode[] = [
        {
          id: "a",
          name: "a",
          children: [
            {
              id: "b",
              name: "b",
              children: [
                {
                  id: "c",
                  name: "c",
                  children: [
                    { id: "file1", name: "file1.ts" },
                    { id: "file2", name: "file2.ts" },
                  ],
                },
              ],
            },
          ],
        },
      ];
      const result = flattenTree(tree, {
        expandedIds: new Set(["a", "b", "c"]),
        compactFolders: true,
      });
      // a/b/c should be compact, then file1 and file2 as children
      const compactNode = result[0];
      expect(compactNode.compactPath).toBeDefined();
      expect(compactNode.compactPath!.map((n) => n.name)).toEqual(["a", "b", "c"]);
      expect(result.map((n) => n.node.id)).toEqual(["c", "file1", "file2"]);
    });

    it("does not compress when folders have multiple children", () => {
      const result = flattenTree(sampleTree, {
        expandedIds: new Set(["src"]),
        compactFolders: true,
      });
      const srcNode = result.find((n) => n.node.id === "src");
      expect(srcNode!.compactPath).toBeUndefined();
    });

    it("does not compress when compactFolders is false", () => {
      const tree: TreeNode[] = [
        {
          id: "a",
          name: "a",
          children: [
            {
              id: "b",
              name: "b",
              children: [{ id: "file", name: "file.ts" }],
            },
          ],
        },
      ];
      const result = flattenTree(tree, {
        expandedIds: new Set(["a", "b"]),
        compactFolders: false,
      });
      expect(result[0].compactPath).toBeUndefined();
      expect(result.map((n) => n.node.id)).toEqual(["a", "b", "file"]);
    });
  });
});
