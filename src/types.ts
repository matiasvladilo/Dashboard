// Estructura del JSON que viene del webhook
export interface RawDataItem {
    row_number: number;
    "Fecha": string;
    "Tipo": string;
    "Categoría": string;
    "Canal": string;
    "#": string;
    "Importe (€)": string;
    "Estado de Pago": string;
    "Descripción Adicional": string;
    // Campos opcionales o alternativos
    importe?: string | number;
}

// Estructura normalizada interna
export interface FinancialRecord {
    rowNumber: number;
    fecha: Date;
    tipo: "Ingreso" | "Gasto";
    categoria: string;
    canal: string;
    referencia: string;
    importe: number;
    estadoPago: string;
    descripcion: string;
}

// Estado de los filtros
export interface Filters {
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    tipo: "Todos" | "Ingreso" | "Gasto";
    categorias: string[];
    canales: string[];
    estadoPago: "Todos" | "Pagado" | "Pendiente";
    busqueda: string;
}

// Datos agregados por categoría
export interface CategoryData {
    categoria: string;
    ingresos: number;
    gastos: number;
    beneficio: number;
}

// Datos agregados por canal
export interface ChannelData {
    canal: string;
    ingresos: number;
}

// Datos para gráfico temporal
export interface TimeSeriesData {
    fecha: string;
    fechaDate: Date;
    ingresos: number;
    gastos: number;
}
