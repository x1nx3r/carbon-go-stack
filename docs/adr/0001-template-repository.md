# ADR-0001: The template is one repository with a design slice

Status: accepted · Date: 2026-10-26

## Context

This repository is a scaffold, not a product. An agent using it needs a
worked example that shows three things at once:

1. how the repository is structured;
2. how the web and backend layers fit together;
3. what the house UI looks like in its real states.

The Customers slice was a clean CRUD example, but it only showed one domain
shape. Agents copied it literally, and the UI reference material was not part
of the working path. A design reference that is executable and connected to a
narrow backend slice teaches the same layers without asking the agent to
generalise from a customer record.

The template stays one repository. The environment image stays separate. The
contract stays canonical. Those are not negotiable.

## Decision

### 1. One repository, three trees

The template is one repository:

```text
web/          Next.js + Carbon
api/          Go, hexagonal, Connect
contract/     canonical protobuf
docs/         template decisions and visual baselines
```

`web/` and `api/` are directories, not repositories. There are no submodules
or pins inside the template. `contract/` is the only contract; both sides
generate from it. The image supplies the environment; the repository supplies
the source.

### 2. The landing page is static placeholder copy

`/` is a landing page with lorem-ipsum copy. It demonstrates the page shell,
typography, spacing, grid, and tiles. It does not read business data and it is
not the product.

The shell has no product navigation. A template user starts from a clean
landing page and adds the navigation their product needs.

### 3. `/design` is the worked example

The design reference lives at `/design`. It is directly accessible but has no
navigation entry. It is for the agent and the template author, not for product
users.

The first thing an agent reads before changing UI is:

```text
web/src/design/catalog.ts
```

The catalogue names every approved primitive and assembly, its source file,
the states it covers, when to use it, and when not to. The `/design` route
renders those same examples. The source files are the copy targets; the route
is the visual proof.

The reference covers the **approved set**, not every Carbon export. The
official Carbon documentation remains the exhaustive reference and the
catalogue links to it.

### 4. The design slice has one live backend

The list, detail, create, edit, and delete assemblies use one narrow vertical
slice through the real backend:

```text
ShowcaseService
  ListShowcaseItems   (paged, filtered)
  GetShowcaseItem
  CreateShowcaseItem
  UpdateShowcaseItem
  DeleteShowcaseItem
```

`ShowcaseItem` is deliberately a demo entity: title, description, status,
owner, amount, tags, done, and timestamps. It exercises the contract,
entity–port–usecase–adapter–handler tower, Postgres migration, seed, and the
generated Connect client. It is not a second product domain.

Pure primitives (buttons, inputs, notifications, dialogs, tabs, skeletons)
use local state or static fixture data. They do not require the backend. This
keeps the gallery usable without a running API.

### 5. The Customers slice is replaced

The Customers slice is removed from the web tree, contract, backend, seed,
tests, navigation, and visual baselines once the design slice passes the full
gate. It is not kept as a parallel example.

The design slice is the only worked example. A new screen copies the nearest
design assembly and adds its own domain; it does not copy a customer record.

### 6. Documentation is reference, not the first source

`web/docs/carbon/` remains as a reference for Carbon details, accessibility,
and patterns. It is not the primary agent path. The root and web `AGENTS.md`
files point to `src/design/catalog.ts` and `/design` first, and to the docs
second.

## Consequences

- The agent has a concrete list and source files to copy, instead of a
  single CRUD slice plus a large external reference.
- The landing page gives the shell a real surface without inventing a product
  domain.
- The hidden design route keeps demo screens out of product navigation while
  keeping them reachable for agents.
- The backend still has one complete worked example, so backend behaviour is
  demonstrated, not described.
- Deleting Customers removes the old example everywhere; this is a
  deliberate loss of a second sample, not an accidental gap.
- The design catalogue must be maintained with the code. A new primitive or
  assembly is not approved until it appears there.

## Out of scope

- Every Carbon component. The catalogue is the approved template vocabulary;
  Carbon owns the exhaustive one.
- A design system package separate from this repository.
- Product navigation, authentication, or a real business domain in the
  landing page.
- Keeping Customers as a historical example in the template.
