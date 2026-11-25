// ALMACÉN DEL CARRITO: guarda y lee el carrito en localStorage
// localStorage solo guarda texto, por eso se usa JSON.stringify para guardar y JSON.parse para leer
// Así el carrito no se pierde al cambiar de página o al cerrar el navegador

import { obtenerPrecioFinal } from "../utilidades/formatos.js"

const CLAVE_CARRITO = "nomada-carrito"

// Devuelve el arreglo del carrito (o un arreglo vacío si todavía no hay nada)
function leerCarrito() {
    try {
        const texto = localStorage.getItem(CLAVE_CARRITO)
        if (texto === null) {
            return []
        }
        const carrito = JSON.parse(texto)
        // Si alguien guardó algo raro en esa clave, empezamos de cero
        return Array.isArray(carrito) ? carrito : []
    } catch (error) {
        // JSON.parse lanza error si el texto guardado está roto
        console.error("No se pudo leer el carrito:", error)
        return []
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
    } catch (error) {
        // Puede fallar si el navegador bloquea el almacenamiento (por ejemplo, modo privado)
        console.error("No se pudo guardar el carrito:", error)
    }
}

// Agrega un paquete. Si ya estaba, se actualiza la cantidad de personas
// Devuelve true si era nuevo y false si se actualizó
function agregarAlCarrito(paquete, personas) {
    const carrito = leerCarrito()
    const existente = carrito.find((item) => item.id === paquete.id)

    if (existente) {
        existente.personas = personas
        guardarCarrito(carrito)
        return false
    }

    // Guardamos solo los datos que necesita el carrito, no el paquete entero
    carrito.push({
        id: paquete.id,
        nombre: paquete.nombre,
        imagen: paquete.imagen,
        descripcionImagen: paquete.descripcionImagen,
        precioUnitario: obtenerPrecioFinal(paquete),
        personas: personas
    })
    guardarCarrito(carrito)
    return true
}

// Saca un paquete del carrito a partir de su id
function quitarDelCarrito(id) {
    const carrito = leerCarrito().filter((item) => item.id !== id)
    guardarCarrito(carrito)
}

function vaciarCarrito() {
    localStorage.removeItem(CLAVE_CARRITO)
}

// Precio de un renglón: precio por persona × cantidad de personas
function calcularSubtotal(item) {
    return item.precioUnitario * item.personas
}

// Suma los subtotales de todos los renglones
function calcularTotal(carrito) {
    return carrito.reduce((acumulado, item) => acumulado + calcularSubtotal(item), 0)
}

export { leerCarrito, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, calcularSubtotal, calcularTotal }
