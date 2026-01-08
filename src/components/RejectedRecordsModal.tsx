import { useState } from 'react';
import type { RejectedRecord } from '../utils/payloadAdapter';

interface RejectedRecordsModalProps {
    rejectedRecords: RejectedRecord[];
    onClose: () => void;
}

export function RejectedRecordsModal({ rejectedRecords, onClose }: RejectedRecordsModalProps) {
    const [selectedRecord, setSelectedRecord] = useState<RejectedRecord | null>(null);

    // Group by source for better organization
    const groupedBySource = rejectedRecords.reduce((acc, record) => {
        const source = record.detectedSource || 'desconocido';
        if (!acc[source]) acc[source] = [];
        acc[source].push(record);
        return acc;
    }, {} as Record<string, RejectedRecord[]>);

    const sourceLabels: Record<string, string> = {
        ventas: '💰 Ventas',
        gastos: '💸 Gastos',
        merma: '📦 Merma',
        desconocido: '❓ Fuente Desconocida',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-[#1c242d] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-gray-700">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">🔍 Registros Rechazados ({rejectedRecords.length})</h2>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-400 transition-all"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-6">
                        Estos registros no pudieron ser procesados. Haz clic en cada uno para ver los detalles y corregirlos en la planilla.
                    </p>

                    {Object.entries(groupedBySource).map(([source, records]) => (
                        <div key={source} className="mb-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-gray-300 mb-4">
                                {sourceLabels[source]} ({records.length})
                            </h3>

                            <div className="space-y-3">
                                {records.map((record, idx) => (
                                    <div
                                        key={idx}
                                        className={`border rounded-2xl transition-all cursor-pointer ${selectedRecord === record
                                                ? 'border-rose-300 dark:border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                                                : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-rose-200 dark:hover:border-rose-600'
                                            }`}
                                        onClick={() => setSelectedRecord(selectedRecord === record ? null : record)}
                                    >
                                        <div className="flex items-center justify-between p-4">
                                            <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">#{record.index + 1}</span>
                                            <span className="flex-1 ml-4 text-sm font-medium text-slate-700 dark:text-gray-300">{record.reason}</span>
                                            <span className="text-slate-400 dark:text-gray-500">{selectedRecord === record ? '▼' : '▶'}</span>
                                        </div>

                                        {selectedRecord === record && (
                                            <div className="px-4 pb-4 space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-gray-400 mb-2">Datos Recibidos:</h4>
                                                    <pre className="bg-slate-100 dark:bg-gray-900 text-slate-800 dark:text-gray-200 p-4 rounded-xl text-xs overflow-x-auto">
                                                        {JSON.stringify(record.rawData, null, 2)}
                                                    </pre>
                                                </div>

                                                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
                                                    <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">💡 Sugerencias:</h4>
                                                    {record.reason.includes('Fecha inválida') && (
                                                        <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                                                            <li>Verifica que la columna "Fecha" o "date" existe</li>
                                                            <li>Formato esperado: dd/mm/yyyy o yyyy-mm-dd</li>
                                                            <li>Ejemplo válido: 18/12/2025</li>
                                                        </ul>
                                                    )}
                                                    {record.reason.includes('source detectado') && (
                                                        <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                                                            <li><strong>Para Ventas:</strong> Debe tener columna "Total Venta"</li>
                                                            <li><strong>Para Gastos:</strong> Debe tener "Total Factura" o "Proveedor/Cliente"</li>
                                                            <li><strong>Para Merma:</strong> Debe tener "PRODUCTO" y "MONTO"</li>
                                                        </ul>
                                                    )}
                                                    {record.reason.includes('Tipo != "GASTO"') && (
                                                        <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                                                            <li>Este registro tiene Tipo = "{record.rawData['Tipo (Ingreso/Gasto)']}"</li>
                                                            <li>Solo se procesan registros con Tipo = "GASTO"</li>
                                                            <li>Si es un ingreso, debe ir en la hoja de Ventas</li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-slate-200 dark:border-gray-700">
                    <button
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all"
                        onClick={() => {
                            const csvContent = "Fila,Motivo,Fuente Detectada,Datos\n" +
                                rejectedRecords.map(r =>
                                    `${r.index + 2},"${r.reason}","${r.detectedSource || '?'}", "${JSON.stringify(r.rawData).replace(/"/g, '""')}"`
                                ).join("\n");

                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement("a");
                            const url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", "registros_rechazados.csv");
                            link.style.visibility = "hidden";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                    >
                        📥 Exportar Errores
                    </button>
                    <button
                        className="px-6 py-3 bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600 text-slate-800 dark:text-gray-200 rounded-xl font-bold text-sm transition-all"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
