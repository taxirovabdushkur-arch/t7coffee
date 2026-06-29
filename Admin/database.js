const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 't7coffee.db'));

/* ── Core tables ── */
db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL,
    description TEXT, price TEXT NOT NULL, price_num INTEGER DEFAULT 0,
    icon TEXT DEFAULT '☕', image_url TEXT DEFAULT '', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL,
    address TEXT, floor TEXT, comment TEXT, payment TEXT DEFAULT 'cash',
    items TEXT, status TEXT DEFAULT 'new', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL,
    message TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL,
    position TEXT, phone TEXT, email TEXT, hire_date TEXT, status TEXT DEFAULT 'active',
    avatar_url TEXT DEFAULT '', role TEXT DEFAULT 'employee',
    tasks_done INTEGER DEFAULT 0, requests_done INTEGER DEFAULT 0,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS employee_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, from_id INTEGER, to_id INTEGER,
    message TEXT NOT NULL, is_read INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT, customer_name TEXT NOT NULL,
    customer_photo TEXT DEFAULT '', text TEXT NOT NULL, rating INTEGER DEFAULT 5,
    status TEXT DEFAULT 'pending', admin_reply TEXT DEFAULT '', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT, employee_id INTEGER NOT NULL,
    date TEXT NOT NULL, time_in TEXT, time_out TEXT, status TEXT DEFAULT 'present',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT,
    price INTEGER DEFAULT 0, stock INTEGER DEFAULT 0, status TEXT DEFAULT 'active',
    image_url TEXT DEFAULT '', description TEXT DEFAULT '', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT,
    discount INTEGER DEFAULT 0, banner_url TEXT DEFAULT '', start_date TEXT, end_date TEXT,
    status TEXT DEFAULT 'active', apply_to TEXT DEFAULT 'all', created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, amount INTEGER NOT NULL,
    category TEXT, date TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

/* ── Safe migrations ── */
['address','floor','comment','payment'].forEach(c => { try { db.exec(`ALTER TABLE orders ADD COLUMN ${c} TEXT`); } catch(_){} });
try { db.exec('ALTER TABLE menu_items ADD COLUMN price_num INTEGER DEFAULT 0'); } catch(_){}
try { db.exec('ALTER TABLE menu_items ADD COLUMN image_url TEXT DEFAULT ""'); } catch(_){}

/* ── Seed menu ── */
if (!db.prepare('SELECT COUNT(*) as c FROM menu_items').get().c) {
  const ins = db.prepare('INSERT INTO menu_items (name,category,description,price,price_num,icon) VALUES(?,?,?,?,?,?)');
  [['Эспрессо','coffee','Насыщенный концентрированный','12 000 сум',12000,'☕'],
   ['Американо','coffee','Мягкий и ароматный','14 000 сум',14000,'☕'],
   ['Капучино','coffee','С воздушной пенкой','18 000 сум',18000,'☕'],
   ['Латте','coffee','Нежный с молоком','20 000 сум',20000,'☕'],
   ['Раф','coffee','Сливочный фаворит','22 000 сум',22000,'☕'],
   ['Айс Латте','cold','Со льдом','22 000 сум',22000,'🧊'],
   ['Холодный Брю','cold','Мягкий без горечи','24 000 сум',24000,'🧊'],
   ['Зелёный чай','tea','Чистый вкус','10 000 сум',10000,'🍵'],
   ['Чизкейк','dessert','Нью-Йорк стиль','25 000 сум',25000,'🍰'],
   ['Брауни','dessert','Шоколадный','18 000 сум',18000,'🍫']
  ].forEach(r => ins.run(...r));
}

/* ── Seed employees ── */
if (!db.prepare('SELECT COUNT(*) as c FROM employees').get().c) {
  const ins = db.prepare('INSERT INTO employees(first_name,last_name,position,phone,email,hire_date,status,role,tasks_done,requests_done) VALUES(?,?,?,?,?,?,?,?,?,?)');
  [['Алексей','Иванов','Бариста','+998901111111','alexey@t7.uz','2024-01-15','active','employee',142,89],
   ['Нилуфар','Каримова','Менеджер','+998902222222','nilufar@t7.uz','2023-11-01','active','manager',201,134],
   ['Санжар','Усманов','Кассир','+998903333333','sanjarbek@t7.uz','2024-03-10','active','employee',98,67],
   ['Малика','Рашидова','Бариста','+998904444444','malika@t7.uz','2024-02-20','active','employee',115,72],
   ['Джасур','Холматов','Курьер','+998905555555','jasur@t7.uz','2024-04-05','inactive','employee',45,30]
  ].forEach(r => ins.run(...r));
}

