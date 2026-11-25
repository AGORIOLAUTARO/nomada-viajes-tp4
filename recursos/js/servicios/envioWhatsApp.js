// ENVÍO POR WHATSAPP: arma el mensaje de la reserva y el link de WhatsApp
// WhatsApp permite abrir un chat con un texto ya escrito usando: https://wa.me/NUMERO?text=MENSAJE
// No hace falta ninguna cuenta ni servidor: el cliente solo tiene que tocar "Enviar"

import { formatearPrecio, formatearFecha } from "../utilidades/formatos.js"
import { calcularSubtotal } from "./almacenCarrito.js"

// Número de WhatsApp de la agencia: código de país + área + número, sin "+", espacios ni guiones
const NUMERO_WHATSAPP = "5493512274047"

// Arma el texto que le llega a la agencia
function armarMensajeReserva(reserva) {
    const lineas = []

    lineas.push(`*Nueva reserva - Nómada Viajes*`)
    lineas.push(`N° de reserva: ${reserva.numero}`)
    lineas.push("")
    lineas.push(`*Datos del pasajero*`)
    lineas.push(`Nombre: ${reserva.cliente.nombre}`)
    lineas.push(`DNI: ${reserva.cliente.dni}`)
    lineas.push(`Email: ${reserva.cliente.email}`)
    lineas.push(`Teléfono: ${reserva.cliente.telefono}`)

    if (reserva.cliente.fecha) {
        lineas.push(`Fecha estimada de viaje: ${formatearFecha(reserva.cliente.fecha)}`)
    }

    lineas.push("")

    // Si hay paquetes en el carrito se detallan; si no, es una consulta
    if (reserva.items.length > 0) {
        lineas.push(`*Paquetes*`)
        reserva.items.forEach((item) => {
            lineas.push(`- ${item.nombre}: ${item.personas} persona(s) × ${formatearPrecio(item.precioUnitario)} = ${formatearPrecio(calcularSubtotal(item))}`)
        })
        lineas.push(`*Total: ${formatearPrecio(reserva.total)}*`)
    } else {
        lineas.push(`*Consulta sin paquetes en el carrito*`)
        if (reserva.cliente.destino) {
            lineas.push(`Destino de interés: ${reserva.cliente.destino}`)
        }
    }

    if (reserva.cliente.mensaje) {
        lineas.push("")
        lineas.push(`Mensaje: ${reserva.cliente.mensaje}`)
    }

    // Cada elemento del arreglo es un renglón del mensaje
    return lineas.join("\n")
}

// encodeURIComponent convierte espacios, tildes y saltos de línea para que viajen bien en la URL
function armarLinkWhatsApp(mensaje) {
    return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`
}

// Abre WhatsApp en otra pestaña. Devuelve false si el navegador bloqueó la ventana
function abrirWhatsApp(link) {
    const ventana = window.open(link, "_blank")
    return ventana !== null
}

export { armarMensajeReserva, armarLinkWhatsApp, abrirWhatsApp }
