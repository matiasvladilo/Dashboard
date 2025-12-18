import { formatCurrency } from '../utils';

interface KpiCardProps {
    titulo: string;
    valor: string | number;
    subtitulo?: string;
    variant?: 'default' | 'success' | 'danger' | 'info';
    icon?: string;
}

export function KpiCard({ titulo, valor, subtitulo, variant = 'default', icon }: KpiCardProps) {
    const formattedValue = typeof valor === 'number' ? formatCurrency(valor) : valor;

    return (
        <div className={`kpi-card kpi-${variant}`}>
            <div className="kpi-header">
                {icon && <span className="kpi-icon">{icon}</span>}
                <h3 className="kpi-title">{titulo}</h3>
            </div>
            <div className="kpi-value">{formattedValue}</div>
            {subtitulo && <div className="kpi-subtitle">{subtitulo}</div>}
        </div>
    );
}
