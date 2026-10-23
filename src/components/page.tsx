import { Column, Grid, Stack } from "@carbon/react";
import type { ReactNode } from "react";
import styles from "./page.module.scss";

/**
 * Page composition. The shell owns the fixed header offset; this component
 * owns the grid, the title block and the vertical rhythm between blocks.
 *
 * Spacing contract (Carbon tokens): the title-to-description stack is step 5
 * (1rem), and the gap between the header, actions and content is step 7
 * (2rem). Pages should not add their own top-level margins.
 */
export function Page({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Grid>
      <Column className={styles.column} sm={4} md={8} lg={16}>
        <Stack gap={7}>
          <Stack gap={5}>
            <h1 className={styles.title}>{title}</h1>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </Stack>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
          {children ? <div className={styles.content}>{children}</div> : null}
        </Stack>
      </Column>
    </Grid>
  );
}
