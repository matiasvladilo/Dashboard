import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { CategoryData } from '../../types';
import { formatCurrency } from '../../utils';

interface CategoryBarChartProps {
    data: CategoryData[];
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="chart-tooltip">
                    <p className="tooltip-label">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="chart-container">
            <h3 className="chart-title">📊 Ingresos vs Gastos por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="categoria"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 11 }}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                        dataKey="ingresos"
                        name="Ingresos"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="gastos"
                        name="Gastos"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
