CREATE TABLE showcase_items (
    id           text PRIMARY KEY,
    title        text NOT NULL,
    description  text NOT NULL DEFAULT '',
    status       smallint NOT NULL DEFAULT 1,
    owner        text NOT NULL DEFAULT '',
    amount_minor bigint NOT NULL DEFAULT 0,
    currency     char(3) NOT NULL DEFAULT 'USD',
    tags         text[] NOT NULL DEFAULT '{}',
    done         boolean NOT NULL DEFAULT false,
    created_at   timestamptz NOT NULL,
    updated_at   timestamptz NOT NULL
);

CREATE INDEX showcase_items_updated_at_idx ON showcase_items (updated_at DESC, id);
CREATE INDEX showcase_items_status_idx ON showcase_items (status);
CREATE INDEX showcase_items_title_lower_idx ON showcase_items (lower(title));
