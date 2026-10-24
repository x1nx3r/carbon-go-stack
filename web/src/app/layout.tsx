import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "ERP",
  description: "A Next.js and Carbon ERP starter with a Connect backend.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      {/* Carbon theme class: cds--white, cds--g10, cds--g90, cds--g100. */}
      <body className="cds--white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
