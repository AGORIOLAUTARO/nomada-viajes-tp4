// TESTS UNITARIOS DE LAS FUNCIONES DE FORMATO (testing nativo de Node)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatearPrecio, formatearFecha, capitalizar, obtenerPrecioFinal } from '../recursos/js/utilidades/formatos.js'

test('formatearPrecio agrega el signo $ y los puntos de miles', () => {
    assert.equal(formatearPrecio(420000), '$420.000')
})

test('formatearFecha convierte AAAA-MM-DD en DD/MM/AAAA', () => {
    assert.equal(formatearFecha('2026-12-10'), '10/12/2026')
})

test('capitalizar pone en mayúscula la primera letra', () => {
    assert.equal(capitalizar('aventura'), 'Aventura')
})

test('obtenerPrecioFinal usa el precio de oferta si existe', () => {
    assert.equal(obtenerPrecioFinal({ precio: 340000, precioOferta: 272000 }), 272000)
    assert.equal(obtenerPrecioFinal({ precio: 420000, precioOferta: null }), 420000)
})
