// TESTS UNITARIOS DE LOS FILTROS DEL CATÁLOGO (testing nativo de Node)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filtrarPaquetes } from '../recursos/js/formularios/filtrosCatalogo.js'

// Datos de prueba con la misma forma que paquetes.json
const paquetes = [
    { id: 'bariloche', destino: 'Bariloche', precio: 420000, tipoViaje: 'aventura', fechaSalida: '2026-12-10' },
    { id: 'rio-de-janeiro', destino: 'Río de Janeiro', precio: 610000, tipoViaje: 'playa', fechaSalida: '2027-02-20' },
    { id: 'buenos-aires', destino: 'Buenos Aires', precio: 150000, tipoViaje: 'ciudad', fechaSalida: '2026-11-27' }
]
const sinFiltros = { destino: '', fechaDesde: '', fechaHasta: '', precioMin: '', precioMax: '', tiposViaje: [] }

test('sin criterios devuelve todos los paquetes', () => {
    assert.equal(filtrarPaquetes(paquetes, sinFiltros).length, 3)
})

test('filtra por destino aunque tenga tildes (rio-de-janeiro encuentra "Río de Janeiro")', () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, destino: 'rio-de-janeiro' })
    assert.deepEqual(resultado.map((p) => p.id), ['rio-de-janeiro'])
})

test('filtra por rango de precio', () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, precioMin: '200000', precioMax: '500000' })
    assert.deepEqual(resultado.map((p) => p.id), ['bariloche'])
})

test('filtra por tipo de viaje', () => {
    const resultado = filtrarPaquetes(paquetes, { ...sinFiltros, tiposViaje: ['playa', 'ciudad'] })
    assert.deepEqual(resultado.map((p) => p.id), ['rio-de-janeiro', 'buenos-aires'])
})

test('no modifica el arreglo original', () => {
    filtrarPaquetes(paquetes, { ...sinFiltros, tiposViaje: ['playa'] })
    assert.equal(paquetes.length, 3)
})
