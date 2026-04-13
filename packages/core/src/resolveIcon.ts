import type { IconTheme, IconValue } from "./types";

/**
 * Resolves the icon for a file or folder based on the icon theme.
 * Priority: exact filename > compound extension > simple extension > folder name > default
 */
export function resolveIcon(
  name: string,
  isFolder: boolean,
  isExpanded: boolean,
  theme: IconTheme,
): IconValue {
  if (isFolder) {
    // Check folder name
    const folderLower = name.toLowerCase();
    if (isExpanded && theme.folderNamesExpanded[folderLower]) {
      return theme.folderNamesExpanded[folderLower];
    }
    if (theme.folderNames[folderLower]) {
      return theme.folderNames[folderLower];
    }
    return isExpanded ? theme.defaultFolderExpanded : theme.defaultFolder;
  }

  // File: check exact filename first
  const nameLower = name.toLowerCase();
  if (theme.fileNames[nameLower]) {
    return theme.fileNames[nameLower];
  }

  // Check compound extension (e.g., .test.ts, .module.css)
  const parts = nameLower.split(".");
  if (parts.length > 2) {
    for (let i = 1; i < parts.length; i++) {
      const compoundExt = "." + parts.slice(i).join(".");
      if (theme.fileExtensions[compoundExt]) {
        return theme.fileExtensions[compoundExt];
      }
    }
  }

  // Check simple extension
  const dotIndex = nameLower.lastIndexOf(".");
  if (dotIndex > 0) {
    const ext = nameLower.slice(dotIndex);
    if (theme.fileExtensions[ext]) {
      return theme.fileExtensions[ext];
    }
  }

  return theme.defaultFile;
}
