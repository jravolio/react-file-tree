import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileTree, type FileTreeProps } from "@vscode-file-tree/react";
import { sampleTree } from "../sampleData";

const meta: Meta<FileTreeProps> = {
  title: "Features",
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

// ─── Icon Themes ────────────────────────────────────────

export const IconThemes: StoryObj<FileTreeProps> = {
  name: "Icon Themes",
  render: () => {
    return (
      <div>
        <div style={{ padding: 8, color: "#999", fontSize: 11 }}>
          The tree supports pluggable icon themes via the <code>iconTheme</code> prop
          or custom <code>renderIcon</code> callback. Below uses emoji as a simple icon demo.
        </div>
        <FileTree
          data={sampleTree}
          height={460}
          width={320}
          defaultExpandedIds={new Set(["src", "src/components", "tests"])}
          renderIcon={(node) => {
            if (node.meta.isFolder) {
              return <span>{node.isExpanded ? "📂" : "📁"}</span>;
            }
            const ext = node.node.name.split(".").pop();
            const icons: Record<string, string> = {
              ts: "🟦",
              tsx: "⚛️",
              css: "🎨",
              json: "📋",
              md: "📝",
              html: "🌐",
              svg: "🖼️",
              ico: "🔷",
            };
            return <span>{icons[ext || ""] || "📄"}</span>;
          }}
          aria-label="Icon themes demo"
        />
      </div>
    );
  },
};

// ─── Theming ────────────────────────────────────────────

export const ThemeSwitcher: StoryObj<FileTreeProps> = {
  name: "Theme Switcher",
  render: () => {
    const [theme, setTheme] = useState<"dark" | "light">("dark");

    const themeVars =
      theme === "light"
        ? {
            "--vft-list-activeSelectionBackground": "#0060c0",
            "--vft-list-activeSelectionForeground": "#ffffff",
            "--vft-list-hoverBackground": "#e8e8e8",
            "--vft-list-hoverForeground": "#333333",
            "--vft-list-focusOutline": "#0090f1",
            "--vft-tree-indentGuidesStroke": "#c4c4c4",
            "--vft-foreground": "#333333",
            "--vft-descriptionForeground": "#717171",
            "--vft-input-background": "#ffffff",
            "--vft-input-foreground": "#333333",
          }
        : {};

    return (
      <div>
        <div style={{ padding: 8, display: "flex", gap: 8 }}>
          <button
            onClick={() => setTheme("dark")}
            style={{
              padding: "4px 12px",
              background: theme === "dark" ? "#007fd4" : "#3c3c3c",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            style={{
              padding: "4px 12px",
              background: theme === "light" ? "#0060c0" : "#3c3c3c",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Light
          </button>
        </div>
        <div
          style={{
            background: theme === "light" ? "#ffffff" : "#252526",
            ...(themeVars as React.CSSProperties),
          }}
        >
          <FileTree
            data={sampleTree}
            height={450}
            width={320}
            defaultExpandedIds={new Set(["src", "src/components"])}
            aria-label="Theme switcher demo"
          />
        </div>
      </div>
    );
  },
};

// ─── Accessibility ──────────────────────────────────────

export const Accessibility: StoryObj<FileTreeProps> = {
  name: "Accessibility / Screen Reader",
  render: () => {
    return (
      <div>
        <div style={{ padding: 8, color: "#999", fontSize: 11 }}>
          <strong>ARIA Tree Pattern:</strong>
          <ul style={{ margin: "4px 0", paddingLeft: 16, lineHeight: 1.6 }}>
            <li>Root has <code>role="tree"</code> and <code>aria-label</code></li>
            <li>Items have <code>role="treeitem"</code></li>
            <li>Folders have <code>aria-expanded</code></li>
            <li>Selected items have <code>aria-selected="true"</code></li>
            <li>Items have <code>aria-level</code> for depth</li>
            <li>Full keyboard navigation (inspect with DevTools)</li>
          </ul>
        </div>
        <FileTree
          data={sampleTree}
          height={400}
          width={320}
          defaultExpandedIds={new Set(["src"])}
          aria-label="Accessible file explorer"
        />
      </div>
    );
  },
};
