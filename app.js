// Catálogo inicial de productos Zenú
const productosIniciales = [
  {
    id: 1,
    nombre: "Sombrero Vueltiao 19 Vueltas",
    categoria: "Sombreros",
    precio: 240000,
    artesano: "Taller Tradicional Tuchín, Córdoba",
    icono: "👒",
    descripcion: "Tejido a mano en caña flecha con pintas tradicionales 'Ojo de pescado' y tinturado natural con barro negro."
  },
  {
    id: 2,
    nombre: "Mochila Tejida en Caña Flecha",
    categoria: "Mochilas",
    precio: 135000,
    artesano: "Asociación Mujeres Artesanas de Sampués",
    icono: "👜",
    descripcion: "Fibra natural trenzada con correa reforzada y diseños geométricos inspirados en la fauna del río Sinú."
  },
  {
    id: 3,
    nombre: "Canasto Frutero Trenzado",
    categoria: "Cestería",
    precio: 85000,
    artesano: "Resguardo San Andrés de Sotavento",
    icono: "🧺",
    descripcion: "Pieza utilitaria y decorativa elaborada mediante trenzado en espiral de alta resistencia."
  },
  {
    id: 4,
    nombre: "Sombrero Vueltiao Fino 21 Vueltas",
    categoria: "Sombreros",
    precio: 380000,
    artesano: "Maestro Artesano Luis Polo - Tuchín",
    icono: "🎩",
    descripcion: "Trenzado fino y flexible de alta calidad, elaborado durante tres semanas de trabajo artesanal continuo."
  }
];

// Cargar desde localStorage o usar iniciales
let productos = JSON.parse(localStorage.getItem("zenumerc_productos")) || productosIniciales;
let carrito = JSON.parse(localStorage.getItem("zenumerc_carrito")) || [];
let categoriaActual = "Todos";

function formatearCOP(valor) {
  return "$" + valor.toLocaleString("es-CO") + " COP";
}

// Renderizar tarjetas de productos
function renderizarProductos() {
  const grid = document.getElementById("gridProductos");
  grid.innerHTML = "";

  const filtrados = categoriaActual === "Todos"
    ? productos
    : productos.filter(p => p.categoria === categoriaActual);

  filtrados.forEach(prod => {
    const card = document.createElement("article");
    card.className = "card-producto";
    card.innerHTML = `
      <div>
        <div class="card-banner">
          <span>${prod.icono || "🧶"}</span>
          <span class="card-cat">${prod.categoria}</span>
        </div>
        <div class="card-body">
          <h4>${prod.nombre}</h4>
          <span class="artesano-tag">📍 ${prod.artesano}</span>
          <p class="card-desc">${prod.descripcion}</p>
        </div>
      </div>
      <div class="card-footer">
        <span class="precio">${formatearCOP(prod.precio)}</span>
        <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})">+ Agregar</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Cambiar pestaña activa
function cambiarVista(nombreVista, boton) {
  document.querySelectorAll(".vista").forEach(v => v.classList.remove("active"));
  document.getElementById(`vista-${nombreVista}`).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  boton.classList.add("active");
}

// Filtrar por categoría
function filtrarProductos(categoria, boton) {
  categoriaActual = categoria;
  document.querySelectorAll(".filtro-btn").forEach(b => b.classList.remove("active"));
  boton.classList.add("active");
  renderizarProductos();
}

// Agregar nuevo producto desde el formulario
function agregarNuevoProducto(event) {
  event.preventDefault();

  const nuevo = {
    id: Date.now(),
    nombre: document.getElementById("nombreProd").value.trim(),
    categoria: document.getElementById("categoriaProd").value,
    precio: Number(document.getElementById("precioProd").value),
    artesano: document.getElementById("artesanoProd").value.trim(),
    icono: "🧶",
    descripcion: document.getElementById("historiaProd").value.trim()
  };

  productos.unshift(nuevo);
  localStorage.setItem("zenumerc_productos", JSON.stringify(productos));

  event.target.reset();
  alert("¡Artesanía publicada exitosamente en el catálogo!");
  
  const btnCatalogo = document.querySelector(".nav-btn");
  cambiarVista("catalogo", btnCatalogo);
  renderizarProductos();
}

// Funciones del Carrito
function agregarAlCarrito(idProducto) {
  const item = productos.find(p => p.id === idProducto);
  if (!item) return;

  carrito.push(item);
  guardarYActualizarCarrito();
  abrirCarrito();
}

function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  guardarYActualizarCarrito();
}

function guardarYActualizarCarrito() {
  localStorage.setItem("zenumerc_carrito", JSON.stringify(carrito));
  document.getElementById("contadorCarrito").textContent = carrito.length;

  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<p>Aún no has agregado artesanías a tu canasta.</p>";
    document.getElementById("totalCarrito").textContent = "$0 COP";
    return;
  }

  let total = 0;
  carrito.forEach((item, index) => {
    total += item.precio;
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <div>
        <strong>${item.nombre}</strong><br>
        <small>${formatearCOP(item.precio)}</small>
      </div>
      <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Quitar</button>
    `;
    lista.appendChild(div);
  });

  document.getElementById("totalCarrito").textContent = formatearCOP(total);
}

function abrirCarrito() {
  document.getElementById("panelCarrito").classList.add("abierto");
  document.getElementById("overlay").classList.add("activo");
}

function cerrarCarrito() {
  document.getElementById("panelCarrito").classList.remove("abierto");
  document.getElementById("overlay").classList.remove("activo");
}

function finalizarPedido() {
  if (carrito.length === 0) {
    alert("Tu canasta está vacía.");
    return;
  }
  alert("¡Solicitud registrada! En la siguiente fase conectaremos este pedido directamente con el artesano.");
  carrito = [];
  guardarYActualizarCarrito();
  cerrarCarrito();
}

// Eventos iniciales
document.getElementById("btnAbrirCarrito").addEventListener("click", abrirCarrito);
document.getElementById("btnCerrarCarrito").addEventListener("click", cerrarCarrito);
document.getElementById("overlay").addEventListener("click", cerrarCarrito);

renderizarProductos();
guardarYActualizarCarrito();