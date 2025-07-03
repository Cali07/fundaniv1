<template>
  <div class="avatar-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Customize Your Avatar 👤</h1>
        <p class="page-subtitle">Unlock items with XP and make your avatar unique!</p>
      </div>

      <!-- Loading State -->
      <div v-if="avatarStore.loading" class="loading-state card">
        <div class="loading-content">
          <div class="loading-spinner">🔄</div>
          <p>Loading your avatar...</p>
        </div>
      </div>

      <template v-else>
        <!-- Avatar Display -->
        <div class="avatar-display card">
          <div class="avatar-preview">
            <div class="avatar-background">
              {{ equippedBackground?.image || '🌲' }}
            </div>
            <div class="avatar-character">
              <div class="avatar-hair">{{ equippedHair?.image || '👦' }}</div>
              <div class="avatar-outfit">{{ equippedOutfit?.image || '👕' }}</div>
              <div v-if="equippedAccessory" class="avatar-accessory">
                {{ equippedAccessory.image }}
              </div>
            </div>
          </div>
          <div class="avatar-info">
            <h2>{{ authStore.userDisplayName }}</h2>
            <p>Level {{ progressStore.level }} Explorer</p>
            <div class="xp-display">
              <span>{{ progressStore.totalXP }} XP</span>
            </div>
          </div>
        </div>

        <!-- Customization Categories -->
        <div class="customization-section">
          <div class="category-tabs">
            <button 
              v-for="category in categories"
              :key="category.id"
              @click="activeCategory = category.id"
              class="category-tab"
              :class="{ active: activeCategory === category.id }"
            >
              <span class="tab-icon">{{ category.icon }}</span>
              <span class="tab-name">{{ category.name }}</span>
            </button>
          </div>

          <div class="items-section">
            <h3 class="items-title">{{ currentCategory?.name }}</h3>
            <div class="items-grid">
              <div 
                v-for="item in currentCategoryItems"
                :key="item.id"
                class="item-card"
                :class="{ 
                  equipped: item.equipped, 
                  locked: !item.unlocked,
                  unlocked: item.unlocked && !item.equipped
                }"
                @click="equipItem(item)"
              >
                <div class="item-image">{{ item.image }}</div>
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <div v-if="!item.unlocked" class="item-requirement">
                    <span class="lock-icon">🔒</span>
                    <span>{{ item.xpRequired }} XP</span>
                  </div>
                  <div v-else-if="item.equipped" class="equipped-badge">
                    <span class="check-icon">✅</span>
                    <span>Equipped</span>
                  </div>
                  <div v-else class="unlocked-badge">
                    <span>Tap to equip</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="actions-section">
          <UButton 
            @click="saveAvatar"
            size="xl"
            class="save-btn"
            icon="i-heroicons-check"
          >
            Save Changes
          </UButton>
        </div>

        <!-- XP Progress Towards Next Unlocks -->
        <div v-if="nextUnlocks.length > 0" class="next-unlocks card">
          <h3>Coming Soon! 🎯</h3>
          <p>Keep earning XP to unlock these awesome items:</p>
          <div class="unlock-list">
            <div 
              v-for="item in nextUnlocks.slice(0, 3)"
              :key="item.id"
              class="unlock-item"
            >
              <div class="unlock-image">{{ item.image }}</div>
              <div class="unlock-info">
                <span class="unlock-name">{{ item.name }}</span>
                <div class="unlock-progress">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: Math.min((progressStore.totalXP / item.xpRequired) * 100, 100) + '%' }"
                    ></div>
                  </div>
                  <span class="progress-text">
                    {{ Math.max(0, item.xpRequired - progressStore.totalXP) }} XP to go
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const progressStore = useProgressStore()
const avatarStore = useAvatarStore()

const activeCategory = ref('hair')

const categories = [
  { id: 'hair', name: 'Hair', icon: '💇' },
  { id: 'outfit', name: 'Outfits', icon: '👕' },
  { id: 'accessory', name: 'Accessories', icon: '🕶️' },
  { id: 'background', name: 'Backgrounds', icon: '🌄' }
]

const currentCategory = computed(() => 
  categories.find(cat => cat.id === activeCategory.value)
)

