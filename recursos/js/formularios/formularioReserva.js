// FORMULARIO DE RESERVA: muestra el resumen del carrito y envía la reserva por WhatsApp
// Pasos al enviar: validar -> armar la reserva -> guardarla -> abrir WhatsApp -> vaciar carrito -> avisar -> ir a confirmación

import { iniciarValidacion } from "./validacionFormulario.js"
import { leerCarrito, vaciarCarrito, calcularSubtotal, calcularTotal } from "../servicios/almacenCarrito.js"
import { guardarUltimaReserva, generarNumeroReserva } from "../servicios/almacenReservas.js"
import { armarMensajeReserva, armarLinkWhatsApp, abrirWhatsApp } from "../servicios/envioWhatsApp.js"
import { formatearPrecio } from "../utilidades/formatos.js"
import { mostrarNotificacion } from "../utilidades/notificaciones.js"
import { actualizarContador } from "../vistas/vistaCarrito.js"

const ESPERA_ANTES_DE_CONFIRMAR = 2500 // milisegundos para que se llegue a leer el aviso

// Dibuja arriba del formulario lo que el cliente tiene en el carrito
function renderizarResumen(contenedor, carrito) {
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <h2>Tu pedido</h2>
            <p>Tu carrito está vacío. Podés enviarnos una consulta igual, o
            <a href="./catalogo.html">elegir un paquete del catálogo</a>.</p>
        `
        return
    }

    const renglones = carrito.map((item) => `
        <li>
            <span>${item.nombre} — ${item.personas} persona(s)</span>
            <strong>${formatearPrecio(calcularSubtotal(item))}</strong>
        </li>
    `).join("")

    contenedor.innerHTML = `
        <h2>Tu pedido</h2>
        <ul>${renglones}</ul>
        <p class="resumen-total">Total: <strong>${formatearPrecio(calcularTotal(carrito))}</strong></p>
        <a href="./detalle.html">Modificar carrito</a>
    `
}

// Lee los campos del formulario y arma el objeto reserva
function armarReserva(formulario, carrito) {
    const datos = new FormData(formulario)

    return {
        numero: generarNumeroReserva(),
        fechaReserva: new Date().toISOString(),
        cliente: {
            nombre: datos.get("nombre").trim(),
            dni: datos.get("dni").trim(),
            email: datos.get("email").trim(),
            telefono: datos.get("telefono").trim(),
            destino: datos.get("destino").trim(),
            fecha: datos.get("fecha"),
            mensaje: datos.get("mensaje").trim()
        },
        items: carrito,
        total: calcularTotal(carrito)
    }
}

function iniciarFormularioReserva(formulario, contenedorResumen) {
    const carrito = leerCarrito()

    // 1) Resumen del pedido arriba del formulario
    if (contenedorResumen) {
        renderizarResumen(contenedorResumen, carrito)
    }

    // 2) Si hay paquetes en el carrito, se completa solo el campo "Destino de interés"
    const campoDestino = formulario.querySelector("#destino")
    if (carrito.length > 0 && campoDestino.value === "") {
        campoDestino.value = carrito.map((item) => item.nombre).join(", ")
    }

    // 3) Validaciones (blur, input) y función para validar todo junto
    const validarFormulario = iniciarValidacion(formulario)

    // 4) Escuchador del envío
    formulario.addEventListener("submit", (evento) => {
        // Siempre frenamos el envío normal: la reserva viaja por WhatsApp, no a un servidor
        evento.preventDefault()

        if (!validarFormulario()) {
            mostrarNotificacion("Revisá los campos marcados en rojo.", "error")
            return
        }

        // Se vuelve a leer el carrito por si se modificó en otra pestaña
        const reserva = armarReserva(formulario, leerCarrito())
        guardarUltimaReserva(reserva)

        // window.open tiene que ejecutarse dentro del evento submit (acción del usuario);
        // si no, el navegador lo toma como ventana emergente y la bloquea
        const link = armarLinkWhatsApp(armarMensajeReserva(reserva))
        const seAbrio = abrirWhatsApp(link)

        vaciarCarrito()
        actualizarContador()
        formulario.reset()

        if (seAbrio) {
            mostrarNotificacion(`¡Listo! Se abrió WhatsApp con tu reserva ${reserva.numero}. Tocá "Enviar" para mandarla.`)
        } else {
            mostrarNotificacion("Tu navegador bloqueó WhatsApp. Podés enviarlo desde la confirmación.", "error")
        }

        // Después del aviso se pasa a la página de confirmación
        setTimeout(() => {
            window.location.href = "./confirmacion.html"
        }, ESPERA_ANTES_DE_CONFIRMAR)
    })
}

export { iniciarFormularioReserva }
