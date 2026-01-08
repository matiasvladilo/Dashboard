// ========================================
// RAW DATA TYPES (from n8n/Google Sheets)
// ========================================

// Raw data from Ventas
export interface VentasRaw {
    source?: "ventas";
    local?: string;
    date?: string;
    "Total Venta"?: string | number;
    Responsable?: string;
    "Medio de Pago"?: string;
    [key: string]: any; // Allow other fields
}

// Raw data from Gastos
export interface GastosRaw {
    source?: "gastos";
    local?: string;
    date?: string;
    "Total Factura"?: string | number;
    "Tipo (Ingreso/Gasto)"?: string;
    "Proveedor/Cliente"?: string;
    "Medio de Pago"?: string;
    "Subtipo Doc"?: string;
    "N° Cheque"?: string;
    [key: string]: any;
}

// Raw data from Merma
export interface MermaRaw {
    source?: "merma";
    local?: string;
    date?: string;
    PRODUCTO?: string;
    TIPO?: string;
    MONTO?: string | number;
    [key: string]: any;
}

// Union type for raw data
export type RawDataItem = VentasRaw | GastosRaw | MermaRaw;

// Payload formats from n8n
export interface PayloadUnificado {
    data: RawDataItem[]; // Unified array with source field
}

export interface PayloadSeparado {
    ventas?: VentasRaw[];
    gastos?: GastosRaw[];
    merma?: MermaRaw[];
}

export type N8nPayload = PayloadUnificado | PayloadSeparado | RawDataItem[];

// ========================================
// NORMALIZED DATA TYPES (internal use)
// ========================================

export interface NormalizedRecord {
    // Common fields (required for all sources)
    local: string;
    date: Date;
    source: "ventas" | "gastos" | "merma";
    amount: number;

    // Source-specific fields (optional)
    // Ventas
    responsable?: string;
    medioPago?: string;

    // Gastos
    tipoIngresogasto?: string;
    proveedorCliente?: string;
    subtipoDoc?: string;
    numCheque?: string;

    // Merma
    producto?: string;
    tipoMerma?: string;

    // Generic/shared
    descripcion?: string;
    referencia?: string;
    [key: string]: any; // Allow additional fields
}

// ========================================
// FILTER TYPES
// ========================================

export interface Filters {
    // Global filters
    locales: string[]; // Multi-select
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    source: "Todos" | "ventas" | "gastos" | "merma";
    busqueda: string;

    // Source-specific filters
    // Gastos
    proveedores: string[];
    mediosPagoGastos: string[];
    subtiposDocs: string[];
    numCheques: string[];

    // Ventas
    responsables: string[];
    mediosPagoVentas: string[];

    // Merma
    tiposMerma: string[];
    productos: string[];
}

export interface ComparisonSettings {
    enabled: boolean;
    fechaDesdeB: Date | null;
    fechaHastaB: Date | null;
}

// ========================================
// KPI TYPES
// ========================================

export interface KPIs {
    ventasTotales: number;
    gastosTotales: number;
    mermaTotales: number;
    resultadoOperacional: number;
    indice50: number | null; // null if ventas = 0
    indice50Status: "OK" | "CRITICO" | "N/A";
}

// ========================================
// CHART DATA TYPES
// ========================================

// Evolution chart (multi-source time series)
export interface EvolutionData {
    fecha: string;
    fechaDate: Date;
    ventas: number;
    gastos: number;
    merma: number;
}

// Indice 50 over time
export interface Indice50Data {
    fecha: string;
    fechaDate: Date;
    indice50: number | null;
}

// Top proveedores (gastos)
export interface ProveedorData {
    proveedor: string;
    totalGasto: number;
}

// Medio de pago distribution (ventas)
export interface MedioPagoData {
    medioPago: string;
    total: number;
    porcentaje: number;
}

// Merma por tipo
export interface MermaTipoData {
    tipo: string;
    total: number;
}

// Merma por producto
export interface MermaProductoData {
    producto: string;
    total: number;
}

// ========================================
// VALIDATION TYPES
// ========================================

export interface ValidationWarning {
    level: "warning" | "error";
    message: string;
    affectedRecords?: number;
}

export interface AdapterResult {
    records: NormalizedRecord[];
    warnings: ValidationWarning[];
}
