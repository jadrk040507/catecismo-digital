// Badge System for Proyecto Catecismo
// Tracks lesson completion, pillar completion, and depth level achievements

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'lesson' | 'pillar' | 'depth' | 'special';
  requirement: number; // lessons required or level threshold
  color: string;
}

export interface UserProgress {
  completedLessons: string[]; // Array of lesson IDs like "credo-01", "sacramentos-11"
  completedWorkbooks: string[];
  completedGuides: string[];
  lastActive: string; // ISO date
  streakDays: number;
  depthLevelCompletions: {
    semilla: string[]; // lesson IDs completed at this depth
    brotes: string[];
    raiz: string[];
    arbol: string[];
  };
}

// All available badges
export const BADGES: Badge[] = [
  // Lesson completion badges (milestone badges)
  {
    id: 'primer-paso',
    name: 'Primer Paso',
    description: 'Completa tu primera lección',
    icon: '🌱',
    category: 'lesson',
    requirement: 1,
    color: '#2e7d32'
  },
  {
    id: 'catecumeno',
    name: 'Catecúmeno',
    description: 'Completa 5 lecciones',
    icon: '📖',
    category: 'lesson',
    requirement: 5,
    color: '#1565c0'
  },
  {
    id: 'estudiante-fiel',
    name: 'Estudiante Fiel',
    description: 'Completa 10 lecciones',
    icon: '✨',
    category: 'lesson',
    requirement: 10,
    color: '#e65100'
  },
  {
    id: 'discipulo-dedicado',
    name: 'Discípulo Dedicado',
    description: 'Completa 20 lecciones',
    icon: '📚',
    category: 'lesson',
    requirement: 20,
    color: '#6a1b9a'
  },
  {
    id: 'maestro-en-formacion',
    name: 'Maestro en Formación',
    description: 'Completa 30 lecciones',
    icon: '🎓',
    category: 'lesson',
    requirement: 30,
    color: '#c9a84c'
  },
  {
    id: 'siervo-de-la-palabra',
    name: 'Siervo de la Palabra',
    description: 'Completa todas las lecciones (37)',
    icon: '👑',
    category: 'lesson',
    requirement: 37,
    color: '#b8860b'
  },

  // Pillar completion badges
  {
    id: 'creo-en-dios',
    name: 'Creo en Dios',
    description: 'Completa todas las lecciones del Credo',
    icon: '✝️',
    category: 'pillar',
    requirement: 10,
    color: '#1565c0'
  },
  {
    id: 'sacramentado',
    name: 'Sacramentado',
    description: 'Completa todas las lecciones de Sacramentos',
    icon: '🕊️',
    category: 'pillar',
    requirement: 10,
    color: '#e65100'
  },
  {
    id: 'vida-nueva',
    name: 'Vida Nueva',
    description: 'Completa todas las lecciones de Moral',
    icon: '🔥',
    category: 'pillar',
    requirement: 12,
    color: '#2e7d32'
  },
  {
    id: 'hombre-de-oracion',
    name: 'Hombre de Oración',
    description: 'Completa todas las lecciones de Oración',
    icon: '🙏',
    category: 'pillar',
    requirement: 5,
    color: '#6a1b9a'
  },

  // Depth level badges
  {
    id: 'semilla-creciente',
    name: 'Semilla Creciente',
    description: 'Completa 5 actividades del nivel Semilla',
    icon: '🌿',
    category: 'depth',
    requirement: 5,
    color: '#2e7d32'
  },
  {
    id: 'brotes-fuertes',
    name: 'Brotes Fuertes',
    description: 'Completa 5 reflexiones del nivel Brotes',
    icon: '🌱',
    category: 'depth',
    requirement: 5,
    color: '#1565c0'
  },
  {
    id: 'raiz-profunda',
    name: 'Raíz Profunda',
    description: 'Completa 5 contextos del nivel Raíz',
    icon: '🪴',
    category: 'depth',
    requirement: 5,
    color: '#e65100'
  },
  {
    id: 'arbol-frondoso',
    name: 'Árbol Frondoso',
    description: 'Completa 5 ampliaciones del nivel Árbol',
    icon: '🌳',
    category: 'depth',
    requirement: 5,
    color: '#6a1b9a'
  },

  // Special badges
  {
    id: 'catequista-preparado',
    name: 'Catequista Preparado',
    description: 'Consulta 5 guías del catequista',
    icon: '📋',
    category: 'special',
    requirement: 5,
    color: '#795548'
  },
  {
    id: 'trabajador-diligente',
    name: 'Trabajador Diligente',
    description: 'Completa 5 workbooks',
    icon: '✍️',
    category: 'special',
    requirement: 5,
    color: '#607d8b'
  },
  {
    id: 'consagrado-total',
    name: 'Consagrado Total',
    description: 'Completa los 4 pilares del catecismo',
    icon: '🏆',
    category: 'special',
    requirement: 4,
    color: '#c9a84c'
  }
];

