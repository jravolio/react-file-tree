import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTree, type FileTreeProps, type TreeNode } from "@vscode-file-tree/react";
import { sampleTree } from "../sampleData";
import { moveNodes } from "../treeUtils";

const meta: Meta<FileTreeProps> = {
  title: "Visual Parity",
  component: FileTree,
};
export default meta;

// ─── Sidebar Background ────────────────────────────────

export const SidebarBackground: StoryObj<FileTreeProps> = {
  name: "Sidebar Background",
  render: () => {
    return (
      <div style={{ display: "flex", gap: 16 }}>
        <div>
          <div style={{ padding: "8px 0", color: "#999", fontSize: 11, fontWeight: 600 }}>
            Sidebar <code>#252526</code> (correct)
          </div>
          <div style={{ background: "#252526", width: 280 }}>
            <FileTree
              data={sampleTree}
              height={400}
              width={280}
              defaultExpandedIds={new Set(["src", "src/components"])}
              aria-label="Sidebar background"
            />
          </div>
        </div>
        <div>
          <div style={{ padding: "8px 0", color: "#999", fontSize: 11, fontWeight: 600 }}>
            Editor <code>#1e1e1e</code> (old/incorrect)
          </div>
          <div style={{ background: "#1e1e1e", width: 280 }}>
            <FileTree
              data={sampleTree}
              height={400}
              width={280}
              defaultExpandedIds={new Set(["src", "src/components"])}
              aria-label="Editor background"
            />
          </div>
        </div>
      </div>
    );
  },
};

// ─── Drag Ghost Styling ────────────────────────────────

export const DragGhostStyling: StoryObj<FileTreeProps> = {
  name: "Drag Ghost Styling",
  render: () => {
    const [data, setData] = useState<TreeNode[]>(sampleTree);

    const handleMove = useCallback(
      (params: { dragIds: string[]; targetId: string; targetIndex: number }) => {
        setData((prev) => moveNodes(prev, params.dragIds, params.targetId));
      },
      [],
    );

    return (
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ background: "#252526", width: 320 }}>
          <FileTree
            data={data}
            height={450}
            width={320}
            enableDragAndDrop
            onMove={handleMove}
            defaultExpandedIds={new Set(["src", "src/components", "src/utils"])}
            aria-label="Drag ghost demo"
          />
        </div>
        <div style={{ padding: 8, color: "#999", fontSize: 11, width: 220 }}>
          <strong>Drag Ghost Styling</strong>
          <p style={{ color: "#666", margin: "8px 0", lineHeight: 1.6 }}>
            Drag any file or folder to see the drag ghost overlay.
            It should match VS Code's style:
          </p>
          <ul style={{ color: "#888", margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
            <li>Sidebar background color</li>
            <li>No rounded corners</li>
            <li>Subtle border</li>
            <li>Light shadow</li>
          </ul>
        </div>
      </div>
    );
  },
};

// ─── Multi-Select Drag ─────────────────────────────────

export const MultiSelectDrag: StoryObj<FileTreeProps> = {
  name: "Multi-Select Drag",
  render: () => {
    const [data, setData] = useState<TreeNode[]>(sampleTree);
    const [log, setLog] = useState<string[]>([]);

    const handleMove = useCallback(
      (params: { dragIds: string[]; targetId: string; targetIndex: number }) => {
        setData((prev) => moveNodes(prev, params.dragIds, params.targetId));
        setLog((prev) => [
          ...prev.slice(-3),
          `Moved ${params.dragIds.length} item(s) → ${params.targetId}`,
        ]);
      },
      [],
    );

    return (
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ background: "#252526", width: 320 }}>
          <FileTree
            data={data}
            height={450}
            width={320}
            enableDragAndDrop
            onMove={handleMove}
            defaultExpandedIds={new Set(["src", "src/components", "src/hooks", "src/utils"])}
            aria-label="Multi-select drag demo"
          />
        </div>
        <div style={{ padding: 8, color: "#999", fontSize: 11, width: 220 }}>
          <strong>Multi-Select Drag</strong>
          <p style={{ color: "#666", margin: "8px 0", lineHeight: 1.6 }}>
            <kbd>Ctrl+Click</kbd> (or <kbd>Cmd+Click</kbd>) to select multiple items,
            then drag them. The overlay should show:
          </p>
          <ul style={{ color: "#888", margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
            <li>First item's name</li>
            <li>Count badge with total items</li>
          </ul>
          {log.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Move Log:</strong>
              {log.map((l, i) => (
                <div key={i} style={{ marginTop: 2 }}>{l}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
};

// ─── Drop Target Highlight ─────────────────────────────

export const DropTargetHighlight: StoryObj<FileTreeProps> = {
  name: "Drop Target Highlight",
  render: () => {
    const [data, setData] = useState<TreeNode[]>(sampleTree);

    const handleMove = useCallback(
      (params: { dragIds: string[]; targetId: string; targetIndex: number }) => {
        setData((prev) => moveNodes(prev, params.dragIds, params.targetId));
      },
      [],
    );

    return (
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ background: "#252526", width: 320 }}>
          <FileTree
            data={data}
            height={450}
            width={320}
            enableDragAndDrop
            onMove={handleMove}
            defaultExpandedIds={new Set(["src", "src/components", "src/hooks", "src/utils", "tests"])}
            aria-label="Drop target highlight demo"
          />
        </div>
        <div style={{ padding: 8, color: "#999", fontSize: 11, width: 220 }}>
          <strong>Drop Target Highlight</strong>
          <p style={{ color: "#666", margin: "8px 0", lineHeight: 1.6 }}>
            Drag a file over a folder. The folder row should highlight with
            a semi-transparent background (<code>list.dropBackground</code>).
          </p>
          <p style={{ color: "#666", margin: "8px 0", lineHeight: 1.6 }}>
            Try dragging over different folders to see the highlight follow your cursor.
            Invalid targets (dropping into own children) should show no highlight.
          </p>
        </div>
      </div>
    );
  },
};

// ─── Auto-Expand on Hover ──────────────────────────────

export const AutoExpandOnHover: StoryObj<FileTreeProps> = {
  name: "Auto-Expand on Hover",
  render: () => {
    const [data, setData] = useState<TreeNode[]>(sampleTree);

    const handleMove = useCallback(
      (params: { dragIds: string[]; targetId: string; targetIndex: number }) => {
        setData((prev) => moveNodes(prev, params.dragIds, params.targetId));
      },
      [],
    );

    return (
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ background: "#252526", width: 320 }}>
          <FileTree
            data={data}
            height={450}
            width={320}
            enableDragAndDrop
            onMove={handleMove}
            aria-label="Auto-expand demo"
          />
        </div>
        <div style={{ padding: 8, color: "#999", fontSize: 11, width: 220 }}>
          <strong>Auto-Expand on Hover</strong>
          <p style={{ color: "#666", margin: "8px 0", lineHeight: 1.6 }}>
            All folders start collapsed. Drag a file and hover over a collapsed folder
            for <strong>500ms</strong> — it should automatically expand, revealing its children
            as potential drop targets.
          </p>
          <p style={{ color: "#666", margin: "8px 0", lineHeight: 1.6 }}>
            This matches VS Code's drag-and-drop auto-expand behavior.
          </p>
        </div>
      </div>
    );
  },
};
