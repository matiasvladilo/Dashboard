import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import type { Indice50Data } from '../../types';

interface Indice50ChartProps {
    data: Indice50Data[];
}

export function Indice50Chart({ data }: Indice50ChartProps) {
    const [opacity, setOpacity] = useState(1);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">Índice de Eficiencia</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest leading-none">Umbral 50%</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorIndice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeOpacity={0.6} vertical={false} />
                    <XAxis
                        dataKey="fecha"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                        className="text-slate-400 dark:text-gray-600"
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
                        className="text-slate-400 dark:text-gray-600"
                        domain={[0, (dataMax: number) => Math.max(70, Math.ceil(dataMax / 10) * 10)]}
                        tickFormatter={(value) => `${value}%`}
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
                        formatter={(value: any) => [`${(Number(value) || 0).toFixed(1)}%`, "Índice 50"]}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <ReferenceLine
                        y={50}
                        stroke="#f43f5e"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        label={{ position: 'right', value: 'ALTO', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="indice50"
                        stroke="#6366f1"
                        strokeWidth={opacity === 1 ? 4 : 6}
                        fillOpacity={opacity}
                        fill="url(#colorIndice)"
                        connectNulls
                        name="Índice 50"
                        onMouseEnter={() => setOpacity(1)}
                        onMouseLeave={() => setOpacity(1)}
                    />
                </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase text-center mt-2 tracking-tighter">Relación de Gastos sobre Ventas Totales</p>
        </div>
    );
}
