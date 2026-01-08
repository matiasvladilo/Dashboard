// Mock data representing real data structure from n8n/Google Sheets

export const MOCK_VENTAS = [
    { local: "Local A", date: "18/12/2025", "Total Venta": "125000", Responsable: "Juan Pérez", "Medio de Pago": "Efectivo" },
    { local: "Local A", date: "17/12/2025", "Total Venta": "98000", Responsable: "María López", "Medio de Pago": "Tarjeta" },
    { local: "Local B", date: "18/12/2025", "Total Venta": "156000", Responsable: "Carlos Díaz", "Medio de Pago": "Transferencia" },
    { local: "Local B", date: "17/12/2025", "Total Venta": "142000", Responsable: "Ana García", "Medio de Pago": "Tarjeta" },
    { local: "Local A", date: "16/12/2025", "Total Venta": "189000", Responsable: "Juan Pérez", "Medio de Pago": "Efectivo" },
    { local: "Local C", date: "18/12/2025", "Total Venta": "234000", Responsable: "Pedro Ruiz", "Medio de Pago": "Tarjeta" },
    { local: "Local C", date: "17/12/2025", "Total Venta": "201000", Responsable: "Sofía Morales", "Medio de Pago": "Efectivo" },
    { local: "Local A", date: "15/12/2025", "Total Venta": "167000", Responsable: "María López", "Medio de Pago": "Transferencia" },
    { local: "Local B", date: "16/12/2025", "Total Venta": "178000", Responsable: "Carlos Díaz", "Medio de Pago": "Tarjeta" },
    { local: "Local C", date: "16/12/2025", "Total Venta": "256000", Responsable: "Pedro Ruiz", "Medio de Pago": "Efectivo" },
];

export const MOCK_GASTOS = [
    { local: "Local A", date: "18/12/2025", "Total Factura": "45000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor X", "Medio de Pago": "Transferencia", "Subtipo Doc": "Factura", "N° Cheque": "" },
    { local: "Local A", date: "17/12/2025", "Total Factura": "32000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor Y", "Medio de Pago": "Cheque", "Subtipo Doc": "Factura", "N° Cheque": "1234" },
    { local: "Local B", date: "18/12/2025", "Total Factura": "67000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor Z", "Medio de Pago": "Transferencia", "Subtipo Doc": "Factura", "N° Cheque": "" },
    { local: "Local B", date: "17/12/2025", "Total Factura": "54000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor X", "Medio de Pago": "Efectivo", "Subtipo Doc": "Boleta", "N° Cheque": "" },
    { local: "Local A", date: "16/12/2025", "Total Factura": "78000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor W", "Medio de Pago": "Transferencia", "Subtipo Doc": "Factura", "N° Cheque": "" },
    { local: "Local C", date: "18/12/2025", "Total Factura": "89000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor X", "Medio de Pago": "Cheque", "Subtipo Doc": "Factura", "N° Cheque": "5678" },
    { local: "Local C", date: "17/12/2025", "Total Factura": "102000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor Y", "Medio de Pago": "Transferencia", "Subtipo Doc": "Factura", "N° Cheque": "" },
    { local: "Local A", date: "15/12/2025", "Total Factura": "23000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor Z", "Medio de Pago": "Efectivo", "Subtipo Doc": "Boleta", "N° Cheque": "" },
    { local: "Local B", date: "16/12/2025", "Total Factura": "91000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor W", "Medio de Pago": "Transferencia", "Subtipo Doc": "Factura", "N° Cheque": "" },
    { local: "Local C", date: "16/12/2025", "Total Factura": "112000", "Tipo (Ingreso/Gasto)": "GASTO", "Proveedor/Cliente": "Proveedor X", "Medio de Pago": "Cheque", "Subtipo Doc": "Factura", "N° Cheque": "9012" },
    // Include some INGRESO records that should be filtered out
    { local: "Local A", date: "18/12/2025", "Total Factura": "150000", "Tipo (Ingreso/Gasto)": "INGRESO", "Proveedor/Cliente": "Cliente ABC", "Medio de Pago": "Transferencia", "Subtipo Doc": "Factura", "N° Cheque": "" },
    { local: "Local B", date: "17/12/2025", "Total Factura": "200000", "Tipo (Ingreso/Gasto)": "INGRESO", "Proveedor/Cliente": "Cliente XYZ", "Medio de Pago": "Cheque", "Subtipo Doc": "Factura", "N° Cheque": "3333" },
];

export const MOCK_MERMA = [
    { date: "18/12/2025", PRODUCTO: "Tomate", TIPO: "Vencimiento", MONTO: "12000", local: "Local A" },
    { date: "17/12/2025", PRODUCTO: "Lechuga", TIPO: "Deterioro", MONTO: "8500", local: "Local A" },
    { date: "18/12/2025", PRODUCTO: "Manzana", TIPO: "Vencimiento", MONTO: "15000", local: "Local B" },
    { date: "17/12/2025", PRODUCTO: "Pan", TIPO: "Vencimiento", MONTO: "6000", local: "Local B" },
    { date: "16/12/2025", PRODUCTO: "Queso", TIPO: "Deterioro", MONTO: "22000", local: "Local A" },
    { date: "18/12/2025", PRODUCTO: "Tomate", TIPO: "Vencimiento", MONTO: "18000", local: "Local C" },
    { date: "17/12/2025", PRODUCTO: "Leche", TIPO: "Vencimiento", MONTO: "9500", local: "Local C" },
    { date: "16/12/2025", PRODUCTO: "Yogurt", TIPO: "Vencimiento", MONTO: "11000", local: "Local B" },
    { date: "15/12/2025", PRODUCTO: "Plátano", TIPO: "Deterioro", MONTO: "7000", local: "Local A" },
    { date: "16/12/2025", PRODUCTO: "Carne", TIPO: "Vencimiento", MONTO: "28000", local: "Local C" },
];

// Mock payload in SEPARATED format
export const MOCK_PAYLOAD_SEPARATED = {
    ventas: MOCK_VENTAS,
    gastos: MOCK_GASTOS,
    merma: MOCK_MERMA,
};

// Mock payload in UNIFIED format (with explicit source field)
export const MOCK_PAYLOAD_UNIFIED = [
    ...MOCK_VENTAS.map(v => ({ ...v, source: 'ventas' })),
    ...MOCK_GASTOS.map(g => ({ ...g, source: 'gastos' })),
    ...MOCK_MERMA.map(m => ({ ...m, source: 'merma' })),
];

// Export the separated format as default for development
export const MOCK_DATA = MOCK_PAYLOAD_SEPARATED;
