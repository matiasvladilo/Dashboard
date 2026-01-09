import { useState, useEffect, useMemo } from 'react';
import type { NormalizedRecord, Filters, ValidationWarning, ComparisonSettings } from './types';
import { adaptPayload } from './utils/payloadAdapter';
import {
  filterRecords,
  calculateKPIs,
  groupByDateEvolution,
  calculateIndice50OverTime,
  groupByProveedor,
  groupByMedioPago,
  groupByMermaTipo,
  groupByMermaProducto,
} from './utils/analytics';
import { getUniqueValues } from './utils/helpers';
import { MOCK_DATA } from './mockData';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { KpiSection } from './components/KpiSection';
import { EvolutionChart } from './components/charts/EvolutionChart';
import { Indice50Chart } from './components/charts/Indice50Chart';
import { ProveedorChart } from './components/charts/ProveedorChart';
import { MedioPagoChart } from './components/charts/MedioPagoChart';
import { MermaCharts } from './components/charts/MermaCharts';
import { TabbedTables } from './components/TabbedTables';
import { RejectedRecordsModal } from './components/RejectedRecordsModal';
import type { RejectedRecord } from './utils/payloadAdapter';
import { Sidebar } from './components/Sidebar';
import './index.css';

// URL del webhook de n8n (usar proxy local)
const WEBHOOK_URL = 'https://n8n.srv1215012.hstgr.cloud/webhook-test/4507d4a8-96d8-4f8c-9d07-0ad88c1fb84c';

