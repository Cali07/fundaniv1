<template>
  <div class="home-page">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="user-greeting">
          <h1 class="greeting fade-in">Hi {{ authStore.userDisplayName }}! 👋</h1>
          <div class="xp-display">
            <div class="xp-info">
              <span class="level">Level {{ progressStore.level }}</span>
              <span class="xp">{{ progressStore.totalXP }} XP</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: progressStore.levelProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
        
        <UButton 
          @click="authStore.signOut"
          size="sm"
          variant="ghost"
          icon="i-heroicons-arrow-right-on-rectangle"
        >
          Sign Out
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="progressStore.loading" class="loading-state card">
        <div class="loading-content">
          <div class="loading-spinner">🔄</div>
          <p>Loading your adventure...</p>
        </div>
      </div>

      <template v-else>
        <!-- Current Quest Card -->
        <div v-if="progressStore.currentQuest" class="current-quest card pulse">
          <h2>Continue Your Adventure</h2>
          <div class="quest-info">
            <div class="quest-icon">{{ progressStore.currentQuest.icon }}</div>
            <div class="quest-details">
              <h3>{{ progressStore.currentQuest.title }}</h3>
              <p>{{ progressStore.currentQuest.description }}</p>
              <div class="quest-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: progressStore.currentQuest.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ progressStore.currentQuest.progress }}% Complete</span>
              </div>
            </div>
          </div>
          <UButton 
            @click="continueQuest(progressStore.currentQuest)"
            size="lg"
            class="continue-btn"
          >
            Continue Quest 🚀
          </UButton>
        </div>

        <!-- All Quests Grid -->
        <div class="section">
          <h2 class="section-title">Choose Your Adventure</h2>
          <div class="quest-grid">
            <div 
              v-for="quest in progressStore.quests" 
              :key="quest.id"
              class="quest-card card"
              :class="{ completed: quest.completed }"
              @click="startQuest(quest)"
            >
              <div class="quest-header">
                <div class="quest-icon">{{ quest.icon }}</div>
                <div v-if="quest.completed" class="completed-badge">✅</div>
              </div>
              <h3>{{ quest.title }}</h3>
              <p>{{ quest.description }}</p>
              <div class="quest-meta">
                <span class="difficulty" :class="quest.difficulty">
                  {{ quest.difficulty.toUpperCase() }}
                </span>
                <span class="xp-reward">+{{ quest.xp_reward }} XP</span>
              </div>
              <div v-if="quest.progress > 0" class="quest-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: quest.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section">
          <h2 class="section-title">Quick Actions</h2>
          <div class="quick-actions">
            <NuxtLink to="/flashcard-generator" class="action-card card">
              <div class="action-icon">🎴</div>
              <h3>Create Flashcards</h3>
              <p>Make custom learning cards</p>
            </NuxtLink>
            
            <NuxtLink to="/progress" class="action-card card">
              <div class="action-icon">📊</div>
              <h3>View Progress</h3>
              <p>Check your achievements</p>
            </NuxtLink>
            
            <NuxtLink to="/avatar" class="action-card card">
              <div class="action-icon">👤</div>
              <h3>Customize Avatar</h3>
              <p>Unlock new items</p>
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const progressStore = useProgressStore()
const avatarStore = useAvatarStore()
const flashcardsStore = useFlashcardsStore()

// Protect route
definePageMeta({
  middleware: 'auth'
})

const startQuest = (quest) => {
  navigateTo(`/quest/${quest.id}`)
}

const continueQuest = (quest) => {
  navigateTo(`/quest/${quest.id}`)
}

// Load data when component mounts
onMounted(async () => {
  await Promise.all([
    progressStore.loadUserData(),
    avatarStore.loadAvatarData(),
    flashcardsStore.loadFlashcardSets()
  ])
})

// Watch for XP changes and check avatar unlocks
watch(() => progressStore.totalXP, (newXP) => {
  avatarStore.checkUnlocks(newXP)
})
</script>

<style scoped>
.home-page {
  padding-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 16px;
}

.user-greeting {
  flex: 1;
}

.greeting {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.xp-display {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.xp-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: white;
  font-weight: 600;
}

.level {
  font-size: 14px;
}

.xp {
  font-size: 14px;
}

.loading-state {
  margin-bottom: 32px;
  text-align: center;
  padding: 48px 32px;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-spinner {
  font-size: 48px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.current-quest {
  margin-bottom: 32px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border: none;
}

.current-quest h2 {
  margin-bottom: 16px;
  font-size: 18px;
}

.quest-info {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.quest-icon {
  font-size: 48px;
  min-width: 60px;
}

.quest-details {
  flex: 1;
}

.quest-details h3 {
  font-size: 20px;
  margin-bottom: 4px;
}

.quest-details p {
  opacity: 0.9;
  margin-bottom: 12px;
  font-size: 14px;
}

.quest-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.9;
  min-width: 80px;
}

.continue-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.section {
  margin-bottom: 32px;
}

.section-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quest-card {
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.quest-card.completed {
  opacity: 0.8;
  background: linear-gradient(135deg, var(--success), #34D399);
  color: white;
}

.quest-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.quest-card .quest-icon {
  font-size: 32px;
}

.completed-badge {
  font-size: 20px;
}

.quest-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.quest-card p {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 12px;
  line-height: 1.4;
}

.quest-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.difficulty {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
  text-transform: uppercase;
}

.difficulty.easy {
  background: var(--success);
  color: white;
}

.difficulty.medium {
  background: var(--warning);
  color: white;
}

.difficulty.hard {
  background: var(--error);
  color: white;
}

.xp-reward {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-card {
  text-decoration: none;
  color: inherit;
  text-align: center;
  cursor: pointer;
}

.action-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.action-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}

.action-card p {
  font-size: 12px;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
  }
  
  .greeting {
    font-size: 20px;
  }
  
  .quest-info {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .quest-progress {
    justify-content: center;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>