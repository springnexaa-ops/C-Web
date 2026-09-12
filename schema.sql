-- Run this once against your D1 database (Cloudflare dashboard -> D1 -> your DB -> Console,
-- or via `wrangler d1 execute <db-name> --file=schema.sql`)

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_content (key, value) VALUES
  ('home_hero_title', 'Three divisions. One company, based in Kulgam.'),
  ('home_hero_lede', 'Springnexa Private Limited works across healthcare diagnostics and training, IT infrastructure, and social welfare — building things that hold up in each field, not just on paper.'),
  ('division_healthcare_body', 'Diagnostic services and healthcare training programs for the local community in and around Kulgam.'),
  ('division_it_body', 'Website hosting, DNS, and infrastructure management — including the setup running this site.'),
  ('division_social_body', 'Community-facing programs and welfare initiatives based in Kulgam and the surrounding area.'),
  ('contact_email', 'info@springnexa.in'),
  ('contact_phone', '+91 00000 00000');

-- Note: there is no INSERT for the `admins` table here on purpose.
-- Create your one admin account via the one-time POST /api/setup endpoint instead
-- (see README), then delete functions/api/setup.js.
