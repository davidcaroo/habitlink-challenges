export const mockChallenges = [
  {
    id: 'abc123',
    name: 'Leer 15 minutos diarios',
    duration: 21,
    type: 'grupal',
    emoji: '📚',
    participants: 24,
    progress: [true, true, false, true, true, true, true, false, true, true],
    createdAt: new Date().toISOString()
  },
  {
    id: 'def456', 
    name: 'Meditar 10 minutos',
    duration: 14,
    type: 'individual',
    emoji: '🧘‍♀️',
    participants: 1,
    progress: [true, false, true, true, false, true, true],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ghi789',
    name: 'Beber 2L de agua',
    duration: 30,
    type: 'grupal',
    emoji: '💧',
    participants: 12,
    progress: [true, true, true, false, true],
    createdAt: new Date().toISOString()
  },
  {
    id: 'jkl012',
    name: 'Ejercicio matutino',
    duration: 7,
    type: 'individual',
    emoji: '🏃‍♂️',
    participants: 1,
    progress: [true, true, false, true],
    createdAt: new Date().toISOString()
  }
];

export const availableEmojis = ['🎯', '📚', '🧘‍♀️', '💧', '🏃‍♂️', '✍️', '🌱', '💪', '🧠', '❤️'];