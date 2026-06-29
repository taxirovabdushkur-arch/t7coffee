-- ============================================================
-- T7 Coffee — Supabase PostgreSQL Migration
-- Все таблицы перенесены из SQLite (better-sqlite3)
-- ============================================================

-- ── MENU ITEMS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT DEFAULT '',
  price       TEXT NOT NULL,
  price_num   INTEGER DEFAULT 0,
  icon        TEXT DEFAULT '☕',
  image_url   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  address    TEXT DEFAULT '',
  floor      TEXT DEFAULT '',
  comment    TEXT DEFAULT '',
  payment    TEXT DEFAULT 'cash',
  items      TEXT DEFAULT '[]',
  status     TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── CONTACTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  message    TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── EMPLOYEES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS employees (
  id              SERIAL PRIMARY KEY,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  position        TEXT DEFAULT '',
  phone           TEXT DEFAULT '',
  email           TEXT DEFAULT '',
  hire_date       TEXT DEFAULT '',
  status          TEXT DEFAULT 'active',
  avatar_url      TEXT DEFAULT '',
  role            TEXT DEFAULT 'employee',
  tasks_done      INTEGER DEFAULT 0,
  requests_done   INTEGER DEFAULT 0,
  last_active     TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── EMPLOYEE MESSAGES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS employee_messages (
  id         SERIAL PRIMARY KEY,
  from_id    INTEGER,
  to_id      INTEGER,
  message    TEXT NOT NULL,
  is_read    INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── REVIEWS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id             SERIAL PRIMARY KEY,
  customer_name  TEXT NOT NULL,
  customer_photo TEXT DEFAULT '',
  text           TEXT NOT NULL,
  rating         INTEGER DEFAULT 5,
  status         TEXT DEFAULT 'pending',
  admin_reply    TEXT DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── ATTENDANCE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id          SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  date        TEXT NOT NULL,
  time_in     TEXT DEFAULT '',
  time_out    TEXT DEFAULT '',
  status      TEXT DEFAULT 'present',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT DEFAULT '',
  price       INTEGER DEFAULT 0,
  stock       INTEGER DEFAULT 0,
  status      TEXT DEFAULT 'active',
  image_url   TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── PROMOTIONS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promotions (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  discount    INTEGER DEFAULT 0,
  banner_url  TEXT DEFAULT '',
  start_date  TEXT DEFAULT '',
  end_date    TEXT DEFAULT '',
  status      TEXT DEFAULT 'active',
  apply_to    TEXT DEFAULT 'all',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── EXPENSES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  amount     INTEGER NOT NULL,
  category   TEXT DEFAULT '',
  date       TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Menu Items seed
INSERT INTO menu_items (name, category, description, price, price_num, icon) VALUES
  ('Эспрессо',    'coffee',  'Насыщенный концентрированный', '12 000 сум', 12000, '☕'),
  ('Американо',   'coffee',  'Мягкий и ароматный',           '14 000 сум', 14000, '☕'),
  ('Капучино',    'coffee',  'С воздушной пенкой',            '18 000 сум', 18000, '☕'),
  ('Латте',       'coffee',  'Нежный с молоком',              '20 000 сум', 20000, '☕'),
  ('Раф',         'coffee',  'Сливочный фаворит',             '22 000 сум', 22000, '☕'),
  ('Айс Латте',   'cold',    'Со льдом',                      '22 000 сум', 22000, '🧊'),
  ('Холодный Брю','cold',    'Мягкий без горечи',             '24 000 сум', 24000, '🧊'),
  ('Зелёный чай', 'tea',     'Чистый вкус',                   '10 000 сум', 10000, '🍵'),
  ('Чизкейк',     'dessert', 'Нью-Йорк стиль',                '25 000 сум', 25000, '🍰'),
  ('Брауни',      'dessert', 'Шоколадный',                    '18 000 сум', 18000, '🍫')
ON CONFLICT DO NOTHING;

-- Employees seed
INSERT INTO employees (first_name, last_name, position, phone, email, hire_date, status, role, tasks_done, requests_done) VALUES
  ('Алексей',  'Иванов',   'Бариста',  '+998901111111', 'alexey@t7.uz',    '2024-01-15', 'active',   'employee', 142, 89),
  ('Нилуфар',  'Каримова', 'Менеджер', '+998902222222', 'nilufar@t7.uz',   '2023-11-01', 'active',   'manager',  201, 134),
  ('Санжар',   'Усманов',  'Кассир',   '+998903333333', 'sanjarbek@t7.uz', '2024-03-10', 'active',   'employee', 98,  67),
  ('Малика',   'Рашидова', 'Бариста',  '+998904444444', 'malika@t7.uz',    '2024-02-20', 'active',   'employee', 115, 72),
  ('Джасур',   'Холматов', 'Курьер',   '+998905555555', 'jasur@t7.uz',     '2024-04-05', 'inactive', 'employee', 45,  30)
ON CONFLICT DO NOTHING;

-- Reviews seed
INSERT INTO reviews (customer_name, text, rating, status) VALUES
  ('Алишер М.',  'Лучший кофе в городе! Раф просто восхитительный.', 5, 'approved'),
  ('Нодира Т.',  'Очень быстрая доставка, кофе горячий.',             5, 'approved'),
  ('Бехзод К.',  'Капучино немного холодный был.',                    3, 'pending'),
  ('Феруза Н.',  'Обожаю их латте! Заказываю каждый день.',           5, 'approved'),
  ('Тимур Р.',   'Хороший кофе, но упаковка могла быть лучше.',       4, 'pending')
ON CONFLICT DO NOTHING;

-- Products seed
INSERT INTO products (name, category, price, stock, status, description) VALUES
  ('Эспрессо 250г', 'Кофе',    45000, 50, 'active', 'Свежеобжаренные зёрна'),
  ('Капучино mix',  'Кофе',    38000, 30, 'active', 'Готовая смесь'),
  ('Чизкейк',       'Десерты', 25000, 15, 'active', 'Свежий ежедневно'),
  ('Брауни',        'Десерты', 18000, 20, 'active', 'Шоколадный'),
  ('Матча 100г',    'Чай',     62000, 10, 'frozen', 'Японский матча')
ON CONFLICT DO NOTHING;

-- Promotions seed
INSERT INTO promotions (title, description, discount, start_date, end_date, status, apply_to) VALUES
  ('Кофе + Десерт',   'Десерт в подарок при заказе кофе',  0,  '2025-06-01', '2025-07-01', 'active', 'all'),
  ('Счастливые часы', 'Скидка с 10:00 до 12:00',           15, '2025-06-01', '2025-06-30', 'active', 'coffee'),
  ('Летняя акция',    'Скидка на холодные напитки',         20, '2025-07-01', '2025-08-31', 'active', 'cold')
ON CONFLICT DO NOTHING;
