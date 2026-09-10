---
name: pf5-foreman-template
description: >-
  Build PatternFly 5 Foreman template index (list) pages and detail pages with correct sectioning,
  spacing, padding, toolbar composition, table layout, tabs, summary cards, and empty states.
  Use when creating or modifying any PF5 Foreman page, list view, detail view, card index, or table layout.
---

# PF5 Foreman Template

Canonical patterns for building PF5 pages in this project. Every new page
**must** follow these conventions unless explicitly told otherwise.

## Spacing tokens

Define these constants at the top of every page component:

```tsx
const spacingL  = 'var(--pf-v5-global--spacer--l, var(--pf-global--spacer--lg, 24px))';
const spacingMd = 'var(--pf-v5-global--spacer--md, var(--pf-global--spacer--md, 16px))';
const background100 = 'var(--pf-v5-global--BackgroundColor--100, var(--pf-global--BackgroundColor--100, #fff))';
```

Use `spacingL` (24 px) for outer side/bottom padding and `spacingMd` (16 px)
for tighter gaps (top of title, between toolbar and table, tab-to-content gap).

---

## Index (list) page structure

An index page is a single `<PageSection>` with two inner `<section>` elements.

```
PageSection  (noPadding, white background)
├── section  "Title and actions"         ← padding: 24 top, 24 sides, 16 bottom
│   └── Level > Title + optional buttons
└── section  "List"                      ← padding: 0 top, 24 sides, 24 bottom
    ├── Toolbar  (insetNone, marginBottom: 0)
    ├── Table
    └── Pagination (bottom)
```

### PageSection wrapper

```tsx
<PageSection
  aria-label="Page name"
  padding={{ default: 'noPadding' }}
  style={{ backgroundColor: background100 }}
>
```

### Title section

```tsx
<section
  aria-label="Title and actions"
  style={{
    paddingTop: spacingL,
    paddingRight: spacingL,
    paddingBottom: spacingMd,
    paddingLeft: spacingL,
    boxSizing: 'border-box',
  }}
>
  <Level hasGutter>
    <LevelItem>
      <TextContent>
        <Title headingLevel="h1" size="2xl">Page title</Title>
      </TextContent>
    </LevelItem>
    <LevelItem>
      <Button variant="secondary">Action</Button>
    </LevelItem>
  </Level>
</section>
```

To add a help icon beside the title, wrap the icon in a `Popover` and a
`Button variant="plain"`, placed inside the `<Title>` with
`display: 'inline-flex', alignItems: 'center', gap: '8px'`.

### Table section

```tsx
<section
  aria-label="List name"
  style={{
    paddingTop: 0,
    paddingRight: spacingL,
    paddingBottom: spacingL,
    paddingLeft: spacingL,
    boxSizing: 'border-box',
  }}
>
  {/* Toolbar → Table → Bottom pagination */}
</section>
```

---

## Index with cards

Example: Template → **Index with cards** (`/template/index-with-cards`).

Insert a **summary cards** section between the title and the toolbar/list.

```
PageSection  (noPadding, white background)
├── section  "Title and actions"         ← padding: 24 top, 24 sides, 16 bottom
├── section  "Summary cards"             ← padding: 16 top, 24 sides, 16 bottom
│   └── Grid hasGutter → compact Cards
└── section  "List"                      ← padding: 0 top, 24 sides, 24 bottom
    ├── Toolbar  (no BulkSelect)
    ├── Table    (no row checkboxes)
    └── Pagination (bottom)
```

### Cards section padding

```tsx
<section
  aria-label="Summary cards"
  style={{
    paddingTop: spacingMd,    // 16 px — extra gap under the title
    paddingRight: spacingL,   // 24 px
    paddingBottom: spacingMd, // 16 px — gap above the toolbar
    paddingLeft: spacingL,    // 24 px
    boxSizing: 'border-box',
  }}
>
```

### Compact cards (required)

Always use **`isCompact`** + **`isFlat`**. Compact cards use PF’s 16 px child padding
(`--pf-v5-global--spacer--md`). Do **not** override card padding with larger values.

