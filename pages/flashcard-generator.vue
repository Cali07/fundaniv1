<template>
  <div class="flashcard-generator-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Create Custom Flashcards 🎴</h1>
        <p class="page-subtitle">Design your own learning cards with AI!</p>
      </div>

      <!-- Generator Form -->
      <div class="generator-form card">
        <div class="form-section">
          <h2>Choose Category</h2>
          <div class="category-grid">
            <button 
              v-for="category in flashcardsStore.categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              class="category-option"
              :class="{ selected: selectedCategory === category.id }"
            >
              <div class="category-emoji">{{ category.emoji }}</div>
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>

        <div class="form-section">
          <h2>Choose Art Style</h2>
          <div class="style-grid">
            <button 
              v-for="style in flashcardsStore.artStyles"
              :key="style.id"
              @click="selectedStyle = style.id"
              class="style-option"
              :class="{ selected: selectedStyle === style.id }"
            >
              <div class="style-preview">{{ style.preview }}</div>
              <span>{{ style.name }}</span>
            </button>
          </div>
        </div>

        <div class="form-section">
          <h2>Custom Words (Optional)</h2>
          <p class="form-description">Add your own words, or leave empty to use our defaults!</p>
          <UTextarea
            v-model="customWords"
            placeholder="Enter words separated by commas (e.g., Apple, Banana, Orange)"
            :rows="3"
            class="custom-words-input"
          />
        </div>

        <div class="generate-section">
          <UButton 
            @click="generateFlashcards"
            :loading="flashcardsStore.isGenerating"
            :disabled="!selectedCategory || !selectedStyle"
            size="xl"
            class="generate-btn"
            icon="i-heroicons-sparkles"
          >
            {{ flashcardsStore.isGenerating ? 'Creating Magic...' : 'Generate Flashcards' }}
          </UButton>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="previewCards.length > 0" class="preview-section">
        <h2 class="section-title">Preview Your Cards ✨</h2>
        <div class="cards-preview">
          <div 
            v-for="(card, index) in previewCards.slice(0, 3)"
            :key="card.id"
            class="flashcard"
            :class="{ flipped: flippedCards.includes(index) }"
            @click="flipCard(index)"
          >
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <div class="card-content">
                  <div class="card-text">{{ card.front }}</div>
                </div>
              </div>
              <div class="flashcard-back">
                <div class="card-content">
                  <div class="card-emoji">{{ card.back }}</div>
                  <div class="card-text">{{ card.front }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="preview-actions">
          <UButton 
            @click="saveFlashcardSet"
            size="lg"
            class="save-btn"
            icon="i-heroicons-check"
          >
            Save This Set
          </UButton>
          <UButton 
            @click="regenerateCards"
            size="lg"
            variant="outline"
            class="regenerate-btn"
            icon="i-heroicons-arrow-path"
          >
            Generate New Set
          </UButton>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <NuxtLink to="/my-flashcards" class="action-card card">
          <div class="action-icon">📚</div>
          <h3>My Flashcard Sets</h3>
          <p>View and play your saved sets</p>
          <div class="sets-count">{{ flashcardsStore.flashcardSets.length }} sets</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const flashcardsStore = useFlashcardsStore()

const selectedCategory = ref('')
const selectedStyle = ref('')
const customWords = ref('')
const flippedCards = ref([])

const previewCards = computed(() => {
  return flashcardsStore.currentSet ? flashcardsStore.currentSet.cards : []
})

const flipCard = (index) => {
  if (flippedCards.value.includes(index)) {
    flippedCards.value = flippedCards.value.filter(i => i !== index)
  } else {
    flippedCards.value.push(index)
  }
}

const generateFlashcards = async () => {
  if (!selectedCategory.value || !selectedStyle.value) return
  
  try {
    const words = customWords.value 
      ? customWords.value.split(',').map(w => w.trim()).filter(w => w)
      : undefined
    
    await flashcardsStore.generateFlashcards(
      selectedCategory.value,
      selectedStyle.value,
      words
    )
    
    flippedCards.value = []
    
    useToast().add({
      title: 'Flashcards Generated!',
      description: 'Your amazing flashcards are ready!',
      icon: 'i-heroicons-sparkles'
    })
  } catch (error) {
    useToast().add({
      title: 'Generation Failed',
      description: 'Something went wrong. Please try again!',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  }
}

const saveFlashcardSet = () => {
  useToast().add({
    title: 'Set Saved!',
    description: 'Your flashcard set has been saved successfully!',
    icon: 'i-heroicons-check-circle'
  })
  
  // Reset form
  selectedCategory.value = ''
  selectedStyle.value = ''
  customWords.value = ''
  flashcardsStore.currentSet = null
}

const regenerateCards = () => {
  generateFlashcards()
}
</script>

<style scoped>
.flashcard-generator-page {
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

.generator-form {
  margin-bottom: 32px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--neutral-800);
}

.form-description {
  font-size: 14px;
  color: var(--neutral-600);
  margin-bottom: 12px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--neutral-50);
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
}

.category-option:hover {
  background: var(--neutral-100);
  transform: translateY(-2px);
}

.category-option.selected {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.category-emoji {
  font-size: 32px;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--neutral-50);
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  text-align: center;
}

.style-option:hover {
  background: var(--neutral-100);
  transform: translateY(-2px);
}

.style-option.selected {
  background: rgba(20, 184, 166, 0.1);
  border-color: var(--secondary);
  color: var(--secondary);
}

.style-preview {
  font-size: 40px;
}

.custom-words-input {
  width: 100%;
}

.generate-section {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--neutral-200);
}

.generate-btn {
  width: 100%;
  max-width: 400px;
}

.preview-section {
  margin-bottom: 32px;
}

.section-title {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cards-preview {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.flashcard {
  perspective: 1000px;
  width: 180px;
  height: 250px;
}

.flashcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.flashcard.flipped .flashcard-inner {
  transform: rotateY(180deg);
}

.flashcard-front, .flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 20px;
}

.flashcard-front {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
}

.flashcard-back {
  background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
  color: white;
  transform: rotateY(180deg);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.card-text {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.card-emoji {
  font-size: 48px;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.save-btn, .regenerate-btn {
  min-width: 160px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 400px;
  margin: 0 auto;
}

.action-card {
  text-decoration: none;
  color: inherit;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.action-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 14px;
  color: var(--neutral-600);
  margin-bottom: 12px;
}

.sets-count {
  background: var(--primary);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .style-grid {
    grid-template-columns: 1fr;
  }
  
  .cards-preview {
    gap: 12px;
  }
  
  .flashcard {
    width: 140px;
    height: 200px;
  }
  
  .card-text {
    font-size: 16px;
  }
  
  .card-emoji {
    font-size: 36px;
  }
  
  .preview-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .save-btn, .regenerate-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .cards-preview {
    justify-content: center;
  }
  
  .flashcard {
    width: 120px;
    height: 180px;
  }
  
  .card-text {
    font-size: 14px;
  }
  
  .card-emoji {
    font-size: 28px;
  }
}
</style>