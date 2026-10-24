CREATE TABLE customers (
    id            text PRIMARY KEY,
    name          text NOT NULL,
    email         text NOT NULL,
    status        smallint NOT NULL DEFAULT 1,
    balance_minor bigint NOT NULL DEFAULT 0,
    currency      char(3) NOT NULL DEFAULT 'USD',
    created_at    timestamptz NOT NULL
);

CREATE INDEX customers_created_at_idx ON customers (created_at DESC, id);
CREATE INDEX customers_name_lower_idx ON customers (lower(name));
CREATE INDEX customers_email_lower_idx ON customers (lower(email));
