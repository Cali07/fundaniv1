<template>
  <div class="quest-page">
    <div class="container">
      <div v-if="quest" class="quest-container">
        <!-- Header -->
        <div class="quest-header">
          <UButton 
            @click="$router.back()"
            size="sm"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            class="back-btn"
          >
            Back
          </UButton>
          
          <div class="quest-title">
            <h1>{{ quest.icon }} {{ quest.title }}</h1>
            <div class="quest-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: quest.progress + '%' }"
                ></div>
              </div>
              <span class="progress-text">{{ quest.progress }}%</span>
            </div>
          </div>
        </div>

        <!-- AI Tutor Section -->
        <div class="tutor-section card">
          <div class="tutor-avatar">
            <div class="avatar-container pulse">
              <div class="avatar">🤖</div>
              <div class="speech-bubble">
                <p>{{ tutorMessage }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quest Content -->
        <div class="quest-content card">
          <div v-if="currentQuestion" class="question-container">
            <div class="question-header">
              <h2>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</h2>
              <div class="question-counter">
                <div class="counter-dots">
                  <div 
                    v-for="(q, index) in questions"
                    :key="index"
                    class="dot"
                    :class="{ 
                      active: index === currentQuestionIndex,
                      completed: index < currentQuestionIndex 
                    }"
                  ></div>
                </div>
              </div>
            </div>
            
            <div class="question-text">
              <h3>{{ currentQuestion.question }}</h3>
              <p v-if="currentQuestion.hint" class="question-hint">💡 {{ currentQuestion.hint }}</p>
            </div>
            
            <!-- Multiple Choice Questions -->
            <div v-if="currentQuestion.type === 'mcq'" class="mcq-options">
              <button 
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                @click="selectAnswer(index)"
                class="option-btn"
                :class="{ 
                  selected: selectedAnswer === index,
                  correct: showResult && index === currentQuestion.correct,
                  incorrect: showResult && selectedAnswer === index && index !== currentQuestion.correct
                }"
                :disabled="showResult"
              >
                <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
                <span class="option-text">{{ option }}</span>
              </button>
            </div>

            <!-- True/False Questions -->
            <div v-if="currentQuestion.type === 'truefalse'" class="truefalse-options">
              <button 
                @click="selectAnswer(true)"
                class="option-btn"
                :class="{ 
                  selected: selectedAnswer === true,
                  correct: showResult && currentQuestion.correct === true,
                  incorrect: showResult && selectedAnswer === true && currentQuestion.correct !== true
                }"
                :disabled="showResult"
              >
                <span class="option-icon">✅</span>
                <span class="option-text">True</span>
              </button>
              <button 
                @click="selectAnswer(false)"
                class="option-btn"
                :class="{ 
                  selected: selectedAnswer === false,
                  correct: showResult && currentQuestion.correct === false,
                  incorrect: showResult && selectedAnswer === false && currentQuestion.correct !== false
                }"
                :disabled="showResult"
              >
                <span class="option-icon">❌</span>
                <span class="option-text">False</span>
              </button>
            </div>

            <!-- Fill in the Blank -->
            <div v-if="currentQuestion.type === 'fillblank'" class="fillblank-container">
              <div class="sentence-display">
                <span v-for="(part, index) in currentQuestion.sentenceParts" :key="index">
                  {{ part }}
                  <input 
                    v-if="index < currentQuestion.sentenceParts.length - 1"
                    v-model="fillBlankAnswers[index]"
                    type="text"
                    class="blank-input"
                    :class="{ 
                      correct: showResult && fillBlankAnswers[index]?.toLowerCase() === currentQuestion.answers[index]?.toLowerCase(),
                      incorrect: showResult && fillBlankAnswers[index]?.toLowerCase() !== currentQuestion.answers[index]?.toLowerCase()
                    }"
                    :disabled="showResult"
                    :placeholder="`Blank ${index + 1}`"
                  />
                </span>
              </div>
            </div>

            <!-- Drag and Drop -->
            <div v-if="currentQuestion.type === 'drag'" class="drag-drop">
              <div class="drop-zones">
                <div 
                  v-for="(zone, index) in currentQuestion.dropZones"
                  :key="index"
                  class="drop-zone"
                  @drop="handleDrop(index, $event)"
                  @dragover.prevent
                >
                  <span v-if="!zone.filled">{{ zone.label }}</span>
                  <div v-else class="dropped-item">{{ zone.content }}</div>
                </div>
              </div>
              <div class="drag-items">
                <div 
                  v-for="(item, index) in currentQuestion.dragItems"
                  :key="index"
                  v-show="!item.used"
                  class="drag-item"
                  draggable="true"
                  @dragstart="handleDragStart(index, $event)"
                >
                  {{ item.content }}
                </div>
              </div>
            </div>

            <!-- Drawing Area -->
            <div v-if="currentQuestion.type === 'draw'" class="drawing-area">
              <canvas 
                ref="drawingCanvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @touchstart="startDrawing"
                @touchmove="draw"
                @touchend="stopDrawing"
                class="drawing-canvas"
              ></canvas>
              <div class="drawing-controls">
                <UButton @click="clearCanvas" size="sm" variant="outline">
                  Clear
                </UButton>
              </div>
            </div>

            <!-- Explanation after answer -->
            <div v-if="showResult && currentQuestion.explanation" class="explanation">
              <div class="explanation-header">
                <span class="explanation-icon">💡</span>
                <h4>Explanation</h4>
              </div>
              <p>{{ currentQuestion.explanation }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="quest-actions">
              <UButton 
                v-if="!showResult && (currentQuestion.type === 'mcq' || currentQuestion.type === 'truefalse')"
                @click="checkAnswer"
                :disabled="selectedAnswer === null"
                size="lg"
                class="check-btn"
              >
                Check Answer
              </UButton>
              
              <UButton 
                v-if="!showResult && currentQuestion.type === 'fillblank'"
                @click="checkFillBlankAnswer"
                :disabled="!fillBlankAnswers.some(answer => answer?.trim())"
                size="lg"
                class="check-btn"
              >
                Check Answer
              </UButton>
              
              <UButton 
                v-if="showResult || currentQuestion.type === 'drag' || currentQuestion.type === 'draw'"
                @click="nextQuestion"
                size="lg"
                class="next-btn"
              >
                {{ isLastQuestion ? 'Complete Quest!' : 'Next Question' }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const progressStore = useProgressStore()

const questId = route.params.id
const quest = computed(() => progressStore.quests.find(q => q.id === questId))

// Quest state
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const fillBlankAnswers = ref([])
const showResult = ref(false)
const tutorMessage = ref("Great! Let's start this quest together. Take your time and think carefully!")
const drawingCanvas = ref(null)
const isDrawing = ref(false)

// Comprehensive questions for each quest
const questQuestions = {
  '1': [ // Math Adventure
    {
      id: 1,
      type: 'mcq',
      question: 'What is 5 + 3?',
      options: ['6', '7', '8', '9'],
      correct: 2,
      hint: 'Count on your fingers if you need to!',
      explanation: 'When we add 5 + 3, we start with 5 and count up 3 more: 6, 7, 8!'
    },
    {
      id: 2,
      type: 'mcq',
      question: 'What is 12 - 4?',
      options: ['6', '7', '8', '9'],
      correct: 2,
      explanation: 'When we subtract 4 from 12, we count backwards: 11, 10, 9, 8!'
    },
    {
      id: 3,
      type: 'truefalse',
      question: 'Is 6 × 2 equal to 12?',
      correct: true,
      explanation: '6 × 2 means 6 + 6, which equals 12!'
    },
    {
      id: 4,
      type: 'fillblank',
      question: 'Complete the pattern: 2, 4, 6, ___, 10',
      sentenceParts: ['2, 4, 6, ', ', 10'],
      answers: ['8'],
      explanation: 'This is counting by 2s: 2, 4, 6, 8, 10!'
    },
    {
      id: 5,
      type: 'mcq',
      question: 'Which shape has 3 sides?',
      options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
      correct: 2,
      explanation: 'A triangle has exactly 3 sides and 3 corners!'
    },
    {
      id: 6,
      type: 'mcq',
      question: 'What is half of 10?',
      options: ['3', '4', '5', '6'],
      correct: 2,
      explanation: 'Half means dividing by 2. 10 ÷ 2 = 5!'
    },
    {
      id: 7,
      type: 'truefalse',
      question: 'Is 15 greater than 20?',
      correct: false,
      explanation: '15 is less than 20. 20 is the bigger number!'
    },
    {
      id: 8,
      type: 'mcq',
      question: 'How many minutes are in 1 hour?',
      options: ['30', '45', '60', '90'],
      correct: 2,
      explanation: 'There are 60 minutes in 1 hour!'
    },
    {
      id: 9,
      type: 'fillblank',
      question: 'If you have 3 apples and eat 1, you have ___ apples left.',
      sentenceParts: ['If you have 3 apples and eat 1, you have ', ' apples left.'],
      answers: ['2'],
      explanation: '3 - 1 = 2 apples remaining!'
    },
    {
      id: 10,
      type: 'mcq',
      question: 'What comes next: 10, 20, 30, ___?',
      options: ['35', '40', '45', '50'],
      correct: 1,
      explanation: 'This is counting by 10s: 10, 20, 30, 40!'
    }
  ],
  '2': [ // Grammar Galaxy
    {
      id: 1,
      type: 'mcq',
      question: 'Which word is a noun?',
      options: ['Run', 'Happy', 'Dog', 'Quickly'],
      correct: 2,
      explanation: 'A noun is a person, place, or thing. Dog is a thing (animal)!'
    },
    {
      id: 2,
      type: 'truefalse',
      question: 'A sentence always starts with a capital letter.',
      correct: true,
      explanation: 'Every sentence must begin with a capital letter!'
    },
    {
      id: 3,
      type: 'fillblank',
      question: 'Complete the sentence: The cat ___ on the mat.',
      sentenceParts: ['The cat ', ' on the mat.'],
      answers: ['sits', 'sat', 'is sitting'],
      explanation: 'We need a verb (action word) like "sits" to complete the sentence!'
    },
    {
      id: 4,
      type: 'mcq',
      question: 'Which word rhymes with "cat"?',
      options: ['Dog', 'Hat', 'Fish', 'Bird'],
      correct: 1,
      explanation: 'Cat and hat both end with the "-at" sound!'
    },
    {
      id: 5,
      type: 'mcq',
      question: 'What type of word is "beautiful"?',
      options: ['Noun', 'Verb', 'Adjective', 'Pronoun'],
      correct: 2,
      explanation: 'Beautiful describes something, so it\'s an adjective!'
    },
    {
      id: 6,
      type: 'truefalse',
      question: 'The word "they" is a pronoun.',
      correct: true,
      explanation: 'Pronouns replace nouns. "They" replaces names of people or things!'
    },
    {
      id: 7,
      type: 'fillblank',
      question: 'Add the missing punctuation: What time is it___',
      sentenceParts: ['What time is it', ''],
      answers: ['?'],
      explanation: 'Questions end with a question mark (?)!'
    },
    {
      id: 8,
      type: 'mcq',
      question: 'Which sentence is correct?',
      options: ['i like pizza', 'I like pizza.', 'i Like Pizza', 'I like pizza'],
      correct: 1,
      explanation: 'Sentences start with capital letters and end with periods!'
    },
    {
      id: 9,
      type: 'mcq',
      question: 'What is the plural of "child"?',
      options: ['Childs', 'Children', 'Childes', 'Child'],
      correct: 1,
      explanation: 'Some words have special plural forms. Child becomes children!'
    },
    {
      id: 10,
      type: 'fillblank',
      question: 'Choose the right word: I ___ to school every day.',
      sentenceParts: ['I ', ' to school every day.'],
      answers: ['go', 'walk', 'run'],
      explanation: 'We need a verb that shows what you do every day!'
    }
  ],
  '3': [ // Science Safari
    {
      id: 1,
      type: 'mcq',
      question: 'What do plants need to grow?',
      options: ['Only water', 'Only sunlight', 'Water, sunlight, and air', 'Only soil'],
      correct: 2,
      explanation: 'Plants need water, sunlight, and air (carbon dioxide) to make their food!'
    },
    {
      id: 2,
      type: 'truefalse',
      question: 'Fish can breathe underwater.',
      correct: true,
      explanation: 'Fish have gills that help them breathe oxygen from water!'
    },
    {
      id: 3,
      type: 'mcq',
      question: 'Which animal is a mammal?',
      options: ['Fish', 'Bird', 'Dog', 'Butterfly'],
      correct: 2,
      explanation: 'Mammals have fur or hair and feed milk to their babies. Dogs are mammals!'
    },
    {
      id: 4,
      type: 'fillblank',
      question: 'The Earth has ___ main layers.',
      sentenceParts: ['The Earth has ', ' main layers.'],
      answers: ['three', '3'],
      explanation: 'Earth has three main layers: crust, mantle, and core!'
    },
    {
      id: 5,
      type: 'mcq',
      question: 'What makes the wind?',
      options: ['Trees moving', 'Air moving', 'Water moving', 'Clouds moving'],
      correct: 1,
      explanation: 'Wind is air that moves from one place to another!'
    },
    {
      id: 6,
      type: 'truefalse',
      question: 'The sun is a star.',
      correct: true,
      explanation: 'The sun is actually a star - it\'s just much closer to us than other stars!'
    },
    {
      id: 7,
      type: 'mcq',
      question: 'How many legs does a spider have?',
      options: ['6', '8', '10', '12'],
      correct: 1,
      explanation: 'All spiders have 8 legs - that\'s how we know they\'re arachnids!'
    },
    {
      id: 8,
      type: 'fillblank',
      question: 'Water freezes at ___ degrees Celsius.',
      sentenceParts: ['Water freezes at ', ' degrees Celsius.'],
      answers: ['0', 'zero'],
      explanation: 'Water turns to ice at 0 degrees Celsius (32 degrees Fahrenheit)!'
    },
    {
      id: 9,
      type: 'mcq',
      question: 'Which planet is closest to the sun?',
      options: ['Venus', 'Earth', 'Mercury', 'Mars'],
      correct: 2,
      explanation: 'Mercury is the closest planet to our sun!'
    },
    {
      id: 10,
      type: 'truefalse',
      question: 'Dinosaurs and humans lived at the same time.',
      correct: false,
      explanation: 'Dinosaurs lived millions of years before humans existed!'
    }
  ],
  '4': [ // History Heroes
    {
      id: 1,
      type: 'mcq',
      question: 'Who was the first person to walk on the moon?',
      options: ['Buzz Aldrin', 'Neil Armstrong', 'John Glenn', 'Alan Shepard'],
      correct: 1,
      explanation: 'Neil Armstrong was the first person to step on the moon in 1969!'
    },
    {
      id: 2,
      type: 'truefalse',
      question: 'The pyramids were built in Egypt.',
      correct: true,
      explanation: 'The famous pyramids were built in ancient Egypt thousands of years ago!'
    },
    {
      id: 3,
      type: 'fillblank',
      question: 'Christopher Columbus sailed to America in the year ___.',
      sentenceParts: ['Christopher Columbus sailed to America in the year ', '.'],
      answers: ['1492'],
      explanation: 'Columbus reached the Americas in 1492 - that\'s over 500 years ago!'
    },
    {
      id: 4,
      type: 'mcq',
      question: 'Which ancient wonder was in Alexandria?',
      options: ['Hanging Gardens', 'Lighthouse', 'Colossus', 'Mausoleum'],
      correct: 1,
      explanation: 'The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World!'
    },
    {
      id: 5,
      type: 'mcq',
      question: 'Who painted the Mona Lisa?',
      options: ['Michelangelo', 'Leonardo da Vinci', 'Picasso', 'Van Gogh'],
      correct: 1,
      explanation: 'Leonardo da Vinci painted the famous Mona Lisa during the Renaissance!'
    },
    {
      id: 6,
      type: 'truefalse',
      question: 'The Great Wall of China can be seen from space.',
      correct: false,
      explanation: 'This is a myth! The Great Wall is actually too narrow to see from space!'
    },
    {
      id: 7,
      type: 'fillblank',
      question: 'The ancient Romans spoke ___.',
      sentenceParts: ['The ancient Romans spoke ', '.'],
      answers: ['Latin'],
      explanation: 'Latin was the language of ancient Rome and is still used today in science!'
    },
    {
      id: 8,
      type: 'mcq',
      question: 'Which civilization built Machu Picchu?',
      options: ['Aztecs', 'Mayans', 'Incas', 'Egyptians'],
      correct: 2,
      explanation: 'The Incas built the amazing city of Machu Picchu high in the mountains!'
    },
    {
      id: 9,
      type: 'truefalse',
      question: 'Vikings wore horned helmets.',
      correct: false,
      explanation: 'Vikings didn\'t actually wear horned helmets - that\'s just in movies!'
    },
    {
      id: 10,
      type: 'mcq',
      question: 'In which country did the Olympic Games begin?',
      options: ['Italy', 'Greece', 'Egypt', 'Turkey'],
      correct: 1,
      explanation: 'The Olympic Games started in ancient Greece over 2,700 years ago!'
    }
  ]
}

const questions = computed(() => questQuestions[questId] || [])
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

// Methods
const selectAnswer = (answer) => {
  if (!showResult.value) {
    selectedAnswer.value = answer
  }
}

const checkAnswer = () => {
  showResult.value = true
  const isCorrect = selectedAnswer.value === currentQuestion.value.correct
  
  if (isCorrect) {
    tutorMessage.value = "Excellent work! You got it right! 🌟"
  } else {
    tutorMessage.value = "Not quite right, but that's okay! Learning takes practice. 💪"
  }
}

const checkFillBlankAnswer = () => {
  showResult.value = true
  const isCorrect = fillBlankAnswers.value.every((answer, index) => 
    currentQuestion.value.answers.some(correctAnswer => 
      answer?.toLowerCase().trim() === correctAnswer.toLowerCase()
    )
  )
  
  if (isCorrect) {
    tutorMessage.value = "Perfect! You filled in the blanks correctly! 🌟"
  } else {
    tutorMessage.value = "Good try! Check the correct answers and try to remember them. 💪"
  }
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    completeQuest()
  } else {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    fillBlankAnswers.value = []
    showResult.value = false
    tutorMessage.value = "Great job! Let's try the next challenge!"
    
    // Reset drag and drop
    if (currentQuestion.value.type === 'drag') {
      currentQuestion.value.dropZones.forEach(zone => {
        zone.filled = false
        zone.content = null
      })
      currentQuestion.value.dragItems.forEach(item => {
        item.used = false
      })
    }
  }
}

const completeQuest = () => {
  const progressPerQuestion = 100 / questions.value.length
  const newProgress = Math.min(quest.value.progress + progressPerQuestion * questions.value.length, 100)
  progressStore.updateQuestProgress(questId, newProgress)
  
  tutorMessage.value = "Amazing! You completed this quest! 🎉"
  
  setTimeout(() => {
    navigateTo('/home')
  }, 2000)
}

// Drawing functions
const startDrawing = (e) => {
  if (currentQuestion.value.type !== 'draw') return
  isDrawing.value = true
  
  const canvas = drawingCanvas.value
  const rect = canvas.getBoundingClientRect()
  const ctx = canvas.getContext('2d')
  
  ctx.beginPath()
  const x = (e.clientX || e.touches[0].clientX) - rect.left
  const y = (e.clientY || e.touches[0].clientY) - rect.top
  ctx.moveTo(x, y)
}

const draw = (e) => {
  if (!isDrawing.value || currentQuestion.value.type !== 'draw') return
  
  e.preventDefault()
  const canvas = drawingCanvas.value
  const rect = canvas.getBoundingClientRect()
  const ctx = canvas.getContext('2d')
  
  const x = (e.clientX || e.touches[0].clientX) - rect.left
  const y = (e.clientY || e.touches[0].clientY) - rect.top
  
  ctx.lineWidth = 3
  ctx.strokeStyle = '#6366F1'
  ctx.lineCap = 'round'
  ctx.lineTo(x, y)
  ctx.stroke()
}

const stopDrawing = () => {
  isDrawing.value = false
}

const clearCanvas = () => {
  const canvas = drawingCanvas.value
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// Drag and drop functions
const handleDragStart = (index, e) => {
  e.dataTransfer.setData('text/plain', index.toString())
}

const handleDrop = (zoneIndex, e) => {
  e.preventDefault()
  const itemIndex = parseInt(e.dataTransfer.getData('text/plain'))
  const item = currentQuestion.value.dragItems[itemIndex]
  const zone = currentQuestion.value.dropZones[zoneIndex]
  
  if (!zone.filled && !item.used) {
    zone.filled = true
    zone.content = item.content
    item.used = true
  }
}

// Initialize canvas on mount
onMounted(() => {
  if (currentQuestion.value?.type === 'draw') {
    nextTick(() => {
      const canvas = drawingCanvas.value
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    })
  }
})

// Handle canvas resize
watch(() => currentQuestion.value?.type, (newType) => {
  if (newType === 'draw') {
    nextTick(() => {
      const canvas = drawingCanvas.value
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    })
  }
})

// Initialize fill blank answers
watch(() => currentQuestion.value, (newQuestion) => {
  if (newQuestion?.type === 'fillblank') {
    fillBlankAnswers.value = new Array(newQuestion.answers.length).fill('')
  }
})
</script>

<style scoped>
.quest-page {
  padding-bottom: 20px;
}

.quest-container {
  max-width: 800px;
  margin: 0 auto;
}

.quest-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  color: white;
}

.back-btn {
  color: white;
}

.quest-title h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quest-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.tutor-section {
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
  color: white;
  border: none;
}

.tutor-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  font-size: 48px;
  min-width: 60px;
}

