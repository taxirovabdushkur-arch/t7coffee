/* ══ SPLASH SCREEN ══ */
document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById('splash-screen');
  if (splash) {
    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 600);
    }, 2500);
  }
});

/* ══ SUPABASE CLIENT ══ */
// Основные API вызовы идут через Express backend (/api/*), который сам использует Supabase.
const SUPABASE_URL  = 'https://cpvwnqehlhkzvybiztxu.supabase.co';
const SUPABASE_ANON = 'sb_publishable_Y4pWyU9zeaKWW5xC2AEuFQ_kOkcY9mz';
const _supabase = (typeof supabase !== 'undefined')
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
  : null; // fallback если CDN недоступен

/* ══ MENU DATA с реальными фото ══ */
const menuData = {
  coffee: [
    { id:1,  icon:'☕', img:'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80', name:'Эспрессо',    desc:'Насыщенный и концентрированный. Основа всего.',              priceNum:12000, price:'12 000 сум' },
    { id:2,  icon:'☕', img:'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=80', name:'Американо',   desc:'Эспрессо с горячей водой — мягкий и ароматный.',            priceNum:14000, price:'14 000 сум' },
    { id:3,  icon:'☕', img:'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80', name:'Капучино',    desc:'Эспрессо, молоко и воздушная пенка.',                       priceNum:18000, price:'18 000 сум' },
    { id:4,  icon:'☕', img:'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400&q=80', name:'Латте',       desc:'Нежный кофе с большим количеством молока.',                 priceNum:20000, price:'20 000 сум' },
    { id:5,  icon:'☕', img:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80', name:'Раф',         desc:'Сливочный кофе на основе сливок — наш фаворит.',            priceNum:22000, price:'22 000 сум' },
    { id:6,  icon:'☕', img:'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&q=80', name:'Флэт Уайт',  desc:'Двойной эспрессо с микропеной — насыщенный.',               priceNum:20000, price:'20 000 сум' },
  ],
  raf: [
    { id:21, icon:'☕', img:'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=400&q=80', name:'Раф Ваниль',  desc:'Нежный раф с ванильным сиропом.',                           priceNum:24000, price:'24 000 сум' },
    { id:22, icon:'☕', img:'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', name:'Мокко',       desc:'Кофе с шоколадом — сладкий и насыщенный.',                  priceNum:22000, price:'22 000 сум' },
    { id:23, icon:'☕', img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80', name:'Раф Карамель', desc:'Раф с карамельным сиропом и сливками.',                     priceNum:25000, price:'25 000 сум' },
  ],
  cold: [
    { id:7,  icon:'🧊', img:'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?w=400&q=80', name:'Айс Латте',   desc:'Классический латте со льдом — освежающий.',                 priceNum:22000, price:'22 000 сум' },
    { id:8,  icon:'🧊', img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', name:'Холодный Брю',desc:'Кофе холодного заваривания — мягкий без горечи.',           priceNum:24000, price:'24 000 сум' },
    { id:9,  icon:'🧊', img:'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&q=80', name:'Фраппе',      desc:'Взбитый ледяной кофе с молоком.',                           priceNum:24000, price:'24 000 сум' },
    { id:10, icon:'🍵', img:'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&q=80', name:'Матча Латте', desc:'Японский зелёный матча с молоком.',                          priceNum:26000, price:'26 000 сум' },
  ],
  dessert: [
    { id:15, icon:'🍰', img:'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400&q=80', name:'Чизкейк',  desc:'Нежный классический чизкейк Нью-Йорк.',                      priceNum:25000, price:'25 000 сум' },
    { id:16, icon:'🍫', img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80', name:'Брауни',   desc:'Шоколадный брауни — плотный с карамелью.',                   priceNum:18000, price:'18 000 сум' },
    { id:17, icon:'🥐', img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', name:'Круассан', desc:'Хрустящий, слоёный со сливочным маслом.',                    priceNum:16000, price:'16 000 сум' },
    { id:18, icon:'🍩', img:'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&q=80', name:'Маффин',   desc:'Пышный маффин — черничный или шоколадный.',                  priceNum:14000, price:'14 000 сум' },
  ]
};

const allItems = Object.values(menuData).flat();
let cart = {};
let currentCat = 'coffee';

/* ══ СТРАНИЦА МЕНЮ (секция) ══ */
function renderPageMenu(cat) {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  const items = menuData[cat] || [];
  grid.innerHTML = items.map(item => `
    <div class="menu-card" onclick="openOrderModal();setTimeout(()=>{addToCart(${item.id})},400)">
      <img class="menu-card-img" src="${item.img}" alt="${item.name}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      <div style="display:none;width:100%;aspect-ratio:4/3;background:#f2ece4;align-items:center;justify-content:center;font-size:2.5rem">${item.icon}</div>
      <div class="menu-card-body">
        <div class="menu-card-name">${item.name}</div>
        <div class="menu-card-desc">${item.desc}</div>
        <div class="menu-card-footer">
          <div class="menu-card-price">${item.price}</div>
          <button class="menu-card-add" onclick="event.stopPropagation();openOrderModal();setTimeout(()=>{addToCart(${item.id})},400)">+</button>
        </div>
      </div>
    </div>`).join('');
}

/* ══ BEST SELLERS ══ */
function renderSellers() {
  const grid = document.getElementById('sellersGrid');
  if (!grid) return;
  // Любимые позиции: Капучино, Раф, Латте, Холодный Брю (fallback на первые из меню)
  const picks = ['Капучино', 'Раф', 'Латте', 'Холодный Брю']
    .map(n => allItems.find(i => i.name === n))
    .filter(Boolean);
  const list = picks.length ? picks : allItems.slice(0, 4);
  grid.innerHTML = list.map(item => `
    <div class="seller-card">
      <img class="seller-img" src="${item.img}" alt="${item.name}" loading="lazy"
           onerror="this.style.display='none'"/>
      <div class="seller-body">
        <div class="seller-name">${item.name}</div>
        <div class="seller-desc">${item.desc}</div>
        <div class="seller-price">${item.price}</div>
        <button class="seller-btn" onclick="openOrderModal();setTimeout(()=>{addToCart(${item.id})},400)">В корзину</button>
      </div>
    </div>`).join('');
}

/* ══ ANIMATED STATS ══ */
function animateStats() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const dur = 1400; const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(p * target).toLocaleString('ru-RU');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/* Табы на странице */
document.addEventListener('DOMContentLoaded', () => {
  renderPageMenu('coffee');
  renderSellers();
  document.querySelectorAll('.menu-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPageMenu(btn.dataset.cat);
    });
  });
  // Подгружаем меню с сервера и обновляем секции
  fetchMenu().then(() => {
    renderPageMenu(document.querySelector('.menu-tab.active')?.dataset.cat || 'coffee');
    renderSellers();
  });
  // Анимация счётчиков при появлении
  const stats = document.getElementById('stats');
  if (stats) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { animateStats(); obs.disconnect(); }
    }, { threshold: .35 });
    obs.observe(stats);
  }
  // Header scroll state
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
});

