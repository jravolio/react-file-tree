## ADDED Requirements

### Requirement: Single-child directories compress into path notation
When a folder contains exactly one child and that child is also a folder, the tree SHALL compress them into a single row showing the combined path (e.g., "src/app/models"), matching VS Code's `explorer.compactFolders` behavior.

#### Scenario: Two single-child folders compress
- **WHEN** folder "src" contains only folder "app" which contains only folder "models"
- **THEN** the tree displays a single row showing "src/app/models"
- **AND** the row has a folder icon

#### Scenario: Folder with multiple children does not compress
- **WHEN** folder "src" contains "app" and "lib"
- **THEN** "src" is displayed as a normal expandable folder
- **AND** "app" and "lib" are displayed as separate children

#### Scenario: Compression stops at first branching point
- **WHEN** folder "a" contains only "b", "b" contains only "c", and "c" contains "file1.ts" and "file2.ts"
- **THEN** the tree displays "a/b/c" as a single compressed row
- **AND** expanding it reveals "file1.ts" and "file2.ts"

### Requirement: Compressed paths are clickable per segment
Each segment in a compressed path SHALL be individually clickable, allowing the user to navigate to that specific folder in the path.

#### Scenario: Clicking a middle segment of compressed path
- **WHEN** the compressed path shows "src/app/models" and the user clicks on "app"
- **THEN** the `onNavigateToSegment` callback is called with the "app" folder's data
- **AND** the tree can optionally reveal that folder expanded

### Requirement: Compact folders can be toggled
The tree SHALL accept a `compactFolders` prop (boolean, default true) that enables or disables the compact folder behavior.

#### Scenario: Compact folders disabled
- **WHEN** the tree is rendered with `compactFolders={false}`
- **THEN** all folders are displayed individually without compression
- **AND** each folder occupies its own row regardless of child count

#### Scenario: Compact folders enabled (default)
- **WHEN** the tree is rendered without the `compactFolders` prop
- **THEN** single-child folder chains are compressed into path notation

### Requirement: Compressed paths show full path on hover
Hovering over a compressed path SHALL show a tooltip with the full path.

#### Scenario: Hover shows full path tooltip
- **WHEN** the user hovers over a compressed path "src/app/models"
- **THEN** a tooltip appears showing the full file system path

### Requirement: Compressed folders expand to show terminal children
Expanding a compressed folder row SHALL reveal the children of the last folder in the compressed chain.

#### Scenario: Expanding compressed folder reveals terminal children
- **WHEN** the user expands the compressed row "src/app/models"
- **THEN** the children of the "models" folder are revealed
- **AND** the compressed row shows the expanded twistie
