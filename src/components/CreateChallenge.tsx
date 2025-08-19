import React, { useState } from 'react';
import { Target, Users, User, LogOut } from 'lucide-react';
import { availableEmojis } from '../data/mockChallenges';

interface CreateChallengeProps {
  onCreate: (challenge: {
    name: string;
    duration: number;
    type: 'individual' | 'grupal';
    emoji: string;
  }) => void;
  onBack?: () => void;
  user?: {
    email?: string;
  };
}

export default function CreateChallenge({ onCreate, onBack, user }: CreateChallengeProps) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(21);
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [type, setType] = useState<'individual' | 'grupal'>('individual');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate({
        name: name.trim(),
        duration,
        type,
        emoji: selectedEmoji
      });
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
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Crear Nuevo Reto
            </h1>
            <p className="text-gray-600 text-lg">
              Define tu desafío personal o grupal y comienza a construir nuevos hábitos
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-green-200/50 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Nombre del reto */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Nombre del reto *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej: Leer 30 minutos diarios"
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all bg-white/80 text-gray-800"
                      required
                    />
                  </div>

                  {/* Duración */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Duración del reto
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all bg-white/80 text-gray-800"
                    >
                      <option value={7}>7 días - Una semana</option>
                      <option value={14}>14 días - Dos semanas</option>
                      <option value={21}>21 días - Formar un hábito</option>
                      <option value={30}>30 días - Un mes completo</option>
                      <option value={60}>60 días - Reto extendido</option>
                      <option value={90}>90 días - Transformación</option>
                    </select>
                  </div>

                  {/* Tipo de reto */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tipo de reto
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setType('individual')}
                        className={`p-4 border-2 rounded-xl transition-all text-left ${type === 'individual'
                          ? 'border-green-400 bg-green-50 shadow-md'
                          : 'border-green-200 hover:border-green-300 hover:bg-green-50/50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Target className="w-6 h-6 text-green-600" />
                          <div>
                            <h3 className="font-semibold text-gray-800">Individual</h3>
                            <p className="text-sm text-gray-600">Reto personal, solo para ti</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setType('grupal')}
                        className={`p-4 border-2 rounded-xl transition-all text-left ${type === 'grupal'
                          ? 'border-green-400 bg-green-50 shadow-md'
                          : 'border-green-200 hover:border-green-300 hover:bg-green-50/50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <Users className="w-6 h-6 text-green-600" />
                          <div>
                            <h3 className="font-semibold text-gray-800">Grupal</h3>
                            <p className="text-sm text-gray-600">Invita a otros y comparte el progreso</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Emoji selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Elige un emoji representativo
                    </label>
                    <div className="bg-gray-50/80 rounded-xl p-4 border border-green-200/50">
                      <div className="grid grid-cols-5 gap-2">
                        {availableEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`text-2xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${selectedEmoji === emoji
                              ? 'border-green-400 bg-green-100 shadow-md'
                              : 'border-transparent hover:border-green-300 hover:bg-white'
                              }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Vista previa de tu reto
                    </label>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{selectedEmoji}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {name || 'Nombre del reto'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {duration} días • {type === 'individual' ? 'Individual' : 'Grupal'}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-0"></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600">0/{duration} días</span>
                        <span className="text-xs text-gray-600">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-6 border-t border-green-200/50">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg"
                >
                  {name.trim() ? `Crear reto: ${name}` : 'Crear reto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}