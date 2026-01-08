import { formatDate } from '../utils/helpers';

interface HeaderProps {
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    onUpdateData?: () => void;
    isComparing?: boolean;
    fechaDesdeB?: Date | null;
    fechaHastaB?: Date | null;
}

export function Header({
    fechaDesde,
    fechaHasta,
    onUpdateData,
    isComparing,
    fechaDesdeB,
    fechaHastaB
}: HeaderProps) {
    const rangoFechas = (desde: Date | null, hasta: Date | null) => {
        if (desde && hasta) {
            return `${formatDate(desde)} - ${formatDate(hasta)}`;
        } else if (desde) {
            return `Desde ${formatDate(desde)}`;
        } else if (hasta) {
            return `Hasta ${formatDate(hasta)}`;
        }
        return "Toda la historia";
    };

    return (
        <div className="flex flex-col gap-8 mb-10 mt-2 animate-slide-up">
            {/* Upper row: Breadcrumbs & Indicators */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span className="hover:text-indigo-600 transition-colors cursor-pointer">FinanzaPro</span>
                    <span className="material-symbols-outlined opacity-30" style={{ fontSize: '10px' }}>arrow_forward_ios</span>
                    <span className="text-indigo-600">Dashboard</span>
                </div>

                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2 group cursor-help">
                        <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inset-0"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 relative"></div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-600 transition-colors">Sistema Online</span>
                    </div>
                </div>
            </div>

            {/* Main Title Row */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <h1 className="text-slate-900 dark:text-white text-5xl lg:text-6xl font-black tracking-tighter leading-tight drop-shadow-sm">
                            Vista <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">General</span>
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">Gestiona y analiza el rendimiento de tus locales en tiempo real.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl shadow-sm">
                            <span className="material-symbols-outlined text-indigo-600" style={{ fontSize: '18px' }}>calendar_today</span>
                            <span className="text-slate-700 dark:text-slate-300 text-xs font-black">{rangoFechas(fechaDesde, fechaHasta)}</span>
                        </div>
                        {isComparing && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl animate-in fade-in zoom-in-95">
                                <span className="material-symbols-outlined text-amber-600" style={{ fontSize: '18px' }}>compare_arrows</span>
                                <span className="text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-tight">vs {rangoFechas(fechaDesdeB!, fechaHastaB!)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center justify-center gap-3 h-14 px-8 bg-white dark:bg-[#1c1f23] text-slate-700 dark:text-white text-xs font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-100 dark:border-white/10 hover:shadow-2xl hover:border-slate-200 group">
                        <span className="material-symbols-outlined transition-transform group-hover:translate-y-[-2px]" style={{ fontSize: '20px' }}>download</span>
                        <span>Descargar</span>
                    </button>
                    <button
                        onClick={onUpdateData}
                        className="flex items-center justify-center gap-3 h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-3xl transition-all shadow-2xl shadow-indigo-600/30 border border-indigo-400/20 active:scale-95 group"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:rotate-180 duration-700" style={{ fontSize: '22px' }}>sync</span>
                        <span>Sincronizar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
