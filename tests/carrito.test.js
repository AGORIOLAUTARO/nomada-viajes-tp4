// TESTS UNITARIOS DEL CARRITO (testing nativo de Node: node:test + node:assert)
// Se ejecutan con: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcularSubtotal, calcularTotal } from '../recursos/js/servicios/almacenCarrito.js'

test('calcularSubtotal multiplica el precio por persona por la cantidad de personas', () => {
    const item = { id: 'bariloche', precioUnitario: 420000, personas: 2 }
    assert.equal(calcularSubtotal(item), 840000)
})

test('calcularTotal suma los subtotales de todos los paquetes del carrito', () => {
    const carrito = [
        { id: 'bariloche', precioUnitario: 420000, personas: 2 },
        { id: 'mendoza', precioUnitario: 272000, personas: 3 }
    ]
    assert.equal(calcularTotal(carrito), 1656000)
})

test('calcularTotal devuelve 0 si el carrito está vacío', () => {
    assert.equal(calcularTotal([]), 0)
})