```tsx
<Card isCompact isFlat isFullHeight isSelectable isSelected={isActive}>
  <CardTitle>
    {/* Title text is a link; keep PF CardTitle styling (black / inherit) */}
    <a href="#" onClick={onFilter} style={{ color: 'inherit', textDecoration: 'none' }}>
      Card title
    </a>
  </CardTitle>
  <CardBody>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      {/* Optional: compact Label before the number — no icon beside the number */}
      <Label color="red" isCompact>Critical</Label>
      <Button
        variant="link"
        isInline
        component="a"
        href="#"
        onClick={onFilter}
        style={{
          fontSize: '18px',
          fontFamily:
            'var(--pf-v5-global--FontFamily--text, "RedHatText", "Red Hat Text", Helvetica, Arial, sans-serif)',
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {count}
      </Button>
    </div>
  </CardBody>
</Card>
```

### Card content rules

| Element | Rule |
|---------|------|
| Title | Use PF5 `<CardTitle>`. Link may wrap the text; **color inherit** (black), not blue link styling. |
| Number | Link only. **18px**, Red Hat Text (`--pf-v5-global--FontFamily--text`), bold. |
| Label | Optional. Place **before** the number. Use `<Label isCompact>`. **No icon** next to the number/label. |
| Layout | Title + number only (plus optional compact label). No description body text. |
| Grid | Typically 3 cards: `GridItem span={12} md={4}` with `Grid hasGutter`. |

### Selection / table behaviour for card indexes

- **Omit** `BulkSelect` and row checkboxes on card index variants.
- Card title and number links **filter the table** (e.g. by status). Clicking the active card again clears the filter.
- Default pagination: **20** per page unless specified otherwise.

---

## Index with cards and tabs

Example: Template → **Index with cards and tabs** (`/template/index-with-cards-and-tabs`).

Same as Index with cards, with a tab bar between the cards and the list:

```
PageSection
├── section  Title                     ← 24 / 24 / 16 / 24
├── section  Summary cards             ← 16 / 24 / 16 / 24
├── div      Tab bar                   ← 0 / 24 / — / 24
└── div      Tab panels wrapper        ← 0 / 0 / 24 / 0
    ├── section[tabpanel] Items        ← list (toolbar + table), sides 24
    └── section[tabpanel] Empty        ← empty state, padded 24 sides + 24 top
```

Use the manual PF5 tab styles (see **Tabs** below). Card section and compact-card rules are identical to Index with cards.

---

## Without tabs (detail) — divider inset

On detail pages **without tabs**, the horizontal `<Divider>` between the header and the content section must be **inset 24 px** from the page edges (same as table/title side padding). Do not use a full-bleed divider.

```tsx
<div style={{ paddingRight: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}>
  <Divider component="div" />
</div>
```

---

## Toolbar composition

```tsx
<Toolbar
  id="unique-toolbar-id"
  ouiaId="unique-toolbar-ouia"
  inset={{ default: 'insetNone' }}
  style={{ marginBottom: 0 }}
>
  <ToolbarContent alignItems="center">
    {/* Group 1: BulkSelect */}
    {/* Group 2: SearchInput + bookmark toggle */}
    {/* Group 3: Action buttons, manage columns, kebab */}
    {/* Group 4 (alignRight): Pagination top */}
  </ToolbarContent>
</Toolbar>
```

### Bulk select (from `@patternfly/react-component-groups`)

```tsx
import { BulkSelect, BulkSelectValue } from '@patternfly/react-component-groups/dist/esm/BulkSelect';

<BulkSelect
  ouiaId="page-bulk-select"
  isDataPaginated
  canSelectAll
  pageCount={slice.length}
  selectedCount={selected.size}
  totalCount={filtered.length}
  pageSelected={allOnPageSelected}
  pagePartiallySelected={partiallySelected}
  onSelect={onBulkSelect}
  popperProps={{ appendTo: () => document.body }}
/>
```

Handle `BulkSelectValue.none`, `.all`, `.page`, `.nonePage` in `onSelect`.

### Search input with bookmark toggle

