import type { TreeNode } from "@vscode-file-tree/core";

export const sampleTree: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "src/components",
        name: "components",
        children: [
          { id: "src/components/Button.tsx", name: "Button.tsx" },
          { id: "src/components/Input.tsx", name: "Input.tsx" },
          { id: "src/components/Modal.tsx", name: "Modal.tsx" },
          {
            id: "src/components/icons",
            name: "icons",
            children: [
              { id: "src/components/icons/Arrow.svg", name: "Arrow.svg" },
              { id: "src/components/icons/Close.svg", name: "Close.svg" },
            ],
          },
        ],
      },
      {
        id: "src/hooks",
        name: "hooks",
        children: [
          { id: "src/hooks/useAuth.ts", name: "useAuth.ts" },
          { id: "src/hooks/useTheme.ts", name: "useTheme.ts" },
        ],
      },
      {
        id: "src/utils",
        name: "utils",
        children: [
          { id: "src/utils/format.ts", name: "format.ts" },
          { id: "src/utils/validate.ts", name: "validate.ts" },
        ],
      },
      { id: "src/App.tsx", name: "App.tsx" },
      { id: "src/index.ts", name: "index.ts" },
      { id: "src/styles.css", name: "styles.css" },
    ],
  },
  {
    id: "tests",
    name: "tests",
    children: [
      { id: "tests/App.test.tsx", name: "App.test.tsx" },
      { id: "tests/setup.ts", name: "setup.ts" },
    ],
  },
  {
    id: "public",
    name: "public",
    children: [
      { id: "public/index.html", name: "index.html" },
      { id: "public/favicon.ico", name: "favicon.ico" },
    ],
  },
  { id: "package.json", name: "package.json" },
  { id: "tsconfig.json", name: "tsconfig.json" },
  { id: "vite.config.ts", name: "vite.config.ts" },
  { id: "README.md", name: "README.md" },
  { id: ".gitignore", name: ".gitignore" },
];

/** Compact folder example: deep single-child chains */
export const compactTree: TreeNode[] = [
  {
    id: "src",
    name: "src",
    children: [
      {
        id: "src/app",
        name: "app",
        children: [
          {
            id: "src/app/features",
            name: "features",
            children: [
              {
                id: "src/app/features/auth",
                name: "auth",
                children: [
                  { id: "src/app/features/auth/login.ts", name: "login.ts" },
                  { id: "src/app/features/auth/register.ts", name: "register.ts" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { id: "package.json", name: "package.json" },
];

/** Generate a large tree for performance testing */
export function generateLargeTree(count: number): TreeNode[] {
  const roots: TreeNode[] = [];
  let id = 0;

  for (let i = 0; i < 20; i++) {
    const folder: TreeNode = {
      id: `folder-${id++}`,
      name: `module-${i}`,
      children: [],
    };
    for (let j = 0; j < 10; j++) {
      const subfolder: TreeNode = {
        id: `folder-${id++}`,
        name: `feature-${j}`,
        children: [],
      };
      const filesPerFolder = Math.ceil(count / 200);
      for (let k = 0; k < filesPerFolder; k++) {
        subfolder.children!.push({
          id: `file-${id++}`,
          name: `file-${k}.ts`,
        });
      }
      folder.children!.push(subfolder);
    }
    roots.push(folder);
  }
  return roots;
}
