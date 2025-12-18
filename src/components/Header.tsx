import { formatDate } from '../utils';

interface HeaderProps {
    fechaDesde: Date | null;
    fechaHasta: Date | null;
}

export function Header({ fechaDesde, fechaHasta }: HeaderProps) {
    const rangoFechas = () => {
        if (fechaDesde && fechaHasta) {
            return `${formatDate(fechaDesde)} - ${formatDate(fechaHasta)}`;
        } else if (fechaDesde) {
            return `Desde ${formatDate(fechaDesde)}`;
        } else if (fechaHasta) {
            return `Hasta ${formatDate(fechaHasta)}`;
        }
        return "Todas las fechas";
    };

    return (
        <header className="dashboard-header">
            <div className="header-content">
                <div className="header-titles">
                    <h1>Dashboard Financiero Agencia IA</h1>
                    <p className="subtitle">Control de ingresos, gastos y métricas clave</p>
                </div>
                <div className="header-date-range">
                    <span className="date-label">Período:</span>
                    <span className="date-value">{rangoFechas()}</span>
                </div>
            </div>
        </header>
    );
}
