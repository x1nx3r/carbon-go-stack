"use client";

import {
  Button,
  DataTableSkeleton,
  InlineNotification,
  Link,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
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
import { CustomerStatus } from "@/gen/erp/customers/v1/customers_pb";
import { customersClient } from "@/lib/connect";
import { formatDate, formatMoney } from "@/lib/format";
import styles from "./customers-page.module.scss";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZES = [10, 20, 50];

type DeleteTarget = { id: string; name: string };
type Notice = { kind: "success" | "error"; text: string };

const STATUS: Record<
  CustomerStatus,
  { label: string; tag: "green" | "red" | "gray" }
> = {
  [CustomerStatus.UNSPECIFIED]: { label: "Unknown", tag: "gray" },
  [CustomerStatus.ACTIVE]: { label: "Active", tag: "green" },
  [CustomerStatus.ON_HOLD]: { label: "On hold", tag: "red" },
  [CustomerStatus.ARCHIVED]: { label: "Archived", tag: "gray" },
};

export function CustomersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );
  const query = (searchParams.get("q") ?? "").trim();
  const requestedSize = Number.parseInt(searchParams.get("size") ?? "", 10);
  const pageSize = PAGE_SIZES.includes(requestedSize)
    ? requestedSize
    : DEFAULT_PAGE_SIZE;
  const [pending, startTransition] = useTransition();
  const [pendingDelete, setPendingDelete] = useState<DeleteTarget | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: (target: DeleteTarget) =>
      customersClient.deleteCustomer({ id: target.id }),
    onSuccess: async (_, target) => {
      setPendingDelete(null);
      setNotice({ kind: "success", text: `Deleted ${target.name}.` });
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      // The modal stays open; the error is shown inside it, where the user is.
      setNotice(null);
    },
  });

  const result = useQuery({
    queryKey: ["customers", page, pageSize, query],
    queryFn: () =>
      customersClient.listCustomers({ page, pageSize, query }),
  });

  function navigate(next: { page?: number; query?: string; size?: number }) {
    const nextPage = next.page ?? page;
    const nextQuery = next.query ?? query;
    const nextSize = next.size ?? pageSize;
    const params = new URLSearchParams();
    if (nextPage > 1) params.set("page", String(nextPage));
    if (nextQuery) params.set("q", nextQuery);
    if (nextSize !== DEFAULT_PAGE_SIZE) params.set("size", String(nextSize));
    const suffix = params.toString();
    startTransition(() =>
      router.push(suffix ? `${pathname}?${suffix}` : pathname),
    );
  }

  const customers = result.data?.customers ?? [];
  const total = result.data?.total ?? 0;
  const busy = pending || result.isFetching;

  return (
    <>
      {notice ? (
        <InlineNotification
          kind={notice.kind}
          title={notice.text}
          onCloseButtonClick={() => setNotice(null)}
        />
      ) : null}

      <form
        className={styles.search}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          navigate({ page: 1, query: String(data.get("q") ?? "").trim() });
        }}
      >
        <TextInput
          key={query}
          id="customer-search"
          name="q"
          labelText="Search customers"
          placeholder="Name or email"
          defaultValue={query}
        />
        <Button kind="tertiary" type="submit">
          Search
        </Button>
      </form>

      {result.isPending ? (
        <DataTableSkeleton
          columnCount={6}
          rowCount={8}
          showToolbar={false}
        />
      ) : result.isError ? (
        <>
          <InlineNotification
            kind="error"
            title="Could not load customers"
            subtitle={result.error.message}
          />
          <Button
            kind="tertiary"
            className={styles.retry}
            onClick={() => result.refetch()}
          >
            Try again
          </Button>
        </>
      ) : customers.length === 0 ? (
        <Tile className={styles.empty}>
          {total > 0 ? (
            <>
              <h2 className={styles.emptyTitle}>No customers on this page</h2>
              <p className={styles.emptyBody}>
                This page is past the end of the list. Return to the first page.
              </p>
              <Link href="/customers">Go to the first page</Link>
            </>
          ) : (
            <>
              <h2 className={styles.emptyTitle}>
                {query ? "No matching customers" : "No customers yet"}
              </h2>
              <p className={styles.emptyBody}>
                {query
                  ? `Nothing matches “${query}”. Adjust the search or clear it.`
                  : "Create the first customer to see it here."}
              </p>
              <Link href={query ? "/customers" : "/customers/new"}>
                {query ? "Clear search" : "Create the first customer"}
              </Link>
            </>
          )}
        </Tile>
      ) : (
        <>
          <TableContainer
            title={`${total} customer${total === 1 ? "" : "s"}`}
            description={busy ? "Refreshing…" : undefined}
          >
            <div className={styles.tableScroll}>
              <Table className="cds--data-table--visible-overflow-menu">
                <caption className="cds--visually-hidden">Customers</caption>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader className={styles.hideSmall}>Email</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader className={styles.numeric}>Balance</TableHeader>
                    <TableHeader className={styles.hideSmall}>Created</TableHeader>
                    <TableHeader className={styles.actionsHeader}>
                      Actions
                    </TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => {
                    const status = STATUS[customer.status] ?? {
                      label: "Unknown",
                      tag: "gray" as const,
                    };
                    return (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell className={styles.hideSmall}>
                          {customer.email}
                        </TableCell>
                        <TableCell>
                          <Tag type={status.tag}>{status.label}</Tag>
                        </TableCell>
                        <TableCell className={styles.numeric}>
                          {formatMoney(customer.balanceMinor, customer.currency)}
                        </TableCell>
                        <TableCell className={styles.hideSmall}>
                          {formatDate(customer.createdAt)}
                        </TableCell>
                        <TableCell
                          className={`${styles.actionsCell} cds--table-column-menu`}
                        >
                          <OverflowMenu
                            aria-label={`Actions for ${customer.name}`}
                            iconDescription={`Actions for ${customer.name}`}
                            flipped
                          >
                            <OverflowMenuItem
                              itemText="Edit"
                              onClick={() =>
                                router.push(`/customers/${customer.id}/edit`)
                              }
                            />
                            <OverflowMenuItem
                              itemText="Delete"
                              isDelete
                              onClick={() => {
                                remove.reset();
                                setPendingDelete({
                                  id: customer.id,
                                  name: customer.name,
                                });
                              }}
                            />
                          </OverflowMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      <Modal
        open={Boolean(pendingDelete)}
        danger
        modalHeading={
          pendingDelete ? `Delete ${pendingDelete.name}?` : "Delete customer?"
        }
        dangerDescription="Deletes the customer record permanently."
        primaryButtonText={remove.isPending ? "Deleting…" : "Delete customer"}
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
            title="Could not delete the customer"
            subtitle={remove.error.message}
          />
        ) : (
          <p className="cds--modal-content__text">
            This removes the customer record. It cannot be undone.
          </p>
        )}
      </Modal>
    </>
  );
}
