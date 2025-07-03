<template>
  <div class="my-flashcards-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">My Flashcard Sets 📚</h1>
        <p class="page-subtitle">Play and manage your custom learning cards</p>
      </div>

      <!-- No sets message -->
      <div v-if="flashcardsStore.flashcardSets.length === 0" class="empty-state card">
        <div class="empty-icon">🎴</div>
        <h2>No Flashcard Sets Yet!</h2>
        <p>Create your first set to start learning with custom flashcards.</p>
        <NuxtLink to="/flashcard-generator">
          <UButton size="lg" class="create-btn">
            Create Your First Set
          </UButton>
        </NuxtLink>
      </div>

      <!-- Flashcard Sets -->
      <div v-else class="sets-grid">
        <div 
          v-for="set in flashcardsStore.flashcardSets"
          :key="set.id"
          class="set-card card"
        >
          <div class="set-header">
            <div class="set-category">
              {{ getCategoryEmoji(set.category) }}
            </div>
            <UDropdown :items="getSetActions(set)">
              <UButton 
                variant="ghost" 
                size="sm"
                icon="i-heroicons-ellipsis-horizontal"
              />
            </UDropdown>
          </div>
          
          <h3 class="set-title">{{ set.name }}</h3>
          <div class="set-meta">
            <span class="card-count">{{ set.cards.length }} cards</span>
            <span class="created-date">{{ formatDate(set.createdAt) }}</span>
          </div>
          
          <div class="set-preview">
            <div 
              v-for="(card, index) in set.cards.slice(0, 3)"
              :key="card.id"
              class="mini-card"
              :style="{ transform: `translateX(${index * -8}px) rotate(${(index - 1) * 3}deg)` }"
            >
              <div class="mini-card-content">
                {{ card.back }}
              </div>
            </div>
          </div>
          
          <div class="set-actions">
            <UButton 
              @click="playSet(set)"
              size="lg" 
              class="play-btn"
              icon="i-heroicons-play"
            >
              Play Cards
            </UButton>
          </div>
        </div>
      </div>

      <!-- Quick Action -->
      <div class="quick-action">
        <NuxtLink to="/flashcard-generator">
          <UButton size="xl" class="create-new-btn">
            <span class="btn-icon">✨</span>
            Create New Set
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Flashcard Player Modal -->
    <UModal v-model="showPlayer" :ui="{ width: 'max-w-md' }">
      <div v-if="currentPlayingSet" class="player-modal">
        <div class="player-header">
          <h2>{{ currentPlayingSet.name }}</h2>
          <div class="card-counter">
            {{ currentCardIndex + 1 }} / {{ currentPlayingSet.cards.length }}
          </div>
        </div>
        
        <div class="player-content">
          <div 
            class="flashcard large"
            :class="{ flipped: isCardFlipped }"
            @click="flipCurrentCard"
          >
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <div class="card-content">
                  <div class="card-text">{{ currentCard?.front }}</div>
                  <div class="tap-hint">Tap to reveal</div>
                </div>
              </div>
              <div class="flashcard-back">
                <div class="card-content">
                  <div class="card-emoji">{{ currentCard?.back }}</div>
                  <div class="card-text">{{ currentCard?.front }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="player-actions">
          <UButton 
            @click="previousCard"
            :disabled="currentCardIndex === 0"
            variant="outline"
            icon="i-heroicons-chevron-left"
          >
            Previous
          </UButton>
          
          <UButton 
            @click="nextCard"
            :disabled="currentCardIndex === currentPlayingSet.cards.length - 1"
            icon="i-heroicons-chevron-right"
            trailing
          >
            Next
          </UButton>
        </div>
        
        <div class="player-footer">
          <UButton 
            @click="closePlayer"
            variant="ghost"
            size="sm"
          >
            Close
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const flashcardsStore = useFlashcardsStore()

// Player state
const showPlayer = ref(false)
const currentPlayingSet = ref(null)
const currentCardIndex = ref(0)
const isCardFlipped = ref(false)

const currentCard = computed(() => {
  if (!currentPlayingSet.value) return null
  return currentPlayingSet.value.cards[currentCardIndex.value]
})

const getCategoryEmoji = (categoryId) => {
  const category = flashcardsStore.categoryById(categoryId)
  return category ? category.emoji : '📚'
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const getSetActions = (set) => [
  [{
    label: 'Play',
    icon: 'i-heroicons-play',
    click: () => playSet(set)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => deleteSet(set)
  }]
]

const playSet = (set) => {
  currentPlayingSet.value = set
  currentCardIndex.value = 0
  isCardFlipped.value = false
  showPlayer.value = true
}

const deleteSet = (set) => {
  if (confirm(`Are you sure you want to delete "${set.name}"?`)) {
    flashcardsStore.deleteFlashcardSet(set.id)
    useToast().add({
      title: 'Set Deleted',
      description: 'Your flashcard set has been removed.',
      icon: 'i-heroicons-trash'
    })
  }
}

const flipCurrentCard = () => {
  isCardFlipped.value = !isCardFlipped.value
}

const nextCard = () => {
  if (currentCardIndex.value < currentPlayingSet.value.cards.length - 1) {
    currentCardIndex.value++
    isCardFlipped.value = false
  }
}

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
    isCardFlipped.value = false
  }
}

