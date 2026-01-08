import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import type { MermaTipoData, MermaProductoData } from '../../types';

interface MermaChartsProps {
    tipoData: MermaTipoData[];
    productoData: MermaProductoData[];
}

const COLORS = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fff1f2'];

export function MermaCharts({ tipoData, productoData }: MermaChartsProps) {
    const [activeTipoIndex, setActiveTipoIndex] = useState<number | null>(null);
    const [activeProductoIndex, setActiveProductoIndex] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Merma por Tipo */}
            <div className="flex flex-col gap-4">
                <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">Merma por Categoría</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tipoData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeOpacity={0.6} vertical={false} />
                        <XAxis
                            dataKey="tipo"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                            className="text-slate-400 dark:text-gray-600"
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                            className="text-slate-400 dark:text-gray-600"
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
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
                            dataKey="total"
                            name="Total Merma"
                            radius={[8, 8, 0, 0]}
                            onMouseEnter={(_, index) => setActiveTipoIndex(index)}
                            onMouseLeave={() => setActiveTipoIndex(null)}
                        >
                            {tipoData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    fillOpacity={activeTipoIndex === null || activeTipoIndex === index ? 1 : 0.3}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Productos con Merma */}
            <div className="flex flex-col gap-4">
                <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">Top Productos Críticos</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={productoData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 10 }}>
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
                            dataKey="producto"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                            className="text-slate-400 dark:text-gray-600"
                            width={80}
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
                            dataKey="total"
                            name="Total Merma"
                            radius={[0, 8, 8, 0]}
                            onMouseEnter={(_, index) => setActiveProductoIndex(index)}
                            onMouseLeave={() => setActiveProductoIndex(null)}
                        >
                            {productoData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    fillOpacity={activeProductoIndex === null || activeProductoIndex === index ? 1 : 0.3}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
