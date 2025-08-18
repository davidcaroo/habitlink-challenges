import { useState } from 'react';
import { Copy, Share2, X, CheckCircle } from 'lucide-react';
import { Challenge } from '../hooks/useChallenges';

interface ShareChallengeModalProps {
    challenge: Challenge;
    isOpen: boolean;
    onClose: () => void;
}

export default function ShareChallengeModal({ challenge, isOpen, onClose }: ShareChallengeModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = `${window.location.origin}/join/${challenge.shareCode}`;

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const copyCode = () => copyToClipboard(challenge.shareCode || '');
    const copyUrl = () => copyToClipboard(shareUrl);

    const shareChallenge = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Únete a mi reto: ${challenge.name}`,
                    text: `¡Hola! Te invito a unirte a mi reto "${challenge.name}" en HabitLink. Usa el código ${challenge.shareCode} o haz clic en el enlace.`,
                    url: shareUrl,
                });
            } catch (error) {
                // User cancelled the share
            }
        } else {
            copyUrl();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-200/50 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                        ¡Reto creado!
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="text-center mb-8">
                    <div className="text-4xl mb-3">{challenge.emoji}</div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        {challenge.name}
                    </h4>
                    <p className="text-gray-600">
                        Tu reto grupal está listo. Comparte el código o enlace para que otros se unan.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Share Code */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Código de reto
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-xl p-3 text-center">
                                <span className="font-mono text-2xl font-bold text-green-600 tracking-wider">
                                    {challenge.shareCode}
                                </span>
                            </div>
                            <button
                                onClick={copyCode}
                                className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                                title="Copiar código"
                            >
                                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Share URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Enlace de invitación
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-xl p-3">
                                <span className="text-sm text-gray-700 break-all">
                                    {shareUrl}
                                </span>
                            </div>
                            <button
                                onClick={copyUrl}
                                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                                title="Copiar enlace"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Share Button */}
                    <button
                        onClick={shareChallenge}
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-5 h-5" />
                        Compartir reto
                    </button>

                    {/* Continue Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl transition-all"
                    >
                        Continuar
                    </button>
                </div>

                {copied && (
                    <div className="mt-4 text-center">
                        <span className="inline-flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                            <CheckCircle className="w-4 h-4" />
                            ¡Copiado al portapapeles!
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
