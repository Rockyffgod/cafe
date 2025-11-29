/* Utility */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Smooth scroll */
$$('[data-scroll]').forEach(btn => {
  btn.addEventListener('click', e => {
    const id = btn.getAttribute('data-scroll');
    const el = $(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Mobile nav toggle */
const navToggle = $('#navToggle');
navToggle?.addEventListener('click', () => {
  const nav = $('#nav');
  const shown = nav.style.display === 'flex';
  nav.style.display = shown ? 'none' : 'flex';
});

/* Year in footer */
$('#year').textContent = new Date().getFullYear();

/* Menu rendering */
const menuGrid = $('#menuGrid');
const itemToOption = item => `<option value="${item.id}">${item.name} — NPR ${item.price}</option>`;
const itemToCard = item => `
  <article class="menu-card" data-cat="${item.category}">
    <div><img src="${item.img}" alt="${item.name}"/></div>
    <div>
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <div class="price">NPR ${item.price}</div>
      <button class="btn btn--ghost" data-add="${item.id}">Add</button>
    </div>
  </article>
`;

const renderMenu = (filter = 'all') => {
  const items = window.CAFE_DATA.menu.filter(m => filter === 'all' ? true : m.category === filter);
  menuGrid.innerHTML = items.map(itemToCard).join('');
};
renderMenu();

/* Menu filters */
$$('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    renderMenu(chip.dataset.filter);
  });
});

/* Order form options */
const orderItemSelect = $('#orderItem');
orderItemSelect.innerHTML = window.CAFE_DATA.menu.map(itemToOption).join('');

/* Cart logic */
const cartList = $('#cartList');
const cartTotal = $('#cartTotal');
let cart = [];

const formatCurrency = npr => `NPR ${npr}`;

const updateCartUI = () => {
  cartList.innerHTML = cart.map((c, i) =>
    `<li>
      <span>${c.name} (${c.size}) — ${formatCurrency(c.price)}</span>
      <button class="btn btn--ghost" data-remove="${i}">Remove</button>
    </li>`
  ).join('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatCurrency(total);
};

document.addEventListener('click', e => {
  const addId = e.target.getAttribute('data-add');
  const removeIdx = e.target.getAttribute('data-remove');

  if (addId) {
    const menuItem = window.CAFE_DATA.menu.find(m => m.id === addId);
    if (menuItem) {
      cart.push({ name: menuItem.name, size: 'Regular', price: menuItem.price });
      updateCartUI();
    }
  }

  if (removeIdx !== null && removeIdx !== undefined) {
    cart.splice(Number(removeIdx), 1);
    updateCartUI();
  }
});

$('#orderForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = orderItemSelect.value;
  const item = window.CAFE_DATA.menu.find(m => m.id === id);
  const size = $('#size').value;
  const notes = $('#notes').value.trim();

  // size price modifier
  const mod = size === 'small' ? -20 : size === 'large' ? 40 : 0;
  const price = item.price + mod;

  cart.push({ name: item.name + (notes ? ` (${notes})` : ''), size: size[0].toUpperCase() + size.slice(1), price });
  updateCartUI();
  e.target.reset();
  orderItemSelect.value = id; // keep selection
});

/* Checkout */
$('#checkout').addEventListener('click', () => {
  if (!cart.length) {
    alert('Your cart is empty.');
    return;
  }
  alert('Thanks! This demo would proceed to payment now.');
  cart = [];
  updateCartUI();
});

/* Slider */
let currentSlide = 0;
const slides = $$('#slider .slide');

const showSlide = idx => {
  slides.forEach((s, i) => s.style.transform = `translateX(${(i - idx) * 100}%)`);
};
showSlide(0);

$('#prevSlide').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});
$('#nextSlide').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

/* Events rendering */
const eventsList = $('#eventsList');
eventsList.innerHTML = window.CAFE_DATA.events.map(ev => `
  <article class="event-card">
    <h4>${ev.title}</h4>
    <div class="event-date">${ev.date}</div>
    <p>${ev.desc}</p>
    <button class="btn btn--ghost">RSVP</button>
  </article>
`).join('');

/* Contact form (demo only) */
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  $('#contactStatus').textContent = 'Thanks for reaching out — we’ll reply soon.';
  e.target.reset();
});

/* Newsletter (demo only) */
$('#newsletterform').addEventListener('submit', e => {
  e.preventDefault();
  $('#newsletterStatus').textContent = 'Subscribed! Check your inbox for a welcome note.';
  e.target.reset();
});