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

-- Public user accounts. Passwords are stored as PBKDF2-SHA-256 hashes with unique salts.
CREATE TABLE IF NOT EXISTS public_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  mobile TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_public_users_email ON public_users(email);
CREATE INDEX IF NOT EXISTS idx_public_users_mobile ON public_users(mobile);
