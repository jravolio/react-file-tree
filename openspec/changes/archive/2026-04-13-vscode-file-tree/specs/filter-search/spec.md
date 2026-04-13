## ADDED Requirements

### Requirement: Filter widget appears above the tree
When activated, a search/filter input widget SHALL appear at the top of the tree, matching VS Code's tree filter widget styling and position.

#### Scenario: Ctrl+F opens filter widget
- **WHEN** the tree is focused and the user presses Ctrl+F (Cmd+F on macOS)
- **THEN** a filter input widget appears at the top of the tree
- **AND** the input is focused and ready for typing

#### Scenario: Filter widget shows match count
- **WHEN** the user types in the filter input
- **THEN** the widget displays a count of matching items (e.g., "3 of 150")

### Requirement: Filter mode hides non-matching items
In filter mode, the tree SHALL hide all items that do not match the filter text. Parent folders of matching items SHALL remain visible to preserve tree structure.

#### Scenario: Filtering hides non-matching items
- **WHEN** the user types "test" in the filter input
- **THEN** only items containing "test" in their name are visible
- **AND** parent folders of matching items remain visible (even if they don't match)
- **AND** non-matching items without matching descendants are hidden

#### Scenario: Empty filter shows all items
- **WHEN** the user clears the filter input
- **THEN** all tree items become visible again

### Requirement: Filter highlights matching text
Matching portions of item names SHALL be highlighted with a distinct style to show what matched.

#### Scenario: Match text is highlighted in item label
- **WHEN** the filter is "test" and an item is named "testUtils.ts"
- **THEN** the "test" portion of the label is highlighted
- **AND** the "Utils.ts" portion renders normally

### Requirement: Filter supports fuzzy matching
The filter SHALL support fuzzy matching where characters can be non-contiguous but must appear in order.

#### Scenario: Fuzzy match works
- **WHEN** the user types "tut" in the filter
- **THEN** items like "testUtils.ts" match (t-u-t appear in order)
- **AND** matched characters are individually highlighted

### Requirement: Up/Down arrows navigate between matches
When the filter widget is active, Up/Down arrow keys SHALL navigate between matching items.

#### Scenario: Down arrow moves to next match
- **WHEN** the filter widget is active with matches and the user presses Down arrow
- **THEN** focus moves to the next matching item in the tree
- **AND** the tree scrolls to reveal the focused match

#### Scenario: Navigation wraps around
- **WHEN** focus is on the last match and the user presses Down arrow
- **THEN** focus wraps to the first match

### Requirement: Escape closes filter widget
Pressing Escape SHALL close the filter widget and restore the full tree view.

#### Scenario: Escape closes filter and restores tree
- **WHEN** the filter widget is active and the user presses Escape
- **THEN** the filter widget closes
- **AND** all tree items become visible
- **AND** focus returns to the previously focused tree item

### Requirement: Filter preserves expansion state
Filtering SHALL not alter the user's expansion state. When the filter is cleared, the expansion state SHALL be the same as before filtering.

#### Scenario: Expansion state restored after filter
- **WHEN** the user has folders A (expanded) and B (collapsed)
- **AND** the user activates filter, types a query, then clears the filter
- **THEN** folder A is still expanded and folder B is still collapsed
