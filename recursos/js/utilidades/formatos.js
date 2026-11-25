// FORMATOS: funciones chicas que usan varias vistas (antes estaban repetidas en catalogo.js y detalle.js)

// Convierte un número en precio: 420000 -> $420.000
function formatearPrecio(precio) {
    return "$" + precio.toLocaleString("es-AR")
}

// Convierte la fecha del JSON (AAAA-MM-DD) al formato argentino (DD/MM/AAAA)
function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split("-")
    return `${dia}/${mes}/${anio}`
}

// Pone en mayúscula la primera letra: "aventura" -> "Aventura"
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Devuelve el precio que se cobra: si el paquete tiene precio de oferta se usa ese
function obtenerPrecioFinal(paquete) {
    if (paquete.precioOferta) {
        return paquete.precioOferta
    }
    return paquete.precio
}

export { formatearPrecio, formatearFecha, capitalizar, obtenerPrecioFinal }
