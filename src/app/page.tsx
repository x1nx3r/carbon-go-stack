import { Button, Column, Grid, Tag, Tile } from "@carbon/react";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <Grid>
        <Column sm={4} md={8} lg={12}>
          <Tag type="green">Next.js 16 · Carbon 11</Tag>
          <h1 className={styles.title}>Start with the system, not a blank page.</h1>
          <p className={styles.lede}>
            A Next.js App Router starter that already speaks Carbon: tokens, type
            styles, spacing and React components. Replace this page, keep the
            foundation.
          </p>
          <div className={styles.actions}>
            <Button>Get started</Button>
            <Button kind="tertiary">Read the docs</Button>
          </div>
        </Column>
        <Column sm={4} md={8} lg={4}>
          <Tile className={styles.tile}>
            <p className={styles.tileLabel}>Included</p>
            <ul className={styles.list}>
              <li>Carbon React components</li>
              <li>Carbon styles and tokens</li>
              <li>TypeScript, App Router, Sass</li>
            </ul>
          </Tile>
        </Column>
      </Grid>
    </main>
  );
}
