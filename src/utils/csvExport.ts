import type { NormalizedRecord } from '../types';
import { formatDate, formatCurrency } from './helpers';

/**
 * Export records to CSV file
 * @param records - Array of normalized records to export
 * @param source - Source type (ventas, gastos, merma, or 'all')
 * @param filename - Optional custom filename
 */
export function exportToCSV(
    records: NormalizedRecord[],
    source: 'ventas' | 'gastos' | 'merma' | 'all' = 'all',
    filename?: string
): void {
    if (records.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Filter by source if specified
    const filteredRecords = source === 'all'
        ? records
        : records.filter(r => r.source === source);

    if (filteredRecords.length === 0) {
        alert(`No hay datos de ${source} para exportar`);
        return;
    }

    let csvContent = '';
    let headers: string[] = [];
    const rows: string[][] = [];

    // Define columns based on source
    if (source === 'ventas' || (source === 'all' && filteredRecords.some(r => r.source === 'ventas'))) {
        headers = ['Fecha', 'Local', 'Total Venta', 'Responsable', 'Medio de Pago'];

        filteredRecords
            .filter(r => r.source === 'ventas')
            .forEach(record => {
                rows.push([
                    formatDate(record.date),
                    record.local,
                    formatCurrency(record.amount),
                    record.responsable || '',
                    record.medioPago || '',
                ]);
            });
    }

    if (source === 'gastos' || (source === 'all' && filteredRecords.some(r => r.source === 'gastos'))) {
        if (source === 'all') {
            // Add separator if mixing sources
            if (rows.length > 0) {
                rows.push(['', '', '', '', '']);
                rows.push(['=== GASTOS ===', '', '', '', '']);
            }
        }

        headers = ['Fecha', 'Local', 'Total Factura', 'Proveedor/Cliente', 'Medio de Pago', 'Subtipo Doc', 'N° Cheque'];

        filteredRecords
            .filter(r => r.source === 'gastos')
            .forEach(record => {
                rows.push([
                    formatDate(record.date),
                    record.local,
                    formatCurrency(record.amount),
                    record.proveedorCliente || '',
                    record.medioPago || '',
                    record.subtipoDoc || '',
                    record.numCheque || '',
                ]);
            });
    }

    if (source === 'merma' || (source === 'all' && filteredRecords.some(r => r.source === 'merma'))) {
        if (source === 'all') {
            if (rows.length > 0) {
                rows.push(['', '', '', '', '']);
                rows.push(['=== MERMA ===', '', '', '', '']);
            }
        }

        headers = ['Fecha', 'Local', 'Producto', 'Tipo', 'Monto'];

        filteredRecords
            .filter(r => r.source === 'merma')
            .forEach(record => {
                rows.push([
                    formatDate(record.date),
                    record.local,
                    record.producto || '',
                    record.tipoMerma || '',
                    formatCurrency(record.amount),
                ]);
            });
    }

    // Build CSV content
    csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        // Escape commas and quotes in cell values
        const escapedRow = row.map(cell => {
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
        });
        csvContent += escapedRow.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const defaultFilename = `${source}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', filename || defaultFilename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