const currentCategoryItems = computed(() => 
  avatarStore.itemsByCategory(activeCategory.value)
)

const equippedHair = computed(() => 
  avatarStore.items.find(item => item.category === 'hair' && item.equipped)
)

const equippedOutfit = computed(() => 
  avatarStore.items.find(item => item.category === 'outfit' && item.equipped)
)

const equippedAccessory = computed(() => 
  avatarStore.items.find(item => item.category === 'accessory' && item.equipped)
)

const equippedBackground = computed(() => 
  avatarStore.items.find(item => item.category === 'background' && item.equipped)
)

const nextUnlocks = computed(() => 
  avatarStore.items
    .filter(item => !item.unlocked)
    .sort((a, b) => a.xpRequired - b.xpRequired)
)

const equipItem = async (item) => {
  if (item.unlocked) {
    await avatarStore.equipItem(item.id)
  }
}

const saveAvatar = async () => {
  await avatarStore.saveAvatar()
  // Show success message
  useToast().add({
    title: 'Avatar Saved!',
    description: 'Your awesome new look has been saved!',
    icon: 'i-heroicons-check-circle'
  })
}

// Load avatar data when component mounts
onMounted(async () => {
  await avatarStore.loadAvatarData()
  avatarStore.checkUnlocks(progressStore.totalXP)
})

// Watch for XP changes and check unlocks
watch(() => progressStore.totalXP, (newXP) => {
  avatarStore.checkUnlocks(newXP)
})
</script>

<style scoped>
.avatar-page {
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

.avatar-display {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding: 32px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border: none;
}

.avatar-preview {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-background {
  position: absolute;
  inset: 0;
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}

.avatar-character {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar-hair, .avatar-outfit {
  font-size: 40px;
}

.avatar-accessory {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
}

.avatar-info h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.avatar-info p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 12px;
}

.xp-display {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  display: inline-block;
}

.customization-section {
  margin-bottom: 32px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  backdrop-filter: blur(10px);
}

.category-tab:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.category-tab.active {
  background: white;
  color: var(--primary);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.tab-icon {
  font-size: 24px;
}

.tab-name {
  font-size: 12px;
}

.items-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
}

.items-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--neutral-800);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.item-card {
  background: var(--neutral-50);
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-card.locked:hover {
  transform: none;
  box-shadow: none;
}

.item-card.equipped {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.item-card.unlocked {
  border-color: var(--success);
  background: rgba(16, 185, 129, 0.05);
}

.item-image {
  font-size: 40px;
  margin-bottom: 8px;
}

.item-info h4 {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
}

.item-requirement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: var(--neutral-500);
  font-weight: 600;
}

.lock-icon {
  font-size: 10px;
}

.equipped-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;
  color: var(--primary);
  font-weight: 700;
}

.check-icon {
  font-size: 12px;
}

.unlocked-badge {
  font-size: 10px;
  color: var(--success);
  font-weight: 600;
}

.actions-section {
  text-align: center;
  margin-bottom: 32px;
}

.save-btn {
  width: 100%;
  max-width: 300px;
}

.next-unlocks {
  background: linear-gradient(135deg, var(--accent), var(--accent-light));
  color: white;
  border: none;
}

.next-unlocks h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.next-unlocks p {
  opacity: 0.9;
  margin-bottom: 16px;
}

.unlock-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.unlock-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  backdrop-filter: blur(10px);
}

.unlock-image {
  font-size: 24px;
  min-width: 30px;
}

.unlock-info {
  flex: 1;
}

.unlock-name {
  font-size: 14px;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.unlock-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unlock-progress .progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
}

.unlock-progress .progress-fill {
  background: white;
}

.progress-text {
  font-size: 11px;
  opacity: 0.8;
  min-width: 70px;
  text-align: right;
}

@media (max-width: 768px) {
  .avatar-display {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .category-tabs {
    justify-content: center;
  }
  
  .items-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-tab {
    min-width: 70px;
    padding: 10px 12px;
  }
  
  .tab-icon {
    font-size: 20px;
  }
  
  .tab-name {
    font-size: 10px;
  }
}
</style>