import React from 'react';
import { formatCurrency } from '../utils/helpers';

interface KpiCardProps {
    titulo: string;
    valor: string | number;
    valorB?: string | number;
    showComparison?: boolean;
    subtitulo?: string;
    variant?: 'default' | 'success' | 'danger' | 'info';
    iconName?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
    titulo,
    valor,
    valorB,
    showComparison = false,
    subtitulo,
    variant = 'default',
    iconName = 'payments'
}) => {
    const formattedValue = typeof valor === 'number' ? formatCurrency(valor) : valor;
    const formattedValueB = typeof valorB === 'number' ? formatCurrency(valorB!) : valorB;

    const getColors = () => {
        switch (variant) {
            case 'success':
                return {
                    iconBg: 'bg-emerald-100/50 dark:bg-emerald-500/10',
                    iconBgHover: 'group-hover:bg-emerald-500',
                    iconText: 'text-emerald-600 dark:text-emerald-400 group-hover:text-white',
                    cardBorder: 'hover:border-emerald-200 dark:hover:border-emerald-500/30'
                };
            case 'danger':
                return {
                    iconBg: 'bg-rose-100/50 dark:bg-rose-500/10',
                    iconBgHover: 'group-hover:bg-rose-500',
                    iconText: 'text-rose-600 dark:text-rose-400 group-hover:text-white',
                    cardBorder: 'hover:border-rose-200 dark:hover:border-rose-500/30'
                };
            case 'info':
                return {
                    iconBg: 'bg-sky-100/50 dark:bg-sky-500/10',
                    iconBgHover: 'group-hover:bg-sky-500',
                    iconText: 'text-sky-600 dark:text-sky-400 group-hover:text-white',
                    cardBorder: 'hover:border-sky-200 dark:hover:border-sky-500/30'
                };
            default:
                return {
                    iconBg: 'bg-indigo-100/50 dark:bg-indigo-500/10',
                    iconBgHover: 'group-hover:bg-indigo-600',
                    iconText: 'text-indigo-600 dark:text-indigo-400 group-hover:text-white',
                    cardBorder: 'hover:border-indigo-200 dark:hover:border-indigo-500/30'
                };
        }
    };

    const colors = getColors();

    let diffPercent: number | null = null;
    if (showComparison && typeof valor === 'number' && typeof valorB === 'number' && valorB !== 0) {
        diffPercent = ((valor - valorB) / valorB) * 100;
    }

    return (
        <div className={`flex flex-col gap-6 rounded-[32px] p-8 bg-white dark:bg-[#15171a] border border-slate-100 dark:border-white/5 transition-all duration-500 group shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none ${colors.cardBorder} ${showComparison ? 'ring-2 ring-indigo-600/5 !border-indigo-100 dark:ring-indigo-600/10 dark:!border-indigo-600/20 shadow-xl' : ''} hover:-translate-y-1`}>

            <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${colors.iconBg} ${colors.iconBgHover}`}>
                    <span className={`material-symbols-outlined transition-colors duration-500 ${colors.iconText}`} style={{ fontSize: '28px' }}>
                        {iconName}
                    </span>
                </div>
                {diffPercent !== null && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black shadow-sm ${diffPercent >= 0 ? (variant === 'danger' ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50') : (variant === 'danger' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50')}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                            {diffPercent >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        {Math.abs(diffPercent).toFixed(1)}%
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <p className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{titulo}</p>
                <div className="flex items-baseline gap-2 w-full overflow-visible">
                    <p className="text-slate-900 dark:text-white tracking-tighter text-2xl font-black whitespace-nowrap">{formattedValue}</p>
                </div>

                {showComparison && (
                    <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest mb-1">Periodo Anterior</span>
                            <span className="text-slate-600 dark:text-gray-400 font-black text-sm">{formattedValueB || '$0'}</span>
                        </div>
                        <div className={`w-1 h-1 rounded-full ${diffPercent && diffPercent >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    </div>
                )}
            </div>

            {subtitulo && !showComparison && (
                <div className="flex items-center gap-2 mt-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-gray-700"></span>
                    <p className="text-slate-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-tight">{subtitulo}</p>
                </div>
            )}
        </div>
    );
};
