import { KpiCard } from './KpiCard';
import { formatCurrency } from '../utils';

interface KpiSectionProps {
    ingresosTotales: number;
    gastosTotales: number;
    beneficioNeto: number;
    categoriaMasRentable: { nombre: string; importe: number };
    numeroOperaciones: number;
    ticketMedioServicios: number;
}

export function KpiSection({
    ingresosTotales,
    gastosTotales,
    beneficioNeto,
    categoriaMasRentable,
    numeroOperaciones,
    ticketMedioServicios,
}: KpiSectionProps) {
    return (
        <section className="kpi-section">
            <div className="kpi-grid">
                <KpiCard
                    titulo="Ingresos Totales"
                    valor={ingresosTotales}
                    icon="💰"
                    variant="success"
                />
                <KpiCard
                    titulo="Gastos Totales"
                    valor={gastosTotales}
                    icon="📉"
                    variant="danger"
                />
                <KpiCard
                    titulo="Beneficio Neto"
                    valor={beneficioNeto}
                    icon="📊"
                    variant={beneficioNeto >= 0 ? 'success' : 'danger'}
                />
                <KpiCard
                    titulo="Categoría Más Rentable"
                    valor={categoriaMasRentable.nombre}
                    subtitulo={formatCurrency(categoriaMasRentable.importe)}
                    icon="🏆"
                    variant="info"
                />
                <KpiCard
                    titulo="Número de Operaciones"
                    valor={numeroOperaciones.toString()}
                    icon="📋"
                />
                <KpiCard
                    titulo="Ticket Medio Servicios"
                    valor={ticketMedioServicios}
                    icon="🎯"
                    variant="info"
                />
            </div>
        </section>
    );
}
