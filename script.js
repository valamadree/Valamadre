// ===== DATOS DE PRODUCTOS (edítalos a tu gusto) =====
const productos = [
  { id: 1, nombre: "Amigurumi Caballo", precio: 25, emoji: "🐴" },
  { id: 2, nombre: "Bolso tejido rosa", precio: 18, emoji: "👜" },
  { id: 3, nombre: "Set de stickers pixel", precio: 6, emoji: "✨" },
  { id: 4, nombre: "Bufanda cielo", precio: 22, emoji: "🧣" },
  { id: 5, nombre: "Libreta dark cute", precio: 12, emoji: "📓" },
  { id: 6, nombre: "Llavero crochet estrella", precio: 5, emoji: "⭐" },
];

// ===== ESTADO DEL CARRITO =====
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ===== RENDER DE PRODUCTOS =====
const grid = document.getElementById("product-grid");

productos.forEach((p) => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-img">${p.emoji}</div>
    <div class="product-info">
      <h3>${p.nombre}</h3>
      <span class="product-price">$${p.precio}</span>
      <button class="add-btn" data-id="${p.id}">Agregar</button>
    </div>
  `;
  grid.appendChild(card);
});

// ===== AGREGAR AL CARRITO =====
grid.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-btn")) {
    const id = parseInt(e.target.dataset.id);
    const prod = productos.find((p) => p.id === id);
    const item = carrito.find((i) => i.id === id);

    if (item) {
      item.cantidad++;
    } else {
      carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
    }
    guardarYRenderizar();
  }
});

// ===== GUARDAR Y RENDERIZAR CARRITO =====
function guardarYRenderizar() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  actualizarContador();
}

function renderCarrito() {
  const lista = document.getElementById("cart-items");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<li style='justify-content:center;'>Tu carrito está vacío 🐴</li>";
  }

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.nombre}<br><strong>$${item.precio * item.cantidad}</strong></span>
      <div class="qty-controls">
        <button data-action="menos" data-id="${item.id}">−</button>
        <span>${item.cantidad}</span>
        <button data-action="mas" data-id="${item.id}">+</button>
        <button data-action="eliminar" data-id="${item.id}">🗑</button>
      </div>
    `;
    lista.appendChild(li);
  });

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  document.getElementById("cart-total").textContent = `$${total}`;
}

function actualizarContador() {
  const total = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  document.getElementById("cart-count").textContent = total;
}

// ===== CONTROLES DEL CARRITO =====
document.getElementById("cart-items").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = parseInt(btn.dataset.id);
  const action = btn.dataset.action;
  const item = carrito.find((i) => i.id === id);

  if (action === "mas") item.cantidad++;
  if (action === "menos") {
    item.cantidad--;
    if (item.cantidad <= 0) carrito = carrito.filter((i) => i.id !== id);
  }
  if (action === "eliminar") carrito = carrito.filter((i) => i.id !== id);

  guardarYRenderizar();
});

// ===== ABRIR / CERRAR CARRITO =====
const panel = document.getElementById("cart-panel");
const overlay = document.getElementById("cart-overlay");

function abrirCarrito() {
  panel.classList.add("open");
  overlay.classList.add("show");
}
function cerrarCarrito() {
  panel.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("cart-toggle").addEventListener("click", abrirCarrito);
document.getElementById("cart-close").addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);

// ===== CHECKOUT (aquí conectas Stripe/PayPal) =====
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío 🐴");
    return;
  }

  // OPCIÓN A: Redirigir a un Payment Link de Stripe
  // window.location.href = "https://buy.stripe.com/TU_LINK_AQUI";

  // OPCIÓN B: Redirigir a PayPal.me
  // window.location.href = "https://paypal.me/tuusuario";

  // Por ahora, mostramos un resumen para que pruebes
  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  alert(`Pedido por $${total}. Aquí conectarás tu pasarela de pago (Stripe/PayPal).`);
});

// ===== INICIALIZAR =====
renderCarrito();
actualizarContador();