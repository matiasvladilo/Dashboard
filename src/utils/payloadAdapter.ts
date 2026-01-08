import type { NormalizedRecord, VentasRaw, GastosRaw, MermaRaw, ValidationWarning, AdapterResult } from '../types';
import { normalizeVentas, normalizeGastos, normalizeMerma } from './normalizers';
import { getValue } from './helpers';

// New type to track rejected records
export interface RejectedRecord {
    rawData: any;
    reason: string;
    detectedSource?: "ventas" | "gastos" | "merma" | null;
    index: number;
}

/**
 * Detect source type from raw data object
 * Uses field presence to infer source when 'source' field is missing
 */
function detectSource(raw: any): "ventas" | "gastos" | "merma" | null {
    // Check if source field exists
    const explicitSource = getValue(raw, ['source', 'Source', 'SOURCE']);
    if (explicitSource) {
        const normalized = explicitSource.toString().toLowerCase();
        if (normalized.includes('venta')) return 'ventas';
        if (normalized.includes('gasto')) return 'gastos';
        if (normalized.includes('merma')) return 'merma';
    }

    // Infer from field presence
    // Ventas: has "Total Venta"
    if (getValue(raw, ['Total Venta', 'total venta', 'TotalVenta', 'venta'])) {
        return 'ventas';
    }

    // Gastos: has "Total Factura" or "Proveedor/Cliente"
    if (getValue(raw, ['Total Factura', 'total factura', 'TotalFactura', 'Factura']) ||
        getValue(raw, ['Proveedor/Cliente', 'Proveedor', 'proveedor'])) {
        return 'gastos';
    }

    // Merma: has "PRODUCTO" and "MONTO"
    if (getValue(raw, ['PRODUCTO', 'Producto', 'producto']) &&
        getValue(raw, ['MONTO', 'Monto', 'monto'])) {
        return 'merma';
    }

    return null;
}

/**
 * Check if payload is in separated format (object with ventas/gastos/merma arrays)
 */
function isSeparatedPayload(payload: any): payload is { ventas?: any[], gastos?: any[], merma?: any[] } {
    return payload &&
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        (Array.isArray(payload.ventas) || Array.isArray(payload.gastos) || Array.isArray(payload.merma));
}

/**
 * Main adapter function with enhanced error tracking
 * Accepts multiple payload formats and normalizes to unified NormalizedRecord[]
 */