/* ── Seed reviews ── */
if (!db.prepare('SELECT COUNT(*) as c FROM reviews').get().c) {
  const ins = db.prepare('INSERT INTO reviews(customer_name,text,rating,status) VALUES(?,?,?,?)');
  [['Алишер М.','Лучший кофе в городе! Раф просто восхитительный.',5,'approved'],
   ['Нодира Т.','Очень быстрая доставка, кофе горячий.',5,'approved'],
   ['Бехзод К.','Капучино немного холодный был.',3,'pending'],
   ['Феруза Н.','Обожаю их латте! Заказываю каждый день.',5,'approved'],
   ['Тимур Р.','Хороший кофе, но упаковка могла быть лучше.',4,'pending']
  ].forEach(r => ins.run(...r));
}

/* ── Seed products ── */
if (!db.prepare('SELECT COUNT(*) as c FROM products').get().c) {
  const ins = db.prepare('INSERT INTO products(name,category,price,stock,status,description) VALUES(?,?,?,?,?,?)');
  [['Эспрессо 250г','Кофе',45000,50,'active','Свежеобжаренные зёрна'],
   ['Капучино mix','Кофе',38000,30,'active','Готовая смесь'],
   ['Чизкейк','Десерты',25000,15,'active','Свежий ежедневно'],
   ['Брауни','Десерты',18000,20,'active','Шоколадный'],
   ['Матча 100г','Чай',62000,10,'frozen','Японский матча']
  ].forEach(r => ins.run(...r));
}

/* ── Seed promotions ── */
if (!db.prepare('SELECT COUNT(*) as c FROM promotions').get().c) {
  const ins = db.prepare('INSERT INTO promotions(title,description,discount,start_date,end_date,status,apply_to) VALUES(?,?,?,?,?,?,?)');
  [['Кофе + Десерт','Десерт в подарок при заказе кофе',0,'2025-06-01','2025-07-01','active','all'],
   ['Счастливые часы','Скидка с 10:00 до 12:00',15,'2025-06-01','2025-06-30','active','coffee'],
   ['Летняя акция','Скидка на холодные напитки',20,'2025-07-01','2025-08-31','active','cold']
  ].forEach(r => ins.run(...r));
}

/* ── Seed expenses ── */
if (!db.prepare('SELECT COUNT(*) as c FROM expenses').get().c) {
  const ins = db.prepare('INSERT INTO expenses(title,amount,category,date) VALUES(?,?,?,?)');
  const d = new Date(); const today = d.toISOString().slice(0,10);
  [['Закупка зёрен',850000,'Сырьё',today],
   ['Аренда',1500000,'Аренда',today],
   ['Зарплата',3200000,'Зарплата',today],
   ['Упаковка',320000,'Материалы',today],
   ['Коммунальные',180000,'Коммунальные',today]
  ].forEach(r => ins.run(...r));
}

/* ── Seed attendance ── */
if (!db.prepare('SELECT COUNT(*) as c FROM attendance').get().c) {
  const ins = db.prepare('INSERT INTO attendance(employee_id,date,time_in,time_out,status) VALUES(?,?,?,?,?)');
  const today = new Date().toISOString().slice(0,10);
  [[1,today,'08:02','17:00','present'],[2,today,'08:00','18:00','present'],
   [3,today,'08:45','17:30','late'],[4,today,null,null,'absent'],[5,today,'09:00','17:00','present']
  ].forEach(r => ins.run(...r));
}

/* ── Seed messages ── */
if (!db.prepare('SELECT COUNT(*) as c FROM employee_messages').get().c) {
  const ins = db.prepare('INSERT INTO employee_messages(from_id,to_id,message,is_read) VALUES(?,?,?,?)');
  [[1,2,'Привет, когда следующая смена?',1],[2,1,'Завтра с 8 утра',1],
   [3,2,'Заканчивается молоко, нужно заказать',0],[1,3,'Хорошо, я сообщил менеджеру',0]
  ].forEach(r => ins.run(...r));
}

console.log('✅ Database ready');
module.exports = db;