function App() {
  const [records, setRecords] = useState<NormalizedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<ValidationWarning[]>([]);
  const [rejectedRecords, setRejectedRecords] = useState<RejectedRecord[]>([]);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    locales: [],
    fechaDesde: null,
    fechaHasta: null,
    source: "Todos",
    busqueda: "",
    proveedores: [],
    mediosPagoGastos: [],
    subtiposDocs: [],
    numCheques: [],
    responsables: [],
    mediosPagoVentas: [],
    tiposMerma: [],
    productos: [],
  });

  const [comparison, setComparison] = useState<ComparisonSettings>({
    enabled: false,
    fechaDesdeB: null,
    fechaHastaB: null,
  });

  // Load data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    setWarnings([]);

    try {
      let rawPayload: any;

      if (WEBHOOK_URL) {
        try {
          const response = await fetch(WEBHOOK_URL);
          if (response.ok) {
            const textData = await response.text();
            if (textData && textData.trim()) {
              rawPayload = JSON.parse(textData);
            } else {
              throw new Error('Respuesta vacía del webhook');
            }
          } else {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (fetchError) {
          console.warn('Usando datos mock:', fetchError);
          rawPayload = MOCK_DATA;
        }
      } else {
        rawPayload = MOCK_DATA;
      }

      const { records: normalizedRecords, warnings: adapterWarnings, rejectedRecords: rejected } = adaptPayload(rawPayload);
      setRecords(normalizedRecords);
      setWarnings(adapterWarnings);
      setRejectedRecords(rejected);

      if (normalizedRecords.length === 0) {
        setError('No se encontraron registros válidos');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const locales = useMemo(() => getUniqueValues(records, 'local'), [records]);
  const responsables = useMemo(() => {
    const ventasRecords = records.filter(r => r.source === 'ventas' && r.responsable);
    return getUniqueValues(ventasRecords, 'responsable');
  }, [records]);
  const proveedores = useMemo(() => {
    const gastosRecords = records.filter(r => r.source === 'gastos' && r.proveedorCliente);
    return getUniqueValues(gastosRecords, 'proveedorCliente');
  }, [records]);
  const mediosPagoVentas = useMemo(() => {
    const ventasRecords = records.filter(r => r.source === 'ventas' && r.medioPago);
    return getUniqueValues(ventasRecords, 'medioPago');
  }, [records]);
  const mediosPagoGastos = useMemo(() => {
    const gastosRecords = records.filter(r => r.source === 'gastos' && r.medioPago);
    return getUniqueValues(gastosRecords, 'medioPago');
  }, [records]);
  const subtiposDocs = useMemo(() => {
    const gastosRecords = records.filter(r => r.source === 'gastos' && r.subtipoDoc);
    return getUniqueValues(gastosRecords, 'subtipoDoc');
  }, [records]);
  const productos = useMemo(() => {
    const mermaRecords = records.filter(r => r.source === 'merma' && r.producto);
    return getUniqueValues(mermaRecords, 'producto');
  }, [records]);
  const tiposMerma = useMemo(() => {
    const mermaRecords = records.filter(r => r.source === 'merma' && r.tipoMerma);
    return getUniqueValues(mermaRecords, 'tipoMerma');
  }, [records]);

  // Main Period Data
  const filteredRecords = useMemo(() => filterRecords(records, filters), [records, filters]);
  const kpis = useMemo(() => calculateKPIs(filteredRecords), [filteredRecords]);
  const evolutionData = useMemo(() => groupByDateEvolution(filteredRecords), [filteredRecords]);
  const indice50Data = useMemo(() => calculateIndice50OverTime(filteredRecords), [filteredRecords]);
  const proveedorData = useMemo(() => groupByProveedor(filteredRecords), [filteredRecords]);
  const medioPagoData = useMemo(() => groupByMedioPago(filteredRecords), [filteredRecords]);
  const mermaTipoData = useMemo(() => groupByMermaTipo(filteredRecords), [filteredRecords]);
  const mermaProductoData = useMemo(() => groupByMermaProducto(filteredRecords), [filteredRecords]);

  // Comparison Period Data
  const filteredRecordsB = useMemo(() => {
    if (!comparison.enabled) return [];
    return filterRecords(records, {
      ...filters,
      fechaDesde: comparison.fechaDesdeB,
      fechaHasta: comparison.fechaHastaB
    });
  }, [records, filters, comparison]);

  const kpisB = useMemo(() => {
    if (!comparison.enabled) return null;
    return calculateKPIs(filteredRecordsB);
  }, [comparison.enabled, filteredRecordsB]);

  if (loading) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium tracking-wide">Cargando inteligencia financiera...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-dark min-h-screen flex items-center justify-center text-white p-8">
        <div className="max-w-md w-full bg-[#1c242d] border border-gray-800 rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-red-500 text-6xl mb-4">warning</span>
          <h2 className="text-2xl font-bold mb-2">Error de conexión</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors" onClick={loadData}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark font-display text-slate-900 dark:text-white h-screen flex w-full overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <header className="w-full h-16 bg-[#111418] border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-10 lg:hidden">
          <div className="flex items-center gap-3">
            <button className="text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="text-white font-bold">Minimarket Mgr</span>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 space-y-2 custom-scrollbar">
          <Header
            fechaDesde={filters.fechaDesde}
            fechaHasta={filters.fechaHasta}
            onUpdateData={loadData}
            isComparing={comparison.enabled}
            fechaDesdeB={comparison.fechaDesdeB}
            fechaHastaB={comparison.fechaHastaB}
          />

          <FiltersBar
            filters={filters}
            onFiltersChange={setFilters}
            comparison={comparison}
            onComparisonChange={setComparison}
            locales={locales}
            responsables={responsables}
            proveedores={proveedores}
            mediosPagoVentas={mediosPagoVentas}
            mediosPagoGastos={mediosPagoGastos}
            subtiposDocs={subtiposDocs}
            productos={productos}
            tiposMerma={tiposMerma}
            warnings={warnings}
            rejectedRecords={rejectedRecords}
            onShowRejected={() => setShowRejectedModal(true)}
          />

          <KpiSection kpis={kpis} kpisB={kpisB} comparisonEnabled={comparison.enabled} />

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-[#1c242d] border border-slate-100 dark:border-gray-800 rounded-3xl p-6 hover:border-indigo-200 dark:hover:border-gray-700 transition-all shadow-sm">
              <EvolutionChart data={evolutionData} />
            </div>
            <div className="bg-white dark:bg-[#1c242d] border border-slate-100 dark:border-gray-800 rounded-3xl p-6 hover:border-indigo-200 dark:hover:border-gray-700 transition-all shadow-sm">
              <Indice50Chart data={indice50Data} />
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-[#1c242d] border border-slate-100 dark:border-gray-800 rounded-3xl p-6 hover:border-indigo-200 dark:hover:border-gray-700 transition-all shadow-sm">
              <ProveedorChart data={proveedorData} />
            </div>
            <div className="bg-white dark:bg-[#1c242d] border border-slate-100 dark:border-gray-800 rounded-3xl p-6 hover:border-indigo-200 dark:hover:border-gray-700 transition-all shadow-sm">
              <MedioPagoChart data={medioPagoData} />
            </div>
          </section>

          <section className="mb-8">
            <div className="bg-white dark:bg-[#1c242d] border border-slate-100 dark:border-gray-800 rounded-3xl p-6 hover:border-indigo-200 dark:hover:border-gray-700 transition-all shadow-sm">
              <MermaCharts tipoData={mermaTipoData} productoData={mermaProductoData} />
            </div>
          </section>

          <div className="bg-white dark:bg-[#1c242d] border border-slate-100 dark:border-gray-800 rounded-3xl overflow-hidden mb-8 shadow-sm">
            <TabbedTables records={filteredRecords} />
          </div>

          {showRejectedModal && (
            <RejectedRecordsModal
              rejectedRecords={rejectedRecords}
              onClose={() => setShowRejectedModal(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
