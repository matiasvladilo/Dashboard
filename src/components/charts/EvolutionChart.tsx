import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/helpers';
import type { EvolutionData } from '../../types';

interface EvolutionChartProps {
    data: EvolutionData[];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
    const [activeLines, setActiveLines] = useState({
        ventas: true,
        gastos: true,
        merma: true
    });
    const [hoveredLine, setHoveredLine] = useState<string | null>(null);

    const handleLegendClick = (e: any) => {
        const dataKey = e.dataKey;
        setActiveLines(prev => ({
            ...prev,
            [dataKey]: !prev[dataKey as keyof typeof prev]
        }));
    };

    const getLineOpacity = (lineKey: string) => {
        if (!activeLines[lineKey as keyof typeof activeLines]) return 0.2;
        if (hoveredLine === null) return 1;
        return hoveredLine === lineKey ? 1 : 0.2;
    };

    const getLineWidth = (lineKey: string, baseWidth: number) => {
        if (!activeLines[lineKey as keyof typeof activeLines]) return baseWidth;
        if (hoveredLine === lineKey) return baseWidth + 2;
        return baseWidth;
    };

    return (
        <div className="flex flex-col gap-6 p-2">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h3 className="text-slate-900 dark:text-white text-base font-black tracking-tight leading-none">Evolución de Flujos</h3>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest leading-none">Ventas vs Gastos Operativos</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                        <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase">Tendencia Temporal</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="6 6" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeOpacity={0.6} vertical={false} />
                    <XAxis
                        dataKey="fecha"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 800 }}
                        className="text-slate-400 dark:text-gray-600"
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 800 }}
                        className="text-slate-400 dark:text-gray-600"
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        cursor={false}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #f1f5f9',
                            borderRadius: '20px',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                            fontSize: '12px',
                            padding: '12px 16px',
                            fontWeight: 'bold',
                            color: '#1e293b'
                        }}
                        itemStyle={{ padding: '2px 0' }}
                        formatter={(value: any) => formatCurrency(Number(value) || 0)}
                        wrapperStyle={{ outline: 'none' }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{
                            paddingTop: '0',
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer'
                        }}
                        onClick={handleLegendClick}
                    />
                    <Line
                        type="monotone"
                        dataKey="ventas"
                        stroke="#6366f1"
                        strokeWidth={getLineWidth('ventas', 5)}
                        strokeOpacity={getLineOpacity('ventas')}
                        dot={false}
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }}
                        name="Ventas"
                        onMouseEnter={() => setHoveredLine('ventas')}
                        onMouseLeave={() => setHoveredLine(null)}
                        hide={!activeLines.ventas}
                    />
                    <Line
                        type="monotone"
                        dataKey="gastos"
                        stroke="#f59e0b"
                        strokeWidth={getLineWidth('gastos', 4)}
                        strokeOpacity={getLineOpacity('gastos')}
                        strokeDasharray="4 4"
                        dot={false}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
                        name="Gastos"
                        onMouseEnter={() => setHoveredLine('gastos')}
                        onMouseLeave={() => setHoveredLine(null)}
                        hide={!activeLines.gastos}
                    />
                    <Line
                        type="monotone"
                        dataKey="merma"
                        stroke="#f43f5e"
                        strokeWidth={getLineWidth('merma', 3)}
                        strokeOpacity={getLineOpacity('merma')}
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 0, fill: '#f43f5e' }}
                        name="Merma"
                        onMouseEnter={() => setHoveredLine('merma')}
                        onMouseLeave={() => setHoveredLine(null)}
                        hide={!activeLines.merma}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