/* ══ ЗАГРУЗКА МЕНЮ С СЕРВЕРА ══ */
async function fetchMenu() {
  try {
    const res = await fetch('/api/menu');
    if (!res.ok) return;
    const items = await res.json();
    const fresh = { coffee:[], raf:[], cold:[], dessert:[] };
    items.forEach(item => {
      const cat = fresh[item.category] !== undefined ? item.category : 'coffee';
      // Сохраняем фото из нашего словаря если нет image_url
      const local = allItems.find(i => i.name === item.name);
      fresh[cat].push({
        id: item.id, icon: item.icon || '☕',
        img: item.image_url || (local ? local.img : 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80'),
        name: item.name, desc: item.description || '',
        priceNum: item.price_num || 0, price: item.price
      });
    });
    Object.assign(menuData, fresh);
    allItems.length = 0;
    allItems.push(...Object.values(menuData).flat());
  } catch (_) {}
}

/* ══ MODAL OPEN / CLOSE ══ */
// Сохраняем исходную разметку оформления, чтобы восстановить после успешного заказа
const _checkoutHTML = document.getElementById('checkoutWrap')?.innerHTML || '';

function openOrderModal() {
  document.getElementById('orderOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  fetchMenu().then(() => { renderOrderItems(currentCat); renderCart(); });
}
function closeOrderModal() {
  document.getElementById('orderOverlay').classList.remove('open');
  document.body.style.overflow = '';
  const co = document.getElementById('checkoutWrap');
  // Восстанавливаем форму, если был показан экран "Заказ принят"
  if (co && !co.querySelector('.checkout-btn[onclick="placeOrder()"]') && _checkoutHTML) {
    co.innerHTML = _checkoutHTML;
  }
  document.getElementById('cartWrap').style.display    = 'flex';
  co.style.display = 'none';
  setStep('cart');
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById('orderOverlay')) closeOrderModal();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOrderModal(); });

/* ══ TABS ══ */
document.getElementById('orderTabs').addEventListener('click', e => {
  if (!e.target.classList.contains('order-tab')) return;
  document.querySelectorAll('.order-tab').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  currentCat = e.target.dataset.cat;
  document.getElementById('orderSearch').value = '';
  renderOrderItems(currentCat);
});

