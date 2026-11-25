// VISTA DE CONFIRMACIÓN: muestra la última reserva guardada en localStorage
import { leerUltimaReserva } from "../servicios/almacenReservas.js"
import { calcularSubtotal } from "../servicios/almacenCarrito.js"
import { armarMensajeReserva, armarLinkWhatsApp } from "../servicios/envioWhatsApp.js"
import { formatearPrecio } from "../utilidades/formatos.js"

function armarDetalleItems(reserva) {
    if (reserva.items.length === 0) {
        return `<p>Enviaste una consulta sin paquetes en el carrito.</p>`
    }

    const renglones = reserva.items.map((item) => `
        <li>
            <span>${item.nombre} (${item.personas} persona/s)</span>
            <strong>${formatearPrecio(calcularSubtotal(item))}</strong>
        </li>
    `).join("")

    return `
        <ul class="confirmacion-items">${renglones}</ul>
        <p class="confirmacion-total">Total: <strong>${formatearPrecio(reserva.total)}</strong></p>
    `
}

function renderizarConfirmacion(contenedor) {
    const reserva = leerUltimaReserva()

    // Si se entra sin haber reservado nada, se avisa en lugar de mostrar datos inventados
    if (!reserva) {
        contenedor.innerHTML = `
            <h1>Todavía no hiciste ninguna reserva</h1>
            <p>Elegí un paquete del catálogo, agregalo al carrito y completá tus datos.</p>
            <a href="./catalogo.html">Ver paquetes</a>
        `
        return
    }

    // El mismo link de WhatsApp, por si la ventana no se abrió o se quiere reenviar
    const linkWhatsApp = armarLinkWhatsApp(armarMensajeReserva(reserva))

    contenedor.innerHTML = `
        <h1>¡Reserva enviada!</h1>
        <p><strong>Número de reserva:</strong> ${reserva.numero}</p>
        <p>
            Gracias, ${reserva.cliente.nombre}. Recibimos tu pedido por WhatsApp y un asesor
            te va a contactar al ${reserva.cliente.telefono} o a ${reserva.cliente.email}
            para coordinar el pago.
        </p>
        ${armarDetalleItems(reserva)}
        <div class="confirmacion-acciones">
            <a href="${linkWhatsApp}" target="_blank" rel="noopener" class="boton-whatsapp">
                Enviar de nuevo por WhatsApp
            </a>
            <a href="./index.html">Volver al inicio</a>
        </div>
    `
}

export { renderizarConfirmacion }