Every search field should include a bookmark toggle appended to the
`InputGroup`. The toggle opens a dropdown with "Bookmark this search",
a group of saved bookmarks, and links to manage bookmarks / documentation.

State required:

```tsx
const [bookmarkOpen, setBookmarkOpen] = React.useState(false);
```

Handler — apply a saved query or close the menu:

```tsx
const applySavedBookmarkQuery = (query: string) => {
  setSearch(query);
  setPage(1);
  setBookmarkOpen(false);
};

const handleBookmarkMenuSelect = (
  _e?: React.MouseEvent<Element, MouseEvent>,
  value?: string | number,
) => {
  const action = String(value ?? '');
  switch (action) {
    case 'bookmark-this-search':
      setBookmarkOpen(false);
      break;
    case 'saved-b1':
      applySavedBookmarkQuery('query1');
      break;
    case 'saved-b2':
      applySavedBookmarkQuery('query2');
      break;
    case 'manage-bookmarks':
      setBookmarkOpen(false);
      break;
    case 'documentation':
      setBookmarkOpen(false);
      window.open('https://www.patternfly.org', '_blank', 'noopener,noreferrer');
      break;
    default:
      setBookmarkOpen(false);
  }
};
```

Full JSX:

```tsx
<InputGroup>
  <InputGroupItem isFill>
    <SearchInput placeholder="Search" value={search}
      onChange={(_e, v) => setSearch(v)}
      onClear={() => { setSearch(''); setPage(1); }}
      onSearch={() => setPage(1)}
      aria-label="Search items" />
  </InputGroupItem>
  <InputGroupItem>
    <Dropdown
      isOpen={bookmarkOpen}
      onOpenChange={setBookmarkOpen}
      onSelect={handleBookmarkMenuSelect}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          variant="default"
          isFullHeight
          className="app-template-search-bookmark-toggle"
          onClick={() => setBookmarkOpen(!bookmarkOpen)}
          isExpanded={bookmarkOpen}
          aria-label="Search bookmarks"
          icon={<OutlinedBookmarkIcon />}
        />
      )}
      popperProps={{ appendTo: () => document.body }}
    >
      <DropdownList>
        <DropdownItem value="bookmark-this-search" icon={<OutlinedBookmarkIcon />}>
          Bookmark this search
        </DropdownItem>
        <Divider component="li" />
        <DropdownGroup label="Saved bookmarks" labelHeadingLevel="h2">
          <DropdownList>
            <DropdownItem value="saved-b1">Bookmark 1</DropdownItem>
            <DropdownItem value="saved-b2">Bookmark 2</DropdownItem>
          </DropdownList>
        </DropdownGroup>
        <Divider component="li" />
        <DropdownItem value="manage-bookmarks">Manage bookmarks</DropdownItem>
        <DropdownItem value="documentation">Documentation</DropdownItem>
      </DropdownList>
    </Dropdown>
  </InputGroupItem>
</InputGroup>
```

Imports needed:

```tsx
import { Divider, Dropdown, DropdownGroup, DropdownItem, DropdownList,
         InputGroup, InputGroupItem, MenuToggle, SearchInput } from '@patternfly/react-core';
import { OutlinedBookmarkIcon } from '@patternfly/react-icons';
```

CSS for the bookmark toggle (in `app.css`):

```css
.app-template-search-bookmark-toggle.pf-v5-c-menu-toggle {
  padding-inline: var(--pf-v5-global--spacer--md, 16px);
}
```

### Manage columns button

```tsx
<Tooltip content="Manage columns">
  <Button variant="plain" aria-label="Manage columns" icon={<ColumnsIcon />}
    onClick={openManageColumnsModal} />
</Tooltip>
```

Opens a `Modal variant={ModalVariant.medium}` containing a compact table of
`Checkbox` items for toggling column visibility.

### Primary action button ("Create + object")

The primary action button belongs **inside the toolbar**, not in the title
section. Use the pattern "Create + object name" in sentence case:

```tsx
<ToolbarGroup spacer={{ default: 'spacerMd' }} spaceItems={{ default: 'spaceItemsNone' }}>
  <ToolbarItem>
    <Button variant="primary" onClick={openCreateModal}>
      Create sync plan
    </Button>
  </ToolbarItem>
</ToolbarGroup>
```

