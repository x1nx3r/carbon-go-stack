import type { Metadata } from "next";
import { InlineLoading } from "@carbon/react";
import { Suspense } from "react";
import { Page } from "@/components/page";
import { EditCustomerForm } from "./_components/edit-customer-form";

export const metadata: Metadata = {
  title: "Edit customer — ERP",
};

export default function EditCustomerRoute() {
  return (
    <Page
      title="Edit customer"
      description="Update the customer record. The same field rules and validation as create apply."
    >
      <Suspense fallback={<InlineLoading description="Loading customer…" />}>
        <EditCustomerForm />
      </Suspense>
    </Page>
  );
}
