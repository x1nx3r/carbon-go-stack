"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Column,
  DataTableSkeleton,
  Dropdown,
  FileUploader,
  FormGroup,
  Grid,
  InlineLoading,
  InlineNotification,
  Link,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  RadioButton,
  RadioButtonGroup,
  Search,
  Stack,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListRow,
  StructuredListWrapper,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TextArea,
  TextInput,
  Tile,
  Toggle,
} from "@carbon/react";
import { useState } from "react";
import styles from "./design.module.scss";

const statusItems = ["Active", "On hold", "Archived"];

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <header className={styles.sectionHeader}>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}

export function PrimitivesGallery() {
  const [checked, setChecked] = useState(true);
  const [toggled, setToggled] = useState(true);
  const [radio, setRadio] = useState("active");
  const [status, setStatus] = useState<string>(statusItems[0]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Stack gap={9}>
      <Section
        id="page-shell"
        title="Page shell"
        description="Page owns the title block, the grid, and the fixed-header offset. Put content in Stack steps, never in ad-hoc top margins."
      >
        <Tile className={styles.example}>
          <div className={styles.typeSample}>
            <span className={styles.eyebrow}>Heading 05</span>
            <h3>Page title</h3>
            <p>
              Body 01 explains the task in one or two sentences. Supporting text
              uses the secondary text token.
            </p>
          </div>
          <div className={styles.rule} />
          <p className={styles.note}>
            <code>Page</code> → <code>Stack gap=7</code> →{" "}
            <code>Stack gap=5</code>. Commands belong in the page actions slot.
          </p>
        </Tile>
      </Section>

      <Section
        id="buttons"
        title="Buttons"
        description="One primary action per region. Secondary is an alternative; tertiary and ghost are low emphasis; danger is destructive."
      >
        <div className={styles.wrap}>
          <Button kind="primary">Primary</Button>
          <Button kind="secondary">Secondary</Button>
          <Button kind="tertiary">Tertiary</Button>
          <Button kind="ghost">Ghost</Button>
          <Button kind="danger">Danger</Button>
          <Button kind="primary" disabled>
            Disabled
          </Button>
          <Button kind="primary" size="sm">
            Small
          </Button>
          <Button kind="primary" size="lg">
            Large
          </Button>
        </div>
        <p className={styles.note}>
          Labels are verbs and describe the result: “Create item”, not “Submit”.
          A disabled button needs an adjacent explanation.
        </p>
      </Section>

      <Section
        id="links"
        title="Links"
        description="Links navigate. Buttons mutate. Do not use a link to submit a form or delete a record."
      >
        <div className={styles.wrap}>
          <Link href="#buttons">Internal link</Link>
          <Link href="#inputs" renderIcon={() => null}>
            Link with icon slot
          </Link>
          <Link href="#buttons" disabled>
            Disabled link
          </Link>
        </div>
      </Section>

      <Section
        id="inputs"
        title="Text inputs"
        description="Always show a visible label. Helper text explains format; invalid text explains the fix. Required fields are marked."
      >
        <Grid narrow>
          <Column sm={4} md={4} lg={8}>
            <Stack gap={5}>
              <TextInput
                id="design-title"
                labelText="Title"
                placeholder="A short record title"
                helperText="Up to 120 characters."
              />
              <TextInput
                id="design-currency"
                labelText="Currency"
                defaultValue="USD"
                maxLength={3}
              />
              <TextInput
                id="design-invalid"
                labelText="Invalid example"
                defaultValue="US"
                invalid
                invalidText="Use a three-letter currency code."
              />
              <TextInput
                id="design-disabled"
                labelText="Disabled"
                defaultValue="Read only value"
                disabled
              />
            </Stack>
          </Column>
          <Column sm={4} md={4} lg={8}>
            <TextArea
              id="design-description"
              labelText="Description"
              placeholder="What should someone know before acting?"
              helperText="Optional. Up to 1000 characters."
              rows={6}
            />
          </Column>
        </Grid>
      </Section>

      <Section
        id="selection"
        title="Selection controls"
        description="Checkboxes allow independent choices. Toggles apply a state immediately. Radio buttons choose one option from a short set."
      >
        <Grid narrow>
          <Column sm={4} md={2} lg={5}>
            <FormGroup legendText="Checkboxes">
              <Stack gap={3}>
                <Checkbox
                  id="design-check"
                  labelText="Include archived items"
                  checked={checked}
                  onChange={(_event, { checked: next }) => setChecked(next)}
                />
                <Checkbox
                  id="design-check-disabled"
                  labelText="Disabled"
                  disabled
                />
              </Stack>
            </FormGroup>
          </Column>
          <Column sm={4} md={3} lg={5}>
            <FormGroup legendText="Toggle">
              <Toggle
                id="design-toggle"
                labelText="Email notifications"
                labelA="Off"
                labelB="On"
                toggled={toggled}
                onToggle={setToggled}
              />
            </FormGroup>
          </Column>
          <Column sm={4} md={3} lg={6}>
            <RadioButtonGroup
              legendText="Status"
              name="design-status"
              value={radio}
              onChange={(value) => setRadio(String(value))}
            >
              <RadioButton labelText="Active" value="active" id="radio-active" />
              <RadioButton
                labelText="On hold"
                value="on_hold"
                id="radio-hold"
              />
              <RadioButton
                labelText="Archived"
                value="archived"
                id="radio-archived"
              />
            </RadioButtonGroup>
          </Column>
        </Grid>
      </Section>

      <Section
        id="dropdown"
        title="Dropdown"
        description="Use for one choice from a small set. Keep the label stable; the selected value is the state."
      >
        <Grid narrow>
          <Column sm={4} md={4} lg={8}>
            <Dropdown
              id="design-status-dropdown"
              titleText="Status"
              label="Choose a status"
              items={statusItems}
              selectedItem={status}
              itemToString={(item) => (item ? String(item) : "")}
              onChange={({ selectedItem }) =>
                setStatus(String(selectedItem ?? statusItems[0]))
              }
            />
          </Column>
          <Column sm={4} md={4} lg={8}>
            <Dropdown
              id="design-disabled-dropdown"
              titleText="Disabled"
              label="Choose a status"
              items={statusItems}
              disabled
            />
          </Column>
        </Grid>
      </Section>

      <Section
        id="search"
        title="Search"
        description="Search filters a list in place. Put the value in URL state when it changes the query; provide a clear action."
      >
        <form
          className={styles.toolbar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Search
            id="design-search"
            labelText="Search the catalogue"
            placeholder="Title, owner, or tag"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Button kind="tertiary" type="submit">
            Search
          </Button>
          {search ? (
            <Button kind="ghost" type="button" onClick={() => setSearch("")}>
              Clear
            </Button>
          ) : null}
        </form>
        <p className={styles.note}>
          {search ? `Searching for “${search}”.` : "No search applied."}
        </p>
      </Section>

      <Section
        id="upload"
        title="File upload"
        description="Use the uploader for a named file. Show edit, upload, success, or error state on the file row; never only a page spinner."
      >
        <Tile className={styles.example}>
          <FileUploader
            labelTitle="Attach a supporting file"
            labelDescription="PDF or PNG, up to 10 MB."
            buttonLabel="Add file"
            filenameStatus="edit"
            accept={[".pdf", ".png"]}
            multiple={false}
          />
        </Tile>
      </Section>

      <Section
        id="feedback"
        title="Feedback"
        description="Place feedback next to the action that caused it. Use an inline notification for persistent context and a toast for transient confirmation."
      >
        <Stack gap={5}>
          <InlineNotification
            kind="info"
            title="Information"
            subtitle="The design slice uses live backend data."
          />
          <InlineNotification
            kind="success"
            title="Saved"
            subtitle="The showcase item was updated."
          />
          <InlineNotification
            kind="warning"
            title="Check the filter"
            subtitle="Archived items are hidden by default."
          />
          <InlineNotification
            kind="error"
            title="Could not save"
            subtitle="The server rejected the request. Keep the form open."
          />
        </Stack>
      </Section>

      <Section
        id="loading"
        title="Loading"
        description="Skeletons preserve the page shape on first load. Inline loading belongs to one action; do not replace visible content with a spinner."
      >
        <Stack gap={7}>
          <Tile className={styles.example}>
            <div className={styles.tableScroll}>
              <DataTableSkeleton
                columnCount={4}
                rowCount={3}
                showToolbar={false}
              />
            </div>
          </Tile>
          <div className={styles.wrap}>
            <InlineLoading status="active" description="Saving…" />
            <InlineLoading status="finished" description="Saved" />
            <InlineLoading status="error" description="Could not save" />
          </div>
        </Stack>
      </Section>

      <Section
        id="data-display"
        title="Tags, tiles, and structured lists"
        description="Tags carry short status or category labels. Tiles group summaries. Structured lists show read-only detail without a table."
      >
        <div className={styles.wrap}>
          <Tag type="green">Active</Tag>
          <Tag type="red">On hold</Tag>
          <Tag type="gray">Archived</Tag>
          <Tag type="blue">Backend</Tag>
          <Tag type="purple">Design</Tag>
        </div>
        <Grid narrow className={styles.cardGrid}>
          <Column sm={4} md={4} lg={5}>
            <Tile className={styles.card}>
              <span className={styles.eyebrow}>Summary</span>
              <h3>10 items</h3>
              <p>Three statuses, one live list.</p>
            </Tile>
          </Column>
          <Column sm={4} md={4} lg={5}>
            <Tile className={styles.card}>
              <span className={styles.eyebrow}>Next action</span>
              <h3>Review the queue</h3>
              <p>Use a clear verb in the action label.</p>
            </Tile>
          </Column>
          <Column sm={4} md={8} lg={6}>
            <StructuredListWrapper aria-label="Read-only example">
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Field</StructuredListCell>
                  <StructuredListCell head>Value</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                <StructuredListRow>
                  <StructuredListCell noWrap>Owner</StructuredListCell>
                  <StructuredListCell>Platform</StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell noWrap>Status</StructuredListCell>
                  <StructuredListCell>
                    <Tag type="green">Active</Tag>
                  </StructuredListCell>
                </StructuredListRow>
                <StructuredListRow>
                  <StructuredListCell noWrap>Updated</StructuredListCell>
                  <StructuredListCell>26 Oct 2026</StructuredListCell>
                </StructuredListRow>
              </StructuredListBody>
            </StructuredListWrapper>
          </Column>
        </Grid>
      </Section>

      <Section
        id="navigation"
        title="Tabs, breadcrumbs, and overflow"
        description="Tabs switch views within one page. Breadcrumbs show hierarchy. Overflow hides secondary row actions without dropping them."
      >
        <Breadcrumb aria-label="Breadcrumb example">
          <BreadcrumbItem href="#page-shell">Design</BreadcrumbItem>
          <BreadcrumbItem href="#navigation" isCurrentPage>
            Navigation
          </BreadcrumbItem>
        </Breadcrumb>
        <Tabs>
          <TabList aria-label="Example tabs">
            <Tab>Overview</Tab>
            <Tab>Usage</Tab>
            <Tab disabled>Disabled</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <p className={styles.note}>
                Use tabs for peer views, not for steps in a form.
              </p>
            </TabPanel>
            <TabPanel>
              <p className={styles.note}>
                Keep the tab label short. The selected tab is the URL state when
                the view is directly linkable.
              </p>
            </TabPanel>
            <TabPanel>
              <p className={styles.note}>Disabled tab content.</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <div className={styles.wrap}>
          <OverflowMenu aria-label="Example actions" iconDescription="Actions">
            <OverflowMenuItem itemText="View details" />
            <OverflowMenuItem itemText="Edit" />
            <OverflowMenuItem itemText="Delete" isDelete />
          </OverflowMenu>
          <Pagination
            page={page}
            pageSize={10}
            pageSizes={[10, 20, 50]}
            totalItems={42}
            onChange={({ page: nextPage }) => setPage(nextPage)}
          />
        </div>
      </Section>

      <Section
        id="dialog"
        title="Dialog"
        description="A modal focuses one task. A danger modal names the target and the consequence; Cancel keeps focus and is the safe default."
      >
        <div className={styles.wrap}>
          <Button kind="primary" onClick={() => setModalOpen(true)}>
            Open transactional modal
          </Button>
          <Button kind="danger" onClick={() => setModalOpen(true)}>
            Open danger modal
          </Button>
        </div>
        <Modal
          open={modalOpen}
          modalHeading="Example dialog"
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          onRequestClose={() => setModalOpen(false)}
          onRequestSubmit={() => setModalOpen(false)}
        >
          <p className="cds--modal-content__text">
            Keep the body short. The primary action repeats the verb from the
            trigger.
          </p>
        </Modal>
      </Section>
    </Stack>
  );
}
