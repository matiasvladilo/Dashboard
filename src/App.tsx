import { useState, useEffect, useMemo } from 'react';
import type { RawDataItem, FinancialRecord, Filters } from './types';
import {
  parseRecord,
  filterRecords,
  calculateKPIs,
  groupByCategory,
  groupByChannel,
  groupByDate,
  getUniqueValues,
  getIncomeDistribution,
} from './utils';
import { Header } from './components/Header';
import { FiltersBar } from './components/FiltersBar';
import { KpiSection } from './components/KpiSection';
import { EvolutionLineChart } from './components/charts/LineChart';
import { CategoryBarChart } from './components/charts/CategoryBarChart';
import { DonutChart } from './components/charts/DonutChart';
import { ChannelBarChart } from './components/charts/ChannelBarChart';
import { TransactionsTable } from './components/TransactionsTable';
import './index.css';

// URL del webhook de n8n (Production URL usando proxy)
const WEBHOOK_URL = '/api/webhook/4507d4a8-96d8-4f8c-9d07-0ad88c1fb84c';

// Datos mock para desarrollo
const MOCK_DATA: RawDataItem[] = [
  { row_number: 1, "Fecha": "03/11/2025", "Tipo": "Ingreso", "Categoría": "Servicios", "Canal": "Cliente A", "#": "F-2024-001", "Importe (€)": "8200.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Desarrollo de aplicación web" },
  { row_number: 2, "Fecha": "05/11/2025", "Tipo": "Gasto", "Categoría": "Infraestructura", "Canal": "Google Cloud", "#": "G-2024-001", "Importe (€)": "-780.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Servicios cloud mensual" },
  { row_number: 3, "Fecha": "08/11/2025", "Tipo": "Ingreso", "Categoría": "YouTube", "Canal": "YouTube", "#": "F-2024-002", "Importe (€)": "2500.00", "Estado de Pago": "Pendiente", "Descripción Adicional": "Ingresos por publicidad" },
  { row_number: 4, "Fecha": "10/11/2025", "Tipo": "Gasto", "Categoría": "APIs IA", "Canal": "OpenAI", "#": "G-2024-002", "Importe (€)": "-450.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Uso de API GPT-4" },
  { row_number: 5, "Fecha": "12/11/2025", "Tipo": "Ingreso", "Categoría": "Servicios", "Canal": "Cliente B", "#": "F-2024-003", "Importe (€)": "5500.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Consultoría en IA" },
  { row_number: 6, "Fecha": "15/11/2025", "Tipo": "Gasto", "Categoría": "APIs IA", "Canal": "Anthropic", "#": "G-2024-003", "Importe (€)": "-320.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Uso de API Claude" },
  { row_number: 7, "Fecha": "18/11/2025", "Tipo": "Ingreso", "Categoría": "Servicios", "Canal": "Cliente C", "#": "F-2024-004", "Importe (€)": "12000.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Desarrollo de chatbot empresarial" },
  { row_number: 8, "Fecha": "20/11/2025", "Tipo": "Gasto", "Categoría": "Infraestructura", "Canal": "AWS", "#": "G-2024-004", "Importe (€)": "-950.00", "Estado de Pago": "Pendiente", "Descripción Adicional": "Servicios AWS mensual" },
  { row_number: 9, "Fecha": "22/11/2025", "Tipo": "Ingreso", "Categoría": "Cursos", "Canal": "Udemy", "#": "F-2024-005", "Importe (€)": "1800.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Ventas curso de IA" },
  { row_number: 10, "Fecha": "25/11/2025", "Tipo": "Gasto", "Categoría": "Marketing", "Canal": "Google Ads", "#": "G-2024-005", "Importe (€)": "-600.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Campaña publicitaria" },
  { row_number: 11, "Fecha": "28/11/2025", "Tipo": "Ingreso", "Categoría": "Servicios", "Canal": "Cliente A", "#": "F-2024-006", "Importe (€)": "7500.00", "Estado de Pago": "Pendiente", "Descripción Adicional": "Mantenimiento mensual" },
  { row_number: 12, "Fecha": "01/12/2025", "Tipo": "Gasto", "Categoría": "Herramientas", "Canal": "Figma", "#": "G-2024-006", "Importe (€)": "-45.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Suscripción Figma Pro" },
  { row_number: 13, "Fecha": "03/12/2025", "Tipo": "Ingreso", "Categoría": "YouTube", "Canal": "YouTube", "#": "F-2024-007", "Importe (€)": "3200.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Patrocinio video" },
  { row_number: 14, "Fecha": "05/12/2025", "Tipo": "Gasto", "Categoría": "APIs IA", "Canal": "OpenAI", "#": "G-2024-007", "Importe (€)": "-520.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Uso intensivo GPT-4" },
  { row_number: 15, "Fecha": "08/12/2025", "Tipo": "Ingreso", "Categoría": "Servicios", "Canal": "Cliente D", "#": "F-2024-008", "Importe (€)": "15000.00", "Estado de Pago": "Pagado", "Descripción Adicional": "Proyecto automatización IA" },
];

