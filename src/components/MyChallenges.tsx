import { useState, useEffect } from 'react';
import { Filter, Search, Plus, Grid, List, Edit, Trash2, Target, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useChallenges } from '../hooks/useChallenges';
import { useProgress } from '../hooks/useProgress';
import { useAuthContext } from '../contexts/AuthContext';

interface Challenge {
    id: string;
    name: string;
    duration: number;
    type: 'individual' | 'grupal';
    emoji: string;
    participants: number;
    progress: boolean[];
    createdAt: string;
}

interface MyChallengesProps {
    onCreateChallenge: () => void;
    onViewChallenge: (challengeId: string) => void;
}

type FilterType = 'all' | 'active' | 'completed' | 'not-started';
type ViewType = 'grid' | 'list';

// Component to get real progress stats for filtering
function ChallengeStatsProvider({
    challenge,
    onStatsReady
}: {
    challenge: Challenge;
    onStatsReady: (id: string, stats: { isCompleted: boolean; isActive: boolean; isNotStarted: boolean }) => void;
}) {
    const { completedDays } = useProgress(challenge.id);

    useEffect(() => {
        const isCompleted = completedDays === challenge.duration;
        const isActive = completedDays > 0 && completedDays < challenge.duration;
        const isNotStarted = completedDays === 0;

        onStatsReady(challenge.id, { isCompleted, isActive, isNotStarted });
    }, [challenge.id, challenge.duration, completedDays, onStatsReady]);

    return null;
}

