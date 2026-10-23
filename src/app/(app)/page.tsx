import { Button } from "@carbon/react";
import { Page } from "@/components/page";

export default function Home() {
  return (
    <Page
      title="Operations"
      description="This is the web half of the ERP template: Next.js, Carbon and a generated Connect client. The dashboard is a shell; the first real slice is the customer list."
      actions={
        <Button as="a" href="/customers">
          Open customers
        </Button>
      }
    />
  );
}
