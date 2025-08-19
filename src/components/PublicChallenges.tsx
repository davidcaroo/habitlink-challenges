import { useState, useEffect } from 'react';
import { Search, Users, Calendar, UserPlus, Target, LogOut, User, Code, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChallenges, Challenge } from '../hooks/useChallenges';
import { useAuthContext } from '../contexts/AuthContext';

function PublicChallengeCard({
    challenge,
    onJoin,
    onViewDetails
}: {
    challenge: Challenge;
    onJoin: (challengeId: string) => void;
    onViewDetails: (challenge: Challenge) => void;
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

    // Calculate challenge status
    const startDate = new Date(challenge.createdAt);
    const currentDate = new Date();
    const endDate = new Date(startDate.getTime() + (challenge.duration * 24 * 60 * 60 * 1000));
    const isActive = currentDate >= startDate && currentDate <= endDate;
    const isCompleted = currentDate > endDate;
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)));

    const getStatusColor = () => {
        if (isCompleted) return 'bg-gray-100 text-gray-600';
        if (isActive) return 'bg-green-100 text-green-700';
        return 'bg-blue-100 text-blue-700';
    };

    const getStatusText = () => {
        if (isCompleted) return 'Completado';
        if (isActive) return `${daysRemaining} días restantes`;
        return 'Próximamente';
    };

    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-3xl shrink-0 group-hover:scale-110 transition-transform">
                        {challenge.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 text-lg truncate mb-1">
                            {challenge.name}
                        </h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                            <User className="w-3 h-3" />
                            <span>Creado por Usuario</span>
                        </div>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
                    {getStatusText()}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">{challenge.duration}</div>
                    <div className="text-xs text-gray-600">días</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">{challenge.participants}</div>
                    <div className="text-xs text-gray-600">participantes</div>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-bold text-gray-800">0%</div>
                    <div className="text-xs text-gray-600">progreso</div>
                </div>
            </div>

            {/* Share Code */}
            {challenge.shareCode && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border border-green-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Código:</span>
                        </div>
                        <div className="bg-white px-3 py-1 rounded-md border">
                            <span className="font-mono font-bold text-green-700">{challenge.shareCode}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => onViewDetails(challenge)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Search className="w-4 h-4" />
                    Ver detalles
                </button>
                <button
                    onClick={handleJoin}
                    disabled={isJoining || isCompleted}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    {isJoining ? 'Uniéndose...' : isCompleted ? 'Completado' : 'Unirse'}
                </button>
            </div>
        </div>
    );
}

