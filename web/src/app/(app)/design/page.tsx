import { Page } from "@/components/page";
import { DesignPage } from "@/design/design-page";

export default function DesignRoute() {
  return (
    <Page
      title="Design reference"
      description="The template's approved Carbon vocabulary and one live vertical slice. This route is hidden from product navigation and is safe to keep as the worked example."
    >
      <DesignPage />
    </Page>
  );
}
