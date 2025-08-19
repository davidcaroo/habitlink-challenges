import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AnimatedBackground from './AnimatedBackground';
import toast from 'react-hot-toast';

const EmailVerification: React.FC = () => {
    const { user, signOut, resendVerificationEmail } = useAuthContext();
    const [isResending, setIsResending] = useState(false);

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            await resendVerificationEmail();
            toast.success('Correo de verificación enviado');
        } catch (error) {
            toast.error('Error al enviar el correo');
        } finally {
            setIsResending(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Sesión cerrada');
        } catch (error) {
            toast.error('Error al cerrar sesión');
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
            <AnimatedBackground />
            <div className="relative z-10 max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Verifica tu cuenta
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Te hemos enviado un enlace de verificación a <strong>{user?.email}</strong>.
                        Por favor, verifica tu cuenta para acceder al dashboard.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleRefresh}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        Ya verifiqué mi cuenta
                    </button>

                    <button
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? 'Enviando...' : 'Reenviar correo de verificación'}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cerrar sesión
                    </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>¿No recibiste el correo?</strong>
                    </p>
                    <ul className="text-sm text-blue-600 mt-2 space-y-1">
                        <li>• Revisa tu carpeta de spam</li>
                        <li>• Espera unos minutos, puede tardar en llegar</li>
                        <li>• Verifica que el email sea correcto</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
