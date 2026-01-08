import type {
    NormalizedRecord,
    Filters,
    KPIs,
    EvolutionData,
    Indice50Data,
    ProveedorData,
    MedioPagoData,
    MermaTipoData,
    MermaProductoData,
} from '../types';
import { formatDate, safeDivide } from './helpers';

/**
 * Filter records based on all active filters
 */
export function filterRecords(records: NormalizedRecord[], filters: Filters): NormalizedRecord[] {
    return records.filter(record => {
        // Filter by locales
        if (filters.locales.length > 0 && !filters.locales.includes(record.local)) {
            return false;
        }

        // Filter by date range
        if (filters.fechaDesde) {
            const startOfDay = new Date(filters.fechaDesde);
            startOfDay.setHours(0, 0, 0, 0);
            if (record.date < startOfDay) return false;
        }
        if (filters.fechaHasta) {
            const endOfDay = new Date(filters.fechaHasta);
            endOfDay.setHours(23, 59, 59, 999);
            if (record.date > endOfDay) return false;
        }

        // Filter by source
        if (filters.source !== "Todos" && record.source !== filters.source) {
            return false;
        }

        // Filter by text search (search in multiple fields)
        if (filters.busqueda) {
            const searchLower = filters.busqueda.toLowerCase();
            const searchableFields = [
                record.proveedorCliente,
                record.responsable,
                record.producto,
                record.tipoMerma,
                record.subtipoDoc,
                record.numCheque,
                record.local,
            ].filter(Boolean).join(' ').toLowerCase();

            if (!searchableFields.includes(searchLower)) {
                return false;
            }
        }

        // Source-specific filters (Gastos)
        if (record.source === 'gastos') {
            if (filters.proveedores.length > 0 && record.proveedorCliente &&
                !filters.proveedores.includes(record.proveedorCliente)) {
                return false;
            }
            if (filters.mediosPagoGastos.length > 0 && record.medioPago &&
                !filters.mediosPagoGastos.includes(record.medioPago)) {
                return false;
            }
            if (filters.subtiposDocs.length > 0 && record.subtipoDoc &&
                !filters.subtiposDocs.includes(record.subtipoDoc)) {
                return false;
            }
            if (filters.numCheques.length > 0 && record.numCheque &&
                !filters.numCheques.includes(record.numCheque)) {
                return false;
            }
        }

        // Source-specific filters (Ventas)
        if (record.source === 'ventas') {
            if (filters.responsables.length > 0 && record.responsable &&
                !filters.responsables.includes(record.responsable)) {
                return false;
            }
            if (filters.mediosPagoVentas.length > 0 && record.medioPago &&
                !filters.mediosPagoVentas.includes(record.medioPago)) {
                return false;
            }
        }

        // Source-specific filters (Merma)
        if (record.source === 'merma') {
            if (filters.tiposMerma.length > 0 && record.tipoMerma &&
                !filters.tiposMerma.includes(record.tipoMerma)) {
                return false;
            }
            if (filters.productos.length > 0 && record.producto &&
                !filters.productos.includes(record.producto)) {
                return false;
            }
        }

        return true;
    });
}

/**
 * Calculate KPIs from filtered records
 */
export function calculateKPIs(records: NormalizedRecord[]): KPIs {
    const ventasTotales = records
        .filter(r => r.source === 'ventas')
        .reduce((sum, r) => sum + r.amount, 0);

    const gastosTotales = records
        .filter(r => r.source === 'gastos')
        .reduce((sum, r) => sum + r.amount, 0);

    const mermaTotales = records
        .filter(r => r.source === 'merma')
        .reduce((sum, r) => sum + r.amount, 0);

    const resultadoOperacional = ventasTotales - gastosTotales - mermaTotales;

    // Calculate Índice 50: (Gastos / Ventas) * 100
    const indice50 = safeDivide(gastosTotales, ventasTotales);
    const indice50Value = indice50 !== null ? indice50 * 100 : null;

    let indice50Status: "OK" | "CRITICO" | "N/A";
    if (indice50Value === null) {
        indice50Status = "N/A";
    } else if (indice50Value < 50) {
        indice50Status = "OK";
    } else {
        indice50Status = "CRITICO";
    }

    return {
        ventasTotales,
        gastosTotales,
        mermaTotales,
        resultadoOperacional,
        indice50: indice50Value,
        indice50Status,
    };
}

/**
 * Group records by date for evolution chart (3 lines: ventas, gastos, merma)
 */
