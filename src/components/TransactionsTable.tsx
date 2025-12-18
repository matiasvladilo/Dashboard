import { useState, useMemo } from 'react';
import type { FinancialRecord } from '../types';
import { formatDate, formatCurrency } from '../utils';

interface TransactionsTableProps {
    records: FinancialRecord[];
}

type SortField = 'fecha' | 'tipo' | 'categoria' | 'canal' | 'referencia' | 'importe' | 'estadoPago';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function TransactionsTable({ records }: TransactionsTableProps) {
    const [sortField, setSortField] = useState<SortField>('fecha');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    const sortedRecords = useMemo(() => {
        return [...records].sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'fecha':
                    comparison = a.fecha.getTime() - b.fecha.getTime();
                    break;
                case 'tipo':
                    comparison = a.tipo.localeCompare(b.tipo);
                    break;
                case 'categoria':
                    comparison = a.categoria.localeCompare(b.categoria);
                    break;
                case 'canal':
                    comparison = a.canal.localeCompare(b.canal);
                    break;
                case 'referencia':
                    comparison = a.referencia.localeCompare(b.referencia);
                    break;
                case 'importe':
                    comparison = a.importe - b.importe;
                    break;
                case 'estadoPago':
                    comparison = a.estadoPago.localeCompare(b.estadoPago);
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [records, sortField, sortDirection]);

    const totalPages = Math.ceil(sortedRecords.length / ITEMS_PER_PAGE);
    const paginatedRecords = sortedRecords.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
        setCurrentPage(1);
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <span className="sort-icon">⇅</span>;
        return <span className="sort-icon active">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="table-container">
            <h3 className="table-title">📋 Detalle de Transacciones</h3>

            <div className="table-wrapper">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('fecha')}>
                                Fecha <SortIcon field="fecha" />
                            </th>
                            <th onClick={() => handleSort('tipo')}>
                                Tipo <SortIcon field="tipo" />
                            </th>
                            <th onClick={() => handleSort('categoria')}>
                                Categoría <SortIcon field="categoria" />
                            </th>
                            <th onClick={() => handleSort('canal')}>
                                Canal <SortIcon field="canal" />
                            </th>
                            <th onClick={() => handleSort('referencia')}>
                                # <SortIcon field="referencia" />
                            </th>
                            <th onClick={() => handleSort('importe')}>
                                Importe (€) <SortIcon field="importe" />
                            </th>
                            <th onClick={() => handleSort('estadoPago')}>
                                Estado <SortIcon field="estadoPago" />
                            </th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedRecords.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="no-data">No hay datos para mostrar</td>
                            </tr>
                        ) : (
                            paginatedRecords.map((record) => (
                                <tr key={record.rowNumber} className={record.tipo === 'Ingreso' ? 'row-income' : 'row-expense'}>
                                    <td>{formatDate(record.fecha)}</td>
                                    <td>
                                        <span className={`badge badge-${record.tipo.toLowerCase()}`}>
                                            {record.tipo}
                                        </span>
                                    </td>
                                    <td>{record.categoria}</td>
                                    <td>{record.canal}</td>
                                    <td className="reference">{record.referencia}</td>
                                    <td className={`amount ${record.tipo === 'Ingreso' ? 'positive' : 'negative'}`}>
                                        {formatCurrency(record.importe)}
                                    </td>
                                    <td>
                                        <span className={`badge badge-${record.estadoPago.toLowerCase()}`}>
                                            {record.estadoPago}
                                        </span>
                                    </td>
                                    <td className="description">{record.descripcion}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        ««
                    </button>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        «
                    </button>

                    <span className="pagination-info">
                        Página {currentPage} de {totalPages} ({sortedRecords.length} registros)
                    </span>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        »
                    </button>
                    <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        »»
                    </button>
                </div>
            )}
        </div>
    );
}
