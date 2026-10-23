"use client";

import {
  Button,
  Column,
  DataTableSkeleton,
  Grid,
  InlineNotification,
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
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CustomerStatus } from "@/gen/erp/customers/v1/customers_pb";
import { customersClient } from "@/lib/connect";
import { formatDate, formatMoney } from "@/lib/format";
import styles from "./customers-page.module.scss";

const PAGE_SIZE = 20;
const PAGE_SIZES = [10, 20, 50];

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
    <Grid>
      <Column sm={4} md={8} lg={16}>
        <div className={styles.header}>
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.lede}>
            A neutral ERP slice: search, pagination and a Carbon table. Data
            arrives over Connect through the BFF; the page itself is a shell.
          </p>
        </div>

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
            columnCount={5}
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Balance</TableHeader>
                    <TableHeader>Created</TableHeader>
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
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>
                          <Tag type={status.tag}>{status.label}</Tag>
                        </TableCell>
                        <TableCell>
                          {formatMoney(customer.balanceMinor, customer.currency)}
                        </TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
      </Column>
    </Grid>
  );
}
