import React from 'react';
import {
    Home,
    ListChecks,
    Users,
    User,
    Settings,
    LogOut,
    Target,
    Menu,
    X
} from 'lucide-react';

interface SidebarProps {
    currentView: string;
    onNavigate: (view: string) => void;
    onLogout: () => void;
    isCollapsed?: boolean;
    isMobileOpen?: boolean;
    onMobileToggle?: () => void;
}

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-challenges', label: 'Mis Retos', icon: ListChecks },
    { id: 'public-challenges', label: 'Retos Públicos', icon: Users },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings },
];

export default function Sidebar({
    currentView,
    onNavigate,
    onLogout,
    isCollapsed = false,
    isMobileOpen = false,
    onMobileToggle
}: SidebarProps) {
    const handleNavigate = (view: string) => {
        onNavigate(view);
        // Cerrar sidebar en mobile después de navegar
        if (onMobileToggle && isMobileOpen) {
            onMobileToggle();
        }
    };

    return (
        <>
            {/* Overlay para mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`
                bg-white/95 backdrop-blur-md border-r border-green-200/50 transition-all duration-300 
                h-screen lg:min-h-screen flex flex-col
                ${isCollapsed ? 'w-16' : 'w-64'}
                
                /* Mobile: Fixed overlay */
                fixed left-0 top-0 z-50 lg:relative lg:z-auto
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Header con logo y botón de cerrar en mobile */}
                <div className="p-4 border-b border-green-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            {!isCollapsed && (
                                <h1 className="text-xl font-bold text-gray-800">HabitLink</h1>
                            )}
                        </div>

                        {/* Botón cerrar en mobile */}
                        {!isCollapsed && (
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleNavigate(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-green-100 hover:text-green-700'
                                            }`}
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {!isCollapsed && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-green-200/50">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
                        title={isCollapsed ? 'Salir' : undefined}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="font-medium">Salir</span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