/* ══ SEARCH ══ */
document.getElementById('orderSearch').addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) { renderOrderItems(currentCat); return; }
  renderItemsArray(allItems.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)));
});

/* ══ RENDER ══ */
function renderOrderItems(cat) { renderItemsArray(menuData[cat] || []); }

function renderItemsArray(items) {
  const grid = document.getElementById('orderItems');
  if (!items.length) { grid.innerHTML = '<div class="order-no-results">Ничего не найдено 🔍</div>'; return; }
  grid.innerHTML = items.map(item => {
    const qty = cart[item.id] || 0;
    const imgEl = item.img
      ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" onerror="this.style.display='none';this.parentElement.textContent='${item.icon}'">`
      : item.icon;
    return `
      <div class="order-item-card">
        <div class="order-item-img">${imgEl}</div>
        <div class="order-item-body">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-desc">${item.desc}</div>
        </div>
        <div class="order-item-footer">
          <div class="order-item-price">${item.price}</div>
          ${qty === 0
            ? `<button class="order-item-add" onclick="addToCart(${item.id})">+</button>`
            : `<div class="order-item-counter">
                <button class="counter-btn" onclick="changeQty(${item.id},-1)">−</button>
                <span class="counter-num">${qty}</span>
                <button class="counter-btn" onclick="changeQty(${item.id},1)">+</button>
              </div>`
          }
        </div>
      </div>`;
  }).join('');
}

/* ══ CART ══ */
function addToCart(id)  { cart[id] = (cart[id] || 0) + 1; refreshAll(); }
function changeQty(id, delta) { cart[id] = (cart[id] || 0) + delta; if (cart[id] <= 0) delete cart[id]; refreshAll(); }
function clearCart() { if (!Object.keys(cart).length) return; if (!confirm('Очистить корзину?')) return; cart = {}; refreshAll(); }

function refreshAll() {
  const q = document.getElementById('orderSearch').value.toLowerCase().trim();
  q ? renderItemsArray(allItems.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)))
    : renderOrderItems(currentCat);
  renderCart();
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmpty   = document.getElementById('cartEmpty');
  const cartFooter  = document.getElementById('cartFooter');
  const clearBtn    = document.getElementById('cartClearBtn');
  const ids = Object.keys(cart).map(Number);
  if (!ids.length) {
    cartEmpty.style.display = 'flex'; cartItemsEl.style.display = 'none';
    cartFooter.style.display = 'none'; clearBtn.style.display = 'none'; return;
  }
  cartEmpty.style.display = 'none'; cartItemsEl.style.display = 'flex';
  cartFooter.style.display = 'block'; clearBtn.style.display = 'block';
  cartItemsEl.innerHTML = ids.map(id => {
    const item = allItems.find(i => i.id === id); if (!item) return '';
    const qty = cart[id];
    return `<div class="cart-row">
      <div class="cart-row-icon">${item.icon}</div>
      <div class="cart-row-info">
        <div class="cart-row-name">${item.name}</div>
        <div class="cart-row-price">${item.price} × ${qty} = ${(item.priceNum*qty).toLocaleString('ru-RU')} сум</div>
      </div>
      <div class="cart-row-counter">
        <button class="cart-counter-btn" onclick="changeQty(${id},-1)">−</button>
        <span class="cart-counter-num">${qty}</span>
        <button class="cart-counter-btn" onclick="changeQty(${id},1)">+</button>
      </div></div>`;
  }).join('');
  const total = ids.reduce((s,id) => s+(allItems.find(i=>i.id===id)?.priceNum||0)*cart[id], 0);
  const str = total.toLocaleString('ru-RU') + ' сум';
  document.getElementById('cartSubtotal').textContent = str;
  document.getElementById('cartTotal').textContent    = str;
  updateHeaderCount();
}

/* ══ HEADER CART BADGE ══ */
function updateHeaderCount() {
  const el = document.getElementById('headerCartCount');
  if (!el) return;
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  el.textContent = count;
  el.classList.toggle('show', count > 0);
}

/* ══ CHECKOUT ══ */
function setStep(step) {
  document.querySelectorAll('.ostep').forEach(s => s.classList.toggle('active', s.dataset.step === step || step === 'checkout'));
  // На шаге корзины подсвечиваем только первый, на оформлении — оба
  document.querySelectorAll('.ostep').forEach(s => {
    if (step === 'cart') s.classList.toggle('active', s.dataset.step === 'cart');
  });
}

