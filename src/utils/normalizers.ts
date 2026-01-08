import type { VentasRaw, GastosRaw, MermaRaw, NormalizedRecord } from '../types';
import { parseDate, getValue, parseNumeric } from './helpers';

/**
 * Normalize Ventas record to common format
 */
export function normalizeVentas(raw: VentasRaw, defaultLocal: string = 'N/A'): NormalizedRecord {
    const local = getValue(raw, ['local', 'Local', 'LOCAL']) || defaultLocal;
    const dateStr = getValue(raw, ['date', 'Fecha', 'fecha', 'Date', 'FECHA']) || '';
    const totalVenta = getValue(raw, ['Total Venta', 'total venta', 'TotalVenta', 'venta', 'Venta']) || 0;
    const responsable = getValue(raw, ['Responsable', 'responsable', 'RESPONSABLE']);
    const medioPago = getValue(raw, ['Medio de Pago', 'medio de pago', 'MedioDePago', 'medioPago']);

    return {
        local,
        date: parseDate(dateStr),
        source: 'ventas',
        amount: parseNumeric(totalVenta),
        responsable,
        medioPago,
    };
}

/**
 * Normalize Gastos record to common format
 * IMPORTANT: Only include if Tipo (Ingreso/Gasto) === "GASTO"
 */
export function normalizeGastos(raw: GastosRaw, defaultLocal: string = 'N/A'): NormalizedRecord | null {
    const tipo = getValue(raw, ['Tipo (Ingreso/Gasto)', 'Tipo', 'tipo', 'TIPO']) || '';

    // Filter: only process GASTO records
    if (!tipo.toString().toLowerCase().includes('gasto')) {
        return null; // Skip this record
    }

    const local = getValue(raw, ['local', 'Local', 'LOCAL']) || defaultLocal;
    const dateStr = getValue(raw, ['date', 'Fecha', 'fecha', 'Date', 'FECHA']) || '';
    const totalFactura = getValue(raw, ['Total Factura', 'total factura', 'TotalFactura', 'Factura']) || 0;
    const proveedorCliente = getValue(raw, ['Proveedor/Cliente', 'Proveedor', 'proveedor', 'Cliente', 'cliente']);
    const medioPago = getValue(raw, ['Medio de Pago', 'medio de pago', 'MedioDePago', 'medioPago']);
    const subtipoDoc = getValue(raw, ['Subtipo Doc', 'subtipo doc', 'SubtipoDoc', 'Subtipo']);
    const numCheque = getValue(raw, ['N° Cheque', 'N Cheque', 'Cheque', 'cheque', 'NumCheque']);

    return {
        local,
        date: parseDate(dateStr),
        source: 'gastos',
        amount: parseNumeric(totalFactura),
        tipoIngresogasto: tipo.toString(),
        proveedorCliente,
        medioPago,
        subtipoDoc,
        numCheque,
    };
}

/**
 * Normalize Merma record to common format
 */
export function normalizeMerma(raw: MermaRaw, defaultLocal: string = 'N/A'): NormalizedRecord {
    const local = getValue(raw, ['local', 'Local', 'LOCAL']) || defaultLocal;
    const dateStr = getValue(raw, ['date', 'Fecha', 'fecha', 'Date', 'FECHA']) || '';
    const monto = getValue(raw, ['MONTO', 'Monto', 'monto', 'Total', 'total']) || 0;
    const producto = getValue(raw, ['PRODUCTO', 'Producto', 'producto']);
    const tipoMerma = getValue(raw, ['TIPO', 'Tipo', 'tipo', 'TipoMerma']);

    return {
        local,
        date: parseDate(dateStr),
        source: 'merma',
        amount: parseNumeric(monto),
        producto,
        tipoMerma,
    };
}
