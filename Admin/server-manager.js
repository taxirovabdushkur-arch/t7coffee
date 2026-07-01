const express = require('express');
const cors    = require('cors');
const path    = require('path');
// dotenv — только для локальной разработки, на Vercel переменные берутся из настроек
try { require('dotenv').config({ path: path.join(__dirname, '.env') }); } catch(_) {}


const supabase = require('./supabase');
const app      = express();
const PORT           = process.env.PORT || 3001;
const MANAGER_PASSWORD = process.env.MANAGER_PASSWORD || 't7manager2024';
const SESSION_SECRET = process.env.SESSION_SECRET || 'secret';
const MANAGER_TOKEN  = Buffer.from(MANAGER_PASSWORD + SESSION_SECRET).toString('base64');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/admin', express.static(path.join(__dirname)));

function requireManager(req, res, next) {
  if (req.headers['x-admin-token'] === MANAGER_TOKEN) return next();
  res.status(401).json({ error: 'Нет доступа' });
}

/* ── AUTH ── */
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === MANAGER_PASSWORD) {
    res.json({ token: MANAGER_TOKEN, ok: true, role: 'manager' });
  } else {
    res.status(401).json({ error: 'Неверный пароль' });
  }
});

/* ── MENU ── */
app.get('/api/menu', async (req, res) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category')
    .order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/menu', requireManager, async (req, res) => {
  const { name, category, description, price, price_num, icon, image_url } = req.body;
  if (!name || !category || !price) return res.status(400).json({ error: 'Заполните все поля' });
  const { data, error } = await supabase
    .from('menu_items')
    .insert({ name, category, description: description || '', price, price_num: price_num || 0, icon: icon || '☕', image_url: image_url || '' })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.put('/api/menu/:id', requireManager, async (req, res) => {
  const { name, category, description, price, price_num, icon, image_url } = req.body;
  const { error } = await supabase
    .from('menu_items')
    .update({ name, category, description, price, price_num: price_num || 0, icon, image_url: image_url || '' })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/menu/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('menu_items').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── ORDERS ── */
app.get('/api/orders', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/orders', async (req, res) => {
  const { name, phone, address, floor, comment, payment, items } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Имя и телефон обязательны' });
  const { data, error } = await supabase
    .from('orders')
    .insert({ name, phone, address: address || '', floor: floor || '', comment: comment || '', payment: payment || 'cash', items: JSON.stringify(items || []), status: 'new' })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id, message: 'Заказ принят!' });
});

