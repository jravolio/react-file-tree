import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTree, type FileTreeProps } from "@vscode-file-tree/react";
import { sampleTree } from "../sampleData";

const meta: Meta<FileTreeProps> = {
  title: "Examples",
  component: FileTree,
};
export default meta;

// ─── With Preview Panel ─────────────────────────────────

export const WithPreviewPanel: StoryObj<FileTreeProps> = {
  name: "With Preview Panel",
  render: () => {
    const [activeFile, setActiveFile] = useState<string | null>(null);

    return (
      <div style={{ display: "flex", height: 500, background: "#252526", color: "#ccc" }}>
        <div style={{ width: 260, borderRight: "1px solid #333", flexShrink: 0 }}>
          <div
            style={{
              padding: "8px 12px",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#999",
            }}
          >
            Explorer
          </div>
          <FileTree
            data={sampleTree}
            height={470}
            width={260}
            defaultExpandedIds={new Set(["src", "src/components"])}
            onNodeClick={({ node, isFolder }) => {
              if (!isFolder) setActiveFile(node.id);
            }}
            aria-label="File explorer"
          />
        </div>
        <div style={{ flex: 1, padding: 16 }}>
          {activeFile ? (
            <div>
              <div
                style={{
                  padding: "4px 12px",
                  fontSize: 13,
                  background: "#2d2d2d",
                  borderBottom: "1px solid #333",
                  marginBottom: 16,
                  borderRadius: "4px 4px 0 0",
                }}
              >
                {activeFile}
              </div>
              <pre
                style={{
                  padding: 12,
                  background: "#252526",
                  border: "1px solid #333",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: "monospace",
                  color: "#d4d4d4",
                }}
              >
                {`// Content of ${activeFile}\n\nexport function example() {\n  return "Hello from ${activeFile}";\n}`}
              </pre>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#666",
                fontSize: 14,
              }}
            >
              Click a file to preview
            </div>
          )}
        </div>
      </div>
    );
  },
};

// ─── Resizable Sidebar ──────────────────────────────────

export const ResizableSidebar: StoryObj<FileTreeProps> = {
  name: "Resizable Sidebar",
  render: () => {
    const [sidebarWidth, setSidebarWidth] = useState(280);
    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = useCallback(() => {
      setIsResizing(true);
      const handleMouseMove = (e: MouseEvent) => {
        setSidebarWidth(Math.max(150, Math.min(500, e.clientX)));
      };
      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }, []);

    return (
      <div style={{ display: "flex", height: 500, background: "#252526", color: "#ccc" }}>
        <div style={{ width: sidebarWidth, flexShrink: 0, overflow: "hidden" }}>
          <div
            style={{
              padding: "8px 12px",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              color: "#999",
            }}
          >
            Explorer
          </div>
          <FileTree
            data={sampleTree}
            height={470}
            width={sidebarWidth}
            defaultExpandedIds={new Set(["src", "src/components"])}
            aria-label="File explorer"
          />
        </div>
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: 4,
            cursor: "col-resize",
            background: isResizing ? "#007fd4" : "#333",
            flexShrink: 0,
            transition: isResizing ? "none" : "background 0.2s",
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            fontSize: 14,
            userSelect: isResizing ? "none" : "auto",
          }}
        >
          Drag the divider to resize the sidebar ({sidebarWidth}px)
        </div>
      </div>
    );
  },
};