Examples: "Create sync plan", "Create item", "Add subscriptions".
Never use a bare "Create" — always include the object name.

### Kebab overflow menu

```tsx
<Dropdown
  toggle={(ref) => (
    <MenuToggle ref={ref} variant="plain" aria-label="Toolbar actions">
      <EllipsisVIcon />
    </MenuToggle>
  )}
  popperProps={{ appendTo: () => document.body }}
>
  <DropdownList>...</DropdownList>
</Dropdown>
```

---

## Table

| Prop | Value | Notes |
|------|-------|-------|
| `variant` | `"compact"` | Always compact |
| `borders` | `true` | |
| `isStriped` | `true` | For flat lists; expandable tables may omit |
| `isExpandable` | `true` | Only for rows with expandable content |
| `style` | `{ marginBottom: 0, width: '100%' }` | |

### Striped rows

Use `isStriped` on `<Table>` for flat (non-expandable) tables.
For expandable tables, apply `isStriped={rowIndex % 2 === 1}` on each `<Tr>`.

**Never** apply inline `backgroundColor` on `<Tr>` — it overrides PF striping.

### Many-column tables

When there are 6+ columns, use `tableLayout: 'fixed'` plus `<colgroup>` with
percentage widths to prevent truncation:

```tsx
<Table style={{ tableLayout: 'fixed' }}>
  <colgroup>
    <col style={{ width: '45px' }} />  {/* checkbox */}
    <col style={{ width: '14%' }} />   {/* Name */}
    ...
  </colgroup>
```

### Column headers

- Use **sentence case** everywhere — column headers, button labels, tab names,
  modal titles, form labels. Only the first word and proper nouns are capitalised.
  Examples: "Start date" not "Start Date", "Sync enabled" not "Sync Enabled",
  "Original sync date" not "Original Sync Date".
- Apply `whiteSpace: 'nowrap'` via a shared style object.
- Use `screenReaderText` for non-visible columns (checkbox, actions, expand).

### Row actions (per-row kebab)

```tsx
<Td isActionCell>
  <Dropdown ... popperProps={{ appendTo: () => document.body }}>
    <DropdownList>
      <DropdownItem>View</DropdownItem>
      <DropdownItem>Edit</DropdownItem>
      <DropdownItem isDanger>Delete</DropdownItem>
    </DropdownList>
  </Dropdown>
</Td>
```

### Expandable rows

Use paired `<Tr>` elements inside `<React.Fragment>`:

```tsx
<Tr isExpanded={isEx} isStriped={rowIndex % 2 === 1}>
  <Td expand={{ isExpanded, rowIndex, onToggle }} />
  <Td select={{ rowIndex, onSelect, isSelected, variant: 'checkbox' }} />
  {/* data cells */}
  <Td isActionCell>{/* kebab */}</Td>
</Tr>
<Tr isExpanded={isEx} isHidden={!isEx} isStriped={rowIndex % 2 === 1}>
  <Td colSpan={totalColumnCount}>
    <ExpandableRowContent>...</ExpandableRowContent>
  </Td>
</Tr>
```

---

## Date and time format

Follow the PatternFly timestamp conventions. Use `dateFormat="medium"` +
`timeFormat="short"` which produces the standard PF format:

| Format | Example |
|--------|---------|
| Date only (medium) | Aug 9, 2022 |
| Date + time (medium + short) | Nov 7, 2020, 4:00 AM |
| Date + time + timezone | Jan 23, 2025, 5:00 PM EST |

For mock data strings, use this exact pattern: `"Mon D, YYYY, H:MM AM/PM"`.
No leading zeros on hours. No "at" between date and time — use a comma.

When using the PF `Timestamp` component:

```tsx
import { Timestamp } from '@patternfly/react-core';

<Timestamp date={new Date('2020-11-07T04:00:00')} dateFormat="medium" timeFormat="short" />
```

For date-only display (no time needed), use `dateFormat="medium"` alone:
"Sep 2, 2024", "Jan 15, 2026".

---

## Pagination

