// NOTIFICACIONES: muestra avisos cortos en la interfaz (abajo a la izquierda)
// Se usan al agregar o quitar del carrito y al enviar la reserva

const DURACION_AVISO = 4000 // milisegundos que el aviso queda en pantalla

// tipo puede ser "exito" (verde) o "error" (rojo)
function mostrarNotificacion(mensaje, tipo = "exito") {
    // Buscamos el contenedor que está al final de cada HTML
    let contenedor = document.getElementById("notificaciones")

    // Si una página no lo tuviera, lo creamos para que el aviso igual se vea
    if (!contenedor) {
        contenedor = document.createElement("div")
        contenedor.id = "notificaciones"
        contenedor.className = "notificaciones"
        contenedor.setAttribute("aria-live", "polite")
        document.body.append(contenedor)
    }

    // Creamos el aviso
    const aviso = document.createElement("p")
    aviso.className = `notificacion notificacion-${tipo}`
    aviso.textContent = mensaje
    contenedor.append(aviso)

    // Después de unos segundos se borra solo
    setTimeout(() => {
        aviso.remove()
    }, DURACION_AVISO)
}

export { mostrarNotificacion }
