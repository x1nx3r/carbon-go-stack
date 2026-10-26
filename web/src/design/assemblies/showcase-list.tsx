"use client";

import {
  Button,
  DataTableSkeleton,
  Dropdown,
  InlineNotification,
  Link,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  TextInput,
  Tile,
} from "@carbon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { ShowcaseItem } from "@/gen/erp/showcase/v1/showcase_pb";
import { showcaseClient } from "@/lib/connect";
import { formatDate, formatMoney } from "@/lib/format";
import { statusLabel, statusTag, statusFromFilter, filterFromParam, statusOptions, type StatusFilter } from "../showcase-utils";
import styles from "../design.module.scss";
import { ShowcaseFormModal } from "./showcase-form";
import { ShowcaseDetailModal } from "./showcase-detail";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZES = [10, 20, 50];

type Notice = { kind: "success" | "error"; text: string };
type DeleteTarget = { id: string; title: string };

export function ShowcaseList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<ShowcaseItem | "new" | null>(null);
  const [viewing, setViewing] = useState<ShowcaseItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DeleteTarget | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );
  const query = (searchParams.get("q") ?? "").trim();
  const statusFilter = filterFromParam(searchParams.get("status"));
  const requestedSize = Number.parseInt(searchParams.get("size") ?? "", 10);
  const pageSize = PAGE_SIZES.includes(requestedSize)
    ? requestedSize
    : DEFAULT_PAGE_SIZE;

  const remove = useMutation({
    mutationFn: (target: DeleteTarget) =>
      showcaseClient.deleteShowcaseItem({ id: target.id }),
    onSuccess: async (_, target) => {
      setPendingDelete(null);
      setNotice({ kind: "success", text: `Deleted “${target.title}”.` });
      await queryClient.invalidateQueries({ queryKey: ["showcase"] });
    },
    onError: () => setNotice(null),
  });

  const result = useQuery({
    queryKey: ["showcase", page, pageSize, query, statusFilter],
    queryFn: () =>
      showcaseClient.listShowcaseItems({
        page,
        pageSize,
        query,
        status: statusFromFilter(statusFilter),
      }),
  });

  function navigate(next: {
    page?: number;
    query?: string;
    size?: number;
    status?: StatusFilter;
  }) {
    const nextPage = next.page ?? page;
    const nextQuery = next.query ?? query;
    const nextSize = next.size ?? pageSize;
    const nextStatus = next.status ?? statusFilter;
    const params = new URLSearchParams();
    if (nextPage > 1) params.set("page", String(nextPage));
    if (nextQuery) params.set("q", nextQuery);
    if (nextSize !== DEFAULT_PAGE_SIZE) params.set("size", String(nextSize));
    if (nextStatus !== "all") params.set("status", nextStatus);
    const suffix = params.toString();
    startTransition(() =>
      router.push(suffix ? `${pathname}?${suffix}` : pathname),
    );
  }

  async function saved(message: string) {
    setEditing(null);
    setNotice({ kind: "success", text: message });
    await queryClient.invalidateQueries({ queryKey: ["showcase"] });
  }

  const items = result.data?.items ?? [];
  const total = result.data?.total ?? 0;
  const busy = pending || result.isFetching;
  const selectedStatus =
    statusOptions.find((option) => option.value === statusFilter) ??
    statusOptions[0];

  return (
    <div id="showcase-list" className={styles.listSection}>
      <div className={styles.listToolbar}>
        <form
          className={styles.searchForm}
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            navigate({ page: 1, query: String(data.get("q") ?? "").trim() });
          }}
        >
          <TextInput
            key={query}
            id="showcase-search"
            name="q"
            labelText="Search items"
            placeholder="Title or owner"
            defaultValue={query}
          />
          <Button kind="tertiary" type="submit">
            Search
          </Button>
        </form>
        <div className={styles.filter}>
          <Dropdown
            id="showcase-status-filter"
            titleText="Status"
            label="All statuses"
            items={statusOptions}
            selectedItem={selectedStatus}
            itemToString={(option) => (option ? option.label : "")}
            onChange={({ selectedItem }) => {
              if (!selectedItem) return;
              navigate({
                page: 1,
                status: selectedItem.value as StatusFilter,
              });
            }}
          />
        </div>
        <Button kind="primary" onClick={() => setEditing("new")}>
          Create item
        </Button>
      </div>

      {notice ? (
        <InlineNotification
          kind={notice.kind}
          title={notice.text}
          onCloseButtonClick={() => setNotice(null)}
        />
      ) : null}

      {result.isPending ? (
        <div className={styles.tableScroll}>
          <DataTableSkeleton columnCount={6} rowCount={8} showToolbar={false} />
        </div>
      ) : result.isError ? (
        <Stack gap={5}>
          <InlineNotification
            kind="error"
            title="Could not load showcase items"
            subtitle={result.error.message}
          />
          <div>
            <Button kind="tertiary" onClick={() => result.refetch()}>
              Try again
            </Button>
          </div>
        </Stack>
      ) : items.length === 0 ? (
        <Tile className={styles.empty}>
          <h3>{query || statusFilter !== "all" ? "No matching items" : "No items yet"}</h3>
          <p>
            {query || statusFilter !== "all"
              ? "Adjust the search or clear the status filter."
              : "Create the first showcase item to exercise the live slice."}
          </p>
          {query || statusFilter !== "all" ? (
            <Link href="/design">Clear filters</Link>
          ) : (
            <Button kind="tertiary" onClick={() => setEditing("new")}>
              Create the first item
            </Button>
          )}
        </Tile>
      ) : (
        <>
          <TableContainer
            title={`${total} showcase item${total === 1 ? "" : "s"}`}
            description={busy ? "Refreshing…" : undefined}
          >
            <div className={styles.tableScroll}>
              <Table className="cds--data-table--visible-overflow-menu">
                <caption className="cds--visually-hidden">Showcase items</caption>
                <TableHead>
                  <TableRow>
                    <TableHeader>Item</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader className={styles.hideSmall}>Owner</TableHeader>
                    <TableHeader className={styles.numeric}>Amount</TableHeader>
                    <TableHeader className={styles.hideSmall}>Updated</TableHeader>
                    <TableHeader className={styles.actionsHeader} aria-label="Actions">
                      <span className={styles.actionsLabel}>Actions</span>
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className={styles.itemCell}>
                          <strong>{item.title}</strong>
                          <span className={styles.itemMeta}>
                            {item.tags.length > 0 ? item.tags.slice(0, 2).join(" · ") : item.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tag type={statusTag(item.status)}>{statusLabel(item.status)}</Tag>
                      </TableCell>
                      <TableCell className={styles.hideSmall}>{item.owner || "Unassigned"}</TableCell>
                      <TableCell className={styles.numeric}>
                        {formatMoney(item.amountMinor, item.currency)}
                      </TableCell>
                      <TableCell className={styles.hideSmall}>{formatDate(item.updatedAt)}</TableCell>
                      <TableCell className={`${styles.actionsCell} cds--table-column-menu`}>
                        <OverflowMenu
                          aria-label={`Actions for ${item.title}`}
                          iconDescription={`Actions for ${item.title}`}
                          flipped
                        >
                          <OverflowMenuItem itemText="View" onClick={() => setViewing(item)} />
                          <OverflowMenuItem itemText="Edit" onClick={() => setEditing(item)} />
                          <OverflowMenuItem
                            itemText="Delete"
                            isDelete
                            onClick={() => {
                              remove.reset();
                              setPendingDelete({ id: item.id, title: item.title });
                            }}
                          />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
          <Pagination
            className={styles.pagination}
            page={page}
            pageSize={pageSize}
            pageSizes={PAGE_SIZES}
            totalItems={total}
            onChange={({ page: nextPage, pageSize: nextSize }) =>
              navigate({
                page: nextSize !== pageSize ? 1 : nextPage,
                size: nextSize,
              })
            }
          />
        </>
      )}

      <ShowcaseFormModal
        key={editing === "new" ? "new" : (editing?.id ?? "closed")}
        open={editing !== null}
        item={editing === "new" ? null : editing}
        onClose={() => setEditing(null)}
        onSaved={saved}
      />
      <ShowcaseDetailModal item={viewing} onClose={() => setViewing(null)} />

      <Modal
        open={Boolean(pendingDelete)}
        danger
        modalHeading={pendingDelete ? `Delete “${pendingDelete.title}”?` : "Delete item?"}
        dangerDescription="Deletes the showcase item permanently."
        primaryButtonText={remove.isPending ? "Deleting…" : "Delete item"}
        primaryButtonDisabled={remove.isPending}
        secondaryButtonText="Cancel"
        onRequestClose={() => {
          setPendingDelete(null);
          remove.reset();
        }}
        onRequestSubmit={() => {
          if (pendingDelete && !remove.isPending) remove.mutate(pendingDelete);
        }}
      >
        {remove.isError ? (
          <InlineNotification
            kind="error"
            title="Could not delete the item"
            subtitle={remove.error.message}
          />
        ) : (
          <p className="cds--modal-content__text">
            This removes the record from the live showcase table. It cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
