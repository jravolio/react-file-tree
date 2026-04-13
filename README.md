# @vscode-file-tree

A React component library that replicates VS Code's file tree (Explorer) behavior 1:1. Virtual scrolling, keyboard navigation, drag-and-drop, inline editing, context menus, file decorations, compact folders, and full theming support.

## Quick Start

```bash
pnpm add @vscode-file-tree/react
```

```tsx
import { FileTree } from "@vscode-file-tree/react";

const data = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "src/index.ts", name: "index.ts" },
      { id: "src/App.tsx", name: "App.tsx" },
    ],
  },
  { id: "package.json", name: "package.json" },
];

function App() {
  return (
    <FileTree
      data={data}
      height={500}
      width={300}
      defaultExpandedIds={new Set(["src"])}
      onActivate={(id) => console.log("Opened:", id)}
      aria-label="Project files"
    />
  );
}
```

## Packages

| Package | Description |
|---------|-------------|
| `@vscode-file-tree/core` | Headless tree logic, hooks, and state management |
| `@vscode-file-tree/react` | Styled React components matching VS Code's theme |
| `@vscode-file-tree/icons` | Optional Seti-inspired icon theme |

## Features

- **Virtual scrolling** — handles 10,000+ nodes smoothly
- **Keyboard navigation** — arrow keys, Enter, F2 rename, Delete, Escape, Ctrl+A, Home/End, Shift+Arrow range select, typeahead search
- **Drag and drop** — via `enableDragAndDrop` prop, with multi-drag, auto-expand on hover, invalid target detection
- **Inline editing** — rename (F2), new file/folder creation with validation
- **Context menu** — right-click with extensible actions, keyboard navigation, viewport repositioning
- **File decorations** — git status colors, badges, folder aggregation, multiple providers
- **Compact folders** — single-child directory chains compress into path notation
- **Icon theming** — pluggable icon themes with file extension, folder name, and filename matching
- **CSS theming** — CSS custom properties matching VS Code's `--vscode-*` tokens, dark/light themes included
- **Filter/search** — fuzzy matching filter widget with match highlighting
- **Accessibility** — full WAI-ARIA tree pattern (`role="tree"`, `aria-expanded`, `aria-selected`, etc.)
- **Controlled & uncontrolled** — works out of the box or fully controlled via props

## Theming

Import a built-in theme:

```tsx
import "@vscode-file-tree/react/themes/dark.css";
// or
import "@vscode-file-tree/react/themes/light.css";
```

Or inside a VS Code webview, use the bridge to auto-inherit the editor theme:

```tsx
import "@vscode-file-tree/react/themes/vscode-bridge.css";
```

## API

### `<FileTree>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TreeNode[]` | required | Tree data |
| `height` | `number` | `400` | Container height (px) |
| `width` | `number \| string` | `"100%"` | Container width |
| `rowHeight` | `number` | `22` | Row height (px) |
| `indentSize` | `number` | `16` | Indent per level (px) |
| `compactFolders` | `boolean` | `true` | Enable compact folder paths |
| `enableDragAndDrop` | `boolean` | `false` | Enable drag and drop |
| `expandedIds` | `Set<string>` | — | Controlled expanded state |
| `onExpandChange` | `(ids: Set<string>) => void` | — | Expansion change handler |
| `selectedIds` | `Set<string>` | — | Controlled selection state |
| `onSelectionChange` | `(ids: Set<string>) => void` | — | Selection change handler |
| `onActivate` | `(id: string) => void` | — | File opened (Enter/double-click) |
| `onDelete` | `(ids: string[]) => void` | — | Delete key pressed |
| `onRename` | `(params) => void` | — | Rename confirmed |
| `onCreate` | `(params) => void` | — | New file/folder confirmed |
| `onMove` | `(params) => void` | — | Drag and drop completed |
| `decorationProviders` | `DecorationProvider[]` | — | File decoration providers |
| `renderIcon` | `(node) => ReactNode` | — | Custom icon renderer |
| `contextMenuItems` | `ContextMenuEntry[]` | — | Custom context menu actions |

### Imperative API (via ref)

```tsx
const ref = useRef<FileTreeHandle>(null);

ref.current.open("folder-id");      // Expand folder
ref.current.close("folder-id");     // Collapse folder
ref.current.select(["file-id"]);    // Select items
ref.current.scrollTo("file-id");    // Scroll to item
ref.current.focus("file-id");       // Focus item
ref.current.startRename("file-id"); // Start inline rename
```

## Development

```bash
pnpm install
pnpm run dev          # Start Storybook at http://localhost:6006
pnpm run test         # Run unit tests
pnpm run build        # Build all packages
```

## License

MIT
