// VISTA DEL CARRITO: dibuja el carrito guardado en localStorage y maneja el botón "Quitar"
import { leerCarrito, quitarDelCarrito, calcularSubtotal, calcularTotal } from "../servicios/almacenCarrito.js"
import { formatearPrecio } from "../utilidades/formatos.js"
import { mostrarNotificacion } from "../utilidades/notificaciones.js"

// Actualiza el numerito del menú "Detalle y Carrito" (está en las 5 páginas)
function actualizarContador() {
    const contador = document.getElementById("contador-carrito")
    if (!contador) {
        return
    }
    const cantidad = leerCarrito().length
    contador.textContent = cantidad
    // Si el carrito está vacío el numerito se oculta
    contador.hidden = cantidad === 0
}

function armarItem(item) {
    return `
        <li class="carrito-item">
            <img src="${item.imagen}" alt="${item.descripcionImagen}" width="80">
            <div class="carrito-datos">
                <h3>${item.nombre}</h3>
                <p>${item.personas} persona(s) × ${formatearPrecio(item.precioUnitario)}</p>
            </div>
            <p class="carrito-precio">${formatearPrecio(calcularSubtotal(item))}</p>
            <button type="button" class="boton-quitar" data-id="${item.id}">
                Quitar
            </button>
        </li>
    `
}

// Vuelve a dibujar todo el carrito: se llama al entrar, al agregar y al quitar
function renderizarCarrito(seccion) {
    const carrito = leerCarrito()
    const lista = seccion.querySelector(".carrito-items")
    const mensajeVacio = seccion.querySelector(".carrito-vacio")
    const zonaTotal = seccion.querySelector(".carrito-total")
    const total = seccion.querySelector("#total-carrito")

    lista.innerHTML = carrito.map(armarItem).join("")
    total.textContent = formatearPrecio(calcularTotal(carrito))

    // Con el carrito vacío se muestra el mensaje y se oculta el total y el botón de continuar
    mensajeVacio.hidden = carrito.length > 0
    zonaTotal.hidden = carrito.length === 0

    actualizarContador()
}

function iniciarCarrito(seccion) {
    renderizarCarrito(seccion)

    // Escuchador en la sección entera (delegación de eventos):
    // los botones "Quitar" se crean y se borran todo el tiempo, entonces escuchamos al contenedor
    // y con closest averiguamos si el clic fue en un botón "Quitar"
    seccion.addEventListener("click", (evento) => {
        const boton = evento.target.closest(".boton-quitar")
        if (!boton) {
            return
        }
        // data-id del botón -> dataset.id
        const nombre = boton.closest(".carrito-item").querySelector("h3").textContent
        quitarDelCarrito(boton.dataset.id)
        renderizarCarrito(seccion)
        mostrarNotificacion(`Quitaste "${nombre}" del carrito.`)
    })
}

export { iniciarCarrito, renderizarCarrito, actualizarContador }
