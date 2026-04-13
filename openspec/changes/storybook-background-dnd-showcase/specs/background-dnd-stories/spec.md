## ADDED Requirements

### Requirement: Sidebar Background comparison story
A Storybook story SHALL render two trees side by side — one on `#252526` (sidebar) and one on `#1e1e1e` (editor) — with labels, so the background difference is immediately visible.

#### Scenario: Visual comparison renders
- **WHEN** the "Sidebar Background" story loads
- **THEN** two trees render side by side with labeled backgrounds ("Sidebar #252526" and "Editor #1e1e1e")

### Requirement: Drag ghost styling story
A Storybook story SHALL render a DnD-enabled tree with instructions to drag items, showcasing the minimal drag overlay (sidebar-colored, no border-radius, subtle shadow).

#### Scenario: Drag ghost visible during drag
- **WHEN** the user drags a tree node in the "Drag Ghost Styling" story
- **THEN** the drag overlay appears with sidebar background color, subtle border, no rounded corners

### Requirement: Multi-select drag story
A Storybook story SHALL render a DnD-enabled tree demonstrating multi-select drag with the count badge on the drag overlay.

#### Scenario: Count badge on multi-drag
- **WHEN** the user selects multiple items and drags them in the "Multi-Select Drag" story
- **THEN** the drag overlay shows the first item name and a count badge

### Requirement: Drop target highlight story
A Storybook story SHALL render a DnD-enabled tree showcasing the `list.dropBackground` highlight on folder drop targets.

#### Scenario: Drop target highlights folder
- **WHEN** the user drags an item over a folder in the "Drop Target Highlight" story
- **THEN** the folder row shows the `--vft-list-dropBackground` highlight

### Requirement: Auto-expand on hover story
A Storybook story SHALL render a DnD-enabled tree with collapsed folders demonstrating the 500ms auto-expand behavior.

#### Scenario: Collapsed folder expands on drag hover
- **WHEN** the user drags an item over a collapsed folder and holds for 500ms in the "Auto-Expand on Hover" story
- **THEN** the folder automatically expands
