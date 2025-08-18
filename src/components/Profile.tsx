import { useState } from 'react';
import { User, Mail, Lock, Camera, Info, AtSign, Shield, UserCheck, Calendar, Loader2, Target, LogOut } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Profile() {
    const { user } = useAuthContext();
    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) return;

        setEmailLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                email: formData.email
            });

            if (error) throw error;
            toast.success('✅ Email actualizado. Revisa tu bandeja para confirmar.', {
                duration: 4000,
                style: {
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                },
            });
        } catch (error: any) {
            toast.error(error.message || 'Error al actualizar email', {
                duration: 3000,
                style: {
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                },
            });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.newPassword || !formData.confirmPassword) return;

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden', {
                duration: 3000,
                style: {
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                },
            });
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres', {
                duration: 3000,
                style: {
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                },
            });
            return;
        }

        setPasswordLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (error) throw error;
            toast.success('🔒 Contraseña actualizada correctamente', {
                duration: 3000,
                style: {
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                },
            });
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error: any) {
            toast.error(error.message || 'Error al actualizar contraseña', {
                duration: 3000,
                style: {
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                },
            });
        } finally {
            setPasswordLoading(false);
        }
    };

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
                <div className="max-w-5xl mx-auto space-y-8">{/* 🎨 Header mejorado */}
                    <div className="text-center relative">
                        {/* Elementos decorativos de fondo */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl blur-xl"></div>
                        <div className="relative">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-xl mb-4">
                                <UserCheck className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                                Mi Perfil
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Gestiona tu información personal y configuración de seguridad
                            </p>
                        </div>
                    </div>

                    {/* 💙 Información Personal Card (Azul) */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50">
                        {/* Elementos decorativos */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-300/15 to-blue-400/10 rounded-full blur-xl"></div>

                        <div className="relative p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                                    <Info className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-800">Información Personal</h2>
                                    <p className="text-blue-600">Datos básicos de tu cuenta</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Avatar Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                                                <User className="w-12 h-12 text-white" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                <Camera className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <button className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-200 transition-all duration-200 group">
                                                <Camera className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                                                <span className="text-blue-700 font-semibold group-hover:text-blue-800">
                                                    Cambiar foto
                                                </span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                    Próximamente
                                                </span>
                                            </button>
                                            <p className="text-sm text-blue-600 mt-2 ml-1">
                                                JPG, PNG hasta 2MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* User Info Fields */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-3">
                                            <User className="w-4 h-4" />
                                            Nombre de usuario
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={user?.email?.split('@')[0] || 'Usuario'}
                                                disabled
                                                className="w-full px-4 py-4 border border-blue-200 rounded-xl bg-blue-50/50 text-blue-700 font-medium shadow-inner"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <UserCheck className="w-5 h-5 text-blue-500" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-blue-600 mt-2 ml-1">
                                            Generado automáticamente desde tu email
                                        </p>
                                    </div>

                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-3">
                                            <Calendar className="w-4 h-4" />
                                            Fecha de registro
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'No disponible'}
                                                disabled
                                                className="w-full px-4 py-4 border border-blue-200 rounded-xl bg-blue-50/50 text-blue-700 font-medium shadow-inner"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <Calendar className="w-5 h-5 text-blue-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 💚 Actualizar Email Card (Verde) */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50">
                        {/* Elementos decorativos */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-green-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-300/15 to-emerald-400/10 rounded-full blur-xl"></div>

                        <div className="relative p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                                    <AtSign className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-emerald-800">Actualizar Email</h2>
                                    <p className="text-emerald-600">Cambia tu dirección de correo electrónico</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateEmail} className="space-y-6">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3">
                                        <Mail className="w-4 h-4" />
                                        Nuevo email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full pl-12 pr-4 py-4 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none bg-white/80 text-emerald-800 shadow-inner transition-all duration-200"
                                            placeholder="tu@email.com"
                                        />
                                        {formData.email && formData.email !== user?.email && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                        <p className="text-sm text-emerald-700 flex items-center gap-2">
                                            <Info className="w-4 h-4 text-emerald-600" />
                                            Recibirás un email de confirmación en tu nueva dirección
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={emailLoading || !formData.email || formData.email === user?.email}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {emailLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Actualizando...
                                        </>
                                    ) : (
                                        <>
                                            <AtSign className="w-5 h-5" />
                                            Actualizar Email
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* 🧡 Cambiar Contraseña Card (Naranja/Rojo) */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-100/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/50">
                        {/* Elementos decorativos */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-red-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-300/15 to-orange-400/10 rounded-full blur-xl"></div>

                        <div className="relative p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-orange-800">Cambiar Contraseña</h2>
                                    <p className="text-orange-600">Actualiza tu contraseña para mayor seguridad</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Password Form */}
                                <div className="lg:col-span-2">
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-orange-800 mb-3">
                                                    <Lock className="w-4 h-4" />
                                                    Contraseña actual
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                                                    <input
                                                        type="password"
                                                        value={formData.currentPassword}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                                        className="w-full pl-12 pr-4 py-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white/80 text-orange-800 shadow-inner transition-all duration-200"
                                                        placeholder="Contraseña actual"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-orange-800 mb-3">
                                                    <Lock className="w-4 h-4" />
                                                    Nueva contraseña
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                                                    <input
                                                        type="password"
                                                        value={formData.newPassword}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                                        className="w-full pl-12 pr-4 py-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white/80 text-orange-800 shadow-inner transition-all duration-200"
                                                        placeholder="Nueva contraseña"
                                                    />
                                                    {formData.newPassword && (
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-orange-500'
                                                                }`}></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-orange-800 mb-3">
                                                <Lock className="w-4 h-4" />
                                                Confirmar contraseña
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                                                <input
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                    className="w-full pl-12 pr-4 py-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none bg-white/80 text-orange-800 shadow-inner transition-all duration-200"
                                                    placeholder="Confirmar contraseña"
                                                />
                                                {formData.confirmPassword && (
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <div className={`w-2 h-2 rounded-full ${formData.newPassword === formData.confirmPassword ? 'bg-green-500' : 'bg-red-500'
                                                            }`}></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={passwordLoading || !formData.newPassword || !formData.confirmPassword}
                                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {passwordLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Actualizando...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-5 h-5" />
                                                    Cambiar Contraseña
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                {/* Password Requirements Panel */}
                                <div className="lg:col-span-1">
                                    <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-6">
                                        <h3 className="flex items-center gap-2 text-lg font-bold text-orange-800 mb-4">
                                            <Shield className="w-5 h-5" />
                                            Requisitos
                                        </h3>
                                        <div className="space-y-3">
                                            <div className={`flex items-center gap-3 text-sm ${formData.newPassword.length >= 6 ? 'text-green-700' : 'text-orange-700'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-orange-400'
                                                    }`}></div>
                                                Mínimo 6 caracteres
                                            </div>
                                            <div className={`flex items-center gap-3 text-sm ${formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword
                                                ? 'text-green-700' : 'text-orange-700'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword
                                                    ? 'bg-green-500' : 'bg-orange-400'
                                                    }`}></div>
                                                Confirmar coincidencia
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                                            <p className="text-xs text-orange-700">
                                                💡 Usa una combinación de letras, números y símbolos para mayor seguridad
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
