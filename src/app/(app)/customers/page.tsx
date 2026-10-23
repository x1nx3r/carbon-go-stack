import type { Metadata } from "next";
import { Button, DataTableSkeleton } from "@carbon/react";
import { Suspense } from "react";
import { Page } from "@/components/page";
import { CustomersPage } from "./_components/customers-page";

export const metadata: Metadata = {
  title: "Customers — ERP",
};

export default function CustomersRoute() {
  return (
    <Page
      title="Customers"
      description="A neutral ERP slice: search, pagination and a Carbon table. Data arrives over Connect through the BFF; the page itself is a shell."
      actions={
        <Button as="a" href="/customers/new">
          New customer
        </Button>
      }
    >
      <Suspense
        fallback={
          <DataTableSkeleton columnCount={5} rowCount={8} showToolbar={false} />
        }
      >
        <CustomersPage />
      </Suspense>
    </Page>
  );
}
