import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import type { ProveedorData } from '../../types';

interface ProveedorChartProps {
    data: ProveedorData[];
}

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

export function ProveedorChart({ data }: ProveedorChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">Top Proveedores</h3>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeOpacity={0.6} horizontal={false} />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                        className="text-slate-400 dark:text-gray-600"
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                        type="category"
                        dataKey="proveedor"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                        className="text-slate-400 dark:text-gray-600"
                        width={100}
                    />
                    <Tooltip
                        cursor={false}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #f1f5f9',
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#1e293b'
                        }}
                        itemStyle={{ color: '#1e293b' }}
                        formatter={(value: any) => formatCurrency(Number(value) || 0)}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <Bar
                        dataKey="totalGasto"
                        name="Total Gastos"
                        radius={[0, 8, 8, 0]}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