### Top pagination (inside toolbar)

```tsx
<Pagination
  variant={PaginationVariant.top}
  isCompact
  itemCount={itemCount}
  perPage={perPage}
  page={safePage}
  onSetPage={...}
  onPerPageSelect={...}
/>
```

### Bottom pagination (after table)

```tsx
<Pagination
  variant={PaginationVariant.bottom}
  isStatic
  isCompact
  toggleTemplate={({ firstIndex, lastIndex, itemCount: total }) => (
    <span>{firstIndex} - {lastIndex} of {total}</span>
  )}
  style={{
    marginTop: spacingMd,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingInline: 0,
  }}
/>
```

---

## Detail page structure

```
PageSection  (noPadding, white background)
├── div  Breadcrumb         ← padding: 16 top, 24 sides, 0 bottom
├── div  Title + summary    ← padding: 16 top, 24 sides, 16 bottom
├── div  Tabs (tab bar)     ← padding: 0 top, 24 sides
└── div  Tab panels         ← padding: 0 top, 0 sides, 24 bottom
    ├── section[tabpanel] "Items"  (toolbar + table inside, padded 24 sides)
    └── section[tabpanel] "Empty"  (padded 24 all sides)
```

### Breadcrumb

```tsx
<div style={{
  paddingTop: spacingMd, paddingRight: spacingL,
  paddingBottom: 0, paddingLeft: spacingL,
  boxSizing: 'border-box',
}}>
  <Breadcrumb>
    <BreadcrumbItem to="/parent" render={({ className, ariaCurrent }) => (
      <Link className={className} to="/parent" aria-current={ariaCurrent}>Parent</Link>
    )} />
    <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
  </Breadcrumb>
</div>
```

### Title section

Same pattern as the index page title section but also includes a subtitle
`<Text component="p">` for summary text, and optional description list
fields below.

### Errata-style inline detail fields

Use `Flex` with wrapping `DescriptionList` items for multi-field detail headers:

```tsx
<Flex
  flexWrap={{ default: 'wrap' }}
  alignItems={{ default: 'alignItemsFlexStart' }}
  style={{ gap: '14px' }}
>
  <DescriptionList style={{ flex: '1 1 8rem', minWidth: '7.5rem', marginBottom: 0 }}>
    <DescriptionListGroup style={{ rowGap: '8px', display: 'flex', flexDirection: 'column' }}>
      <DescriptionListTerm style={{ fontSize: '14px', fontWeight: 700 }}>Label</DescriptionListTerm>
      <DescriptionListDescription>Value</DescriptionListDescription>
    </DescriptionListGroup>
  </DescriptionList>
  {/* more items ... */}
</Flex>
```

For full-width fields (Environment, Description), use a standalone
`DescriptionList` with `marginTop: '14px'`.

