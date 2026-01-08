import { useState } from 'react';
import type { NormalizedRecord } from '../types';
import { formatDate, formatCurrency } from '../utils/helpers';
import { exportToCSV } from '../utils/csvExport';

interface TabbedTablesProps {
    records: NormalizedRecord[];
}

type SortField = string;
type SortDirection = 'asc' | 'desc';

export function TabbedTables({ records }: TabbedTablesProps) {
    const [activeTab, setActiveTab] = useState<'ventas' | 'gastos' | 'merma'>('ventas');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const filteredRecords = records.filter(r => r.source === activeTab);

    const sortedRecords = [...filteredRecords].sort((a, b) => {
        let aValue: any = a[sortField as keyof NormalizedRecord];
        let bValue: any = b[sortField as keyof NormalizedRecord];

        if (sortField === 'date') {
            aValue = a.date.getTime();
            bValue = b.date.getTime();
        }

        if (sortField === 'amount') {
            aValue = a.amount;
            bValue = b.amount;
        }

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue?.toLowerCase() || '';
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleExport = () => {
        exportToCSV(filteredRecords, activeTab);
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <span className="opacity-10 ml-2">⇅</span>;
        return <span className={`ml-2 font-black ${sortDirection === 'asc' ? 'text-indigo-600' : 'text-indigo-600'}`}>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const total = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

    return (
        <div className="bg-white dark:bg-[#15171a] rounded-[32px] border border-slate-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden animate-slide-up [animation-delay:300ms] opacity-0 [animation-fill-mode:forwards] transition-all">
            {/* Table Header with Tabs */}
            <div className="p-8 pb-6 border-b border-slate-50 dark:border-white/5 flex flex-wrap gap-6 justify-between items-center">
                <div className="flex bg-slate-100/50 dark:bg-white/5 p-1.5 rounded-[20px] border border-slate-100 dark:border-white/5 shadow-inner">
                    {(['ventas', 'gastos', 'merma'] as const).map(tab => (
                        <button
                            key={tab}
                            className={`px-8 py-3 text-xs font-black uppercase tracking-wider rounded-2xl transition-all duration-300 ${activeTab === tab ? 'bg-white dark:bg-[#1c1f23] text-indigo-600 dark:text-indigo-400 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <button
                    className="h-12 px-8 text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-white bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 hover:bg-slate-50 hover:shadow-lg transition-all flex items-center gap-3 active:scale-95 transition-all group"
                    onClick={handleExport}
                >
                    <span className="material-symbols-outlined transition-transform group-hover:translate-y-0.5" style={{ fontSize: '20px' }}>upload_file</span>
                    <span>Exportar</span>
                </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                {filteredRecords.length === 0 ? (
                    <div className="p-24 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-slate-200 dark:text-gray-800 text-4xl">inventory_2</span>
                        </div>
                        <p className="text-slate-400 dark:text-gray-600 font-black uppercase tracking-widest text-[10px]">Sin datos para este periodo</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/30 dark:bg-black/5 text-slate-400 dark:text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50 dark:border-white/5">
                                {activeTab === 'ventas' && (
                                    <>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('date')}>Fecha <SortIcon field="date" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('local')}>Local <SortIcon field="local" /></th>
                                        <th className="px-10 py-6 text-right cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('amount')}>Monto Venta <SortIcon field="amount" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('responsable')}>Responsable <SortIcon field="responsable" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('medioPago')}>Medio <SortIcon field="medioPago" /></th>
                                    </>
                                )}
                                {activeTab === 'gastos' && (
                                    <>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('date')}>Fecha <SortIcon field="date" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('local')}>Local <SortIcon field="local" /></th>
                                        <th className="px-10 py-6 text-right cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('amount')}>Monto Gasto <SortIcon field="amount" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('proveedorCliente')}>Proveedor <SortIcon field="proveedorCliente" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('subtipoDoc')}>Tipo Doc <SortIcon field="subtipoDoc" /></th>
                                    </>
                                )}
                                {activeTab === 'merma' && (
                                    <>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('date')}>Fecha <SortIcon field="date" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('local')}>Local <SortIcon field="local" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('producto')}>Producto <SortIcon field="producto" /></th>
                                        <th className="px-10 py-6 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('tipoMerma')}>Motivo <SortIcon field="tipoMerma" /></th>
                                        <th className="px-10 py-6 text-right cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('amount')}>Pérdida <SortIcon field="amount" /></th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/5 text-xs font-bold">
                            {sortedRecords.map((record, index) => (
                                <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 transition-colors group">
                                    <td className="px-10 py-5 text-slate-400 dark:text-gray-500 font-mono tracking-tighter">{formatDate(record.date)}</td>
                                    <td className="px-10 py-5">
                                        <span className="text-slate-900 dark:text-white font-black">{record.local}</span>
                                    </td>
                                    <td className="px-10 py-5 text-right">
                                        <p className={`font-mono text-sm font-black ${activeTab === 'ventas' ? 'text-emerald-500' : activeTab === 'gastos' ? 'text-rose-500' : 'text-amber-500'}`}>
                                            {formatCurrency(record.amount)}
                                        </p>
                                    </td>
                                    {activeTab === 'ventas' && (
                                        <>
                                            <td className="px-10 py-5 text-slate-500 dark:text-gray-400 font-medium">{record.responsable || '-'}</td>
                                            <td className="px-10 py-5">
                                                <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] text-slate-500 uppercase font-black">{record.medioPago || '-'}</span>
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'gastos' && (
                                        <>
                                            <td className="px-10 py-5 text-slate-500 dark:text-gray-400 font-medium truncate max-w-[200px]">{record.proveedorCliente || '-'}</td>
                                            <td className="px-10 py-5 text-slate-400 dark:text-gray-500 text-[10px] italic">{record.subtipoDoc || '-'}</td>
                                        </>
                                    )}
                                    {activeTab === 'merma' && (
                                        <>
                                            <td className="px-10 py-5 text-slate-500 dark:text-gray-400 font-extrabold">{record.producto || '-'}</td>
                                            <td className="px-10 py-5 text-slate-400 dark:text-gray-500">{record.tipoMerma || '-'}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-50/50 dark:bg-black/20 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-[0.2em]">
                                <td className="px-10 py-8" colSpan={2}>Resumen Total de este Periodo</td>
                                <td className="px-10 py-8 text-right font-mono text-2xl text-indigo-600">{formatCurrency(total)}</td>
                                <td className="px-10 py-8" colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>
        </div>
    );
}
