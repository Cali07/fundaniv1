<template>
  <div class="progress-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Your Progress 📊</h1>
        <p class="page-subtitle">Look how amazing you're doing!</p>
      </div>

      <!-- XP Overview -->
      <div class="stats-grid">
        <div class="stat-card card">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <div class="stat-value">{{ progressStore.totalXP }}</div>
            <div class="stat-label">Total XP</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <div class="stat-value">{{ progressStore.level }}</div>
            <div class="stat-label">Level</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <div class="stat-value">{{ progressStore.completedQuests.length }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="stat-icon">🎖️</div>
          <div class="stat-info">
            <div class="stat-value">{{ progressStore.earnedBadges.length }}</div>
            <div class="stat-label">Badges</div>
          </div>
        </div>
      </div>

      <!-- Level Progress -->
      <div class="level-section card">
        <h2>Level Progress</h2>
        <div class="level-info">
          <div class="level-display">
            <div class="current-level">Level {{ progressStore.level }}</div>
            <div class="next-level">Level {{ progressStore.level + 1 }}</div>
          </div>
          <div class="level-progress">
            <div class="progress-bar large">
              <div 
                class="progress-fill" 
                :style="{ width: progressStore.levelProgress + '%' }"
              ></div>
            </div>
            <div class="progress-text">
              {{ progressStore.currentLevelXP }} / {{ progressStore.nextLevelXP }} XP
            </div>
          </div>
        </div>
      </div>

      <!-- Badges Section -->
      <div class="badges-section">
        <h2 class="section-title">Your Badges 🏅</h2>
        <div class="badges-grid">
          <div 
            v-for="badge in progressStore.badges"
            :key="badge.id"
            class="badge-card card"
            :class="{ earned: badge.earned }"
          >
            <div class="badge-icon">{{ badge.icon }}</div>
            <h3>{{ badge.name }}</h3>
            <p>{{ badge.description }}</p>
            <div v-if="badge.earned && badge.earnedAt" class="earned-date">
              Earned {{ formatDate(badge.earnedAt) }}
            </div>
            <div v-else class="not-earned">
              Keep going! 💪
            </div>
          </div>
        </div>
      </div>

      <!-- Quest Progress -->
      <div class="quests-section">
        <h2 class="section-title">Quest Progress 🗺️</h2>
        <div class="quest-list">
          <div 
            v-for="quest in progressStore.quests"
            :key="quest.id"
            class="quest-item card"
            :class="{ completed: quest.completed }"
          >
            <div class="quest-icon">{{ quest.icon }}</div>
            <div class="quest-details">
              <h3>{{ quest.title }}</h3>
              <p>{{ quest.description }}</p>
              <div class="quest-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: quest.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ quest.progress }}%</span>
              </div>
              <div class="quest-meta">
                <span class="category">{{ quest.category }}</span>
                <span class="xp-reward">+{{ quest.xpReward }} XP</span>
              </div>
            </div>
            <div v-if="quest.completed" class="completed-badge">
              <div class="check-icon">✅</div>
              <span>Complete!</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivational Quote -->
      <div class="motivation-section card">
        <div class="motivation-icon">🌟</div>
        <blockquote class="motivation-quote">
          "{{ motivationalQuote }}"
        </blockquote>
        <div class="motivation-author">- Your AI Learning Companion</div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const progressStore = useProgressStore()

const motivationalQuotes = [
  "Every expert was once a beginner. Keep learning!",
  "You're making amazing progress! Keep up the great work!",
  "Learning is a journey, not a destination. Enjoy every step!",
  "Your curiosity is your superpower! Keep exploring!",
  "Small steps every day lead to big changes! You're doing great!",
  "Mistakes are proof that you're trying. Keep going!",
  "You're braver than you believe and stronger than you seem!"
]

const motivationalQuote = ref(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Check for unlocks when component loads
onMounted(() => {
  const avatarStore = useAvatarStore()
  avatarStore.checkUnlocks(progressStore.totalXP)
})
</script>

<style scoped>
.progress-page {
  padding-bottom: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  color: white;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  text-align: left;
}

.stat-icon {
  font-size: 32px;
  min-width: 40px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--neutral-600);
  font-weight: 600;
  margin-top: 4px;
}

.level-section {
  margin-bottom: 32px;
}

.level-section h2 {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
}

.level-info {
  space-y: 16px;
}

.level-display {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 600;
  color: var(--neutral-700);
}

.current-level {
  color: var(--primary);
}

.next-level {
  color: var(--neutral-500);
}

.progress-bar.large {
  height: 12px;
  margin-bottom: 8px;
}

.section-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badges-section {
  margin-bottom: 32px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.badge-card {
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.badge-card.earned {
  background: linear-gradient(135deg, var(--success), #34D399);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.badge-card:not(.earned) {
  opacity: 0.6;
  background: var(--neutral-100);
}

.badge-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.badge-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.badge-card p {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
  line-height: 1.4;
}

.earned-date {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.not-earned {
  font-size: 12px;
  color: var(--neutral-500);
  font-weight: 600;
}

.quests-section {
  margin-bottom: 32px;
}

.quest-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.quest-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  position: relative;
}

.quest-item.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.quest-item .quest-icon {
  font-size: 32px;
  min-width: 40px;
}

.quest-details {
  flex: 1;
}

.quest-details h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.quest-details p {
  font-size: 14px;
  color: var(--neutral-600);
  margin-bottom: 12px;
  line-height: 1.4;
}

.quest-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.quest-progress .progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-500);
  min-width: 35px;
}

.quest-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  font-weight: 600;
}

.category {
  color: var(--neutral-500);
}

.xp-reward {
  color: var(--primary);
}

.completed-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  min-width: 80px;
}

.check-icon {
  font-size: 24px;
}

.completed-badge span {
  font-size: 12px;
  font-weight: 700;
  color: var(--success);
}

.motivation-section {
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: white;
  text-align: center;
  border: none;
}

.motivation-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.motivation-quote {
  font-size: 18px;
  font-style: italic;
  margin-bottom: 12px;
  line-height: 1.6;
}

.motivation-author {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 600;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .badges-grid {
    grid-template-columns: 1fr;
  }
  
  .quest-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .quest-details {
    width: 100%;
  }
  
  .completed-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .level-display {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>