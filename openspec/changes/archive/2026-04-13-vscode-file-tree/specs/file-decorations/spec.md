## ADDED Requirements

### Requirement: Tree supports decoration providers
The tree SHALL accept decoration providers that can attach visual decorations (color, badge, tooltip) to tree items based on their data.

#### Scenario: Git status decoration provider
- **WHEN** a decoration provider returns `{ color: 'modified', badge: 'M' }` for a file
- **THEN** the file's label is rendered with the modified color
- **AND** a badge showing "M" appears next to the label

#### Scenario: Multiple decoration providers merge
- **WHEN** two decoration providers return decorations for the same item
- **THEN** the decorations are merged (colors from highest priority provider, badges concatenated)

### Requirement: File decorations show git status colors
The tree SHALL render file labels with git-status-appropriate colors matching VS Code: modified (yellow/warning), untracked (green), deleted (red), conflicting (red bold), ignored (dimmed).

#### Scenario: Modified file shows warning color
- **WHEN** a file has decoration `{ status: 'modified' }`
- **THEN** the file label is rendered with the `--vft-gitDecoration-modifiedResourceForeground` color

#### Scenario: Untracked file shows added color
- **WHEN** a file has decoration `{ status: 'untracked' }`
- **THEN** the file label is rendered with the `--vft-gitDecoration-untrackedResourceForeground` color

#### Scenario: Deleted file shows deleted color
- **WHEN** a file has decoration `{ status: 'deleted' }`
- **THEN** the file label is rendered with the `--vft-gitDecoration-deletedResourceForeground` color

### Requirement: Folder decorations propagate from children
Folders SHALL display decorations that aggregate from their children. If any child is modified, the folder shows a modified indicator. Badge counts on folders SHALL reflect the number of decorated children.

#### Scenario: Folder shows modified status from child
- **WHEN** a folder contains a file with `status: 'modified'`
- **THEN** the folder label is rendered with the modified color
- **AND** a badge shows the count of decorated files

#### Scenario: Folder badge count reflects children
- **WHEN** a folder contains 3 modified files and 1 untracked file
- **THEN** the folder displays a badge showing "4"

### Requirement: Decoration badges render as circular indicators
Badges SHALL render as small circular indicators with a number or letter, positioned to the right of the item label, matching VS Code's badge styling.

#### Scenario: Badge renders with correct styling
- **WHEN** a decoration badge with value "M" is applied to an item
- **THEN** a circular badge appears to the right of the label
- **AND** the badge uses `--vft-badge-background` and `--vft-badge-foreground` colors
- **AND** the badge has a minimum width to remain circular for single characters

### Requirement: Decorations update reactively
When the decoration provider's data changes, the affected tree items SHALL re-render with updated decorations without requiring a full tree refresh.

#### Scenario: Decoration update triggers targeted re-render
- **WHEN** the decoration provider updates a single file's status from 'modified' to 'staged'
- **THEN** only that file's tree item re-renders
- **AND** the file's decoration color and badge update accordingly
- **AND** parent folder decorations recalculate

### Requirement: Decoration tooltips on hover
Decorated items SHALL show a tooltip on hover that describes the decoration (e.g., "Modified - This file has been modified").

#### Scenario: Hover shows decoration tooltip
- **WHEN** the user hovers over a file with `status: 'modified'`
- **THEN** a tooltip appears showing "M - Modified"
