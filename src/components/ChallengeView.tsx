import { useEffect, useState } from 'react';
import { Share2, ArrowLeft, Trophy, TrendingUp, Users, Check, Copy, MessageCircle, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProgress } from '../hooks/useProgress';

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

interface ChallengeViewProps {
  challenge: Challenge;
  onBack: () => void;
  onUpdateProgress: (challengeId: string, progress: boolean[]) => void;
}

export default function ChallengeView({ challenge, onBack, onUpdateProgress }: ChallengeViewProps) {
  const { progress, completedDays, completionPercentage, updateProgress } = useProgress(challenge.id);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  const currentDay = progress.length + 1;
  const isCompleted = completedDays === challenge.duration;

  // Notify parent component when progress changes
  useEffect(() => {
    onUpdateProgress(challenge.id, progress);
  }, [challenge.id, progress, onUpdateProgress]);

  // Show celebration modal when challenge is completed
  useEffect(() => {
    if (isCompleted && completedDays > 0) {
      setShowCelebrationModal(true);
    }
  }, [isCompleted, completedDays]);

  const handleDayComplete = async (completed: boolean) => {
    if (currentDay <= challenge.duration) {
      await updateProgress(currentDay - 1, completed);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    const link = `tuhabito.app/reto/${challenge.id}`;

    try {
      await navigator.clipboard.writeText(link);
      toast.success('¡Link copiado al portapapeles! 📋', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#ffffff',
          borderRadius: '12px',
          fontWeight: '600',
          padding: '12px 16px',
        },
        icon: '🔗',
      });
      setShowShareModal(false);
    } catch (error) {
      toast.error('Error al copiar el link', {
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

  const shareToWhatsApp = () => {
    const link = `tuhabito.app/reto/${challenge.id}`;
    const message = `¡Únete a mi reto "${challenge.name}"! 🎯 ${challenge.duration} días para crear un nuevo hábito. ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareModal(false);

    toast.success('¡Compartido en WhatsApp! 💬', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#25D366',
        color: '#ffffff',
        borderRadius: '12px',
        fontWeight: '600',
        padding: '12px 16px',
      },
      icon: '📱',
    });
  };

  const shareToTwitter = () => {
    const link = `tuhabito.app/reto/${challenge.id}`;
    const message = `¡Estoy haciendo el reto "${challenge.name}"! 🎯 ${challenge.duration} días para crear un nuevo hábito. ¿Te unes? ${link}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
    setShowShareModal(false);

    toast.success('¡Compartido en Twitter! 🐦', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#1DA1F2',
        color: '#ffffff',
        borderRadius: '12px',
        fontWeight: '600',
        padding: '12px 16px',
      },
      icon: '🐦',
    });
  };

  const shareToFacebook = () => {
    const link = `tuhabito.app/reto/${challenge.id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    window.open(facebookUrl, '_blank');
    setShowShareModal(false);

    toast.success('¡Compartido en Facebook! 👥', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#1877F2',
        color: '#ffffff',
        borderRadius: '12px',
        fontWeight: '600',
        padding: '12px 16px',
      },
      icon: '👥',
    });
  };

  // Celebration modal share functions
  const shareAchievementToWhatsApp = () => {
    const link = `tuhabito.app/reto/${challenge.id}`;
    const message = `¡Acabo de completar mi reto "${challenge.name}"! 🎉 ${challenge.duration} días de constancia con un ${completionPercentage}% de éxito. ¡Únete y crea tu propio hábito! ${link}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('¡Logro compartido en WhatsApp! 💬', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#25D366',
        color: '#ffffff',
        borderRadius: '12px',
        fontWeight: '600',
        padding: '12px 16px',
      },
      icon: '🎉',
    });
  };

  const shareAchievementToTwitter = () => {
    const link = `tuhabito.app/reto/${challenge.id}`;
    const message = `¡Acabo de completar mi reto "${challenge.name}"! 🎉 ${challenge.duration} días de constancia y un ${completionPercentage}% de éxito. ¡Es increíble lo que puedes lograr! ${link} #HabitLink #Retos #Constancia`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');

    toast.success('¡Logro compartido en Twitter! 🐦', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#1DA1F2',
        color: '#ffffff',
        borderRadius: '12px',
        fontWeight: '600',
        padding: '12px 16px',
      },
      icon: '🎉',
    });
  };

  const shareAchievementToFacebook = () => {
    const link = `tuhabito.app/reto/${challenge.id}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
    window.open(facebookUrl, '_blank');

    toast.success('¡Logro compartido en Facebook! 👥', {
      duration: 2000,
      position: 'top-center',
      style: {
        background: '#1877F2',
        color: '#ffffff',
        borderRadius: '12px',
        fontWeight: '600',
        padding: '12px 16px',
      },
      icon: '🎉',
    });
  };

  const copyAchievementLink = async () => {
    const link = `tuhabito.app/reto/${challenge.id}`;

    try {
      await navigator.clipboard.writeText(link);
      toast.success('¡Enlace de tu logro copiado! 📋', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10b981',
          color: '#ffffff',
          borderRadius: '12px',
          fontWeight: '600',
          padding: '12px 16px',
        },
        icon: '🏆',
      });
    } catch (error) {
      toast.error('Error al copiar el enlace', {
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
  }; const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < challenge.duration; i++) {
      let dayClass = 'w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-semibold ';

      if (i < progress.length) {
        // Día ya completado
        if (progress[i]) {
          dayClass += 'bg-green-500 border-green-500 text-white';
        } else {
          dayClass += 'bg-red-500 border-red-500 text-white';
        }
      } else if (i === progress.length) {
        // Día actual
        dayClass += 'border-lime-400 bg-lime-200 text-gray-800';
      } else {
        // Días pendientes
        dayClass += 'border-gray-300 bg-gray-100 text-gray-500';
      }

      days.push(
        <div key={i} className={dayClass}>
          {i + 1}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-green-200/50 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{challenge.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {challenge.name}
              </h1>
              <p className="text-gray-600">
                {challenge.duration} días • {challenge.type}
              </p>
            </div>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 font-semibold"
          >
            <Share2 className="w-5 h-5" />
            Compartir
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {currentDay > challenge.duration ? challenge.duration : currentDay}
          </div>
          <p className="text-gray-600">Día actual</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <Trophy className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {completionPercentage}%
          </div>
          <p className="text-gray-600">Completado</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {challenge.participants}
          </div>
          <p className="text-gray-600">Participantes</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-green-200/50 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Progreso total</h3>
        <div className="bg-gray-200 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {completedDays} de {challenge.duration} días completados
        </p>
      </div>

      {/* Daily Action */}
      {currentDay <= challenge.duration && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-green-200/50 mb-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Día {currentDay}
          </h3>
          <p className="text-gray-600 mb-6">
            ¿Completaste tu hábito hoy?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleDayComplete(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              ¡Sí!
            </button>
            <button
              onClick={() => handleDayComplete(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              No hoy
            </button>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-green-200/50">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Calendario de progreso</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 pb-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600">No completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-gray-600">Pendiente</span>
          </div>
        </div>
      </div>

      {currentDay > challenge.duration && (
        <div className="bg-green-200/80 backdrop-blur-md border border-green-400 rounded-2xl p-8 text-center mt-8">
          <Trophy className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Reto completado!
          </h3>
          <p className="text-gray-600 mb-4">
            Has terminado tu reto de {challenge.duration} días con un {completionPercentage}% de éxito.
          </p>
          <button
            onClick={() => setShowCelebrationModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105"
          >
            ¡Celebrar mi logro! 🎉
          </button>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-green-200/50 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Compartir Reto
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Invita a tus amigos a unirse a "{challenge.name}"
            </p>

            <div className="space-y-3">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <Copy className="w-6 h-6 text-gray-600" />
                <span className="font-semibold text-gray-800">Copiar enlace</span>
              </button>

              <button
                onClick={shareToWhatsApp}
                className="w-full flex items-center gap-3 p-4 bg-green-100 hover:bg-green-200 rounded-xl transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
                <span className="font-semibold text-gray-800">WhatsApp</span>
              </button>

              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 p-4 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors"
              >
                <Hash className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-gray-800">Twitter</span>
              </button>

              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-3 p-4 bg-indigo-100 hover:bg-indigo-200 rounded-xl transition-colors"
              >
                <Users className="w-6 h-6 text-indigo-600" />
                <span className="font-semibold text-gray-800">Facebook</span>
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-6 p-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebrationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-green-200/50 max-w-sm w-full max-h-[90vh] overflow-y-auto">
            {/* Celebration Header */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-3 animate-bounce">🎉</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ¡Enhorabuena!
              </h2>
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                ¡Has completado tu reto!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Has terminado "{challenge.name}" de {challenge.duration} días con un {completionPercentage}% de éxito.
              </p>
              <div className="mt-3 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 font-medium text-sm">
                  ¡Eres increíble! La constancia es la clave del éxito. 💪
                </p>
              </div>
            </div>

            {/* Share Section */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                Comparte este logro con tus amigos
              </h4>

              <div className="space-y-2">
                <button
                  onClick={copyAchievementLink}
                  className="w-full flex items-center gap-2 p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors shadow-sm text-sm"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-800">Copiar enlace de mi logro</span>
                </button>

                <button
                  onClick={shareAchievementToWhatsApp}
                  className="w-full flex items-center gap-2 p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-800">Compartir en WhatsApp</span>
                </button>

                <button
                  onClick={shareAchievementToTwitter}
                  className="w-full flex items-center gap-2 p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                >
                  <Hash className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-800">Compartir en Twitter</span>
                </button>

                <button
                  onClick={shareAchievementToFacebook}
                  className="w-full flex items-center gap-2 p-3 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors text-sm"
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-gray-800">Compartir en Facebook</span>
                </button>
              </div>
            </div>              {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="flex-1 p-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-800 transition-colors text-sm"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowCelebrationModal(false);
                  onBack();
                }}
                className="flex-1 p-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all text-sm"
              >
                Ver mis retos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}