export function adaptPayload(rawPayload: unknown, defaultLocal: string = 'N/A'): AdapterResult & { rejectedRecords: RejectedRecord[] } {
    const warnings: ValidationWarning[] = [];
    const records: NormalizedRecord[] = [];
    const rejectedRecords: RejectedRecord[] = [];

    try {
        // Handle null/undefined
        if (!rawPayload) {
            warnings.push({
                level: 'error',
                message: 'Payload is null or undefined',
            });
            return { records, warnings, rejectedRecords };
        }

        let dataArray: any[] = [];

        // Case 1: Separated payload {ventas: [], gastos: [], merma: []}
        if (isSeparatedPayload(rawPayload)) {
            console.log('✓ Detected separated payload format');

            if (rawPayload.ventas && Array.isArray(rawPayload.ventas)) {
                dataArray.push(...rawPayload.ventas.map(v => ({ ...v, source: 'ventas' as const })));
            }
            if (rawPayload.gastos && Array.isArray(rawPayload.gastos)) {
                dataArray.push(...rawPayload.gastos.map(g => ({ ...g, source: 'gastos' as const })));
            }
            if (rawPayload.merma && Array.isArray(rawPayload.merma)) {
                dataArray.push(...rawPayload.merma.map(m => ({ ...m, source: 'merma' as const })));
            }

            console.log(`✓ Loaded ${dataArray.length} records from separated payload`);
        }
        // Case 2: Unified array or wrapped array
        else if (Array.isArray(rawPayload)) {
            console.log('✓ Detected unified array payload');
            dataArray = rawPayload;
        }
        // Case 3: Wrapped in data field
        else if (typeof rawPayload === 'object' && 'data' in rawPayload && Array.isArray((rawPayload as any).data)) {
            console.log('✓ Detected wrapped payload with "data" field');
            dataArray = (rawPayload as any).data;
        }
        else {
            warnings.push({
                level: 'error',
                message: 'Unknown payload format. Expected array or object with ventas/gastos/merma fields.',
            });
            return { records, warnings, rejectedRecords };
        }

        // Process each raw record
        let skippedRecords = 0;
        let invalidSourceRecords = 0;

        dataArray.forEach((raw, index) => {
            const source = detectSource(raw);

            if (!source) {
                invalidSourceRecords++;
                rejectedRecords.push({
                    rawData: raw,
                    reason: 'No se pudo detectar el tipo de fuente (ventas/gastos/merma). Faltan campos clave.',
                    detectedSource: null,
                    index,
                });
                console.warn(`⚠ Record #${index + 1}: Could not detect source, skipping`, raw);
                return;
            }

            try {
                let normalized: NormalizedRecord | null = null;

                switch (source) {
                    case 'ventas':
                        normalized = normalizeVentas(raw as VentasRaw, defaultLocal);
                        break;
                    case 'gastos':
                        normalized = normalizeGastos(raw as GastosRaw, defaultLocal);
                        break;
                    case 'merma':
                        normalized = normalizeMerma(raw as MermaRaw, defaultLocal);
                        break;
                }

                if (normalized) {
                    // Validate critical fields
                    if (!normalized.date || isNaN(normalized.date.getTime())) {
                        rejectedRecords.push({
                            rawData: raw,
                            reason: `Fecha inválida o faltante. Valor recibido: "${getValue(raw, ['date', 'Fecha', 'fecha'])}"`,
                            detectedSource: source,
                            index,
                        });
                        console.warn(`⚠ Record #${index + 1}: Invalid date, skipping`, raw);
                        skippedRecords++;
                        return;
                    }

                    if (normalized.amount === 0) {
                        console.warn(`⚠ Record #${index + 1}: Amount is 0`, raw);
                    }

                    records.push(normalized);
                } else {
                    // normalizeGastos can return null for non-GASTO records
                    rejectedRecords.push({
                        rawData: raw,
                        reason: source === 'gastos'
                            ? 'Registro de gastos con Tipo != "GASTO" (fue filtrado intencionalmente)'
                            : 'Error al normalizar el registro',
                        detectedSource: source,
                        index,
                    });
                    skippedRecords++;
                }
            } catch (error) {
                console.error(`❌ Error normalizing record #${index + 1}:`, error, raw);
                rejectedRecords.push({
                    rawData: raw,
                    reason: `Error al procesar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                    detectedSource: source,
                    index,
                });
                skippedRecords++;
            }
        });

        // Add warnings if records were skipped
        if (invalidSourceRecords > 0) {
            warnings.push({
                level: 'warning',
                message: `${invalidSourceRecords} registro(s) sin source detectado fueron omitidos`,
                affectedRecords: invalidSourceRecords,
            });
        }

        if (skippedRecords > 0) {
            warnings.push({
                level: 'warning',
                message: `${skippedRecords} registro(s) no pudieron ser procesados`,
                affectedRecords: skippedRecords,
            });
        }

        console.log(`✓ Successfully normalized ${records.length} records`);
        console.log(`  - Ventas: ${records.filter(r => r.source === 'ventas').length}`);
        console.log(`  - Gastos: ${records.filter(r => r.source === 'gastos').length}`);
        console.log(`  - Merma: ${records.filter(r => r.source === 'merma').length}`);
        console.log(`  - Rechazados: ${rejectedRecords.length}`);

        return { records, warnings, rejectedRecords };

    } catch (error) {
        console.error('❌ Fatal error in adaptPayload:', error);
        warnings.push({
            level: 'error',
            message: `Error fatal: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        });
        return { records, warnings, rejectedRecords };
    }
}
