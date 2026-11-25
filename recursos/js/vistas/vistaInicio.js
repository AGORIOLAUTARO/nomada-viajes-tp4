// VISTA DEL INICIO: dibuja "Destinos destacados" y "Ofertas vigentes" a partir de paquetes.json
// Antes estas tarjetas estaban escritas a mano en index.html
import { formatearPrecio } from "../utilidades/formatos.js"

function armarTarjetaDestacado(paquete) {
    return `
        <article>
            <a href="./detalle.html?id=${paquete.id}">
                <h3>${paquete.destino} — desde ${formatearPrecio(paquete.precio)}</h3>
                <img src="${paquete.imagen}" alt="${paquete.descripcionImagen}" width="400">
            </a>
        </article>
    `
}

function armarTarjetaOferta(paquete) {
    // Si la oferta tiene precio rebajado se muestra "Antes ... ahora ...", si no, solo el precio
    const textoPrecio = paquete.precioOferta
        ? `Antes ${formatearPrecio(paquete.precio)}, ahora ${formatearPrecio(paquete.precioOferta)}`
        : formatearPrecio(paquete.precio)

    return `
        <article>
            <a href="./detalle.html?id=${paquete.id}">
                <h3>${paquete.nombre} — ${paquete.etiquetaOferta}</h3>
                <p>${textoPrecio}</p>
                <img src="${paquete.imagen}" alt="${paquete.descripcionImagen}" width="400">
            </a>
        </article>
    `
}

function iniciarInicio(contenedorDestacados, contenedorOfertas, paquetes) {
    // filter se queda solo con los paquetes que cumplen la condición
    const destacados = paquetes.filter((paquete) => paquete.destacado)
    const ofertas = paquetes.filter((paquete) => paquete.oferta)

    // map transforma cada paquete en su HTML y join une todo en un solo texto
    contenedorDestacados.innerHTML = destacados.map(armarTarjetaDestacado).join("")
    contenedorOfertas.innerHTML = ofertas.map(armarTarjetaOferta).join("")
}

export { iniciarInicio }