function App() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    fechaDesde: null,
    fechaHasta: null,
    tipo: "Todos",
    categorias: [],
    canales: [],
    estadoPago: "Todos",
    busqueda: "",
  });

  // Cargar datos
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (WEBHOOK_URL) {
        console.log('Iniciando fetch a:', WEBHOOK_URL);
        const response = await fetch(WEBHOOK_URL);
        console.log('Estado respuesta:', response.status, response.statusText);

        if (!response.ok) {
          const text = await response.text();
          console.error('Cuerpo del error:', text);
          throw new Error(`Error HTTP: ${response.status} - ${text}`);
        }

        // Leer primero como texto para depuración
        const textData = await response.text();
        console.log('Cuerpo de respuesta (raw text):', textData);

        if (!textData || textData.trim() === "") {
          throw new Error('La respuesta del servidor está vacía');
        }

        let rawData;
        try {
          rawData = JSON.parse(textData);
        } catch (e) {
          throw new Error(`Error al parsear JSON: ${e instanceof Error ? e.message : 'JSON inválido'}\nContenido recibido: ${textData.substring(0, 100)}...`);
        }

        console.log('Datos recibidos (parsed):', rawData);

        if (!Array.isArray(rawData)) {
          throw new Error('El formato de datos recibido no es un array');
        }

        const parsedRecords = rawData.map(parseRecord);
        console.log('Datos procesados:', parsedRecords);
        setRecords(parsedRecords);
      } else {
        // Usar datos mock si no hay URL
        await new Promise(resolve => setTimeout(resolve, 800)); // Simular carga
        const parsedRecords = MOCK_DATA.map(parseRecord);
        setRecords(parsedRecords);
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Datos filtrados
  const filteredRecords = useMemo(() => {
    return filterRecords(records, filters);
  }, [records, filters]);

  // KPIs calculados
  const kpis = useMemo(() => {
    return calculateKPIs(filteredRecords);
  }, [filteredRecords]);

  // Datos para gráficos
  const categoryData = useMemo(() => groupByCategory(filteredRecords), [filteredRecords]);
  const channelData = useMemo(() => groupByChannel(filteredRecords), [filteredRecords]);
  const timeSeriesData = useMemo(() => groupByDate(filteredRecords), [filteredRecords]);
  const incomeDistribution = useMemo(() => getIncomeDistribution(filteredRecords), [filteredRecords]);

  // Valores únicos para filtros
  const categorias = useMemo(() => getUniqueValues(records, 'categoria'), [records]);
  const canales = useMemo(() => getUniqueValues(records, 'canal'), [records]);

  // Estado de carga
  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando datos…</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <h2 className="error-title">Error al cargar datos</h2>
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={loadData}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="dashboard-container">
        <Header
          fechaDesde={filters.fechaDesde}
          fechaHasta={filters.fechaHasta}
        />

        <FiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          categorias={categorias}
          canales={canales}
        />

        <KpiSection
          ingresosTotales={kpis.ingresosTotales}
          gastosTotales={kpis.gastosTotales}
          beneficioNeto={kpis.beneficioNeto}
          categoriaMasRentable={kpis.categoriaMasRentable}
          numeroOperaciones={kpis.numeroOperaciones}
          ticketMedioServicios={kpis.ticketMedioServicios}
        />

        <section className="charts-section">
          <EvolutionLineChart data={timeSeriesData} />
          <CategoryBarChart data={categoryData} />
          <DonutChart data={incomeDistribution} />
          <ChannelBarChart data={channelData} />
        </section>

        <TransactionsTable records={filteredRecords} />
      </div>
    </div>
  );
}

export default App;
