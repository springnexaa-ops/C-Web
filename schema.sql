-- Optional D1 schema for public site content.
-- The legacy browser admin console and its admin account table are no longer part of C-Web.

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO site_content (key, value) VALUES
  ('home_hero_title', 'Building healthier communities with technology & care.'),
  ('home_hero_lede', 'Integrated solutions in Healthcare, Information Technology and Social Welfare for a better tomorrow.'),
  ('contact_email', 'info@springnexa.in'),
  ('contact_phone', '+91 7006318286');