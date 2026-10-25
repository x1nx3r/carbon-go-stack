import {
  Column,
  DataTableSkeleton,
  Grid,
  Stack,
  Tile,
} from "@carbon/react";
import { Suspense } from "react";
import { ShowcaseList } from "./assemblies/showcase-list";
import { designCatalog, designGroups } from "./catalog";
import styles from "./design.module.scss";
import { PrimitivesGallery } from "./primitives";

export function DesignPage() {
  return (
    <Stack gap={9}>
      <Tile className={styles.intro}>
        <div className={styles.introCopy}>
          <span className={styles.eyebrow}>Hidden example route</span>
          <h2>Build from this page, not from memory.</h2>
          <p>
            Every primitive and assembly below is approved template vocabulary.
            The route is deliberately absent from product navigation; open{" "}
            <code>/design</code> directly. The landing page at <code>/</code> is
            placeholder copy.
          </p>
        </div>
        <dl className={styles.stats}>
          <div>
            <dt>Entries</dt>
            <dd>{designCatalog.length}</dd>
          </div>
          <div>
            <dt>Groups</dt>
            <dd>{designGroups.length}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>
              <code>web/src/design/catalog.ts</code>
            </dd>
          </div>
        </dl>
      </Tile>

      <section id="catalog" className={styles.section} aria-labelledby="catalog-title">
        <header className={styles.sectionHeader}>
          <h2 id="catalog-title">Catalogue</h2>
          <p>
            The component contract for the template. If a control or assembly is
            not here, add it here and to this page before a product screen uses
            it.
          </p>
        </header>
        {designGroups.map((group) => (
          <div key={group.id} className={styles.catalogGroup}>
            <div className={styles.catalogGroupHeader}>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
            </div>
            <Grid narrow className={styles.catalogGrid}>
              {designCatalog
                .filter((entry) => entry.group === group.id)
                .map((entry) => (
                  <Column key={entry.id} sm={4} md={4} lg={5} xlg={4}>
                    <Tile className={styles.catalogCard}>
                      <div className={styles.catalogCardTop}>
                        <h4>{entry.title}</h4>
                        <span className={styles.entryId}>{entry.id}</span>
                      </div>
                      <p>{entry.description}</p>
                      {entry.states ? (
                        <div className={styles.states}>
                          {entry.states.map((state) => (
                            <span key={state}>{state}</span>
                          ))}
                        </div>
                      ) : null}
                      <code className={styles.source}>{entry.source}</code>
                    </Tile>
                  </Column>
                ))}
            </Grid>
          </div>
        ))}
      </section>

      <section id="primitives" className={styles.section} aria-labelledby="primitives-title">
        <header className={styles.sectionHeader}>
          <h2 id="primitives-title">Primitive gallery</h2>
          <p>
            States, sizes, and composition rules in one place. Each example is
            the same Carbon package the product uses.
          </p>
        </header>
        <PrimitivesGallery />
      </section>

      <section id="assemblies" className={styles.section} aria-labelledby="assemblies-title">
        <header className={styles.sectionHeader}>
          <h2 id="assemblies-title">Live assembly</h2>
          <p>
            One thin vertical wired end to end: contract → Go usecase →
            PostgreSQL → generated Connect client. The list, form, detail, and
            delete dialog below all use live data. Nothing on this page reads a
            mock file.
          </p>
        </header>
        <Suspense
          fallback={
            <div className={styles.tableScroll}>
              <DataTableSkeleton columnCount={6} rowCount={6} showToolbar={false} />
            </div>
          }
        >
          <ShowcaseList />
        </Suspense>
      </section>
    </Stack>
  );
}
