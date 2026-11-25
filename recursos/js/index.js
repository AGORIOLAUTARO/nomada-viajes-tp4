// ARCHIVO DE ENTRADA: lo cargan los 5 HTML con <script type="module">
// No dibuja nada por su cuenta: se fija qué elementos hay en la página abierta
// y llama al módulo que corresponde

//Siempre los import van arriba de todo
import { obtenerPaquetes } from "./servicios/servicioPaquetes.js"
import { agregarAlCarrito } from "./servicios/almacenCarrito.js"
import { iniciarMenuHamburguesa } from "./utilidades/menuHamburguesa.js"
import { mostrarNotificacion } from "./utilidades/notificaciones.js"
import { iniciarInicio } from "./vistas/vistaInicio.js"
import { iniciarCatalogo } from "./vistas/vistaCatalogo.js"
import { iniciarDetalle } from "./vistas/vistaDetalle.js"
import { iniciarCarrito, renderizarCarrito, actualizarContador } from "./vistas/vistaCarrito.js"
import { renderizarConfirmacion } from "./vistas/vistaConfirmacion.js"
import { iniciarFormularioReserva } from "./formularios/formularioReserva.js"

// Referenciamos elementos del DOM a partir de su ID
// Cada elemento se usa solo si existe en la página abierta
const encabezado = document.getElementById("encabezado-principal")
const botonAbrir = document.getElementById("boton-abrir")
const botonCerrar = document.getElementById("boton-cerrar")
const contenedorDestinos = document.getElementById("contenedor-destinos")
const contenedorOfertas = document.getElementById("contenedor-ofertas")
const contenedorPaquetes = document.getElementById("contenedor-paquetes")
const formFiltros = document.getElementById("form-filtros")
const contenedorDetalle = document.getElementById("contenedor-detalle")
const seccionCarrito = document.getElementById("contenedor-carrito")
const formReserva = document.getElementById("form-reserva")
const resumenPedido = document.getElementById("resumen-pedido")
const resumenReserva = document.getElementById("resumen-reserva")

const MENSAJE_ERROR_CARGA = '<p>No se pudieron cargar los paquetes. Intentá de nuevo más tarde.</p>'

// MENÚ HAMBURGUESA y CONTADOR DEL CARRITO (en todas las páginas)
if (encabezado && botonAbrir && botonCerrar) {
    iniciarMenuHamburguesa(encabezado, botonAbrir, botonCerrar)
}
actualizarContador()

// INICIO (solo existe en index.html)
if (contenedorDestinos && contenedorOfertas) {
    const paquetes = await obtenerPaquetes()

    if (paquetes) {
        iniciarInicio(contenedorDestinos, contenedorOfertas, paquetes)
    } else {
        contenedorDestinos.innerHTML = MENSAJE_ERROR_CARGA
    }
}

// CATÁLOGO (solo existe en catalogo.html)
if (contenedorPaquetes && formFiltros) {
    const paquetes = await obtenerPaquetes()

    if (paquetes) {
        iniciarCatalogo(contenedorPaquetes, formFiltros, paquetes)
    } else {
        contenedorPaquetes.innerHTML = MENSAJE_ERROR_CARGA
    }
}

// CARRITO (solo existe en detalle.html): se dibuja con lo guardado en localStorage
if (seccionCarrito) {
    iniciarCarrito(seccionCarrito)
}

// DETALLE (solo existe en detalle.html)
if (contenedorDetalle) {
    const paquetes = await obtenerPaquetes()

    if (paquetes) {
        const paquete = iniciarDetalle(contenedorDetalle, paquetes)

        // El botón y el campo se buscan DESPUÉS de dibujar el detalle, porque los crea vistaDetalle.js
        const botonAgregar = document.getElementById("boton-agregar")
        const campoPersonas = document.getElementById("id-personas")

        if (paquete && botonAgregar && campoPersonas) {
            // Escuchador: agrega el paquete al carrito y lo guarda en localStorage
            botonAgregar.addEventListener("click", () => {
                const personas = Number(campoPersonas.value)

                // Validación: entre 1 y 10 personas (los mismos límites que min y max del input)
                if (!Number.isInteger(personas) || personas < 1 || personas > 10) {
                    mostrarNotificacion("Elegí entre 1 y 10 personas.", "error")
                    campoPersonas.focus()
                    return
                }

                const esNuevo = agregarAlCarrito(paquete, personas)
                renderizarCarrito(seccionCarrito)

                if (esNuevo) {
                    mostrarNotificacion(`Agregaste "${paquete.nombre}" al carrito.`)
                } else {
                    mostrarNotificacion(`Actualizaste "${paquete.nombre}": ahora son ${personas} persona(s).`)
                }
            })
        }
    } else {
        contenedorDetalle.innerHTML = MENSAJE_ERROR_CARGA
    }
}

// FORMULARIO DE RESERVA (solo existe en formulario.html)
if (formReserva) {
    iniciarFormularioReserva(formReserva, resumenPedido)
}

// CONFIRMACIÓN (solo existe en confirmacion.html)
if (resumenReserva) {
    renderizarConfirmacion(resumenReserva)
}
