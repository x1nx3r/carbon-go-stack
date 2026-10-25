import { Column, Grid, Tag, Tile } from "@carbon/react";
import { Page } from "@/components/page";
import styles from "./home.module.scss";

export default function Home() {
  return (
    <Page
      title="Lorem ipsum dolor sit amet"
      description="Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. This landing page is static placeholder copy; the live worked example lives at the hidden design route."
    >
      <Grid narrow className={styles.grid}>
        <Column sm={4} md={4} lg={5}>
          <Tile className={styles.card}>
            <Tag type="gray">Lorem</Tag>
            <h2>Sed do eiusmod tempor</h2>
            <p>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </Tile>
        </Column>
        <Column sm={4} md={4} lg={5}>
          <Tile className={styles.card}>
            <Tag type="gray">Ipsum</Tag>
            <h2>Duis aute irure dolor</h2>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </Tile>
        </Column>
        <Column sm={4} md={8} lg={6}>
          <Tile className={styles.card}>
            <Tag type="gray">Dolor</Tag>
            <h2>At vero eos et accusamus</h2>
            <p>
              Nam libero tempore, cum soluta nobis est eligendi optio cumque
              nihil impedit quo minus id quod maxime placeat facere possimus.
            </p>
          </Tile>
        </Column>
      </Grid>
      <Tile className={styles.banner}>
        <span className={styles.eyebrow}>Template note</span>
        <p>
          The design reference is a working example, not a product screen. Open{" "}
          <code>/design</code> directly when you need to inspect components or
          the live showcase slice.
        </p>
      </Tile>
    </Page>
  );
}
