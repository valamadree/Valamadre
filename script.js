// ===== DATOS DE PRODUCTOS (Ahora con categorías) =====
const productos = [
  { id: 1, nombre: "Amigurumi Osito", precio: 18, categoria: "crochet", img: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400" },
  { id: 2, nombre: "Bolso Crochet Rosa", precio: 28, categoria: "crochet", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400" },
  { id: 3, nombre: "Cuaderno Dark Cute", precio: 12, categoria: "papeleria", img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400" },
  { id: 4, nombre: "Llavero Pixel", precio: 8, categoria: "accesorios", img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400" },
  { id: 5, nombre: "Calcetines Kawaii", precio: 10, categoria: "accesorios", img: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400" },
  { id: 6, nombre: "Stickers Dark", precio: 6, categoria: "papeleria", img: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=400" }
];

let carrito = [];

// ===== RENDERIZAR PRODUCTOS Y FILTROS =====
const grid = document.getElementById("product-grid");
const categoryBtns = document.querySelectorAll(".category-btn");

function renderProductos(categoriaFiltro = "todos") {
  grid.innerHTML = ""; // Limpiar grid
  
  const productosFiltrados = categoriaFiltro === "todos" 
    ? productos 
    : productos.filter(p => p.categoria === categoriaFiltro);

  productosFiltrados.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <div class="price">$${p.precio}</div>
      <button class="btn-add" onclick="agregarAlCarrito(${p.id})">Agregar</button>
    `;
    grid.appendChild(card);
  });
}

// Eventos de los botones de categoría
categoryBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    // Quitar clase active a todos
    categoryBtns.forEach(b => b.classList.remove("active"));
    // Poner active al clickeado
    e.target.classList.add("active");
    // Renderizar filtrados
    renderProductos(e.target.dataset.category);
  });
});

// Renderizado inicial
renderProductos();

// ===== LÓGICA DEL CARRITO =====
function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("cart-items");
  lista.innerHTML = "";
  let total = 0;
  let contador = 0;

  carrito.forEach(item => {
    total += item.precio * item.cantidad;
    contador += item.cantidad;
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.nombre} x${item.cantidad}</span>
      <span>$${item.precio * item.cantidad}
        <button onclick="eliminarDelCarrito(${item.id})">🗑️</button>
      </span>
    `;
    lista.appendChild(li);
  });

  document.getElementById("cart-total").textContent = `$${total}`;
  document.getElementById("cart-count").textContent = contador;
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarrito();
}

// ===== ABRIR / CERRAR CARRITO =====
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("cart-overlay");

function abrirCarrito() {
  cartPanel.classList.add("open");
  overlay.classList.add("active");
}

function cerrarCarrito() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("active");
}

document.getElementById("cart-toggle").addEventListener("click", abrirCarrito);
document.getElementById("cart-close").addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);

// ===== MODAL DE PAGO QR =====
const paymentModal = document.getElementById("payment-modal");
const modalOverlay = document.getElementById("modal-overlay");

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío 🌸");
    return;
  }
  
  // Actualizamos el total en el modal
  const totalText = document.getElementById("cart-total").textContent;
  document.getElementById("modal-total").textContent = totalText;
  
  // Cerramos el carrito y abrimos el modal
  cerrarCarrito();
  paymentModal.classList.add("open");
  modalOverlay.classList.add("active");
});

function cerrarModal() {
  paymentModal.classList.remove("open");
  modalOverlay.classList.remove("active");
}

document.getElementById("modal-close").addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", cerrarModal);

// Simular confirmación de pago
document.getElementById("confirm-payment").addEventListener("click", () => {
  alert("¡Gracias! Tu pedido está en revisión. Envíanos el comprobante por Instagram.");
  carrito = [];
  actualizarCarrito();
  cerrarModal();
});