### Copyable UUID field

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: spacingSm, marginTop: spacingSm }}>
  <span style={{ fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>UUID:</span>
  <ClipboardCopy isReadOnly hoverTip="Copy" clickTip="Copied"
    variant={ClipboardCopyVariant.inline}>
    {uuid}
  </ClipboardCopy>
</div>
```

---

## Tabs (manual PF5 tab styles)

Use `@patternfly/react-styles` to build accessible tabs without the `<Tabs>`
component, which gives full control over tab-to-content spacing:

```tsx
import { css } from '@patternfly/react-styles';
import tabStyles from '@patternfly/react-styles/css/components/Tabs/tabs.mjs';
import tabContentStyles from '@patternfly/react-styles/css/components/TabContent/tab-content.mjs';
```

### Tab bar

```tsx
<div style={{ paddingTop: 0, paddingRight: spacingL, paddingLeft: spacingL, boxSizing: 'border-box' }}>
  <div className={css(tabStyles.tabs)} aria-label="Detail tabs">
    <ul className={css(tabStyles.tabsList)} role="tablist">
      <li className={css(tabStyles.tabsItem, activeTabKey === 'items' && tabStyles.modifiers.current)}
          role="presentation">
        <button type="button" id={TAB_IDS.items} className={css(tabStyles.tabsLink)}
          role="tab" aria-selected={activeTabKey === 'items'}
          aria-controls={PANEL_IDS.items}
          tabIndex={activeTabKey === 'items' ? 0 : -1}
          onClick={() => setActiveTabKey('items')}>
          <span className={css(tabStyles.tabsItemText)}>Items</span>
        </button>
      </li>
    </ul>
  </div>
</div>
```

### Tab panels

```tsx
<div style={{ paddingBottom: spacingL, boxSizing: 'border-box' }}>
  <section id={PANEL_IDS.items} role="tabpanel" aria-labelledby={TAB_IDS.items}
    className={css(tabContentStyles.tabContent)} style={{ padding: 0 }}
    hidden={activeTabKey !== 'items'} tabIndex={0}>
    {tableSection}
  </section>
</div>
```

### "Without search" tab variant

When a tab has no search/toolbar, add `paddingTop: spacingMd` (16 px) to the
tab panel content wrapper to create the gap between the tab bar and the table.

---

## Empty states

Always use the PF5.4 `EmptyStateHeader` + `EmptyStateIcon` API:

```tsx
import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon,
         EmptyStateVariant } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

<EmptyState variant={EmptyStateVariant.lg}>
  <EmptyStateHeader
    titleText="No items to display yet"
    headingLevel="h4"
    icon={<EmptyStateIcon icon={CubesIcon} />}
  />
  <EmptyStateBody>
    Descriptive message here.
  </EmptyStateBody>
</EmptyState>
```

**Do not** pass `icon` or `titleText` directly to `<EmptyState>` — that is the
old API and will not render in PF5.4.

| Variant | Use case |
|---------|----------|
| `lg` | Primary empty state in a tab panel |
| `sm` | Inline empty state inside a detail subsection |

---

## Simple list pages (no bulk/checkboxes/carets)

For content-type pages (Files, Module Streams, Ansible Collections) that need
a minimal table:

- Remove `BulkSelect`, row checkboxes, expandable carets, and per-row kebabs.
- Keep `isStriped` on `<Table>`.
- Keep search + pagination in toolbar.
- Row names link to a detail page via `<Button variant="link" isInline>`.

---

## CSS helpers (app.css)

```css
/* Expand-all caret orientation */
.app-table-expand-header-caret thead .pf-v5-c-table__toggle
  .pf-v5-c-button:not(.pf-m-expanded) .pf-v5-c-table__toggle-icon {
  transform: rotate(180deg);
}
.app-table-expand-header-caret thead .pf-v5-c-table__toggle
  .pf-v5-c-button.pf-m-expanded .pf-v5-c-table__toggle-icon {
  transform: rotate(270deg);
}

/* Remove separator between parent and expanded row */
.app-table-expand-no-middle-rule
  .pf-v5-c-table__expandable-row.pf-m-expanded:has(+ .pf-v5-c-table__expandable-row) {
  border-block-end: none;
  box-shadow: none;
}

/* Bookmark toggle padding */
.app-template-search-bookmark-toggle.pf-v5-c-menu-toggle {
  padding-inline: var(--pf-v5-global--spacer--md, 16px);
}
```

---

## Quick-reference spacing cheat sheet

| Element | Top | Right | Bottom | Left |
|---------|-----|-------|--------|------|
| Title section | 24 | 24 | 16 | 24 |
| Summary cards section | 16 | 24 | 16 | 24 |
| Compact card padding (via `isCompact`) | 16 | 16 | 16 | 16 |
| Table section | 0 | 24 | 24 | 24 |
| Breadcrumb | 16 | 24 | 0 | 24 |
| Detail title | 16 | 24 | 16 | 24 |
| Without-tabs divider inset | — | 24 | — | 24 |
| Tab bar | 0 | 24 | — | 24 |
| Tab panels wrapper | 0 | 0 | 24 | 0 |
| Tab panel content (with toolbar) | 0 | 24 | 0 | 24 |
| Tab panel content (without search) | 16 | 24 | 0 | 24 |
| Bottom pagination marginTop | 16 | 0 | 0 | 0 |

All values in pixels. Use the token constants, not raw numbers.
