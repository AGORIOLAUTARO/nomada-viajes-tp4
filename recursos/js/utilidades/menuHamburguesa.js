// MENÚ HAMBURGUESA: abre y cierra el menú en pantallas chicas
// Antes este código estaba suelto dentro de index.js

function iniciarMenuHamburguesa(encabezado, botonAbrir, botonCerrar) {
    // Escuchador: el botón de las tres rayas abre el menú
    botonAbrir.addEventListener("click", () => {
        encabezado.classList.add("menu-abierto")
        botonAbrir.setAttribute("aria-expanded", "true")
    })

    // Escuchador: el botón de la cruz cierra el menú
    botonCerrar.addEventListener("click", () => {
        encabezado.classList.remove("menu-abierto")
        botonAbrir.setAttribute("aria-expanded", "false")
    })

    // Escuchador: la tecla Escape también cierra el menú
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            encabezado.classList.remove("menu-abierto")
            botonAbrir.setAttribute("aria-expanded", "false")
        }
    })
}

export { iniciarMenuHamburguesa }
