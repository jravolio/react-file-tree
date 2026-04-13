import { useState, useCallback, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTree, type FileTreeProps, type FileTreeHandle, type TreeNode } from "@vscode-file-tree/react";
import { sampleTree, compactTree, generateLargeTree } from "../sampleData";

const meta: Meta<FileTreeProps> = {
  title: "Basic/File Tree",
  component: FileTree,
  decorators: [
    (Story) => (
      <div style={{ height: 500, width: 300, background: "#252526" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    height: { control: { type: "number" } },
    width: { control: { type: "number" } },
    rowHeight: { control: { type: "number" } },
    indentSize: { control: { type: "number" } },
    compactFolders: { control: { type: "boolean" } },
  },
};

export default meta;
type Story = StoryObj<FileTreeProps>;

export const Default: Story = {
  args: {
    data: sampleTree,
    height: 500,
    width: 300,
    "aria-label": "Project files",
  },
};

export const WithDefaultExpanded: Story = {
  args: {
    data: sampleTree,
    height: 500,
    width: 300,
    defaultExpandedIds: new Set(["src", "src/components"]),
    "aria-label": "Project files",
  },
};

export const CompactFolders: Story = {
  args: {
    data: compactTree,
    height: 500,
    width: 300,
    compactFolders: true,
    defaultExpandedIds: new Set([
      "src",
      "src/app",
      "src/app/features",
      "src/app/features/auth",
    ]),
    "aria-label": "Compact folders demo",
  },
};

export const CompactFoldersDisabled: Story = {
  args: {
    data: compactTree,
    height: 500,
    width: 300,
    compactFolders: false,
    defaultExpandedIds: new Set([
      "src",
      "src/app",
      "src/app/features",
      "src/app/features/auth",
    ]),
    "aria-label": "Compact folders disabled",
  },
};

export const ControlledState: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState(new Set(["src"]));
    const [selectedIds, setSelectedIds] = useState(new Set<string>());

    return (
      <div>
        <div style={{ padding: 8, color: "#ccc", fontSize: 12 }}>
          Expanded: {[...expandedIds].join(", ") || "none"} | Selected:{" "}
          {[...selectedIds].join(", ") || "none"}
        </div>
        <FileTree
          data={sampleTree}
          height={450}
          width={300}
          expandedIds={expandedIds}
          onExpandChange={setExpandedIds}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          aria-label="Controlled tree"
        />
      </div>
    );
  },
};

export const WithCallbacks: Story = {
  render: () => {
    const [log, setLog] = useState<string[]>([]);
    const addLog = useCallback(
      (msg: string) => setLog((prev) => [...prev.slice(-4), msg]),
      [],
    );

    return (
      <div style={{ display: "flex", gap: 8 }}>
        <FileTree
          data={sampleTree}
          height={500}
          width={300}
          defaultExpandedIds={new Set(["src"])}
          onNodeClick={({ node, isFolder, isExpanded }) =>
            addLog(`Clicked: ${node.name} (${isFolder ? "folder" : "file"}${isFolder ? `, ${isExpanded ? "expanded" : "collapsed"}` : ""})`)
          }
          aria-label="File tree with callbacks"
        />
        <div style={{ padding: 8, color: "#999", fontSize: 11, width: 200 }}>
          <strong>Event log:</strong>
          {log.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    );
  },
};

export const LargeTree: Story = {
  render: () => {
    const data = generateLargeTree(10000);
    return (
      <FileTree
        data={data}
        height={500}
        width={300}
        defaultExpandedIds={new Set(["folder-0", "folder-1"])}
        aria-label="Large tree (10k nodes)"
      />
    );
  },
};

export const ImperativeAPI: Story = {
  render: () => {
    const ref = useRef<FileTreeHandle>(null);

    return (
      <div>
        <div style={{ padding: 8, display: "flex", gap: 4 }}>
          <button onClick={() => ref.current?.open("src")}>Open src</button>
          <button onClick={() => ref.current?.close("src")}>Close src</button>
          <button onClick={() => ref.current?.scrollTo("README.md")}>
            Scroll to README
          </button>
          <button onClick={() => ref.current?.focus("package.json")}>
            Focus package.json
          </button>
        </div>
        <FileTree
          ref={ref}
          data={sampleTree}
          height={450}
          width={300}
          aria-label="Imperative API demo"
        />
      </div>
    );
  },
};

export const WithDecorations: Story = {
  render: () => {
    const decorationProvider = {
      getDecoration: (node: TreeNode) => {
        if (node.name === "App.tsx") return { color: "modified", badge: "M", tooltip: "Modified" };
        if (node.name === "validate.ts") return { color: "untracked", badge: "U", tooltip: "Untracked" };
        if (node.name === "format.ts") return { color: "deleted", badge: "D", tooltip: "Deleted" };
        return null;
      },
    };

    return (
      <FileTree
        data={sampleTree}
        height={500}
        width={300}
        defaultExpandedIds={new Set(["src", "src/utils"])}
        decorationProviders={[decorationProvider]}
        aria-label="File tree with decorations"
      />
    );
  },
};
