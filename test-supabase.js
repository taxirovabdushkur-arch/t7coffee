/**
 * Скрипт для проверки подключения Supabase и наличия всех таблиц.
 * Запуск: node test-supabase.js
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'Admin', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const TABLES = [
  'menu_items', 'orders', 'contacts', 'employees',
  'employee_messages', 'reviews', 'attendance',
  'products', 'promotions', 'expenses'
];

async function main() {
  console.log('\n🔌 Проверяем подключение к Supabase...\n');
  let allOk = true;

  for (const table of TABLES) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log(`  ❌  ${table.padEnd(22)} — ${error.message}`);
      allOk = false;
    } else {
      console.log(`  ✅  ${table.padEnd(22)} — ${count ?? 0} записей`);
    }
  }

  console.log(allOk
    ? '\n🎉 Всё подключено! Можно запускать сервер: node Admin/server.js\n'
    : '\n⚠️  Некоторые таблицы не найдены. Выполните SQL миграцию в Supabase SQL Editor.\n'
  );
}

main().catch(console.error);
