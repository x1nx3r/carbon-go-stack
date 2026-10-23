import type { Metadata } from "next";
import { DataTableSkeleton } from "@carbon/react";
import { Suspense } from "react";
import { CustomersPage } from "./_components/customers-page";

export const metadata: Metadata = {
  title: "Customers — ERP",
};

export default function Page() {
  return (
    <Suspense
      fallback={<DataTableSkeleton columnCount={5} rowCount={8} showToolbar={false} />}
    >
      <CustomersPage />
    </Suspense>
  );
}