app.patch('/api/orders/:id/status', requireManager, async (req, res) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: req.body.status })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/orders/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('orders').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── EMPLOYEES ── */
app.get('/api/employees', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/employees', requireManager, async (req, res) => {
  const { first_name, last_name, position, phone, email, hire_date, role, avatar_url } = req.body;
  const { data, error } = await supabase
    .from('employees')
    .insert({ first_name, last_name, position: position || '', phone: phone || '', email: email || '', hire_date: hire_date || '', role: role || 'employee', avatar_url: avatar_url || '' })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.put('/api/employees/:id', requireManager, async (req, res) => {
  const { first_name, last_name, position, phone, email, hire_date, status, role } = req.body;
  const { error } = await supabase
    .from('employees')
    .update({ first_name, last_name, position, phone, email, hire_date, status, role })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/employees/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('employees').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── MESSAGES ── */
app.get('/api/messages', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('employee_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/api/messages/:empId', requireManager, async (req, res) => {
  const id = Number(req.params.empId);
  const { data, error } = await supabase
    .from('employee_messages')
    .select('*')
    .or(`from_id.eq.${id},to_id.eq.${id}`)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/messages', requireManager, async (req, res) => {
  const { from_id, to_id, message } = req.body;
  const { data, error } = await supabase
    .from('employee_messages')
    .insert({ from_id, to_id, message })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.patch('/api/messages/:id/read', requireManager, async (req, res) => {
  const { error } = await supabase
    .from('employee_messages')
    .update({ is_read: 1 })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── REVIEWS ── */
app.get('/api/reviews', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/reviews', async (req, res) => {
  const { customer_name, text, rating } = req.body;
  const { data, error } = await supabase
    .from('reviews')
    .insert({ customer_name, text, rating: rating || 5 })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.patch('/api/reviews/:id/status', requireManager, async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .update({ status: req.body.status })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.post('/api/reviews/:id/reply', requireManager, async (req, res) => {
  const { error } = await supabase
    .from('reviews')
    .update({ admin_reply: req.body.reply })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/reviews/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('reviews').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── ATTENDANCE ── */
app.get('/api/attendance', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('attendance')
    .select(`*, employees(first_name, last_name, position, avatar_url)`)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  // Flatten nested employees object to match old SQLite format
  const rows = data.map(r => ({
    ...r,
    first_name: r.employees?.first_name,
    last_name:  r.employees?.last_name,
    position:   r.employees?.position,
    avatar_url: r.employees?.avatar_url,
    employees:  undefined
  }));
  res.json(rows);
});

app.post('/api/attendance', requireManager, async (req, res) => {
  const { employee_id, date, time_in, time_out, status } = req.body;
  const { data, error } = await supabase
    .from('attendance')
    .insert({ employee_id, date, time_in: time_in || '', time_out: time_out || '', status: status || 'present' })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.put('/api/attendance/:id', requireManager, async (req, res) => {
  const { time_in, time_out, status } = req.body;
  const { error } = await supabase
    .from('attendance')
    .update({ time_in, time_out, status })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── PRODUCTS ── */
app.get('/api/products', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/products', requireManager, async (req, res) => {
  const { name, category, price, stock, status, image_url, description } = req.body;
  const { data, error } = await supabase
    .from('products')
    .insert({ name, category: category || '', price: price || 0, stock: stock || 0, status: status || 'active', image_url: image_url || '', description: description || '' })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.put('/api/products/:id', requireManager, async (req, res) => {
  const { name, category, price, stock, status, image_url, description } = req.body;
  const { error } = await supabase
    .from('products')
    .update({ name, category, price, stock, status, image_url: image_url || '', description: description || '' })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.patch('/api/products/:id/status', requireManager, async (req, res) => {
  const { error } = await supabase
    .from('products')
    .update({ status: req.body.status })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/products/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── PROMOTIONS ── */
app.get('/api/promotions', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/promotions', requireManager, async (req, res) => {
  const { title, description, discount, banner_url, start_date, end_date, status, apply_to } = req.body;
  const { data, error } = await supabase
    .from('promotions')
    .insert({ title, description: description || '', discount: discount || 0, banner_url: banner_url || '', start_date: start_date || '', end_date: end_date || '', status: status || 'active', apply_to: apply_to || 'all' })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.put('/api/promotions/:id', requireManager, async (req, res) => {
  const { title, description, discount, banner_url, start_date, end_date, status, apply_to } = req.body;
  const { error } = await supabase
    .from('promotions')
    .update({ title, description, discount, banner_url: banner_url || '', start_date, end_date, status, apply_to })
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.delete('/api/promotions/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('promotions').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── EXPENSES ── */
app.get('/api/expenses', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/expenses', requireManager, async (req, res) => {
  const { title, amount, category, date } = req.body;
  const { data, error } = await supabase
    .from('expenses')
    .insert({ title, amount, category: category || '', date: date || new Date().toISOString().slice(0, 10) })
    .select('id')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json({ id: data.id });
});

app.delete('/api/expenses/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('expenses').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── CONTACTS ── */
app.post('/api/contact', async (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Заполните имя и телефон' });
  const { error } = await supabase
    .from('contacts')
    .insert({ name, phone, message: message || '' });
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

app.get('/api/contacts', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/contacts/:id', requireManager, async (req, res) => {
  const { error } = await supabase.from('contacts').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

/* ── DASHBOARD STATS ── */
app.get('/api/stats/dashboard', requireManager, async (req, res) => {
  const now      = new Date();
  const today    = now.toISOString().slice(0, 10);
  const weekAgo  = new Date(now - 7 * 864e5).toISOString().slice(0, 10);
  const monthAgo = new Date(now - 30 * 864e5).toISOString().slice(0, 10);

  const calcRev = (rows) => rows.reduce((s, o) => {
    try { return s + (JSON.parse(o.items || '[]')).reduce((a, i) => a + (i.priceNum || 0) * (i.qty || 1), 0); } catch { return s; }
  }, 0);

  const [
    { count: ordersToday },
    { count: ordersWeek },
    { count: ordersMonth },
    { data: revTodayRows },
    { data: revWeekRows },
    { data: revMonthRows },
    { data: expMonthData },
    { count: employeesCount },
    { count: activeProducts },
    { count: pendingReviews },
    { count: unreadMessages },
    { count: newOrders },
    { count: attendancePresentToday },
    { data: recentOrders }
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', today),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', monthAgo),
    supabase.from('orders').select('items').gte('created_at', today),
    supabase.from('orders').select('items').gte('created_at', weekAgo),
    supabase.from('orders').select('items').gte('created_at', monthAgo),
    supabase.from('expenses').select('amount').gte('date', monthAgo),
    supabase.from('employees').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('employee_messages').select('*', { count: 'exact', head: true }).eq('is_read', 0),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('date', today).in('status', ['present', 'late']),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10)
  ]);

  const revToday = calcRev(revTodayRows || []);
  const revWeek  = calcRev(revWeekRows  || []);
  const revMonth = calcRev(revMonthRows || []);
  const expMonth = (expMonthData || []).reduce((s, r) => s + (r.amount || 0), 0);

  // Chart data: last 7 days
  const orders_by_day  = [];
  const revenue_by_day = [];
  const expenses_by_day = [];

  for (let i = 6; i >= 0; i--) {
    const d     = new Date(now - i * 864e5).toISOString().slice(0, 10);
    const dNext = new Date(now - (i - 1) * 864e5).toISOString().slice(0, 10);
    const [{ data: dayOrders }, { data: dayExp }] = await Promise.all([
      supabase.from('orders').select('items').gte('created_at', d).lt('created_at', i === 0 ? '9999-12-31' : dNext),
      supabase.from('expenses').select('amount').eq('date', d)
    ]);
    orders_by_day.push({ date: d, count: (dayOrders || []).length });
    revenue_by_day.push({ date: d, amount: calcRev(dayOrders || []) });
    expenses_by_day.push({ date: d, amount: (dayExp || []).reduce((s, r) => s + r.amount, 0) });
  }

  res.json({
    orders_today: ordersToday, orders_week: ordersWeek, orders_month: ordersMonth,
    revenue_today: revToday, revenue_week: revWeek, revenue_month: revMonth,
    expenses_month: expMonth, profit_month: revMonth - expMonth,
    employees_count: employeesCount, active_products: activeProducts,
    pending_reviews: pendingReviews, unread_messages: unreadMessages, new_orders: newOrders,
    attendance_present_today: attendancePresentToday,
    recent_orders: recentOrders || [],
    orders_by_day, revenue_by_day, expenses_by_day
  });
});

app.get('/api/stats', requireManager, async (req, res) => {
  const [
    { count: totalOrders },
    { count: newOrders },
    { count: doneOrders },
    { count: totalContacts },
    { count: menuCount }
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'done'),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('menu_items').select('*', { count: 'exact', head: true })
  ]);
  res.json({ totalOrders, newOrders, doneOrders, totalContacts, menuCount });
});

app.get('/api/customers', requireManager, async (req, res) => {
  const { data: orders, error } = await supabase.from('orders').select('phone, name, created_at, items');
  if (error) return res.status(500).json({ error: error.message });

  const map = {};
  orders.forEach(o => {
    if (!map[o.phone]) map[o.phone] = { phone: o.phone, name: o.name, order_count: 0, last_order: o.created_at, total_sum: 0 };
    map[o.phone].order_count++;
    if (o.created_at > map[o.phone].last_order) {
      map[o.phone].last_order = o.created_at;
      map[o.phone].name       = o.name;
    }
    try { JSON.parse(o.items || '[]').forEach(i => { map[o.phone].total_sum += (i.priceNum || 0) * (i.qty || 1); }); } catch (_) {}
  });

  res.json(Object.values(map).sort((a, b) => b.last_order.localeCompare(a.last_order)));
});

app.get('/api/customers/:phone/orders', requireManager, async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('phone', req.params.phone)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/* ── SPA fallback ── */
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅  T7 Coffee (Supabase): http://localhost:${PORT}`);
    console.log(`☕  Admin:               http://localhost:${PORT}/admin/login.html`);
  });
}

module.exports = app;
