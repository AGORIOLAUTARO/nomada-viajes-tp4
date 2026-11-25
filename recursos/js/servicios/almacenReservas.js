// ALMACÉN DE RESERVAS: guarda la última reserva en localStorage
// La página de confirmación la lee para mostrar el resumen

const CLAVE_RESERVA = "nomada-ultima-reserva"

function guardarUltimaReserva(reserva) {
    try {
        localStorage.setItem(CLAVE_RESERVA, JSON.stringify(reserva))
    } catch (error) {
        console.error("No se pudo guardar la reserva:", error)
    }
}

// Devuelve la reserva guardada o null si no hay ninguna
function leerUltimaReserva() {
    try {
        const texto = localStorage.getItem(CLAVE_RESERVA)
        return texto === null ? null : JSON.parse(texto)
    } catch (error) {
        console.error("No se pudo leer la reserva:", error)
        return null
    }
}

// Arma un número de reserva con el año y los últimos 6 dígitos de la hora actual
// Ejemplo: NV-2026-482193
function generarNumeroReserva() {
    const anio = new Date().getFullYear()
    const sufijo = String(Date.now()).slice(-6)
    return `NV-${anio}-${sufijo}`
}

export { guardarUltimaReserva, leerUltimaReserva, generarNumeroReserva }
