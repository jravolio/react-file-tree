import { describe, it, expect } from "vitest";
import { resolveIcon } from "../resolveIcon";
import type { IconTheme } from "../types";

const theme: IconTheme = {
  fileExtensions: {
    ".ts": "icon-ts",
    ".js": "icon-js",
    ".css": "icon-css",
    ".test.ts": "icon-test-ts",
    ".module.css": "icon-module-css",
  },
  fileNames: {
    "package.json": "icon-npm",
    "tsconfig.json": "icon-tsconfig",
    ".gitignore": "icon-git",
  },
  folderNames: {
    "node_modules": "icon-node-modules",
    src: "icon-src",
  },
  folderNamesExpanded: {
    src: "icon-src-open",
  },
  defaultFile: "icon-file",
  defaultFolder: "icon-folder",
  defaultFolderExpanded: "icon-folder-open",
};

describe("resolveIcon", () => {
  describe("files", () => {
    it("resolves by exact filename", () => {
      expect(resolveIcon("package.json", false, false, theme)).toBe("icon-npm");
    });

    it("filename takes priority over extension", () => {
      expect(resolveIcon("tsconfig.json", false, false, theme)).toBe("icon-tsconfig");
    });

    it("resolves by compound extension", () => {
      expect(resolveIcon("app.test.ts", false, false, theme)).toBe("icon-test-ts");
    });

    it("compound extension takes priority over simple extension", () => {
      expect(resolveIcon("styles.module.css", false, false, theme)).toBe("icon-module-css");
    });

    it("resolves by simple extension", () => {
      expect(resolveIcon("index.ts", false, false, theme)).toBe("icon-ts");
    });

    it("falls back to default file icon", () => {
      expect(resolveIcon("readme.md", false, false, theme)).toBe("icon-file");
    });

    it("handles dotfiles", () => {
      expect(resolveIcon(".gitignore", false, false, theme)).toBe("icon-git");
    });

    it("is case insensitive", () => {
      expect(resolveIcon("Package.JSON", false, false, theme)).toBe("icon-npm");
    });
  });

  describe("folders", () => {
    it("resolves by folder name", () => {
      expect(resolveIcon("node_modules", true, false, theme)).toBe("icon-node-modules");
    });

    it("resolves expanded folder name", () => {
      expect(resolveIcon("src", true, true, theme)).toBe("icon-src-open");
    });

    it("falls back to folder name when no expanded variant", () => {
      expect(resolveIcon("node_modules", true, true, theme)).toBe("icon-node-modules");
    });

    it("falls back to default folder icon", () => {
      expect(resolveIcon("custom-folder", true, false, theme)).toBe("icon-folder");
    });

    it("falls back to default expanded folder icon", () => {
      expect(resolveIcon("custom-folder", true, true, theme)).toBe("icon-folder-open");
    });
  });
});