const closePlayer = () => {
  showPlayer.value = false
  currentPlayingSet.value = null
  currentCardIndex.value = 0
  isCardFlipped.value = false
}

// Keyboard navigation
const handleKeyPress = (event) => {
  if (!showPlayer.value) return
  
  switch (event.key) {
    case 'ArrowLeft':
      previousCard()
      break
    case 'ArrowRight':
      nextCard()
      break
    case ' ':
      event.preventDefault()
      flipCurrentCard()
      break
    case 'Escape':
      closePlayer()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.my-flashcards-page {
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

.empty-state {
  text-align: center;
  padding: 48px 32px;
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--neutral-800);
}

.empty-state p {
  font-size: 16px;
  color: var(--neutral-600);
  margin-bottom: 24px;
  line-height: 1.5;
}

.create-btn {
  width: 100%;
  max-width: 250px;
}

.sets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.set-card {
  position: relative;
  transition: all 0.3s ease;
}

.set-card:hover {
  transform: translateY(-4px);
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.set-category {
  font-size: 32px;
}

.set-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--neutral-800);
}

.set-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 12px;
  color: var(--neutral-500);
  font-weight: 600;
}

.set-preview {
  position: relative;
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mini-card {
  position: absolute;
  width: 60px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.set-card:hover .mini-card {
  transform: translateX(0) rotate(0deg) !important;
}

.mini-card-content {
  font-size: 24px;
  color: white;
}

.set-actions {
  text-align: center;
}

.play-btn {
  width: 100%;
}

.quick-action {
  text-align: center;
}

.create-new-btn {
  width: 100%;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  font-size: 20px;
}

/* Player Modal Styles */
.player-modal {
  padding: 24px;
}

.player-header {
  text-align: center;
  margin-bottom: 24px;
}

.player-header h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--neutral-800);
}

.card-counter {
  font-size: 14px;
  color: var(--neutral-500);
  font-weight: 600;
}

.player-content {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.flashcard.large {
  width: 240px;
  height: 320px;
}

.flashcard.large .card-text {
  font-size: 20px;
}

.flashcard.large .card-emoji {
  font-size: 64px;
}

.tap-hint {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 8px;
}

.player-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.player-actions button {
  flex: 1;
}

.player-footer {
  text-align: center;
}

@media (max-width: 768px) {
  .sets-grid {
    grid-template-columns: 1fr;
  }
  
  .flashcard.large {
    width: 200px;
    height: 280px;
  }
  
  .flashcard.large .card-text {
    font-size: 18px;
  }
  
  .flashcard.large .card-emoji {
    font-size: 48px;
  }
}

@media (max-width: 480px) {
  .set-meta {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
  
  .player-actions {
    flex-direction: column;
  }
  
  .flashcard.large {
    width: 180px;
    height: 240px;
  }
}
</style>