// Lesson structure mapping
export const LESSON_STRUCTURE = {
  credo: { count: 10, range: [1, 10] },
  sacramentos: { count: 10, range: [11, 20] },
  moral: { count: 12, range: [21, 32] },
  oracion: { count: 5, range: [33, 37] }
};

// Helper to generate lesson ID
export function getLessonId(pillar: string, lessonNum: number): string {
  return `${pillar}-${lessonNum.toString().padStart(2, '0')}`;
}

// Get pillar from lesson number
export function getPillarFromLessonNum(lessonNum: number): string | null {
  if (lessonNum >= 1 && lessonNum <= 10) return 'credo';
  if (lessonNum >= 11 && lessonNum <= 20) return 'sacramentos';
  if (lessonNum >= 21 && lessonNum <= 32) return 'moral';
  if (lessonNum >= 33 && lessonNum <= 37) return 'oracion';
  return null;
}

// Check which badges are earned based on progress
export function getEarnedBadges(progress: UserProgress): Badge[] {
  const earned: Badge[] = [];
  const totalCompleted = progress.completedLessons.length;

  for (const badge of BADGES) {
    let isEarned = false;

    switch (badge.category) {
      case 'lesson':
        isEarned = totalCompleted >= badge.requirement;
        break;
      case 'pillar':
        // Check pillar-specific completion
        if (badge.id === 'creo-en-dios') {
          const credoLessons = progress.completedLessons.filter(l => l.startsWith('credo-'));
          isEarned = credoLessons.length >= 10;
        } else if (badge.id === 'sacramentado') {
          const sacLessons = progress.completedLessons.filter(l => l.startsWith('sacramentos-'));
          isEarned = sacLessons.length >= 10;
        } else if (badge.id === 'vida-nueva') {
          const moralLessons = progress.completedLessons.filter(l => l.startsWith('moral-'));
          isEarned = moralLessons.length >= 12;
        } else if (badge.id === 'hombre-de-oracion') {
          const oracionLessons = progress.completedLessons.filter(l => l.startsWith('oracion-'));
          isEarned = oracionLessons.length >= 5;
        }
        break;
      case 'depth':
        if (badge.id === 'semilla-creciente') {
          isEarned = progress.depthLevelCompletions.semilla.length >= badge.requirement;
        } else if (badge.id === 'brotes-fuertes') {
          isEarned = progress.depthLevelCompletions.brotes.length >= badge.requirement;
        } else if (badge.id === 'raiz-profunda') {
          isEarned = progress.depthLevelCompletions.raiz.length >= badge.requirement;
        } else if (badge.id === 'arbol-frondoso') {
          isEarned = progress.depthLevelCompletions.arbol.length >= badge.requirement;
        }
        break;
      case 'special':
        if (badge.id === 'catequista-preparado') {
          isEarned = progress.completedGuides.length >= badge.requirement;
        } else if (badge.id === 'trabajador-diligente') {
          isEarned = progress.completedWorkbooks.length >= badge.requirement;
        } else if (badge.id === 'consagrado-total') {
          const credoDone = progress.completedLessons.filter(l => l.startsWith('credo-')).length >= 10;
          const sacDone = progress.completedLessons.filter(l => l.startsWith('sacramentos-')).length >= 10;
          const moralDone = progress.completedLessons.filter(l => l.startsWith('moral-')).length >= 12;
          const oracionDone = progress.completedLessons.filter(l => l.startsWith('oracion-')).length >= 5;
          isEarned = credoDone && sacDone && moralDone && oracionDone;
        }
        break;
    }

    if (isEarned) {
      earned.push(badge);
    }
  }

  return earned;
}

// Check if a specific badge is earned
export function isBadgeEarned(badgeId: string, progress: UserProgress): boolean {
  const earned = getEarnedBadges(progress);
  return earned.some(b => b.id === badgeId);
}

// Get progress percentage
export function getProgressPercentage(progress: UserProgress): number {
  const totalLessons = 37;
  return Math.round((progress.completedLessons.length / totalLessons) * 100);
}

// Get next badge to earn
export function getNextBadge(progress: UserProgress): Badge | null {
  const earnedIds = new Set(getEarnedBadges(progress).map(b => b.id));
  
  // Find first unearned badge
  for (const badge of BADGES) {
    if (!earnedIds.has(badge.id)) {
      return badge;
    }
  }
  
  return null;
}

// Default empty progress
export function createEmptyProgress(): UserProgress {
  return {
    completedLessons: [],
    completedWorkbooks: [],
    completedGuides: [],
    lastActive: new Date().toISOString(),
    streakDays: 0,
    depthLevelCompletions: {
      semilla: [],
      brotes: [],
      raiz: [],
      arbol: []
    }
  };
}
