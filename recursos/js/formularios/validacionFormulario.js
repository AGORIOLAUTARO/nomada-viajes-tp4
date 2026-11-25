// VALIDACIÓN DEL FORMULARIO DE RESERVA
// Valida cada campo con JavaScript y muestra los errores debajo de cada uno
// El envío (WhatsApp) lo maneja formularioReserva.js, que usa la función que devuelve iniciarValidacion

//Funciones de validación
// Cada una recibe el texto del campo y devuelve el mensaje de error, o "" si está bien

function validarNombre(valor) {
    if (valor.trim() === "") {
        return "Ingresá tu nombre y apellido."
    }
    if (valor.trim().length < 3) {
        return "El nombre es demasiado corto."
    }
    // Solo letras (con tildes y ñ), espacios, apóstrofes y guiones
    if (!/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ' -]+$/.test(valor.trim())) {
        return "El nombre solo puede tener letras y espacios."
    }
    return ""
}

function validarDni(valor) {
    // Se aceptan puntos por si escribe 12.345.678
    const dni = valor.trim().replace(/\./g, "")
    if (dni === "") {
        return "Ingresá tu DNI."
    }
    if (!/^\d{7,8}$/.test(dni)) {
        return "El DNI debe tener 7 u 8 números, sin letras."
    }
    return ""
}

function validarEmail(valor) {
    if (valor.trim() === "") {
        return "Ingresá tu correo electrónico."
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
        return "Ingresá un correo válido, por ejemplo nombre@correo.com."
    }
    return ""
}

function validarTelefono(valor) {
    if (valor.trim() === "") {
        return "Ingresá tu teléfono de contacto."
    }
    // Se permiten espacios, guiones, paréntesis y + al escribirlo
    if (!/^[\d\s()+-]+$/.test(valor.trim())) {
        return "El teléfono solo puede tener números, espacios, guiones y paréntesis."
    }
    const cantidadNumeros = valor.replace(/\D/g, "").length
    if (cantidadNumeros < 8 || cantidadNumeros > 15) {
        return "El teléfono debe tener entre 8 y 15 números."
    }
    return ""
}

// Arma la fecha de hoy como AAAA-MM-DD (el mismo formato que devuelve input type="date")
function obtenerHoyTexto() {
    const hoy = new Date()
    const mes = String(hoy.getMonth() + 1).padStart(2, "0")
    const dia = String(hoy.getDate()).padStart(2, "0")
    return `${hoy.getFullYear()}-${mes}-${dia}`
}

function validarFecha(valor) {
    // La fecha es opcional: si está vacía no se valida
    if (valor === "") {
        return ""
    }
    if (valor < obtenerHoyTexto()) {
        return "La fecha de viaje no puede ser anterior a hoy."
    }
    return ""
}

//Funciones para mostrar y borrar errores 

// Muestra el mensaje debajo del campo (lo crea la primera vez)
function mostrarError(campo, mensaje) {
    let elementoError = campo.parentElement.querySelector(".mensaje-error")
    if (!elementoError) {
        elementoError = document.createElement("p")
        elementoError.className = "mensaje-error"
        elementoError.id = `error-${campo.id}`
        campo.insertAdjacentElement("afterend", elementoError)
    }
    elementoError.textContent = mensaje
    campo.setAttribute("aria-invalid", "true")
    campo.setAttribute("aria-describedby", elementoError.id)
}

function limpiarError(campo) {
    const elementoError = campo.parentElement.querySelector(".mensaje-error")
    if (elementoError) {
        elementoError.remove()
    }
    campo.removeAttribute("aria-invalid")
    campo.removeAttribute("aria-describedby")
}

// Función principal

// Prepara la validación y devuelve una función que valida todo el formulario de una vez
function iniciarValidacion(formulario) {
    // Referenciamos los campos a partir de su ID
    const campoNombre = formulario.querySelector("#nombre")
    const campoDni = formulario.querySelector("#dni")
    const campoEmail = formulario.querySelector("#email")
    const campoTelefono = formulario.querySelector("#telefono")
    const campoFecha = formulario.querySelector("#fecha")

    // Cada campo con su función de validación
    const validaciones = [
        { campo: campoNombre, validar: validarNombre },
        { campo: campoDni, validar: validarDni },
        { campo: campoEmail, validar: validarEmail },
        { campo: campoTelefono, validar: validarTelefono },
        { campo: campoFecha, validar: validarFecha }
    ]

    // Validación HTML: el calendario no deja elegir días anteriores a hoy (atributo min)
    campoFecha.setAttribute("min", obtenerHoyTexto())

    // Desactivamos los avisos del navegador para mostrar los nuestros
    // (si JavaScript no carga, siguen funcionando las validaciones HTML: required, type="email", pattern...)
    formulario.setAttribute("novalidate", "")

    // Valida un campo y muestra o borra su error. Devuelve true si está bien
    function validarCampo(item) {
        const mensaje = item.validar(item.campo.value)
        if (mensaje !== "") {
            mostrarError(item.campo, mensaje)
            return false
        }
        limpiarError(item.campo)
        return true
    }

    // Escuchadores: al salir de un campo se valida; al escribir se borra el error mostrado
    validaciones.forEach((item) => {
        item.campo.addEventListener("blur", () => {
            validarCampo(item)
        })
        item.campo.addEventListener("input", () => {
            if (item.campo.getAttribute("aria-invalid") === "true") {
                validarCampo(item)
            }
        })
    })

    // Valida todos los campos. Si hay errores lleva al usuario al primero y devuelve false
    function validarFormulario() {
        let primerCampoConError = null

        validaciones.forEach((item) => {
            const esValido = validarCampo(item)
            if (!esValido && primerCampoConError === null) {
                primerCampoConError = item.campo
            }
        })

        if (primerCampoConError !== null) {
            primerCampoConError.focus()
            return false
        }
        return true
    }

    return validarFormulario
}

export { iniciarValidacion }
