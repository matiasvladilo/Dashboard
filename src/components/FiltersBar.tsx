import { useState, useRef, useEffect } from 'react';
import { parseISO, isValid, format, startOfWeek, endOfWeek, subWeeks, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Filters, ValidationWarning, ComparisonSettings } from '../types';
import type { RejectedRecord } from '../utils/payloadAdapter';

interface FiltersBarProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    comparison: ComparisonSettings;
    onComparisonChange: (comparison: ComparisonSettings) => void;
    locales: string[];
    responsables: string[];
    proveedores: string[];
    mediosPagoVentas: string[];
    mediosPagoGastos: string[];
    subtiposDocs: string[];
    productos: string[];
    tiposMerma: string[];
    warnings: ValidationWarning[];
    rejectedRecords: RejectedRecord[];
    onShowRejected: () => void;
}

export function FiltersBar({
    filters,
    onFiltersChange,
    comparison,
    onComparisonChange,
    locales,
    mediosPagoVentas,
    mediosPagoGastos,
    rejectedRecords,
    onShowRejected,
}: FiltersBarProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showLocalesDropdown, setShowLocalesDropdown] = useState(false);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const localesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
            if (localesRef.current && !localesRef.current.contains(event.target as Node)) {
                setShowLocalesDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateChange = (field: 'fechaDesde' | 'fechaHasta', value: string) => {
        if (!value) {
            onFiltersChange({ ...filters, [field]: null });
            return;
        }
        const parsed = parseISO(value);
        if (isValid(parsed)) {
            onFiltersChange({ ...filters, [field]: parsed });
        }
    };

    const handleDateChangeB = (field: 'fechaDesdeB' | 'fechaHastaB', value: string) => {
        if (!value) {
            onComparisonChange({ ...comparison, [field]: null });
            return;
        }
        const parsed = parseISO(value);
        if (isValid(parsed)) {
            onComparisonChange({ ...comparison, [field]: parsed });
        }
    };

    const handleMultiSelect = (field: keyof Filters, value: string) => {
        const currentArray = (filters[field] as string[]) || [];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        onFiltersChange({ ...filters, [field]: newArray });
    };

    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';
        try {
            return format(date, 'yyyy-MM-dd');
        } catch (e) {
            return '';
        }
    };

    const getRangeLabel = () => {
        if (!filters.fechaDesde && !filters.fechaHasta) return "Todas las fechas";
        if (filters.fechaDesde && filters.fechaHasta) {
            return `${format(filters.fechaDesde, 'd MMM', { locale: es })} - ${format(filters.fechaHasta, 'd MMM, yyyy', { locale: es })}`;
        }
        return filters.fechaDesde ? `Desde ${format(filters.fechaDesde, 'd MMM, yyyy', { locale: es })}` : `Hasta ${format(filters.fechaHasta!, 'd MMM, yyyy', { locale: es })}`;
    };

    return (
        <div className="flex flex-col gap-6 mb-12 animate-slide-up [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
            <div className="bg-white dark:bg-[#15171a] p-3 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none relative z-40 transition-all">

                {/* Unified Date Button */}
                <div className="relative" ref={datePickerRef}>
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`flex items-center gap-4 h-14 px-6 rounded-2xl border transition-all duration-300 ${showDatePicker || (filters.fechaDesde || filters.fechaHasta) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-indigo-500/30'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>calendar_month</span>
                        <div className="flex flex-col items-start translate-y-[-1px]">
                            <span className={`text-[9px] uppercase font-black tracking-widest ${showDatePicker || (filters.fechaDesde || filters.fechaHasta) ? 'text-indigo-100' : 'text-slate-400'}`}>Rango</span>
                            <span className="text-xs font-black">{getRangeLabel()}</span>
                        </div>
                        <span className={`material-symbols-outlined transition-transform duration-300 ${showDatePicker ? 'rotate-180' : ''}`} style={{ fontSize: '20px' }}>expand_more</span>
                    </button>

                    {showDatePicker && (
                        <div className="absolute top-full left-0 mt-4 p-8 bg-white dark:bg-[#181f26] border border-slate-100 dark:border-white/10 rounded-3xl shadow-2xl z-50 w-[400px] animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-col gap-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[11px] text-slate-400 dark:text-gray-400 font-extrabold uppercase tracking-widest ml-1">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            className="bg-slate-50 dark:bg-[#111418] border border-slate-200 dark:border-[#2e3338] text-slate-900 dark:text-white text-sm font-bold rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                                            value={formatDateForInput(filters.fechaDesde)}
                                            onChange={(e) => handleDateChange('fechaDesde', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[11px] text-slate-400 dark:text-gray-400 font-extrabold uppercase tracking-widest ml-1">Fecha de Término</label>
                                        <input
                                            type="date"
                                            className="bg-slate-50 dark:bg-[#111418] border border-slate-200 dark:border-[#2e3338] text-slate-900 dark:text-white text-sm font-bold rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all"
                                            value={formatDateForInput(filters.fechaHasta)}
                                            onChange={(e) => handleDateChange('fechaHasta', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <p className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest ml-1">Atajos Inteligentes</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => { onFiltersChange({ ...filters, fechaDesde: startOfWeek(new Date(), { weekStartsOn: 1 }), fechaHasta: endOfWeek(new Date(), { weekStartsOn: 1 }) }); setShowDatePicker(false); }} className="text-[11px] font-black p-4 bg-slate-50 dark:bg-[#111418] text-slate-600 dark:text-gray-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-all text-left border border-transparent hover:border-indigo-200">ESTA SEMANA</button>
                                        <button onClick={() => { onFiltersChange({ ...filters, fechaDesde: startOfMonth(new Date()), fechaHasta: endOfMonth(new Date()) }); setShowDatePicker(false); }} className="text-[11px] font-black p-4 bg-slate-50 dark:bg-[#111418] text-slate-600 dark:text-gray-400 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 transition-all text-left border border-transparent hover:border-indigo-200">ESTE MES</button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowDatePicker(false)}
                                    className="w-full bg-indigo-600 h-14 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Confirmar Selección
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Local Switcher - Premium Multi-select */}
                <div className="relative flex-1 min-w-[200px]" ref={localesRef}>
                    <button
                        onClick={() => setShowLocalesDropdown(!showLocalesDropdown)}
                        className={`flex items-center gap-4 h-14 w-full px-6 rounded-2xl border transition-all duration-300 ${showLocalesDropdown || filters.locales.length > 0 ? 'bg-slate-900 dark:bg-slate-800 border-slate-900 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-indigo-500/30'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>location_on</span>
                        <div className="flex flex-col items-start translate-y-[-1px] overflow-hidden">
                            <span className={`text-[9px] uppercase font-black tracking-widest ${showLocalesDropdown || filters.locales.length > 0 ? 'text-slate-400' : 'text-slate-400'}`}>Ubicación</span>
                            <span className="text-xs font-black truncate w-full">
                                {filters.locales.length === 0 ? "Todos los Locales" : (filters.locales.length === 1 ? filters.locales[0] : `${filters.locales.length} locales`)}
                            </span>
                        </div>
                        <span className={`material-symbols-outlined ml-auto transition-transform duration-300 ${showLocalesDropdown ? 'rotate-180' : ''}`} style={{ fontSize: '20px' }}>expand_more</span>
                    </button>

                    {showLocalesDropdown && (
                        <div className="absolute top-full left-0 mt-4 p-4 bg-white dark:bg-[#181f26] border border-slate-100 dark:border-white/10 rounded-3xl shadow-2xl z-50 w-full min-w-[300px] animate-dropdown-enter origin-top">
                            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                <button
                                    onClick={() => onFiltersChange({ ...filters, locales: [] })}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${filters.locales.length === 0 ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300'}`}
                                >
                                    <span className="text-xs font-black">Todos los Locales</span>
                                    {filters.locales.length === 0 && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>}
                                </button>

                                <div className="h-px bg-slate-100 dark:bg-white/5 my-2"></div>

                                {locales.map(l => (
                                    <button
                                        key={l}
                                        onClick={() => handleMultiSelect('locales', l)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${filters.locales.includes(l) ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20' : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300 border border-transparent'}`}
                                    >
                                        <span className="text-xs font-bold">{l}</span>
                                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${filters.locales.includes(l) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                                            {filters.locales.includes(l) && <span className="material-symbols-outlined text-[14px] font-black">check</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Engine */}
                <div className="flex-[2] min-w-[240px]">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-indigo-600 transition-colors" style={{ fontSize: '22px' }}>search</span>
                        </div>
                        <input
                            className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white text-xs font-black rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 block w-full pl-14 h-14 placeholder-slate-400 outline-none transition-all shadow-inner"
                            placeholder="Buscar proveedor, responsable o producto..."
                            type="text"
                            value={filters.busqueda}
                            onChange={(e) => onFiltersChange({ ...filters, busqueda: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Comparative Button */}
                    <button
                        className={`h-14 px-7 rounded-2xl border flex items-center gap-3 transition-all duration-300 font-black text-xs uppercase tracking-widest ${comparison.enabled ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-300'}`}
                        onClick={() => onComparisonChange({ ...comparison, enabled: !comparison.enabled })}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>compare_arrows</span>
                        <span>{comparison.enabled ? 'Activa' : 'Comparar'}</span>
                    </button>

                    {/* Quick Settings */}
                    <button
                        className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${showAdvanced ? 'bg-slate-900 dark:bg-gray-700 border-slate-900 text-white' : 'bg-slate-100 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-300'}`}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        title="Filtros específicos"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>tune</span>
                    </button>

                    {rejectedRecords.length > 0 && (
                        <button
                            className="h-14 px-5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-600 rounded-2xl border border-rose-100 transition-all flex items-center gap-3 animate-pulse"
                            onClick={onShowRejected}
                        >
                            <span className="material-symbols-outlined font-black" style={{ fontSize: '22px' }}>error</span>
                            <span className="text-xs font-black">{rejectedRecords.length}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvanced && (
                <div className="bg-white dark:bg-[#15171a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-2xl animate-dropdown-enter relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none group-hover:rotate-45 transition-transform duration-1000">
                        <span className="material-symbols-outlined" style={{ fontSize: '180px' }}>tune</span>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>filter_list</span>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Filtros Avanzados</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Segmenta tus datos con precisión quirúrgica</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onFiltersChange({
                                    ...filters,
                                    proveedores: [],
                                    mediosPagoGastos: [],
                                    subtiposDocs: [],
                                    responsables: [],
                                    mediosPagoVentas: [],
                                    tiposMerma: [],
                                    productos: [],
                                })}
                                className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-100"
                            >
                                Limpiar Filtros
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Ventas Filters */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                    <span className="material-symbols-outlined text-sm">payments</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ventas</span>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-wider ml-1">Medios de Pago</p>
                                    <div className="flex flex-wrap gap-2">
                                        {mediosPagoVentas.map(m => (
                                            <button
                                                key={m}
                                                onClick={() => handleMultiSelect('mediosPagoVentas', m)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${filters.mediosPagoVentas.includes(m) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-200'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Gastos Filters */}
                            <div className="space-y-4 lg:col-span-2">
                                <div className="flex items-center gap-2 text-rose-500 mb-2">
                                    <span className="material-symbols-outlined text-sm">shopping_cart</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Gastos</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-wider ml-1">Medios de Pago</p>
                                        <div className="flex flex-wrap gap-2">
                                            {mediosPagoGastos.map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => handleMultiSelect('mediosPagoGastos', m)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${filters.mediosPagoGastos.includes(m) ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 hover:border-slate-200'}`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-wider ml-1">Uso de Filtros</p>
                                        <p className="text-xs text-slate-400 italic">Pronto: Filtros por proveedores y subtipos de documentos.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Indicators */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                                    <span className="material-symbols-outlined text-sm">analytics</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Resumen de Selección</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-black/20 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Filtros Activos</span>
                                        <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full">
                                            {[...filters.locales, ...filters.mediosPagoVentas, ...filters.mediosPagoGastos].length}
                                        </span>
                                    </div>
                                    <div className="h-px bg-slate-200 dark:bg-white/5"></div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Los cambios se aplican automáticamente a todos los gráficos y KPIs del dashboard.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Logic Layer */}
            {comparison.enabled && (
                <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-3xl border-2 border-amber-200/50 flex flex-wrap items-center gap-8 animate-in slide-in-from-bottom-6 transition-all shadow-xl shadow-amber-900/5 relative z-10 overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>compare_arrows</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
                            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>history</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-500 tracking-widest leading-none">Periodo de Contraste</span>
                            <span className="text-amber-600/60 text-[10px] font-bold mt-2">Selecciona contra qué comparar tus datos actuales</span>
                        </div>
                    </div>

                    <div className="flex items-center bg-white dark:bg-black/20 rounded-2xl px-6 h-14 border border-amber-200/50 gap-4 shadow-sm">
                        <input
                            type="date"
                            className="bg-transparent border-none text-slate-800 dark:text-white text-xs font-black focus:ring-0 p-0 w-32 outline-none"
                            value={formatDateForInput(comparison.fechaDesdeB)}
                            onChange={(e) => handleDateChangeB('fechaDesdeB', e.target.value)}
                        />
                        <span className="text-amber-300 font-bold">→</span>
                        <input
                            type="date"
                            className="bg-transparent border-none text-slate-800 dark:text-white text-xs font-black focus:ring-0 p-0 w-32 outline-none"
                            value={formatDateForInput(comparison.fechaHastaB)}
                            onChange={(e) => handleDateChangeB('fechaHastaB', e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (filters.fechaDesde && filters.fechaHasta) {
                                    const duration = filters.fechaHasta.getTime() - filters.fechaDesde.getTime();
                                    const end = new Date(filters.fechaDesde.getTime() - 24 * 60 * 60 * 1000);
                                    const start = new Date(end.getTime() - duration);
                                    onComparisonChange({ ...comparison, fechaDesdeB: start, fechaHastaB: end });
                                }
                            }}
                            className="h-12 px-6 text-[10px] font-black bg-amber-600 text-white rounded-2xl hover:bg-amber-700 transition-all uppercase tracking-widest shadow-md"
                        >
                            Periodo Anterior
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
