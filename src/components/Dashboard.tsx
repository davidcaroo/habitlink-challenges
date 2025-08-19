import { useState, useEffect, useCallback } from 'react';
import { Target, Trophy, Calendar, TrendingUp, Plus, LogOut, User, Users } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

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

interface DashboardProps {
  user: User;
  challenges: Challenge[];
  onCreateChallenge: () => void;
  onViewChallenge: (challengeId: string) => void;
  onViewJoinedChallenges: () => void;
  onLogout: () => void;
}

// Component to calculate progress for a single challenge
function ChallengeStats({ challenge, onStatsUpdate }: {
  challenge: Challenge;
  onStatsUpdate: (id: string, stats: { completed: boolean; active: boolean }) => void;
}) {
  const { completedDays } = useProgress(challenge.id);

  useEffect(() => {
    const isCompleted = completedDays === challenge.duration;
    const isActive = completedDays > 0 && completedDays < challenge.duration;
    onStatsUpdate(challenge.id, { completed: isCompleted, active: isActive });
  }, [challenge.id, challenge.duration, completedDays, onStatsUpdate]);
  [challenge.id, challenge.duration, completedDays, onStatsUpdate];

  return null;
}

// Component to display a challenge card with real progress
function ChallengeCard({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
  const { completedDays, completionPercentage } = useProgress(challenge.id);
  const isCompleted = completedDays === challenge.duration;

  return (
    <div
      onClick={onClick}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{challenge.emoji}</div>
        <h4 className="font-semibold text-gray-800 mb-2">
          {challenge.name}
        </h4>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <span>{challenge.duration} días</span>
          <span>•</span>
          <span className="capitalize">{challenge.type}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{completedDays}/{challenge.duration} días</span>
          <span>{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
              : 'bg-gradient-to-r from-lime-400 to-green-500'
              }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {isCompleted && (
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">¡Reto completado!</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ user, challenges, onCreateChallenge, onViewChallenge, onViewJoinedChallenges, onLogout }: DashboardProps) {
  const [challengeStats, setChallengeStats] = useState<Record<string, { completed: boolean; active: boolean }>>({});

  const handleStatsUpdate = useCallback((id: string, stats: { completed: boolean; active: boolean }) => {
    setChallengeStats(prev => ({ ...prev, [id]: stats }));
  }, []);

  const userChallenges = challenges.slice(0, 6);
  const totalChallenges = challenges.length;
  const completedChallenges = Object.values(challengeStats).filter(s => s.completed).length;
  const activeChallenges = Object.values(challengeStats).filter(s => s.active).length;

  return (
    <div className="h-full flex flex-col">
      {/* Hidden components to calculate stats */}
      {challenges.map(challenge => (
        <ChallengeStats
          key={challenge.id}
          challenge={challenge}
          onStatsUpdate={handleStatsUpdate}
        />
      ))}

      {/* Header */}
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
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
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
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Hola, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-600">
              Aquí tienes un resumen de tus retos y progreso
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalChallenges}</p>
                  <p className="text-gray-600">Retos totales</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{completedChallenges}</p>
                  <p className="text-gray-600">Completados</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{activeChallenges}</p>
                  <p className="text-gray-600">En progreso</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onCreateChallenge}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Crear nuevo reto
              </button>

              <button
                onClick={onViewJoinedChallenges}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <Users className="w-5 h-5" />
                Mis retos unidos
              </button>
            </div>
          </div>

          {/* My Challenges */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Mis retos</h3>
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>

            {userChallenges.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-xl border border-green-200/50 text-center">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  No tienes retos aún
                </h4>
                <p className="text-gray-600 mb-6">
                  Crea tu primer reto y comienza a construir hábitos positivos
                </p>
                <button
                  onClick={onCreateChallenge}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105"
                >
                  Crear mi primer reto
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => onViewChallenge(challenge.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}