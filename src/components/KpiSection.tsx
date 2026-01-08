import type { KPIs } from '../types';
import { KpiCard } from './KpiCard';

interface KpiSectionProps {
    kpis: KPIs;
    kpisB: KPIs | null;
    comparisonEnabled: boolean;
}

export function KpiSection({ kpis, kpisB, comparisonEnabled }: KpiSectionProps) {
    const getIndice50Variant = (status: KPIs['indice50Status']) => {
        switch (status) {
            case 'OK': return 'success';
            case 'CRITICO': return 'danger';
            default: return 'default';
        }
    };

    const getResultadoVariant = (resultado: number) => {
        return resultado >= 0 ? 'success' : 'danger';
    };

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10 transition-colors duration-300">
            <KpiCard
                titulo="Ventas Totales"
                valor={kpis.ventasTotales}
                valorB={kpisB?.ventasTotales}
                showComparison={comparisonEnabled}
                variant="success"
                iconName="payments"
            />
            <KpiCard
                titulo="Gastos Totales"
                valor={kpis.gastosTotales}
                valorB={kpisB?.gastosTotales}
                showComparison={comparisonEnabled}
                variant="info"
                iconName="receipt_long"
            />
            <KpiCard
                titulo="Merma Total"
                valor={kpis.mermaTotales}
                valorB={kpisB?.mermaTotales}
                showComparison={comparisonEnabled}
                variant="danger"
                iconName="delete_sweep"
            />
            <KpiCard
                titulo="Utilidad Neta"
                valor={kpis.resultadoOperacional}
                valorB={kpisB?.resultadoOperacional}
                showComparison={comparisonEnabled}
                variant={getResultadoVariant(kpis.resultadoOperacional)}
                iconName="account_balance_wallet"
                subtitulo="Ventas - Gastos - Merma"
            />
            <KpiCard
                titulo="Índice 50"
                valor={kpis.indice50 !== null ? `${kpis.indice50.toFixed(1)}%` : 'N/A'}
                valorB={kpisB?.indice50 !== null ? `${kpisB?.indice50.toFixed(1)}%` : 'N/A'}
                showComparison={comparisonEnabled}
                variant={getIndice50Variant(kpis.indice50Status)}
                iconName="analytics"
                subtitulo={
                    kpis.indice50Status === 'OK'
                        ? 'Objetivo logrado (<50%)'
                        : kpis.indice50Status === 'CRITICO'
                            ? 'Crítico (>50%)'
                            : 'Faltan datos'
                }
            />
        </section>
    );
}