.speech-bubble {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px;
  position: relative;
  backdrop-filter: blur(10px);
  flex: 1;
}

.speech-bubble::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid rgba(255, 255, 255, 0.2);
}

.quest-content {
  margin-bottom: 24px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--neutral-100);
}

.question-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.counter-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--neutral-300);
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--primary);
  transform: scale(1.2);
}

.dot.completed {
  background: var(--success);
}

.question-text h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--neutral-800);
}

.question-hint {
  font-size: 14px;
  color: var(--accent);
  font-style: italic;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(249, 115, 22, 0.1);
  border-radius: 8px;
  border-left: 4px solid var(--accent);
}

.mcq-options, .truefalse-options {
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--neutral-50);
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-btn:hover {
  background: var(--neutral-100);
  transform: translateY(-2px);
}

.option-btn.selected {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

.option-btn.correct {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--success);
  color: var(--success);
}

.option-btn.incorrect {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--error);
  color: var(--error);
}

.option-letter {
  background: var(--primary);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  min-width: 24px;
}

.option-icon {
  font-size: 20px;
  min-width: 24px;
}

.option-text {
  flex: 1;
}

.fillblank-container {
  margin-bottom: 24px;
}

.sentence-display {
  font-size: 18px;
  line-height: 1.6;
  padding: 20px;
  background: var(--neutral-50);
  border-radius: 12px;
  border: 2px solid var(--neutral-200);
}

