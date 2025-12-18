import { useState, useRef, useEffect } from 'react';
import type { Filters } from '../types';

interface FiltersBarProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    categorias: string[];
    canales: string[];
}

export function FiltersBar({ filters, onFiltersChange, categorias, canales }: FiltersBarProps) {
    const [showCategorias, setShowCategorias] = useState(false);
    const [showCanales, setShowCanales] = useState(false);
    const categoriasRef = useRef<HTMLDivElement>(null);
    const canalesRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoriasRef.current && !categoriasRef.current.contains(event.target as Node)) {
                setShowCategorias(false);
            }
            if (canalesRef.current && !canalesRef.current.contains(event.target as Node)) {
                setShowCanales(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateChange = (field: 'fechaDesde' | 'fechaHasta', value: string) => {
        onFiltersChange({
            ...filters,
            [field]: value ? new Date(value) : null,
        });
    };

    const handleTipoChange = (value: string) => {
        onFiltersChange({
            ...filters,
            tipo: value as Filters['tipo'],
        });
    };

    const handleEstadoPagoChange = (value: string) => {
        onFiltersChange({
            ...filters,
            estadoPago: value as Filters['estadoPago'],
        });
    };

    const handleCategoriaToggle = (categoria: string) => {
        const newCategorias = filters.categorias.includes(categoria)
            ? filters.categorias.filter(c => c !== categoria)
            : [...filters.categorias, categoria];
        onFiltersChange({
            ...filters,
            categorias: newCategorias,
        });
    };

    const handleCanalToggle = (canal: string) => {
        const newCanales = filters.canales.includes(canal)
            ? filters.canales.filter(c => c !== canal)
            : [...filters.canales, canal];
        onFiltersChange({
            ...filters,
            canales: newCanales,
        });
    };

    const handleBusquedaChange = (value: string) => {
        onFiltersChange({
            ...filters,
            busqueda: value,
        });
    };

    const clearAllFilters = () => {
        onFiltersChange({
            fechaDesde: null,
            fechaHasta: null,
            tipo: "Todos",
            categorias: [],
            canales: [],
            estadoPago: "Todos",
            busqueda: "",
        });
    };

    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    const hasActiveFilters =
        filters.fechaDesde ||
        filters.fechaHasta ||
        filters.tipo !== "Todos" ||
        filters.categorias.length > 0 ||
        filters.canales.length > 0 ||
        filters.estadoPago !== "Todos" ||
        filters.busqueda;

    return (
        <div className="filters-bar">
            <div className="filters-row">
                {/* Fecha Desde */}
                <div className="filter-group">
                    <label>Desde</label>
                    <input
                        type="date"
                        value={formatDateForInput(filters.fechaDesde)}
                        onChange={(e) => handleDateChange('fechaDesde', e.target.value)}
                    />
                </div>

                {/* Fecha Hasta */}
                <div className="filter-group">
                    <label>Hasta</label>
                    <input
                        type="date"
                        value={formatDateForInput(filters.fechaHasta)}
                        onChange={(e) => handleDateChange('fechaHasta', e.target.value)}
                    />
                </div>

                {/* Tipo */}
                <div className="filter-group">
                    <label>Tipo</label>
                    <select
                        value={filters.tipo}
                        onChange={(e) => handleTipoChange(e.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Gasto">Gasto</option>
                    </select>
                </div>

                {/* Categorías - Multi-select */}
                <div className="filter-group multi-select" ref={categoriasRef}>
                    <label>Categorías</label>
                    <button
                        className="multi-select-trigger"
                        onClick={() => setShowCategorias(!showCategorias)}
                    >
                        {filters.categorias.length > 0
                            ? `${filters.categorias.length} seleccionadas`
                            : 'Todas'}
                        <span className="arrow">▼</span>
                    </button>
                    {showCategorias && (
                        <div className="multi-select-dropdown">
                            {categorias.map(cat => (
                                <label key={cat} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={filters.categorias.includes(cat)}
                                        onChange={() => handleCategoriaToggle(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Canales - Multi-select */}
                <div className="filter-group multi-select" ref={canalesRef}>
                    <label>Canales</label>
                    <button
                        className="multi-select-trigger"
                        onClick={() => setShowCanales(!showCanales)}
                    >
                        {filters.canales.length > 0
                            ? `${filters.canales.length} seleccionados`
                            : 'Todos'}
                        <span className="arrow">▼</span>
                    </button>
                    {showCanales && (
                        <div className="multi-select-dropdown">
                            {canales.map(canal => (
                                <label key={canal} className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={filters.canales.includes(canal)}
                                        onChange={() => handleCanalToggle(canal)}
                                    />
                                    {canal}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Estado de Pago */}
                <div className="filter-group">
                    <label>Estado de Pago</label>
                    <select
                        value={filters.estadoPago}
                        onChange={(e) => handleEstadoPagoChange(e.target.value)}
                    >
                        <option value="Todos">Todos</option>
                        <option value="Pagado">Pagado</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                </div>

                {/* Búsqueda */}
                <div className="filter-group search-group">
                    <label>Buscar</label>
                    <input
                        type="text"
                        placeholder="Descripción o referencia..."
                        value={filters.busqueda}
                        onChange={(e) => handleBusquedaChange(e.target.value)}
                    />
                </div>

                {/* Limpiar filtros */}
                {hasActiveFilters && (
                    <button className="clear-filters-btn" onClick={clearAllFilters}>
                        ✕ Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}