function ChallengeCard({
    challenge,
    onClick,
    onEdit,
    onDelete
}: {
    challenge: Challenge;
    onClick: () => void;
    onEdit: (challenge: Challenge) => void;
    onDelete: (challenge: Challenge) => void;
}) {
    const { completedDays, completionPercentage } = useProgress(challenge.id);
    const isCompleted = completedDays === challenge.duration;
    const isActive = completedDays > 0 && completedDays < challenge.duration;

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir que se abra el reto
        onEdit(challenge);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevenir que se abra el reto
        onDelete(challenge);
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-green-200/50 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 relative group">
            {/* Action buttons - visible on hover */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={handleEdit}
                    className="p-1.5 sm:p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg"
                    title="Editar reto"
                >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg"
                    title="Eliminar reto"
                >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>

            <div onClick={onClick} className="pr-16 sm:pr-20"> {/* Add padding to avoid overlap with buttons */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className="text-2xl sm:text-3xl shrink-0">{challenge.emoji}</div>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{challenge.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                                {challenge.duration} días • {challenge.type}
                            </p>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${isCompleted ? 'bg-green-100 text-green-700' :
                        isActive ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        <span className="hidden sm:inline">
                            {isCompleted ? 'Completado' : isActive ? 'En progreso' : 'No iniciado'}
                        </span>
                        <span className="sm:hidden">
                            {isCompleted ? '✓' : isActive ? '...' : '○'}
                        </span>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                        <span>{completedDays}/{challenge.duration} días</span>
                        <span>{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${isCompleted
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-lime-400 to-green-500'
                                }`}
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MyChallenges({ onCreateChallenge, onViewChallenge }: MyChallengesProps) {
    const { user } = useAuthContext();
    const { challenges, updateChallenge, deleteChallenge } = useChallenges();
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState<ViewType>('grid');
    const [challengeStats, setChallengeStats] = useState<Record<string, { isCompleted: boolean; isActive: boolean; isNotStarted: boolean }>>({});

    // Forzar vista de cuadrícula en móvil
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) { // sm breakpoint
                setViewType('grid');
            }
        };

        // Ejecutar al montar
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        duration: 7,
        type: 'individual' as 'individual' | 'grupal',
        emoji: '🎯'
    });

    const handleStatsReady = (challengeId: string, stats: { isCompleted: boolean; isActive: boolean; isNotStarted: boolean }) => {
        setChallengeStats(prev => ({
            ...prev,
            [challengeId]: stats
        }));
    };

    const handleEdit = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setEditForm({
            name: challenge.name,
            duration: challenge.duration,
            type: challenge.type,
            emoji: challenge.emoji
        });
        setShowEditModal(true);
    };

    const handleDelete = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setShowDeleteModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedChallenge) return;

        try {
            await updateChallenge(selectedChallenge.id, editForm);
            toast.success('¡Reto actualizado exitosamente! 🎉', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '12px 16px',
                },
                icon: '✏️',
            });
            setShowEditModal(false);
            setSelectedChallenge(null);
        } catch (error) {
            toast.error('Error al actualizar el reto', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '12px 16px',
                },
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedChallenge) return;

        try {
            await deleteChallenge(selectedChallenge.id);
            toast.success('Reto eliminado correctamente', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#10b981',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '12px 16px',
                },
                icon: '🗑️',
            });
            setShowDeleteModal(false);
            setSelectedChallenge(null);
        } catch (error) {
            toast.error('Error al eliminar el reto', {
                duration: 3000,
                position: 'top-center',
                style: {
                    background: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '12px',
                    fontWeight: '600',
                    padding: '12px 16px',
                },
            });
        }
    };

    const filteredChallenges = challenges.filter(challenge => {
        // Search filter
        if (searchTerm && !challenge.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Get real stats for this challenge
        const stats = challengeStats[challenge.id];
        if (!stats) return filter === 'all'; // Show all if stats not loaded yet

        // Status filter using real progress data
        if (filter === 'all') return true;
        if (filter === 'completed') return stats.isCompleted;
        if (filter === 'active') return stats.isActive;
        if (filter === 'not-started') return stats.isNotStarted;

        return true;
    });

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
                <div className="max-w-6xl mx-auto p-4 sm:p-6">
                    {/* Stats providers for each challenge - hidden components that calculate real progress */}
                    {challenges.map(challenge => (
                        <ChallengeStatsProvider
                            key={challenge.id}
                            challenge={challenge}
                            onStatsReady={handleStatsReady}
                        />
                    ))}

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mis Retos</h1>
                        <button
                            onClick={onCreateChallenge}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-4 sm:px-6 py-3 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base shrink-0"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Nuevo Reto</span>
                            <span className="sm:hidden">Nuevo</span>
                        </button>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-6 shadow-xl border border-green-200/50 mb-6">
                        <div className="space-y-2 sm:space-y-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-5 sm:h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-7 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-3 text-xs sm:text-base border border-gray-200 rounded-md sm:rounded-xl focus:ring-1 sm:focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Mobile Filter - Full Width */}
                            <div className="sm:hidden">
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value as FilterType)}
                                    className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-green-400 focus:border-transparent outline-none bg-white appearance-none"
                                    style={{ maxWidth: '100%', fontSize: '12px' }}
                                >
                                    <option value="all">Todos</option>
                                    <option value="active">En proceso</option>
                                    <option value="completed">Completados</option>
                                    <option value="not-started">No iniciados</option>
                                </select>
                            </div>

                            {/* Desktop Filter and View Toggle */}
                            <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
                                {/* Filter */}
                                <div className="flex items-center gap-3 flex-1">
                                    <Filter className="w-5 h-5 text-gray-400 shrink-0" />
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value as FilterType)}
                                        className="flex-1 px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                                    >
                                        <option value="all">Todos</option>
                                        <option value="active">En proceso</option>
                                        <option value="completed">Completados</option>
                                        <option value="not-started">No iniciados</option>
                                    </select>
                                </div>

                                {/* View Toggle - Only on Desktop */}
                                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 shrink-0">
                                    <button
                                        onClick={() => setViewType('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewType === 'grid'
                                            ? 'bg-white shadow-sm text-green-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        <Grid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewType('list')}
                                        className={`p-2 rounded-lg transition-all ${viewType === 'list'
                                            ? 'bg-white shadow-sm text-green-600'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Challenges Display */}
                    {filteredChallenges.length === 0 ? (
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-green-200/50 text-center">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {challenges.length === 0 ? 'No tienes retos aún' : 'No se encontraron retos'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {challenges.length === 0
                                    ? 'Crea tu primer reto y comienza a construir hábitos positivos'
                                    : 'Prueba con otros filtros o términos de búsqueda'
                                }
                            </p>
                            {challenges.length === 0 && (
                                <button
                                    onClick={onCreateChallenge}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105"
                                >
                                    Crear mi primer reto
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={`
                            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6
                            ${viewType === 'list' ? 'sm:block sm:space-y-4' : ''}
                        `}>
                            {filteredChallenges.map((challenge) => (
                                <ChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    onClick={() => onViewChallenge(challenge.id)}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && selectedChallenge && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-200/50 max-w-md w-full">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                    Editar Reto
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre del reto
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                                            placeholder="Ej: Leer 30 minutos diarios"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Duración (días)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={editForm.duration}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 7 }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tipo de reto
                                        </label>
                                        <select
                                            value={editForm.type}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as 'individual' | 'grupal' }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                                        >
                                            <option value="individual">Individual</option>
                                            <option value="grupal">Grupal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Emoji
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.emoji}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, emoji: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none text-center text-2xl"
                                            placeholder="🎯"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-800 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && selectedChallenge && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-red-200/50 max-w-md w-full">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">⚠️</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                        ¿Eliminar Reto?
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        ¿Estás seguro de que quieres eliminar el reto "{selectedChallenge.name}"?
                                        Esta acción no se puede deshacer y perderás todo tu progreso.
                                    </p>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteModal(false)}
                                            className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-800 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleConfirmDelete}
                                            className="flex-1 p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}