// VISTA DEL CATÁLOGO: dibuja las tarjetas de paquetes en catalogo.html
import { iniciarFiltros } from "../formularios/filtrosCatalogo.js"
import { formatearPrecio } from "../utilidades/formatos.js"

// Arma el renglón del precio: si hay oferta muestra el precio anterior tachado
function armarPrecio(paquete) {
    if (paquete.precioOferta) {
        return `<s>${formatearPrecio(paquete.precio)}</s> ${formatearPrecio(paquete.precioOferta)} por persona`
    }
    return `${formatearPrecio(paquete.precio)} por persona`
}

function renderizarPaquetes(contenedor, /*es la referencia del DOM*/ paquetes /*es el arreglo*/) {

    // Si no hay resultados se muestra un mensaje en lugar de la grilla
    if (paquetes.length === 0) {
        contenedor.innerHTML = `<p>No hay paquetes que coincidan con los filtros elegidos.</p>`
        return
    }

    let paquetesHTML = ''
    paquetes.forEach((paquete) => {
        paquetesHTML += `
        <article>
            <h3>${paquete.nombre}</h3>
            <img src="${paquete.imagen}" alt="${paquete.descripcionImagen}" width="400">
            <ul>
                <li>
                    ${paquete.noches} noches
                </li>
                <li>
                    ${armarPrecio(paquete)}
                </li>
                <li>
                    <a href="./detalle.html?id=${paquete.id}">
                        Ver paquete
                    </a>
                </li>
            </ul>
        </article>
        `
    })
    contenedor.innerHTML = paquetesHTML
}

// La llama index.js: dibuja todo el catálogo y deja listos los filtros
function iniciarCatalogo(contenedor, formulario, paquetes) {
    // 1) Renderizamos todos los paquetes
    renderizarPaquetes(contenedor, paquetes)

    // 2) filtrosCatalogo.js escucha el formulario y llama a esta función con el arreglo ya filtrado
    iniciarFiltros(formulario, paquetes, (paquetesFiltrados) => {
        renderizarPaquetes(contenedor, paquetesFiltrados)
    })
}

// Exportación nombrada -> las que sean necesarias
export { renderizarPaquetes, iniciarCatalogo }
