BEGIN;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  account_type text NOT NULL CHECK (account_type IN ('current', 'savings', 'credit', 'cash')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  direction text NOT NULL CHECK (direction IN ('income', 'expense')),
  amount_cents bigint NOT NULL CHECK (amount_cents > 0),
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 60),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 160),
  occurred_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (char_length(category) BETWEEN 1 AND 60),
  month date NOT NULL CHECK (month = date_trunc('month', month)::date),
  limit_cents bigint NOT NULL CHECK (limit_cents > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, category, month)
);

CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON transactions (user_id, occurred_on DESC);
CREATE INDEX IF NOT EXISTS transactions_user_category_idx ON transactions (user_id, category, occurred_on DESC);
CREATE INDEX IF NOT EXISTS budgets_user_month_idx ON budgets (user_id, month);

COMMIT;
