import { useState, useEffect } from 'react';
import { Search, Users, Calendar, Code, UserPlus, Target, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChallenges, Challenge } from '../hooks/useChallenges';
import { useAuthContext } from '../contexts/AuthContext';

function PublicChallengeCard({
    challenge,
    onJoin
}: {
    challenge: Challenge;
    onJoin: (challengeId: string) => void;
}) {
    const [isJoining, setIsJoining] = useState(false);

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            await onJoin(challenge.id);
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-3xl shrink-0">{challenge.emoji}</div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-800 text-lg truncate">
                            {challenge.name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{challenge.duration} días</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{challenge.participants} participantes</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {challenge.shareCode && (
                        <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700">
                            {challenge.shareCode}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Creado hace {new Date(challenge.createdAt).toLocaleDateString()}
                </div>
                <button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    {isJoining ? 'Uniéndose...' : 'Unirse'}
                </button>
            </div>
        </div>
    );
}

export default function PublicChallenges() {
    const { user } = useAuthContext();
    const { getPublicChallenges, joinPublicChallenge, joinChallengeByCode } = useChallenges();
    const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [shareCode, setShareCode] = useState('');
    const [showJoinByCode, setShowJoinByCode] = useState(false);

    // Load public challenges
    useEffect(() => {
        loadPublicChallenges();
    }, []);

    const loadPublicChallenges = async () => {
        try {
            setLoading(true);
            const challenges = await getPublicChallenges();
            setPublicChallenges(challenges);
        } catch (error) {
            toast.error('Error al cargar retos públicos');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinChallenge = async (challengeId: string) => {
        try {
            await joinPublicChallenge(challengeId);
            toast.success('¡Te has unido al reto exitosamente!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '12px 16px',
                },
                icon: '🎉',
            });
            // Refresh challenges
            loadPublicChallenges();
        } catch (error: any) {
            toast.error(error.message || 'Error al unirse al reto');
        }
    };

    const handleJoinByCode = async () => {
        if (!shareCode.trim()) {
            toast.error('Ingresa un código válido');
            return;
        }

        try {
            await joinChallengeByCode(shareCode.trim());
            toast.success('¡Te has unido al reto exitosamente!', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '12px 16px',
                },
                icon: '🎉',
            });
            setShareCode('');
            setShowJoinByCode(false);
            loadPublicChallenges();
        } catch (error: any) {
            toast.error(error.message || 'Error al unirse al reto');
        }
    };

    const filteredChallenges = publicChallenges.filter(challenge =>
        challenge.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-0">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-gray-800">Retos Públicos</h1>
                        <button
                            onClick={() => setShowJoinByCode(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <Code className="w-5 h-5" />
                            Unirse con código
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar retos públicos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none bg-white/80 backdrop-blur-md"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="max-w-6xl mx-auto">

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Cargando retos públicos...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredChallenges.length === 0 && (
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-green-200/50 text-center">
                            <div className="text-6xl mb-4">🌍</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {publicChallenges.length === 0 ? 'No hay retos públicos disponibles' : 'No se encontraron retos'}
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                                {publicChallenges.length === 0
                                    ? 'Sé el primero en crear un reto grupal y compártelo con la comunidad.'
                                    : 'Prueba con otros términos de búsqueda.'
                                }
                            </p>
                        </div>
                    )}

                    {/* Challenges Grid */}
                    {!loading && filteredChallenges.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChallenges.map((challenge) => (
                                <PublicChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    onJoin={handleJoinChallenge}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Join by Code Modal */}
            {showJoinByCode && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-200/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            Unirse con código
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Código del reto
                                </label>
                                <input
                                    type="text"
                                    value={shareCode}
                                    onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-center font-mono text-lg tracking-wider"
                                    placeholder="Ej: ABC123"
                                    maxLength={6}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowJoinByCode(false);
                                        setShareCode('');
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold transition-all hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleJoinByCode}
                                    disabled={!shareCode.trim()}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
                                >
                                    Unirse
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
