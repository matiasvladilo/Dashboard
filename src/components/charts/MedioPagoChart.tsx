import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import type { MedioPagoData } from '../../types';

interface MedioPagoChartProps {
    data: MedioPagoData[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

export function MedioPagoChart({ data }: MedioPagoChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [hiddenSegments, setHiddenSegments] = useState<Set<number>>(new Set());

    const handleLegendClick = (entry: any, index: number) => {
        setHiddenSegments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const visibleData = data.map((item, index) => ({
        ...item,
        total: hiddenSegments.has(index) ? 0 : item.total
    }));

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">Distribución de Pagos</h3>
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={visibleData}
                        dataKey="total"
                        nameKey="medioPago"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        stroke="none"
                        activeIndex={activeIndex !== null ? activeIndex : undefined}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {visibleData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #f1f5f9',
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                        itemStyle={{ color: '#1e293b' }}
                        formatter={(value: any) => formatCurrency(Number(value) || 0)}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            color: '#64748b',
                            cursor: 'pointer'
                        }}
                        onClick={handleLegendClick}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
