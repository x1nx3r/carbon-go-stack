import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Next + Carbon",
  description: "A Next.js App Router starter with the IBM Carbon Design System.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      {/* Carbon theme class: cds--white, cds--g10, cds--g90, cds--g100. */}
      <body className="cds--white">{children}</body>
    </html>
  );
}
