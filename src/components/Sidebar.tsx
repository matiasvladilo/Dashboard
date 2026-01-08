import { useState, useEffect } from 'react';

export function Sidebar() {
    // Initializing with false (Light Mode) as per request to improve light theme
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const menuItems = [
        { icon: 'grid_view', label: 'Resumen', active: true },
        { icon: 'payments', label: 'Ventas' },
        { icon: 'receipt_long', label: 'Gastos' },
        { icon: 'inventory', label: 'Inventario' },
        { icon: 'analytics', label: 'Reportes' },
        { icon: 'settings', label: 'Ajustes' },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-[#0f1113] border-r border-slate-100 dark:border-white/5 hidden lg:flex flex-col h-full transition-all duration-500 z-50">
            {/* Header / Logo */}
            <div className="p-8 pb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 transform rotate-3">
                    <span className="material-symbols-outlined text-white font-black" style={{ fontSize: '24px' }}>finance</span>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Finanza<span className="text-indigo-600 italic">Pro</span></h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Analytics</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 mt-8 space-y-2">
                <div className="px-4 mb-4">
                    <span className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">Menú Principal</span>
                </div>
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${item.active
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className={`material-symbols-outlined transition-transform duration-300 group-hover:scale-110 ${item.active ? 'font-black' : ''}`} style={{ fontSize: '20px' }}>{item.icon}</span>
                        <span className={`text-sm tracking-tight ${item.active ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                        {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
                    </button>
                ))}
            </nav>

            {/* Footer / Theme Toggle */}
            <div className="p-6 border-t border-slate-50 dark:border-white/5">
                <div className="mb-6 px-2">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between p-1.5 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:border-indigo-200 transition-all group"
                    >
                        <div className={`p-2 rounded-xl transition-all ${!isDark ? 'bg-white shadow-sm text-amber-500' : 'text-slate-400'}`}>
                            <span className="material-symbols-outlined block" style={{ fontSize: '18px' }}>light_mode</span>
                        </div>
                        <div className={`p-2 rounded-xl transition-all ${isDark ? 'bg-[#1c1f23] shadow-sm text-indigo-400' : 'text-slate-400'}`}>
                            <span className="material-symbols-outlined block" style={{ fontSize: '18px' }}>dark_mode</span>
                        </div>
                    </button>
                    <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Tema: {isDark ? 'Oscuro' : 'Claro'}</p>
                </div>

                <div className="flex items-center gap-4 px-2">
                    <div className="relative">
                        <img
                            src={`https://ui-avatars.com/api/?name=ML&background=6366f1&color=fff&bold=true`}
                            className="w-10 h-10 rounded-2xl border-2 border-white dark:border-slate-800 shadow-xl"
                            alt="User"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white leading-none">Matias Vladilo</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Super Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
