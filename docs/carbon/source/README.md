# Carbon React docs — source dump

Raw component documentation and examples from the Carbon monorepo, at the
tag that matches `@carbon/react@1.119.0`. This is the source behind
<https://react.carbondesignsystem.com>; it is not transformed for agents yet.

| | |
|---|---|
| Source | <https://github.com/carbon-design-system/carbon> |
| Tag | `v11.119.0` |
| Commit | `571cd549545dd156e11f06fd046eb14efa6a61c3` |
| Path | `packages/react/src/components` |
| Dumped | 2026-10-24 |
| License | Apache-2.0 (`LICENSE-carbon`) |
| Contents | 203 `.mdx` docs, 163 stories, 4 READMEs (2.6 MB) |

Only documentation text and examples are included; images, previews and the
design-guidelines site are not. The MDX imports Storybook blocks
(`Meta`, `Canvas`, `ArgTypes`), so it is source material, not rendered docs.

**Do not edit these files.** Transform them into `docs/carbon/*.md` and keep
this directory as the provenance record. Re-dump when the Carbon version
changes; update the tag and commit here.

## Index

| Component | MDX | Stories |
|---|---:|---:|
| `AILabel` | 2 | 1 |
| `AISkeleton` | 1 | 3 |
| `Accordion` | 1 | 1 |
| `Accordion/docs` | 1 | 0 |
| `ActionSet` | 1 | 1 |
| `AddSelect` | 0 | 1 |
| `AddSelect/docs` | 1 | 0 |
| `AspectRatio` | 1 | 1 |
| `AspectRatio/docs` | 1 | 0 |
| `BigNumber` | 1 | 1 |
| `Breadcrumb` | 1 | 1 |
| `Breadcrumb/docs` | 1 | 0 |
| `Button` | 1 | 1 |
| `Button/docs` | 1 | 0 |
| `ButtonSet` | 0 | 1 |
| `Card` | 1 | 1 |
| `ChatButton` | 0 | 1 |
| `Checkbox` | 1 | 1 |
| `Checkbox/docs` | 1 | 0 |
| `ClassPrefix` | 1 | 1 |
| `ClassPrefix/docs` | 1 | 0 |
| `Coachmark` | 1 | 1 |
| `CodeSnippet` | 1 | 1 |
| `CodeSnippet/docs` | 1 | 0 |
| `ComboBox` | 2 | 2 |
| `ComboBox/docs` | 1 | 0 |
| `ComboButton` | 2 | 2 |
| `ComboButton/docs` | 1 | 0 |
| `ComposedModal` | 2 | 5 |
| `ComposedModal/docs` | 1 | 0 |
| `ConditionBuilder` | 1 | 1 |
| `ContainedList` | 1 | 1 |
| `ContainedList/docs` | 1 | 0 |
| `ContentSwitcher` | 1 | 1 |
| `ContentSwitcher/docs` | 1 | 0 |
| `ContextMenu` | 1 | 1 |
| `ContextMenu/docs` | 1 | 0 |
| `CopyButton` | 1 | 1 |
| `CopyButton/docs` | 1 | 0 |
| `DataTable` | 1 | 0 |
| `DataTable/docs` | 1 | 0 |
| `DataTable/stories` | 0 | 8 |
| `DataTable/stories/dynamic-content` | 0 | 1 |
| `DataTable/stories/expansion` | 0 | 1 |
| `DataTableSkeleton` | 0 | 1 |
| `DatePicker` | 1 | 1 |
| `DatePicker/docs` | 1 | 0 |
| `DatePicker/next/__stories__` | 1 | 1 |
| `Dialog` | 1 | 1 |
| `Dropdown` | 2 | 2 |
| `Dropdown/docs` | 1 | 0 |
| `EditInPlace` | 1 | 1 |
| `ErrorBoundary` | 1 | 1 |
| `ErrorBoundary/docs` | 1 | 0 |
| `FeatureFlags` | 1 | 0 |
| `FileUploader` | 2 | 2 |
| `FileUploader/docs` | 1 | 0 |
| `FlexGrid/docs` | 1 | 0 |
| `FluidComboBox` | 1 | 1 |
| `FluidDatePicker` | 1 | 1 |
| `FluidDropdown` | 1 | 1 |
| `FluidForm` | 1 | 1 |
| `FluidMultiSelect` | 1 | 1 |
| `FluidNumberInput` | 1 | 1 |
| `FluidSearch` | 1 | 1 |
| `FluidSelect` | 1 | 1 |
| `FluidTextArea` | 1 | 1 |
| `FluidTextInput` | 2 | 2 |
| `FluidTimePicker` | 1 | 1 |
| `Form` | 1 | 1 |
| `Form/docs` | 1 | 0 |
| `FormGroup` | 1 | 1 |
| `FormGroup/docs` | 1 | 0 |
| `FormLabel` | 1 | 1 |
| `FormLabel/docs` | 1 | 0 |
| `FullPageError` | 1 | 1 |
| `Grid` | 2 | 4 |
| `Grid/docs` | 1 | 0 |
| `Guidebanner` | 0 | 1 |
| `Guidebanner/docs` | 1 | 0 |
| `Heading` | 2 | 1 |
| `Heading/docs` | 1 | 0 |
| `HideAtBreakpoint` | 1 | 1 |
| `IconButton` | 1 | 1 |
| `IconButton/docs` | 1 | 0 |
| `IconIndicator` | 1 | 1 |
| `IconIndicator/docs` | 1 | 0 |
| `Icons` | 1 | 2 |
| `IdPrefix` | 1 | 1 |
| `IdPrefix/docs` | 1 | 0 |
| `InlineLoading` | 1 | 1 |
| `InlineLoading/docs` | 1 | 0 |
| `InterstitialScreen` | 1 | 1 |
| `Layer` | 1 | 1 |
| `Layer/docs` | 2 | 0 |
| `Layout` | 1 | 1 |
| `LayoutDirection/docs` | 1 | 0 |
| `Link` | 1 | 1 |
| `Link/docs` | 1 | 0 |
| `Loading` | 1 | 1 |
| `Loading/docs` | 1 | 0 |
| `Menu` | 1 | 1 |
| `Menu/docs` | 1 | 0 |
| `MenuButton` | 2 | 2 |
| `MenuButton/docs` | 1 | 0 |
| `Modal` | 2 | 5 |
| `Modal/docs` | 1 | 0 |
| `ModalWrapper` | 1 | 1 |
| `MultiSelect` | 2 | 2 |
| `MultiSelect/docs` | 1 | 0 |
| `Notification` | 2 | 0 |
| `Notification/docs` | 1 | 0 |
| `Notification/stories` | 1 | 6 |
| `NotificationsPanel` | 0 | 1 |
| `NotificationsPanel/docs` | 1 | 0 |
| `NumberInput` | 1 | 1 |
| `NumberInput/docs` | 1 | 0 |
| `OptionsTile` | 1 | 1 |
| `OrderedList` | 1 | 1 |
| `OrderedList/docs` | 1 | 0 |
| `OverflowHandler` | 0 | 2 |
| `OverflowMenu` | 2 | 2 |
| `OverflowMenu/docs` | 1 | 0 |
| `OverflowMenu/next/docs` | 1 | 0 |
| `OverflowMenuV2` | 0 | 1 |
| `PageHeader` | 0 | 1 |
| `PageHeader/docs` | 1 | 0 |
| `PageHeaderDeprecated` | 1 | 1 |
| `Pagination` | 1 | 1 |
| `Pagination/docs` | 1 | 0 |
| `Pagination/experimental/docs` | 1 | 0 |
| `PaginationNav` | 1 | 1 |
| `PaginationNav/docs` | 1 | 0 |
| `Plex` | 0 | 1 |
| `Popover` | 2 | 2 |
| `Popover/docs` | 1 | 0 |
| `ProgressBar` | 1 | 1 |
| `ProgressBar/docs` | 1 | 0 |
| `ProgressIndicator` | 1 | 1 |
| `ProgressIndicator/docs` | 1 | 0 |
| `RadioButton` | 1 | 1 |
| `RadioButton/docs` | 1 | 0 |
| `Resizer` | 1 | 1 |
| `ScrollGradient` | 0 | 1 |
| `ScrollGradient/docs` | 1 | 0 |
| `Search` | 1 | 1 |
| `Search/docs` | 1 | 0 |
| `Select` | 1 | 1 |
| `Select/docs` | 1 | 0 |
| `ShapeIndicator` | 1 | 1 |
| `ShapeIndicator/docs` | 1 | 0 |
| `SidePanel` | 1 | 1 |
| `SkeletonIcon` | 1 | 1 |
| `SkeletonPlaceholder` | 1 | 1 |
| `SkeletonText` | 1 | 1 |
| `Slider` | 1 | 1 |
| `Slider/docs` | 1 | 0 |
| `Stack` | 0 | 1 |
| `Stack/docs` | 1 | 0 |
| `StructuredList` | 2 | 2 |
| `StructuredList/docs` | 1 | 0 |
| `Tabs` | 1 | 1 |
| `Tabs/docs` | 1 | 0 |
| `Tag` | 1 | 2 |
| `Tag/docs` | 1 | 0 |
| `TagOverflow` | 1 | 1 |
| `Tearsheet` | 1 | 2 |
| `Text` | 1 | 1 |
| `Text/docs` | 2 | 0 |
| `TextArea` | 1 | 1 |
| `TextArea/docs` | 1 | 0 |
| `TextInput` | 1 | 2 |
| `TextInput/docs` | 1 | 0 |
| `Theme` | 1 | 1 |
| `Theme/docs` | 2 | 0 |
| `Tile` | 2 | 2 |
| `Tile/docs` | 1 | 0 |
| `TimePicker` | 1 | 1 |
| `TimePicker/docs` | 1 | 0 |
| `Toggle` | 2 | 2 |
| `Toggle/docs` | 1 | 0 |
| `Toggletip` | 2 | 2 |
| `Toggletip/docs` | 1 | 0 |
| `Tooltip` | 3 | 3 |
| `Tooltip/docs` | 2 | 0 |
| `TreeView` | 2 | 2 |
| `TreeView/docs` | 1 | 0 |
| `TruncatedText` | 1 | 1 |
| `UIShell` | 1 | 2 |
| `UnorderedList` | 1 | 1 |
| `UnorderedList/docs` | 1 | 0 |
| `UserAvatar` | 1 | 1 |