export function groupByDateEvolution(records: NormalizedRecord[]): EvolutionData[] {
    const dateMap = new Map<string, { ventas: number; gastos: number; merma: number; fechaDate: Date }>();

    records.forEach(record => {
        const dateKey = formatDate(record.date);
        const current = dateMap.get(dateKey) || { ventas: 0, gastos: 0, merma: 0, fechaDate: record.date };

        if (record.source === 'ventas') {
            current.ventas += record.amount;
        } else if (record.source === 'gastos') {
            current.gastos += record.amount;
        } else if (record.source === 'merma') {
            current.merma += record.amount;
        }

        dateMap.set(dateKey, current);
    });

    return Array.from(dateMap.entries())
        .map(([fecha, data]) => ({
            fecha,
            fechaDate: data.fechaDate,
            ventas: data.ventas,
            gastos: data.gastos,
            merma: data.merma,
        }))
        .sort((a, b) => a.fechaDate.getTime() - b.fechaDate.getTime());
}

/**
 * Calculate Índice 50 over time
 */
export function calculateIndice50OverTime(records: NormalizedRecord[]): Indice50Data[] {
    const dateMap = new Map<string, { ventas: number; gastos: number; fechaDate: Date }>();

    records.forEach(record => {
        const dateKey = formatDate(record.date);
        const current = dateMap.get(dateKey) || { ventas: 0, gastos: 0, fechaDate: record.date };

        if (record.source === 'ventas') {
            current.ventas += record.amount;
        } else if (record.source === 'gastos') {
            current.gastos += record.amount;
        }

        dateMap.set(dateKey, current);
    });

    return Array.from(dateMap.entries())
        .map(([fecha, data]) => ({
            fecha,
            fechaDate: data.fechaDate,
            indice50: safeDivide(data.gastos, data.ventas) !== null
                ? safeDivide(data.gastos, data.ventas)! * 100
                : null,
        }))
        .sort((a, b) => a.fechaDate.getTime() - b.fechaDate.getTime());
}

/**
 * Group gastos by proveedor (Top 10)
 */
export function groupByProveedor(records: NormalizedRecord[]): ProveedorData[] {
    const proveedorMap = new Map<string, number>();

    records
        .filter(r => r.source === 'gastos' && r.proveedorCliente)
        .forEach(record => {
            const proveedor = record.proveedorCliente!;
            const current = proveedorMap.get(proveedor) || 0;
            proveedorMap.set(proveedor, current + record.amount);
        });

    return Array.from(proveedorMap.entries())
        .map(([proveedor, totalGasto]) => ({ proveedor, totalGasto }))
        .sort((a, b) => b.totalGasto - a.totalGasto)
        .slice(0, 10); // Top 10
}

/**
 * Group ventas by medio de pago
 */
export function groupByMedioPago(records: NormalizedRecord[]): MedioPagoData[] {
    const medioPagoMap = new Map<string, number>();

    records
        .filter(r => r.source === 'ventas' && r.medioPago)
        .forEach(record => {
            const medioPago = record.medioPago!;
            const current = medioPagoMap.get(medioPago) || 0;
            medioPagoMap.set(medioPago, current + record.amount);
        });

    const total = Array.from(medioPagoMap.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(medioPagoMap.entries())
        .map(([medioPago, amount]) => ({
            medioPago,
            total: amount,
            porcentaje: total > 0 ? (amount / total) * 100 : 0,
        }))
        .sort((a, b) => b.total - a.total);
}

/**
 * Group merma by tipo
 */
export function groupByMermaTipo(records: NormalizedRecord[]): MermaTipoData[] {
    const tipoMap = new Map<string, number>();

    records
        .filter(r => r.source === 'merma' && r.tipoMerma)
        .forEach(record => {
            const tipo = record.tipoMerma!;
            const current = tipoMap.get(tipo) || 0;
            tipoMap.set(tipo, current + record.amount);
        });

    return Array.from(tipoMap.entries())
        .map(([tipo, total]) => ({ tipo, total }))
        .sort((a, b) => b.total - a.total);
}

/**
 * Group merma by producto (Top 10)
 */
export function groupByMermaProducto(records: NormalizedRecord[]): MermaProductoData[] {
    const productoMap = new Map<string, number>();

    records
        .filter(r => r.source === 'merma' && r.producto)
        .forEach(record => {
            const producto = record.producto!;
            const current = productoMap.get(producto) || 0;
            productoMap.set(producto, current + record.amount);
        });

    return Array.from(productoMap.entries())
        .map(([producto, total]) => ({ producto, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10); // Top 10
}
