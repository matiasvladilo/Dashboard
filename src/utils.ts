import { parse, format, isValid, parseISO } from 'date-fns';
import type { RawDataItem, FinancialRecord, Filters, CategoryData, ChannelData, TimeSeriesData } from './types';

// Parsea una fecha en formato dd/MM/yyyy a Date
export function parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();

    // Intentar formato DD/MM/YYYY
    let parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    if (isValid(parsed)) return parsed;

    // Intentar formato ISO
    parsed = parseISO(dateStr);
    if (isValid(parsed)) return parsed;

    // Intentar new Date() estándar
    parsed = new Date(dateStr);
    if (isValid(parsed)) return parsed;

    console.warn(`Fecha inválida recibida: ${dateStr}, usando fecha actual`);
    return new Date();
}

// Formatea una fecha a dd/MM/yyyy
export function formatDate(date: Date): string {
    return format(date, 'dd/MM/yyyy');
}

// Formatea un número como euros
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

// Helper para buscar claves ignorando mayúsculas/minúsculas y espacios extra
function getValue(obj: any, key: string): any {
    if (obj[key] !== undefined) return obj[key];
    const normalizedKey = key.toLowerCase().trim();
    const foundKey = Object.keys(obj).find(k => k.toLowerCase().trim() === normalizedKey || k.toLowerCase().includes(normalizedKey));
    return foundKey ? obj[foundKey] : undefined;
}

// Convierte un registro crudo del webhook a formato interno
export function parseRecord(raw: RawDataItem): FinancialRecord {
    const rawObj = raw as any;

    // Buscar importe en varias variantes comunes
    let importeRaw = getValue(rawObj, "Importe (€)") || getValue(rawObj, "Importe") || getValue(rawObj, "Amount") || getValue(rawObj, "Total") || "0";

    const importe = typeof importeRaw === 'number' ? importeRaw : parseFloat(importeRaw.toString().replace(',', '.').replace(/[^\d.-]/g, ''));

    const tipoRaw = getValue(rawObj, "Tipo") || "Ingreso";
    const normalizedTipo = String(tipoRaw).toLowerCase();

    // Simplificar lógica de tipo
    const tipo = (normalizedTipo.includes("gasto") || normalizedTipo.includes("egreso") || normalizedTipo.includes("expense")) ? "Gasto" : "Ingreso";

    return {
        rowNumber: Number(getValue(rawObj, "row_number") || 0),
        fecha: parseDate(getValue(rawObj, "Fecha") || getValue(rawObj, "Date") || ""),
        tipo: tipo as "Ingreso" | "Gasto",
        categoria: getValue(rawObj, "Categoría") || getValue(rawObj, "Categoria") || getValue(rawObj, "Category") || "Sin categoría",
        canal: getValue(rawObj, "Canal") || getValue(rawObj, "Channel") || "Otros",
        referencia: getValue(rawObj, "#") || getValue(rawObj, "Ref") || getValue(rawObj, "Referencia") || "-",
        importe: isNaN(importe) ? 0 : importe,
        estadoPago: getValue(rawObj, "Estado de Pago") || "Pendiente",
        descripcion: getValue(rawObj, "Descripción Adicional") || getValue(rawObj, "Descripcion") || "",
    };
}

// Aplica todos los filtros a los registros
export function filterRecords(records: FinancialRecord[], filters: Filters): FinancialRecord[] {
    return records.filter(record => {
        // Filtro por fecha desde
        if (filters.fechaDesde && record.fecha < filters.fechaDesde) {
            return false;
        }

        // Filtro por fecha hasta
        if (filters.fechaHasta && record.fecha > filters.fechaHasta) {
            return false;
        }

        // Filtro por tipo
        if (filters.tipo !== "Todos" && record.tipo !== filters.tipo) {
            return false;
        }

        // Filtro por categorías
        if (filters.categorias.length > 0 && !filters.categorias.includes(record.categoria)) {
            return false;
        }

        // Filtro por canales
        if (filters.canales.length > 0 && !filters.canales.includes(record.canal)) {
            return false;
        }

        // Filtro por estado de pago
        if (filters.estadoPago !== "Todos" && record.estadoPago !== filters.estadoPago) {
            return false;
        }

        // Filtro por búsqueda de texto
        if (filters.busqueda) {
            const searchLower = filters.busqueda.toLowerCase();
            const matchDescripcion = record.descripcion.toLowerCase().includes(searchLower);
            const matchReferencia = record.referencia.toLowerCase().includes(searchLower);
            if (!matchDescripcion && !matchReferencia) {
                return false;
            }
        }

        return true;
    });
}

