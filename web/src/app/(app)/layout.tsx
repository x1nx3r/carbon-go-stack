import { Header, HeaderName } from "@carbon/react";
import type { ReactNode } from "react";
import styles from "./layout.module.scss";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className={styles.skip} href="#main">
        Skip to main content
      </a>
      <Header aria-label="ERP">
        <HeaderName href="/" prefix="">
          ERP
        </HeaderName>
      </Header>
      <main id="main" className={styles.main}>
        {children}
      </main>
    </>
  );
}
