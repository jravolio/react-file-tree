import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTree, type FileTreeProps, type TreeNode } from "@vscode-file-tree/react";
import { sampleTree } from "../sampleData";
import { moveNodes } from "../treeUtils";

const meta: Meta<FileTreeProps> = {
  title: "Interactions",
  component: FileTree,
  decorators: [
    (Story) => (
      <div style={{ height: 500, width: 320, background: "#252526" }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

// ─── Drag and Drop ──────────────────────────────────────

export const DragAndDrop: StoryObj<FileTreeProps> = {
  name: "Drag and Drop",
  render: () => {
    const [data, setData] = useState<TreeNode[]>(sampleTree);
    const [log, setLog] = useState<string[]>([]);

    const handleMove = useCallback(
      (params: { dragIds: string[]; targetId: string; targetIndex: number }) => {
        setData((prev) => moveNodes(prev, params.dragIds, params.targetId));
        setLog((prev) => [
          ...prev.slice(-5),
          `Moved [${params.dragIds.join(", ")}] → ${params.targetId}`,
        ]);
      },
      [],
    );

    return (
      <div style={{ display: "flex", gap: 8 }}>
        <FileTree
          data={data}
          height={500}
          width={320}
          enableDragAndDrop
          onMove={handleMove}
          defaultExpandedIds={new Set(["src", "src/components", "src/hooks", "src/utils"])}
          aria-label="Drag and drop demo"
        />
        <div style={{ padding: 8, color: "#999", fontSize: 11, width: 220 }}>
          <strong>Drag & Drop Log:</strong>
          <p style={{ color: "#666", margin: "4px 0" }}>
            Drag files/folders to move them. Multi-select with Ctrl+Click then drag.
            Hovering over a collapsed folder auto-expands it after 500ms.
          </p>
          {log.map((l, i) => (
            <div key={i} style={{ marginTop: 2 }}>{l}</div>
          ))}
        </div>
      </div>
    );
  },
};

// ─── Keyboard Navigation ────────────────────────────────

export const KeyboardNavigation: StoryObj<FileTreeProps> = {
  name: "Keyboard Navigation",
  render: () => {
    const [lastAction, setLastAction] = useState<string>("Focus the tree and use keyboard");

    return (
      <div style={{ display: "flex", gap: 8 }}>
        <FileTree
          data={sampleTree}
          height={500}
          width={320}
          defaultExpandedIds={new Set(["src", "src/components"])}
          onNodeClick={({ node, isFolder, isExpanded }) =>
            setLastAction(`Clicked: ${node.name} (${isFolder ? "folder" : "file"}${isFolder ? `, ${isExpanded ? "expanded" : "collapsed"}` : ""})`)
          }
          aria-label="Keyboard navigation demo"
        />
        <div style={{ padding: 8, color: "#999", fontSize: 11, width: 220 }}>
          <strong>Keyboard Shortcuts:</strong>
          <div style={{ marginTop: 8, lineHeight: 1.8 }}>
            <div><kbd>↑↓</kbd> Navigate</div>
            <div><kbd>→</kbd> Expand / Enter child</div>
            <div><kbd>←</kbd> Collapse / Go to parent</div>
            <div><kbd>Enter</kbd> Open file / Toggle folder</div>
            <div><kbd>Escape</kbd> Clear selection</div>
            <div><kbd>Ctrl+A</kbd> Select all</div>
            <div><kbd>Home/End</kbd> First/Last item</div>
            <div><kbd>Shift+↑↓</kbd> Extend selection</div>
            <div>Type to search (typeahead)</div>
          </div>
          <div style={{ marginTop: 12, color: "#ccc" }}>
            Last: {lastAction}
          </div>
        </div>
      </div>
    );
  },
};