// Calcula KPIs a partir de los registros filtrados
export function calculateKPIs(records: FinancialRecord[]) {
    const ingresosTotales = records
        .filter(r => r.tipo === "Ingreso")
        .reduce((sum, r) => sum + r.importe, 0);

    const gastosTotales = Math.abs(
        records
            .filter(r => r.tipo === "Gasto")
            .reduce((sum, r) => sum + r.importe, 0)
    );

    const beneficioNeto = ingresosTotales - gastosTotales;

    // Calcular categoría más rentable
    const categoriaMap = new Map<string, number>();
    records.forEach(r => {
        const current = categoriaMap.get(r.categoria) || 0;
        categoriaMap.set(r.categoria, current + r.importe);
    });

    let categoriaMasRentable = { nombre: "-", importe: 0 };
    categoriaMap.forEach((importe, categoria) => {
        if (importe > categoriaMasRentable.importe) {
            categoriaMasRentable = { nombre: categoria, importe };
        }
    });

    // Número de operaciones
    const numeroOperaciones = records.length;

    // Ticket medio servicios
    const servicios = records.filter(r => r.categoria === "Servicios" && r.tipo === "Ingreso");
    const ticketMedioServicios = servicios.length > 0
        ? servicios.reduce((sum, r) => sum + r.importe, 0) / servicios.length
        : 0;

    return {
        ingresosTotales,
        gastosTotales,
        beneficioNeto,
        categoriaMasRentable,
        numeroOperaciones,
        ticketMedioServicios,
    };
}

// Agrupa datos por categoría para el gráfico de barras
export function groupByCategory(records: FinancialRecord[]): CategoryData[] {
    const categoryMap = new Map<string, { ingresos: number; gastos: number }>();

    records.forEach(record => {
        const current = categoryMap.get(record.categoria) || { ingresos: 0, gastos: 0 };
        if (record.tipo === "Ingreso") {
            current.ingresos += record.importe;
        } else {
            current.gastos += Math.abs(record.importe);
        }
        categoryMap.set(record.categoria, current);
    });

    return Array.from(categoryMap.entries()).map(([categoria, data]) => ({
        categoria,
        ingresos: data.ingresos,
        gastos: data.gastos,
        beneficio: data.ingresos - data.gastos,
    }));
}

// Agrupa datos por canal para el gráfico horizontal
export function groupByChannel(records: FinancialRecord[]): ChannelData[] {
    const channelMap = new Map<string, number>();

    records
        .filter(r => r.tipo === "Ingreso")
        .forEach(record => {
            const current = channelMap.get(record.canal) || 0;
            channelMap.set(record.canal, current + record.importe);
        });

    return Array.from(channelMap.entries())
        .map(([canal, ingresos]) => ({ canal, ingresos }))
        .sort((a, b) => b.ingresos - a.ingresos);
}

// Agrupa datos por fecha para el gráfico de líneas
export function groupByDate(records: FinancialRecord[]): TimeSeriesData[] {
    const dateMap = new Map<string, { ingresos: number; gastos: number; fechaDate: Date }>();

    records.forEach(record => {
        const dateKey = formatDate(record.fecha);
        const current = dateMap.get(dateKey) || { ingresos: 0, gastos: 0, fechaDate: record.fecha };
        if (record.tipo === "Ingreso") {
            current.ingresos += record.importe;
        } else {
            current.gastos += Math.abs(record.importe);
        }
        dateMap.set(dateKey, current);
    });

    return Array.from(dateMap.entries())
        .map(([fecha, data]) => ({
            fecha,
            fechaDate: data.fechaDate,
            ingresos: data.ingresos,
            gastos: data.gastos,
        }))
        .sort((a, b) => a.fechaDate.getTime() - b.fechaDate.getTime());
}

// Obtiene valores únicos de un campo
export function getUniqueValues<T, K extends keyof T>(records: T[], key: K): T[K][] {
    return [...new Set(records.map(r => r[key]))];
}

// Calcula distribución de ingresos por categoría para el donut
export function getIncomeDistribution(records: FinancialRecord[]): { categoria: string; valor: number; porcentaje: number }[] {
    const ingresos = records.filter(r => r.tipo === "Ingreso");
    const total = ingresos.reduce((sum, r) => sum + r.importe, 0);

    const categoryMap = new Map<string, number>();
    ingresos.forEach(record => {
        const current = categoryMap.get(record.categoria) || 0;
        categoryMap.set(record.categoria, current + record.importe);
    });

    return Array.from(categoryMap.entries())
        .map(([categoria, valor]) => ({
            categoria,
            valor,
            porcentaje: total > 0 ? (valor / total) * 100 : 0,
        }))
        .sort((a, b) => b.valor - a.valor);
}
