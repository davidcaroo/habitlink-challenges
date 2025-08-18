import { Target, LogOut, User } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

export default function Settings() {
    const { user } = useAuthContext();

    return (
        <div className="h-full flex flex-col">
            {/* Navbar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-green-200/50 flex-shrink-0">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8 text-green-600" />
                                <h1 className="text-2xl font-bold text-gray-800">HabitLink</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="hidden md:block">
                                    <p className="font-semibold text-gray-800">{user?.email?.split('@')[0] || 'Usuario'}</p>
                                    <p className="text-sm text-gray-600">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {/* onLogout function should be passed as prop */ }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Cerrar sesión"
                            >
                                <LogOut className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Configuración</h1>

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-green-200/50 text-center">
                        <div className="text-6xl mb-4">⚙️</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Próximamente
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Esta función estará disponible pronto. Aquí podrás cambiar el idioma, tema (claro/oscuro), paleta de colores y otras preferencias.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
