// Progress Tracker for Proyecto Catecismo
// Manages localStorage persistence and badge notifications

const STORAGE_KEY = 'catecismo-progress-v1';

// Default empty progress structure
function createEmptyProgress() {
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

// Load progress from localStorage
function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle schema updates
      return { ...createEmptyProgress(), ...parsed };
    }
  } catch (e) {
    console.error('Error loading progress:', e);
  }
  return createEmptyProgress();
}

// Save progress to localStorage
function saveProgress(progress) {
  try {
    progress.lastActive = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

// Check if a lesson is completed
function isLessonCompleted(lessonId) {
  const progress = loadProgress();
  return progress.completedLessons.includes(lessonId);
}

// Mark a lesson as completed
function markLessonComplete(lessonId, depthLevel = null) {
  const progress = loadProgress();
  const previouslyCompleted = [...progress.completedLessons];
  
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  
  // Track depth level completion if specified
  if (depthLevel && progress.depthLevelCompletions[depthLevel]) {
    if (!progress.depthLevelCompletions[depthLevel].includes(lessonId)) {
      progress.depthLevelCompletions[depthLevel].push(lessonId);
    }
  }
  
  saveProgress(progress);
  
  // Check for newly earned badges
  const newBadges = checkNewBadges(previouslyCompleted, progress);
  if (newBadges.length > 0) {
    showBadgeNotifications(newBadges);
  }
  
  return newBadges;
}

// Mark a workbook as completed
function markWorkbookComplete(lessonId) {
  const progress = loadProgress();
  if (!progress.completedWorkbooks.includes(lessonId)) {
    progress.completedWorkbooks.push(lessonId);
    saveProgress(progress);
  }
}

// Mark a guide as viewed
function markGuideViewed(lessonId) {
  const progress = loadProgress();
  if (!progress.completedGuides.includes(lessonId)) {
    progress.completedGuides.push(lessonId);
    saveProgress(progress);
  }
}

// Get progress statistics
function getProgressStats() {
  const progress = loadProgress();
  const totalLessons = 37;
  
  // Count by pillar
  const credoCount = progress.completedLessons.filter(l => l.startsWith('credo-')).length;
  const sacramentosCount = progress.completedLessons.filter(l => l.startsWith('sacramentos-')).length;
  const moralCount = progress.completedLessons.filter(l => l.startsWith('moral-')).length;
  const oracionCount = progress.completedLessons.filter(l => l.startsWith('oracion-')).length;
  
  return {
    totalCompleted: progress.completedLessons.length,
    totalLessons: totalLessons,
    percentage: Math.round((progress.completedLessons.length / totalLessons) * 100),
    byPillar: {
      credo: credoCount,
      sacramentos: sacramentosCount,
      moral: moralCount,
      oracion: oracionCount
    },
    workbooksCompleted: progress.completedWorkbooks.length,
    guidesViewed: progress.completedGuides.length,
    streakDays: progress.streakDays,
    depthLevels: {
      semilla: progress.depthLevelCompletions.semilla.length,
      brotes: progress.depthLevelCompletions.brotes.length,
      raiz: progress.depthLevelCompletions.raiz.length,
      arbol: progress.depthLevelCompletions.arbol.length
    }
  };
}

// Check for newly earned badges
function checkNewBadges(previouslyCompleted, currentProgress) {
  const newBadges = [];
  const prevCount = previouslyCompleted.length;
  const currentCount = currentProgress.completedLessons.length;
  
  // Lesson milestone badges
  const milestones = [
    { id: 'primer-paso', count: 1, name: 'Primer Paso', icon: '🌱' },
    { id: 'catecumeno', count: 5, name: 'Catecúmeno', icon: '📖' },
    { id: 'estudiante-fiel', count: 10, name: 'Estudiante Fiel', icon: '✨' },
    { id: 'discipulo-dedicado', count: 20, name: 'Discípulo Dedicado', icon: '📚' },
    { id: 'maestro-en-formacion', count: 30, name: 'Maestro en Formación', icon: '🎓' },
    { id: 'siervo-de-la-palabra', count: 37, name: 'Siervo de la Palabra', icon: '👑' }
  ];
  
  for (const milestone of milestones) {
    if (prevCount < milestone.count && currentCount >= milestone.count) {
      newBadges.push(milestone);
    }
  }
  
  // Pillar completion badges
  const pillars = [
    { id: 'creo-en-dios', prefix: 'credo-', required: 10, name: 'Creo en Dios', icon: '✝️' },
    { id: 'sacramentado', prefix: 'sacramentos-', required: 10, name: 'Sacramentado', icon: '🕊️' },
    { id: 'vida-nueva', prefix: 'moral-', required: 12, name: 'Vida Nueva', icon: '🔥' },
    { id: 'hombre-de-oracion', prefix: 'oracion-', required: 5, name: 'Hombre de Oración', icon: '🙏' }
  ];
  
  const prevCredo = previouslyCompleted.filter(l => l.startsWith('credo-')).length;
  const currCredo = currentProgress.completedLessons.filter(l => l.startsWith('credo-')).length;
  if (prevCredo < 10 && currCredo >= 10) {
    newBadges.push({ id: 'creo-en-dios', name: 'Creo en Dios', icon: '✝️' });
  }
  
  const prevSac = previouslyCompleted.filter(l => l.startsWith('sacramentos-')).length;
  const currSac = currentProgress.completedLessons.filter(l => l.startsWith('sacramentos-')).length;
  if (prevSac < 10 && currSac >= 10) {
    newBadges.push({ id: 'sacramentado', name: 'Sacramentado', icon: '🕊️' });
  }
  
  const prevMoral = previouslyCompleted.filter(l => l.startsWith('moral-')).length;
  const currMoral = currentProgress.completedLessons.filter(l => l.startsWith('moral-')).length;
  if (prevMoral < 12 && currMoral >= 12) {
    newBadges.push({ id: 'vida-nueva', name: 'Vida Nueva', icon: '🔥' });
  }
  
  const prevOracion = previouslyCompleted.filter(l => l.startsWith('oracion-')).length;
  const currOracion = currentProgress.completedLessons.filter(l => l.startsWith('oracion-')).length;
  if (prevOracion < 5 && currOracion >= 5) {
    newBadges.push({ id: 'hombre-de-oracion', name: 'Hombre de Oración', icon: '🙏' });
  }
  
  // Consagrado Total (all pillars)
  const prevAllPillars = prevCredo >= 10 && prevSac >= 10 && prevMoral >= 12 && prevOracion >= 5;
  const currAllPillars = currCredo >= 10 && currSac >= 10 && currMoral >= 12 && currOracion >= 5;
  if (!prevAllPillars && currAllPillars) {
    newBadges.push({ id: 'consagrado-total', name: 'Consagrado Total', icon: '🏆' });
  }
  
  return newBadges;
}

// Show badge notification
function showBadgeNotifications(badges) {
  // Create notification container if it doesn't exist
  let container = document.getElementById('badge-notifications');
  if (!container) {
    container = document.createElement('div');
    container.id = 'badge-notifications';
    container.style.cssText = `
      position: fixed;
      top: 80px;
      right: 16px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 320px;
    `;
    document.body.appendChild(container);
  }
  
  for (const badge of badges) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.style.cssText = `
      background: linear-gradient(135deg, #b8860b 0%, #d4a84c 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(184, 134, 11, 0.3);
      animation: badgeSlideIn 0.5s ease-out;
      font-family: 'Inter', sans-serif;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 2rem;">${badge.icon}</div>
        <div>
          <div style="font-weight: 600; font-size: 0.9rem; opacity: 0.9;">¡Nueva insignia!</div>
          <div style="font-weight: 700; font-size: 1.1rem;">${badge.name}</div>
        </div>
      </div>
    `;
    
    container.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
      notification.style.animation = 'badgeFadeOut 0.5s ease-out';
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  }
}

// Add animation styles
function addBadgeStyles() {
  if (document.getElementById('badge-animation-styles')) return;
  
  const styles = document.createElement('style');
  styles.id = 'badge-animation-styles';
  styles.textContent = `
    @keyframes badgeSlideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes badgeFadeOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styles);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  addBadgeStyles();
});

// Export for use in other scripts
window.CatecismoProgress = {
  loadProgress,
  saveProgress,
  isLessonCompleted,
  markLessonComplete,
  markWorkbookComplete,
  markGuideViewed,
  getProgressStats,
  createEmptyProgress
};
