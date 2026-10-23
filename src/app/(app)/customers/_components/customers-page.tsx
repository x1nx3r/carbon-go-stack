"use client";

import {
  Button,
  DataTableSkeleton,
  InlineNotification,
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
} from "@carbon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CustomerStatus } from "@/gen/erp/customers/v1/customers_pb";
import { customersClient } from "@/lib/connect";
import { formatDate, formatMoney } from "@/lib/format";
import styles from "./customers-page.module.scss";

const PAGE_SIZE = 20;
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
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const query = (searchParams.get("q") ?? "").trim();
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
    onError: (error) => {
      setNotice({ kind: "error", text: error.message });
    },
  });

  const result = useQuery({
    queryKey: ["customers", page, query],
    queryFn: () =>
      customersClient.listCustomers({ page, pageSize: PAGE_SIZE, query }),
  });

  function navigate(next: { page?: number; query?: string }) {
    const nextPage = next.page ?? page;
    const nextQuery = next.query ?? query;
    const params = new URLSearchParams();
    if (nextPage > 1) params.set("page", String(nextPage));
    if (nextQuery) params.set("q", nextQuery);
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
          <Button type="submit">Search</Button>
        </form>

        {result.isPending ? (
          <DataTableSkeleton
            columnCount={6}
            rowCount={8}
            showToolbar={false}
          />
        ) : result.isError ? (
          <InlineNotification
            kind="error"
            title="Could not load customers"
            subtitle={result.error.message}
          />
        ) : customers.length === 0 ? (
          <InlineNotification
            kind="info"
            title="No customers"
            subtitle={
              query
                ? `Nothing matches “${query}”.`
                : "Create the first customer in the backend, or seed the mock."
            }
          />
        ) : (
          <>
            <TableContainer
              title={`${total} customer${total === 1 ? "" : "s"}`}
              description={busy ? "Refreshing…" : undefined}
            >
              <div className={styles.tableScroll}>
                <Table className="cds--data-table--visible-overflow-menu">
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader className={styles.hideSmall}>Email</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Balance</TableHeader>
                    <TableHeader className={styles.hideSmall}>Created</TableHeader>
                    <TableHeader className={styles.actionsHeader}>Actions</TableHeader>
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
                        <TableCell className={styles.hideSmall}>{customer.email}</TableCell>
                        <TableCell>
                          <Tag type={status.tag}>{status.label}</Tag>
                        </TableCell>
                        <TableCell>
                          {formatMoney(customer.balanceMinor, customer.currency)}
                        </TableCell>
                        <TableCell className={styles.hideSmall}>{formatDate(customer.createdAt)}</TableCell>
                        <TableCell className={`${styles.actionsCell} cds--table-column-menu`}>
                          <OverflowMenu
                            aria-label={`Actions for ${customer.name}`}
                            flipped
                            size="sm"
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
                              onClick={() =>
                                setPendingDelete({
                                  id: customer.id,
                                  name: customer.name,
                                })
                              }
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
              pageSize={PAGE_SIZE}
              pageSizes={PAGE_SIZES}
              totalItems={total}
              onChange={({ page: nextPage }) => navigate({ page: nextPage })}
            />
          </>
        )}

      <Modal
        open={Boolean(pendingDelete)}
        danger
        modalHeading={
          pendingDelete ? `Delete ${pendingDelete.name}?` : "Delete customer?"
        }
        primaryButtonText={remove.isPending ? "Deleting…" : "Delete"}
        primaryButtonDisabled={remove.isPending}
        secondaryButtonText="Cancel"
        onRequestClose={() => setPendingDelete(null)}
        onRequestSubmit={() => {
          if (pendingDelete && !remove.isPending) remove.mutate(pendingDelete);
        }}
      >
        <p className="cds--modal-content__text">
          This removes the customer record. It cannot be undone.
        </p>
      </Modal>
    </>
  );
}
