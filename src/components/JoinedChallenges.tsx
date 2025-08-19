import { useState, useEffect } from 'react';
import { Users, Calendar } from 'lucide-react';
import { useChallenges } from '../hooks/useChallenges';
import { useAuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface JoinedChallenge {
    id: string;
    name: string;
    duration: number;
    type: 'individual' | 'grupal';
    emoji: string;
    participants: number;
    createdAt: string;
    progress: boolean[];
    isPublic?: boolean;
    shareCode?: string;
    createdBy?: string;
    participantIds?: string[];
    joinedAt?: string;
}

interface ProgressData {
    userProgress: any[];
    allProgress: any[];
}

function JoinedChallengeCard({
    challenge,
    progressData,
    onMarkProgress
}: {
    challenge: JoinedChallenge;
    progressData: ProgressData;
    onMarkProgress: (challengeId: string, dayNumber: number, completed: boolean) => void;
}) {
    const startDate = new Date(challenge.createdAt);
    const currentDate = new Date();
    const endDate = new Date(startDate.getTime() + (challenge.duration * 24 * 60 * 60 * 1000));
    const isActive = currentDate >= startDate && currentDate <= endDate;
    const isCompleted = currentDate > endDate;

    // Calculate user progress
    const userCompletedDays = progressData.userProgress.filter(p => p.completed).length;
    const userProgressPercentage = Math.round((userCompletedDays / challenge.duration) * 100);

    // Calculate average progress of all participants
    const allParticipants = [...new Set(progressData.allProgress.map(p => p.user_id))];
    const avgCompletedDays = allParticipants.length > 0
        ? progressData.allProgress.filter(p => p.completed).length / allParticipants.length
        : 0;
    const avgProgressPercentage = Math.round((avgCompletedDays / challenge.duration) * 100);

    const renderProgressDays = () => {
        const days = [];
        const today = new Date();

        // Fechas importantes
        const challengeStartDate = new Date(challenge.createdAt);
        const userJoinedDate = challenge.joinedAt ? new Date(challenge.joinedAt) : challengeStartDate;

        // Calcular en qué día del reto nos encontramos hoy
        const daysSinceChallengeStart = Math.floor((today.getTime() - challengeStartDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

        // Calcular desde qué día del reto el usuario puede participar
        const dayUserStartedParticipating = Math.floor((userJoinedDate.getTime() - challengeStartDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

        for (let day = 1; day <= challenge.duration; day++) {
            const userDayProgress = progressData.userProgress.find(p => p.day_number === day);
            const isCompleted = userDayProgress?.completed || false;

            // Un día está disponible si:
            // 1. El usuario ya se había unido cuando llegó ese día (day >= dayUserStartedParticipating)
            // 2. Ese día ya ha llegado o es hoy (day <= daysSinceChallengeStart)
            // 3. El reto aún está activo o ese día específico ya pasó
            const isAvailable = day >= dayUserStartedParticipating && day <= daysSinceChallengeStart && daysSinceChallengeStart > 0;

            // Estados para mostrar información clara
            const isPastUserDay = day < dayUserStartedParticipating;
            const isFutureDay = day > daysSinceChallengeStart;

            days.push(
                <button
                    key={day}
                    onClick={() => {
                        if (isAvailable) {
                            onMarkProgress(challenge.id, day, !isCompleted);
                        }
                    }}
                    disabled={!isAvailable}
                    title={
                        isCompleted ? `Día ${day} completado` :
                            isPastUserDay ? `Día ${day} - No participabas aún` :
                                isFutureDay ? `Día ${day} - Disponible el ${new Date(challengeStartDate.getTime() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString()}` :
                                    isAvailable ? `Marcar día ${day}` :
                                        `Día ${day} no disponible`
                    }
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${isCompleted
                        ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                        : isAvailable
                            ? 'bg-blue-100 text-blue-600 border-2 border-blue-300 hover:bg-blue-200 cursor-pointer'
                            : isPastUserDay
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                                : 'bg-yellow-100 text-yellow-600 cursor-not-allowed opacity-60'
                        }`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-green-200/50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{challenge.emoji}</span>
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{challenge.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{challenge.duration} días</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{allParticipants.length} participantes</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-gray-100 text-gray-600' :
                    isActive ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                    {isCompleted ? 'Completado' : isActive ? 'En progreso' : 'Próximamente'}
                </div>
            </div>

            {/* Progress Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-800">{userProgressPercentage}%</div>
                    <div className="text-sm text-green-600">Tu progreso</div>
                    <div className="text-xs text-green-500">{userCompletedDays}/{challenge.duration} días</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-800">{avgProgressPercentage}%</div>
                    <div className="text-sm text-blue-600">Promedio grupal</div>
                    <div className="text-xs text-blue-500">{Math.round(avgCompletedDays)}/{challenge.duration} días</div>
                </div>
            </div>

            {/* Progress Visual */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso diario</span>
                    <span className="text-xs text-gray-500">
                        {userCompletedDays} de {challenge.duration} completados
                    </span>
                </div>
                <div className="grid grid-cols-7 gap-1 max-w-md">
                    {renderProgressDays()}
                </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Tu progreso</span>
                        <span className="font-medium text-green-600">{userProgressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${userProgressPercentage}%` }}
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Promedio del grupo</span>
                        <span className="font-medium text-blue-600">{avgProgressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${avgProgressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function JoinedChallenges() {
    const { getJoinedChallenges, getChallengeProgress, markChallengeProgress } = useChallenges();
    const [joinedChallenges, setJoinedChallenges] = useState<JoinedChallenge[]>([]);
    const [progressData, setProgressData] = useState<Record<string, ProgressData>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadJoinedChallenges();
    }, []);

    const loadJoinedChallenges = async () => {
        try {
            setLoading(true);
            console.log('Loading joined challenges...');
            const challenges = await getJoinedChallenges();
            console.log('Joined challenges loaded:', challenges);
            setJoinedChallenges(challenges);

            // Load progress for each challenge
            const progressPromises = challenges.map(async (challenge) => {
                try {
                    console.log(`Loading progress for challenge ${challenge.id}...`);
                    const progress = await getChallengeProgress(challenge.id);
                    console.log(`Progress loaded for challenge ${challenge.id}:`, progress);
                    return { challengeId: challenge.id, progress };
                } catch (progressError: any) {
                    console.error(`Error loading progress for challenge ${challenge.id}:`, progressError);
                    // Return empty progress instead of throwing
                    return { challengeId: challenge.id, progress: { userProgress: [], allProgress: [] } };
                }
            });

            const progressResults = await Promise.all(progressPromises);
            const progressMap: Record<string, ProgressData> = {};
            progressResults.forEach(({ challengeId, progress }) => {
                progressMap[challengeId] = progress;
            });

            setProgressData(progressMap);
            console.log('All data loaded successfully');
        } catch (error: any) {
            console.error('Error loading joined challenges:', error);
            toast.error('Error al cargar tus retos unidos');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkProgress = async (challengeId: string, dayNumber: number, completed: boolean) => {
        try {
            await markChallengeProgress(challengeId, dayNumber, completed);
            toast.success(completed ? '¡Día completado!' : 'Progreso actualizado');

            // Reload progress for this specific challenge
            const updatedProgress = await getChallengeProgress(challengeId);
            setProgressData(prev => ({
                ...prev,
                [challengeId]: updatedProgress
            }));
        } catch (error: any) {
            console.error('Error marking progress:', error);
            toast.error('Error al actualizar progreso');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Retos Unidos</h1>
                <p className="text-gray-600">Retos públicos a los que te has unido y tu progreso compartido</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Cargando tus retos unidos...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && joinedChallenges.length === 0 && (
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-12 shadow-lg border border-green-200/50 text-center">
                    <div className="text-6xl mb-4">🤝</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No te has unido a ningún reto público
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Explora los retos públicos y únete a la comunidad para compartir tu progreso con otros.
                    </p>
                </div>
            )}

            {/* Joined Challenges Grid */}
            {!loading && joinedChallenges.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                    {joinedChallenges.map((challenge) => (
                        <JoinedChallengeCard
                            key={challenge.id}
                            challenge={challenge}
                            progressData={progressData[challenge.id] || { userProgress: [], allProgress: [] }}
                            onMarkProgress={handleMarkProgress}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
