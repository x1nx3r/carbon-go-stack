import { Button, Column, Grid } from "@carbon/react";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <Grid>
      <Column sm={4} md={8} lg={12}>
        <h1 className={styles.title}>Operations</h1>
        <p className={styles.lede}>
          This is the web half of the ERP template: Next.js, Carbon and a
          generated Connect client. The dashboard is a shell; the first real
          slice is the customer list.
        </p>
        <Button as="a" href="/customers">
          Open customers
        </Button>
      </Column>
    </Grid>
  );
}
