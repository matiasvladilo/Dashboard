import { parse, format, isValid, parseISO } from 'date-fns';

/**
 * Robust date parser supporting multiple formats
 * Supports: dd/MM/yyyy, dd-MM-yyyy, yyyy-MM-dd, ISO strings
 */
export function parseDate(dateStr: string): Date {
    if (!dateStr) {
        console.warn('Empty date string received, using current date');
        return new Date();
    }

    const trimmed = dateStr.trim();

    // Try dd/MM/yyyy format (e.g., "18/12/2025")
    let parsed = parse(trimmed, 'dd/MM/yyyy', new Date());
    if (isValid(parsed)) return parsed;

    // Try dd-MM-yyyy format
    parsed = parse(trimmed, 'dd-MM-yyyy', new Date());
    if (isValid(parsed)) return parsed;

    // Try yyyy-MM-dd format (ISO standard)
    parsed = parse(trimmed, 'yyyy-MM-dd', new Date());
    if (isValid(parsed)) return parsed;

    // Try ISO string parsing
    parsed = parseISO(trimmed);
    if (isValid(parsed)) return parsed;

    // Fallback to native Date parser
    parsed = new Date(trimmed);
    if (isValid(parsed)) return parsed;

    console.warn(`Invalid date format: "${dateStr}", using current date`);
    return new Date();
}

/**
 * Format date as dd/MM/yyyy
 */
export function formatDate(date: Date): string {
    return format(date, 'dd/MM/yyyy');
}

/**
 * Format amount as Chilean Pesos (CLP)
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Helper to safely get value from object with flexible key matching
 * Tries exact match first, then case-insensitive match
 */
export function getValue(obj: any, keys: string[]): any {
    // Try exact match first
    for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            return obj[key];
        }
    }

    // Try case-insensitive match
    const objKeys = Object.keys(obj);
    for (const key of keys) {
        const normalizedKey = key.toLowerCase().trim();
        const foundKey = objKeys.find(k => k.toLowerCase().trim() === normalizedKey);
        if (foundKey && obj[foundKey] !== undefined && obj[foundKey] !== null && obj[foundKey] !== '') {
            return obj[foundKey];
        }
    }

    return undefined;
}

/**
 * Parse numeric value from string or number
 * Handles comma decimal separators and currency symbols
 */
export function parseNumeric(value: any): number {
    if (typeof value === 'number') return value;
    if (!value) return 0;

    const str = String(value)
        .replace(/\$/g, '') // Remove currency symbol
        .replace(/\./g, '') // Remove thousands separator (dot in CLP)
        .replace(/,/g, '.') // Replace comma decimal separator with dot
        .trim();

    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Get unique values from array of records for a specific field
 */
export function getUniqueValues<T>(records: T[], field: keyof T): any[] {
    const values = records
        .map(r => r[field])
        .filter(v => v !== undefined && v !== null && v !== '');
    return [...new Set(values)].sort();
}

/**
 * Safe division (returns null if denominator is 0)
 */
export function safeDivide(numerator: number, denominator: number): number | null {
    if (denominator === 0) return null;
    return numerator / denominator;
}