function toggleCheckout() {
  const cw = document.getElementById('cartWrap'); const co = document.getElementById('checkoutWrap');
  const isCart = cw.style.display !== 'none';
  if (isCart && !Object.keys(cart).length) { alert('Сначала добавьте напитки в корзину'); return; }
  cw.style.display = isCart ? 'none' : 'flex'; co.style.display = isCart ? 'flex' : 'none';
  setStep(isCart ? 'checkout' : 'cart');
  if (isCart) {
    const ids = Object.keys(cart).map(Number);
    const total = ids.reduce((s,id) => s+(allItems.find(i=>i.id===id)?.priceNum||0)*cart[id], 0);
    document.getElementById('checkoutTotal').textContent = total.toLocaleString('ru-RU') + ' сум';
  }
}

/* Доставка / Самовывоз */
function onMethodChange() {
  const method = document.querySelector('input[name="method"]:checked')?.value || 'delivery';
  const block = document.getElementById('addrBlock');
  if (block) block.style.display = method === 'pickup' ? 'none' : 'block';
}

async function placeOrder() {
  const name    = document.getElementById('orderName').value.trim();
  const phone   = document.getElementById('orderPhone').value.trim();
  const method  = document.querySelector('input[name="method"]:checked')?.value || 'delivery';
  const address = document.getElementById('orderAddr').value.trim();
  const floor   = document.getElementById('orderFloor').value.trim();
  const note    = document.getElementById('orderComment').value.trim();
  const payment = document.querySelector('input[name="payment"]:checked')?.value || 'cash';
  if (!Object.keys(cart).length) { alert('Корзина пуста'); return; }
  if (!name)  { document.getElementById('orderName').focus();  alert('Введите имя'); return; }
  if (!phone) { document.getElementById('orderPhone').focus(); alert('Введите телефон'); return; }
  if (method === 'delivery' && !address) { document.getElementById('orderAddr').focus(); alert('Введите адрес доставки'); return; }

  // Способ получения сохраняем в комментарии, чтобы он отображался в админке
  const methodLabel = method === 'pickup' ? '🏬 Самовывоз' : '🛵 Доставка';
  const comment = [methodLabel, note].filter(Boolean).join(' · ');
  const finalAddress = method === 'pickup' ? 'Самовывоз — ул. Амира Темура, 107' : address;

  const ids = Object.keys(cart).map(Number);
  const items = ids.map(id => { const item = allItems.find(i=>i.id===id); return {...item, qty:cart[id]}; });
  const btn = document.querySelector('.checkout-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Отправляем...'; }
  try {
    const res = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,phone,address:finalAddress,floor,comment,payment,items}) });
    if (!res.ok) throw new Error('bad response');
    await res.json();
    document.getElementById('checkoutWrap').innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:2.5rem 1.5rem;text-align:center;gap:1rem">
        <div style="font-size:3rem">🎉</div>
        <div style="font-size:1.15rem;font-weight:700;color:#f3ece1;font-family:'Playfair Display',serif">Заказ принят!</div>
        <p style="font-size:.88rem;color:#b1a08c;line-height:1.6">Мы свяжемся с вами в течение 5 минут для подтверждения.</p>
        <a href="https://t.me/t7delivery" target="_blank" style="font-size:.82rem;color:#cda45e;text-decoration:none">Написать в Telegram → @t7delivery</a>
        <button class="checkout-btn" onclick="closeOrderModal()" style="margin-top:1rem;max-width:200px">Готово</button>
      </div>`;
    cart = {};
    updateHeaderCount();
  } catch {
    if (btn) { btn.disabled = false; btn.textContent = '✅ Подтвердить заказ'; }
    alert('Ошибка соединения. Пожалуйста, напишите нам в Telegram @t7delivery');
  }
}

/* ══ MOBILE NAV ══ */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');
let navOpen = false;
burger.addEventListener('click', () => {
  navOpen = !navOpen; mobileNav.classList.toggle('open', navOpen);
  const s = burger.querySelectorAll('span');
  if (navOpen) { s[0].style.transform='rotate(45deg) translate(5px,5px)'; s[1].style.opacity='0'; s[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
  else { s.forEach(x => { x.style.transform=''; x.style.opacity=''; }); }
});
function closeMobileNav() {
  navOpen = false; mobileNav.classList.remove('open');
  burger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
}

/* ══ CONTACT FORM ══ */
async function submitForm() {
  const name  = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const msg   = document.getElementById('fmsg').value.trim();
  if (!name || !phone) { alert('Заполните имя и телефон'); return; }
  try { await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,phone,message:msg}) }); } catch (_) {}
  document.getElementById('formSuccess').style.display = 'block';
  document.getElementById('fname').value = ''; document.getElementById('fphone').value = ''; document.getElementById('fmsg').value = '';
  setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 4000);
}