.blank-input {
  display: inline-block;
  min-width: 100px;
  padding: 4px 8px;
  margin: 0 4px;
  border: 2px solid var(--primary);
  border-radius: 6px;
  font-family: 'Fredoka', sans-serif;
  font-weight: 600;
  text-align: center;
  background: white;
}

.blank-input.correct {
  border-color: var(--success);
  background: rgba(16, 185, 129, 0.1);
}

.blank-input.incorrect {
  border-color: var(--error);
  background: rgba(239, 68, 68, 0.1);
}

.explanation {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.explanation-icon {
  font-size: 20px;
}

.explanation-header h4 {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

.explanation p {
  color: var(--neutral-700);
  line-height: 1.5;
}

.drag-drop {
  margin-bottom: 24px;
}

.drop-zones {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.drop-zone {
  min-width: 120px;
  min-height: 60px;
  border: 2px dashed var(--neutral-300);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-50);
  transition: all 0.3s ease;
  padding: 12px;
}

.drop-zone:hover {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.05);
}

.dropped-item {
  background: var(--primary);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
}

.drag-items {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.drag-item {
  background: var(--accent);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: grab;
  font-weight: 600;
  transition: all 0.3s ease;
}

.drag-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.drag-item:active {
  cursor: grabbing;
}

.drawing-area {
  margin-bottom: 24px;
}

.drawing-canvas {
  width: 100%;
  height: 300px;
  border: 2px solid var(--neutral-200);
  border-radius: 12px;
  background: white;
  cursor: crosshair;
  touch-action: none;
}

.drawing-controls {
  margin-top: 12px;
  text-align: center;
}

.quest-actions {
  text-align: center;
}

.check-btn, .next-btn {
  width: 100%;
  max-width: 300px;
}

@media (max-width: 768px) {
  .quest-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .question-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .tutor-avatar {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-container {
    flex-direction: column;
  }
  
  .speech-bubble::before {
    display: none;
  }
  
  .drop-zones {
    justify-content: center;
  }
  
  .drag-items {
    justify-content: center;
  }
  
  .sentence-display {
    font-size: 16px;
  }
  
  .blank-input {
    min-width: 80px;
  }
}
</style>