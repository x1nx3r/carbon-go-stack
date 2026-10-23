import type { Metadata } from "next";
import { Page } from "@/components/page";
import { CustomerForm } from "./_components/customer-form";

export const metadata: Metadata = {
  title: "New customer — ERP",
};

export default function NewCustomerRoute() {
  return (
    <Page
      title="New customer"
      description="Create a customer record. The backend validates the name and email; this form handles field feedback and the request state."
    >
      <CustomerForm />
    </Page>
  );
}
