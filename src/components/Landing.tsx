import React from 'react';
import { Target, Users, Calendar, Trophy, TrendingUp, Clock, LogIn } from 'lucide-react';
import { mockChallenges } from '../data/mockChallenges';
import AnimatedBackground from './AnimatedBackground';

interface LandingProps {
  onCreateChallenge: () => void;
  onViewChallenge: (challengeId: string) => void;
  onLogin: () => void;
}

export default function Landing({ onCreateChallenge, onViewChallenge, onLogin }: LandingProps) {
  const features = [
    {
      icon: TrendingUp,
      title: 'Sin fricción',
      description: 'Crea retos en segundos, sin registros ni complicaciones'
    },
    {
      icon: Calendar,
      title: 'Compartible',
      description: 'Genera links únicos para invitar a amigos y familiares'
    },
    {
      icon: Users,
      title: 'Individual o grupal',
      description: 'Retos personales o desafíos con tu comunidad'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header with Login Button */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            <button
              onClick={onLogin}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-md hover:bg-white/90 text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 border border-green-200/50"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-12 h-12 text-green-600" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800">
              HabitLink
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea y comparte retos de hábitos. Construye rutinas positivas solo o en comunidad.
          </p>
          <button 
            onClick={onCreateChallenge}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl transition-all transform hover:scale-105 text-lg"
          >
            Crear mi primer reto
          </button>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-md border border-green-200/50 rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <IconComponent className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Popular Challenges Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Retos populares
          </h2>
          <p className="text-gray-600">
            Únete a estos desafíos o crea el tuyo propio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockChallenges.map((challenge) => (
            <div 
              key={challenge.id}
              onClick={() => onViewChallenge(challenge.id)}
              className="bg-white/80 backdrop-blur-md border border-green-200/50 rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{challenge.emoji}</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {challenge.name}
                </h3>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{challenge.duration} días</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{challenge.participants}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(challenge.progress.filter(Boolean).length / challenge.duration) * 100}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                {Math.round((challenge.progress.filter(Boolean).length / challenge.duration) * 100)}% completado
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}