// Challenge Details Modal
function ChallengeDetailsModal({
    challenge,
    onClose,
    onJoin
}: {
    challenge: Challenge | null;
    onClose: () => void;
    onJoin: (challengeId: string) => void;
}) {
    if (!challenge) return null;

    const startDate = new Date(challenge.createdAt);
    const currentDate = new Date();
    const endDate = new Date(startDate.getTime() + (challenge.duration * 24 * 60 * 60 * 1000));
    const isActive = currentDate >= startDate && currentDate <= endDate;
    const isCompleted = currentDate > endDate;
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)));

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-green-200/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-green-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{challenge.emoji}</span>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{challenge.name}</h2>
                                <p className="text-gray-600">Reto grupal público</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status and Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-800">{challenge.duration}</div>
                            <div className="text-sm text-blue-600">días de duración</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-800">{challenge.participants}</div>
                            <div className="text-sm text-green-600">participantes</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-purple-800">
                                {isCompleted ? '0' : daysRemaining}
                            </div>
                            <div className="text-sm text-purple-600">
                                {isCompleted ? 'días restantes' : 'días restantes'}
                            </div>
                        </div>
                    </div>

                    {/* Share Code */}
                    {challenge.shareCode && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Código de invitación</h3>
                                    <p className="text-sm text-gray-600">Comparte este código para que otros se unan</p>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
                                    <span className="font-mono font-bold text-green-700 text-lg">{challenge.shareCode}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Cronología del reto</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <div className="font-medium text-gray-800">Inicio del reto</div>
                                    <div className="text-sm text-gray-600">{startDate.toLocaleDateString()}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                <div>
                                    <div className="font-medium text-gray-800">Progreso actual</div>
                                    <div className="text-sm text-gray-600">
                                        {isCompleted ? 'Reto completado' : isActive ? 'En progreso' : 'No iniciado'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <div>
                                    <div className="font-medium text-gray-800">Finalización</div>
                                    <div className="text-sm text-gray-600">{endDate.toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Creator Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-2">Información del creador</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">Usuario creador</div>
                                <div className="text-sm text-gray-600">Creado el {startDate.toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-green-200/50">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={() => {
                                onJoin(challenge.id);
                                onClose();
                            }}
                            disabled={isCompleted}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            {isCompleted ? 'Reto completado' : 'Unirse al reto'}
                        </button>
                    </div>
                </div>
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
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

    // Filters
    const [durationFilter, setDurationFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Load public challenges
    useEffect(() => {
        loadPublicChallenges();
    }, []);

    const loadPublicChallenges = async () => {
        try {
            setLoading(true);
            console.log('Loading public challenges...');
            console.log('User:', user);
            console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
            console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');

            const challenges = await getPublicChallenges();
            console.log('Loaded challenges:', challenges);
            setPublicChallenges(challenges);
        } catch (error: any) {
            console.error('Error loading public challenges:', error);
            toast.error(`Error al cargar retos públicos: ${error.message || 'Error desconocido'}`);
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

    // Advanced filtering and sorting
    const getFilteredAndSortedChallenges = () => {
        let filtered = publicChallenges.filter(challenge => {
            // Search filter
            const matchesSearch = challenge.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Duration filter
            const matchesDuration = durationFilter === 'all' ||
                (durationFilter === 'short' && challenge.duration <= 14) ||
                (durationFilter === 'medium' && challenge.duration > 14 && challenge.duration <= 30) ||
                (durationFilter === 'long' && challenge.duration > 30);

            // Status filter
            const currentDate = new Date();
            const startDate = new Date(challenge.createdAt);
            const endDate = new Date(startDate.getTime() + (challenge.duration * 24 * 60 * 60 * 1000));
            const isActive = currentDate >= startDate && currentDate <= endDate;
            const isCompleted = currentDate > endDate;
            const isPending = currentDate < startDate;

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && isActive) ||
                (statusFilter === 'completed' && isCompleted) ||
                (statusFilter === 'pending' && isPending);

            return matchesSearch && matchesDuration && matchesStatus;
        });

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'duration-asc':
                    return a.duration - b.duration;
                case 'duration-desc':
                    return b.duration - a.duration;
                case 'participants':
                    return b.participants - a.participants;
                case 'name':
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return filtered;
    };

    const filteredChallenges = getFilteredAndSortedChallenges();

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
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Retos Públicos</h1>
                            <p className="text-gray-600 mt-1">Únete a retos creados por la comunidad</p>
                        </div>
                        <button
                            onClick={() => setShowJoinByCode(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 shrink-0"
                        >
                            <Code className="w-5 h-5" />
                            Unirse con código
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-green-200/50 mb-8">
                        <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar retos por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Filters */}
                            <div className="grid md:grid-cols-4 gap-4">
                                {/* Duration Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duración
                                    </label>
                                    <select
                                        value={durationFilter}
                                        onChange={(e) => setDurationFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-sm"
                                    >
                                        <option value="all">Todas</option>
                                        <option value="short">Corta (≤14 días)</option>
                                        <option value="medium">Media (15-30 días)</option>
                                        <option value="long">Larga ({'>'}30 días)</option>
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-sm"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="active">Activos</option>
                                        <option value="pending">Por iniciar</option>
                                        <option value="completed">Completados</option>
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ordenar por
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-sm"
                                    >
                                        <option value="newest">Más recientes</option>
                                        <option value="oldest">Más antiguos</option>
                                        <option value="participants">Más participantes</option>
                                        <option value="duration-asc">Duración (menor)</option>
                                        <option value="duration-desc">Duración (mayor)</option>
                                        <option value="name">Nombre A-Z</option>
                                    </select>
                                </div>

                                {/* Results count */}
                                <div className="flex items-end">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">{filteredChallenges.length}</span> retos encontrados
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                            <p className="text-gray-600 mt-4">Cargando retos públicos...</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredChallenges.length === 0 && (
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 shadow-lg border border-green-200/50 text-center">
                            <div className="text-6xl mb-4">🌍</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {publicChallenges.length === 0 ? 'No hay retos públicos disponibles' : 'No se encontraron retos'}
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                {publicChallenges.length === 0
                                    ? 'Sé el primero en crear un reto grupal y compártelo con la comunidad.'
                                    : 'Prueba con otros filtros o términos de búsqueda.'
                                }
                            </p>
                            {publicChallenges.length === 0 && (
                                <button
                                    onClick={() => setShowJoinByCode(true)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                                >
                                    Unirse con código
                                </button>
                            )}
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
                                    onViewDetails={setSelectedChallenge}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Challenge Details Modal */}
            <ChallengeDetailsModal
                challenge={selectedChallenge}
                onClose={() => setSelectedChallenge(null)}
                onJoin={handleJoinChallenge}
            />

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
                                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all"
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
