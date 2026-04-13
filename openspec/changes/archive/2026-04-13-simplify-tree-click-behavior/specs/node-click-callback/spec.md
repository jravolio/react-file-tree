## ADDED Requirements

### Requirement: onNodeClick callback fires on single click
The FileTree component SHALL expose an `onNodeClick` prop that fires whenever a user clicks on any tree node (file or folder). The callback SHALL receive an object with `node` (the TreeNode data), `isFolder` (boolean), and `isExpanded` (boolean, reflecting post-click expansion state for folders, always `false` for files).

#### Scenario: Click on a file node
- **WHEN** user single-clicks on a file node
- **THEN** `onNodeClick` fires with `{ node, isFolder: false, isExpanded: false }`

#### Scenario: Click on a collapsed folder node
- **WHEN** user single-clicks on a collapsed folder node
- **THEN** the folder expands AND `onNodeClick` fires with `{ node, isFolder: true, isExpanded: true }`

#### Scenario: Click on an expanded folder node
- **WHEN** user single-clicks on an expanded folder node
- **THEN** the folder collapses AND `onNodeClick` fires with `{ node, isFolder: true, isExpanded: false }`

#### Scenario: Ctrl/Cmd click on a node
- **WHEN** user Ctrl-clicks (or Cmd-clicks on Mac) on any node
- **THEN** selection toggles for that node AND `onNodeClick` fires with the clicked node's data

#### Scenario: Shift-click on a node
- **WHEN** user Shift-clicks on any node
- **THEN** range selection extends AND `onNodeClick` fires with the clicked node's data

#### Scenario: onNodeClick is optional
- **WHEN** `onNodeClick` prop is not provided
- **THEN** click behavior (selection, folder expansion) still works normally without errors

### Requirement: Folder expands/collapses on single click
Clicking anywhere on a folder row SHALL toggle the folder's expansion state, matching VS Code's default file explorer behavior. This replaces the previous behavior where only the twistie (chevron icon) toggled expansion.

#### Scenario: Single click on folder row body (not twistie)
- **WHEN** user clicks on the label, icon, or empty space area of a folder row
- **THEN** the folder's expansion state toggles (expand if collapsed, collapse if expanded)

#### Scenario: Single click on folder twistie
- **WHEN** user clicks on the twistie (chevron) of a folder row
- **THEN** the folder's expansion state toggles (same behavior as clicking the row body — no separate handling)

#### Scenario: Folder expansion animation
- **WHEN** a folder expands or collapses via click
- **THEN** the twistie rotates with a 0.1s CSS transition (matching current behavior)

### Requirement: Keyboard Enter fires onNodeClick for files
When a file node has keyboard focus, pressing Enter SHALL fire the `onNodeClick` callback instead of the removed `onActivate` callback.

#### Scenario: Enter key on focused file
- **WHEN** user presses Enter while a file node is focused
- **THEN** `onNodeClick` fires with `{ node, isFolder: false, isExpanded: false }`

#### Scenario: Enter key on focused folder
- **WHEN** user presses Enter while a folder node is focused
- **THEN** folder expansion toggles (unchanged from current behavior) AND `onNodeClick` fires

## REMOVED Requirements

### Requirement: onActivate callback
**Reason**: Replaced by `onNodeClick` which provides a more generic click callback. `onActivate` implied file-opening semantics that coupled the tree to a specific use case.
**Migration**: Replace `onActivate` with `onNodeClick`. The callback now fires on all clicks (not just double-click on files). Check `isFolder` to distinguish file vs folder clicks.

### Requirement: Inline editing (rename and create)
**Reason**: File-system operations are out of scope for a pure tree component. Consumers should implement editing UI externally using the tree's selection state.
**Migration**: Remove `onRename` and `onCreate` props. Remove usage of `ref.startRename()` and `ref.startCreate()`. Implement custom editing UI outside the tree if needed.

### Requirement: Delete handling
**Reason**: File-system operations are out of scope. The tree should not manage deletion.
**Migration**: Remove `onDelete` prop. Handle deletion in application code using `selectedIds` from `onSelectionChange`.

### Requirement: Context menu
**Reason**: Context menu implementation is application-specific. A pure tree component should not bundle a menu system.
**Migration**: Remove `contextMenuItems` prop. Implement context menus externally using the tree's `onContextMenu` DOM event or a right-click handler on the container.

### Requirement: Filter widget
**Reason**: Filter/search UI is application-specific. The tree should expose data, not UI for filtering it.
**Migration**: Implement filtering externally by pre-filtering the `data` prop before passing it to FileTree.

### Requirement: Double-click to activate
**Reason**: Replaced by single-click `onNodeClick` for files. Folders now expand on single click. Double-click has no special behavior.
**Migration**: If double-click behavior is needed, consumers can implement it externally using standard DOM events on the tree container.

### Requirement: F2 rename keyboard shortcut
**Reason**: Inline editing removed.
**Migration**: None — implement custom keyboard shortcuts externally if needed.

### Requirement: Delete/Backspace keyboard shortcut
**Reason**: Delete handling removed.
**Migration**: None — implement custom keyboard shortcuts externally if needed.
