import { defineStore } from 'pinia'

export interface FlashcardSet {
  id: string
  name: string
  category: string
  artStyle: string
  cards: Flashcard[]
  createdAt: Date
  customWords?: string[]
}

export interface Flashcard {
  id: string
  front: string
  back: string
  image?: string
}

export const useFlashcardsStore = defineStore('flashcards', {
  state: () => ({
    categories: [
      { id: 'fruits', name: 'Fruits', emoji: '🍎' },
      { id: 'animals', name: 'Animals', emoji: '🦁' },
      { id: 'sweets', name: 'Sweets', emoji: '🍭' },
      { id: 'food', name: 'Food', emoji: '🍕' },
      { id: 'colors', name: 'Colors', emoji: '🌈' },
      { id: 'shapes', name: 'Shapes', emoji: '🔷' },
      { id: 'numbers', name: 'Numbers', emoji: '🔢' },
      { id: 'vehicles', name: 'Vehicles', emoji: '🚗' },
      { id: 'nature', name: 'Nature', emoji: '🌳' },
      { id: 'space', name: 'Space', emoji: '🚀' },
      { id: 'sports', name: 'Sports', emoji: '⚽' },
      { id: 'music', name: 'Music', emoji: '🎵' },
      { id: 'clothes', name: 'Clothes', emoji: '👕' },
      { id: 'weather', name: 'Weather', emoji: '☀️' },
      { id: 'emotions', name: 'Emotions', emoji: '😊' }
    ],
    artStyles: [
      { id: 'cartoon-animals', name: 'Cartoon Animal Friends', preview: '🐱' },
      { id: 'fantasy-creatures', name: 'Fantasy Creatures', preview: '🦄' },
      { id: 'robot-helpers', name: 'Robot Helpers', preview: '🤖' },
      { id: 'space-explorers', name: 'Space Explorers', preview: '👨‍🚀' },
      { id: 'underwater-world', name: 'Underwater World', preview: '🐠' },
      { id: 'jungle-adventure', name: 'Jungle Adventure', preview: '🦜' },
      { id: 'fairy-tale', name: 'Fairy Tale Magic', preview: '🧚' },
      { id: 'superhero', name: 'Superhero Squad', preview: '🦸' },
      { id: 'pirate-treasure', name: 'Pirate Treasure', preview: '🏴‍☠️' },
      { id: 'dinosaur-land', name: 'Dinosaur Land', preview: '🦕' }
    ],
    flashcardSets: [] as FlashcardSet[],
    currentSet: null as FlashcardSet | null,
    isGenerating: false,
    loading: false
  }),

  getters: {
    categoryById: (state) => (id: string) => 
      state.categories.find(cat => cat.id === id),
    artStyleById: (state) => (id: string) => 
      state.artStyles.find(style => style.id === id)
  },

  actions: {
    async loadFlashcardSets() {
      const authStore = useAuthStore()
      if (!authStore.user || authStore.isGuest) {
        this.loadGuestData()
        return
      }

      this.loading = true
      const { getFlashcardSets } = useSupabaseData()

      try {
        const sets = await getFlashcardSets(authStore.user.id)
        
        this.flashcardSets = sets.map(set => ({
          id: set.id,
          name: set.name,
          category: set.category,
          artStyle: set.art_style,
          createdAt: new Date(set.created_at),
          customWords: set.custom_words,
          cards: set.flashcards?.map((card: any) => ({
            id: card.id,
            front: card.front,
            back: card.back,
            image: card.image_url
          })) || []
        }))

      } catch (error) {
        console.error('Failed to load flashcard sets:', error)
        this.loadGuestData()
      } finally {
        this.loading = false
      }
    },

    loadGuestData() {
      // Load expanded guest flashcard data with 30 variations
      this.flashcardSets = [
        {
          id: '1',
          name: 'My Fruit Friends',
          category: 'fruits',
          artStyle: 'cartoon-animals',
          createdAt: new Date('2024-01-15'),
          cards: [
            { id: '1', front: 'Apple', back: '🍎' },
            { id: '2', front: 'Banana', back: '🍌' },
            { id: '3', front: 'Orange', back: '🍊' },
            { id: '4', front: 'Grape', back: '🍇' },
            { id: '5', front: 'Strawberry', back: '🍓' }
          ]
        },
        {
          id: '2',
          name: 'Animal Kingdom',
          category: 'animals',
          artStyle: 'jungle-adventure',
          createdAt: new Date('2024-01-16'),
          cards: [
            { id: '6', front: 'Lion', back: '🦁' },
            { id: '7', front: 'Elephant', back: '🐘' },
            { id: '8', front: 'Tiger', back: '🐅' },
            { id: '9', front: 'Monkey', back: '🐒' },
            { id: '10', front: 'Giraffe', back: '🦒' }
          ]
        },
        {
          id: '3',
          name: 'Sweet Treats',
          category: 'sweets',
          artStyle: 'fairy-tale',
          createdAt: new Date('2024-01-17'),
          cards: [
            { id: '11', front: 'Candy', back: '🍬' },
            { id: '12', front: 'Chocolate', back: '🍫' },
            { id: '13', front: 'Lollipop', back: '🍭' },
            { id: '14', front: 'Cookie', back: '🍪' },
            { id: '15', front: 'Ice Cream', back: '🍦' }
          ]
        },
        {
          id: '4',
          name: 'Yummy Food',
          category: 'food',
          artStyle: 'cartoon-animals',
          createdAt: new Date('2024-01-18'),
          cards: [
            { id: '16', front: 'Pizza', back: '🍕' },
            { id: '17', front: 'Burger', back: '🍔' },
            { id: '18', front: 'Pasta', back: '🍝' },
            { id: '19', front: 'Sandwich', back: '🥪' },
            { id: '20', front: 'Salad', back: '🥗' }
          ]
        },
        {
          id: '5',
          name: 'Rainbow Colors',
          category: 'colors',
          artStyle: 'fantasy-creatures',
          createdAt: new Date('2024-01-19'),
          cards: [
            { id: '21', front: 'Red', back: '🔴' },
            { id: '22', front: 'Blue', back: '🔵' },
            { id: '23', front: 'Yellow', back: '🟡' },
            { id: '24', front: 'Green', back: '🟢' },
            { id: '25', front: 'Purple', back: '🟣' }
          ]
        },
        {
          id: '6',
          name: 'Fun Shapes',
          category: 'shapes',
          artStyle: 'robot-helpers',
          createdAt: new Date('2024-01-20'),
          cards: [
            { id: '26', front: 'Circle', back: '⭕' },
            { id: '27', front: 'Square', back: '⬜' },
            { id: '28', front: 'Triangle', back: '🔺' },
            { id: '29', front: 'Star', back: '⭐' },
            { id: '30', front: 'Heart', back: '❤️' }
          ]
        },
        {
          id: '7',
          name: 'Number Fun',
          category: 'numbers',
          artStyle: 'space-explorers',
          createdAt: new Date('2024-01-21'),
          cards: [
            { id: '31', front: 'One', back: '1️⃣' },
            { id: '32', front: 'Two', back: '2️⃣' },
            { id: '33', front: 'Three', back: '3️⃣' },
            { id: '34', front: 'Four', back: '4️⃣' },
            { id: '35', front: 'Five', back: '5️⃣' }
          ]
        },
        {
          id: '8',
          name: 'Cool Vehicles',
          category: 'vehicles',
          artStyle: 'superhero',
          createdAt: new Date('2024-01-22'),
          cards: [
            { id: '36', front: 'Car', back: '🚗' },
            { id: '37', front: 'Airplane', back: '✈️' },
            { id: '38', front: 'Train', back: '🚂' },
            { id: '39', front: 'Boat', back: '⛵' },
            { id: '40', front: 'Bicycle', back: '🚲' }
          ]
        },
        {
          id: '9',
          name: 'Nature Wonders',
          category: 'nature',
          artStyle: 'underwater-world',
          createdAt: new Date('2024-01-23'),
          cards: [
            { id: '41', front: 'Tree', back: '🌳' },
            { id: '42', front: 'Flower', back: '🌸' },
            { id: '43', front: 'Mountain', back: '⛰️' },
            { id: '44', front: 'Ocean', back: '🌊' },
            { id: '45', front: 'Sun', back: '☀️' }
          ]
        },
        {
          id: '10',
          name: 'Space Adventure',
          category: 'space',
          artStyle: 'space-explorers',
          createdAt: new Date('2024-01-24'),
          cards: [
            { id: '46', front: 'Rocket', back: '🚀' },
            { id: '47', front: 'Planet', back: '🪐' },
            { id: '48', front: 'Star', back: '⭐' },
            { id: '49', front: 'Moon', back: '🌙' },
            { id: '50', front: 'Astronaut', back: '👨‍🚀' }
          ]
        },
        {
          id: '11',
          name: 'Sports Fun',
          category: 'sports',
          artStyle: 'superhero',
          createdAt: new Date('2024-01-25'),
          cards: [
            { id: '51', front: 'Soccer', back: '⚽' },
            { id: '52', front: 'Basketball', back: '🏀' },
            { id: '53', front: 'Tennis', back: '🎾' },
            { id: '54', front: 'Swimming', back: '🏊' },
            { id: '55', front: 'Running', back: '🏃' }
          ]
        },
        {
          id: '12',
          name: 'Musical Notes',
          category: 'music',
          artStyle: 'fairy-tale',
          createdAt: new Date('2024-01-26'),
          cards: [
            { id: '56', front: 'Piano', back: '🎹' },
            { id: '57', front: 'Guitar', back: '🎸' },
            { id: '58', front: 'Drums', back: '🥁' },
            { id: '59', front: 'Violin', back: '🎻' },
            { id: '60', front: 'Microphone', back: '🎤' }
          ]
        },
        {
          id: '13',
          name: 'Dress Up Time',
          category: 'clothes',
          artStyle: 'cartoon-animals',
          createdAt: new Date('2024-01-27'),
          cards: [
            { id: '61', front: 'Shirt', back: '👕' },
            { id: '62', front: 'Pants', back: '👖' },
            { id: '63', front: 'Shoes', back: '👟' },
            { id: '64', front: 'Hat', back: '👒' },
            { id: '65', front: 'Dress', back: '👗' }
          ]
        },
        {
          id: '14',
          name: 'Weather Watch',
          category: 'weather',
          artStyle: 'fantasy-creatures',
          createdAt: new Date('2024-01-28'),
          cards: [
            { id: '66', front: 'Sunny', back: '☀️' },
            { id: '67', front: 'Rainy', back: '🌧️' },
            { id: '68', front: 'Cloudy', back: '☁️' },
            { id: '69', front: 'Snowy', back: '❄️' },
            { id: '70', front: 'Windy', back: '💨' }
          ]
        },
        {
          id: '15',
          name: 'Happy Feelings',
          category: 'emotions',
          artStyle: 'robot-helpers',
          createdAt: new Date('2024-01-29'),
          cards: [
            { id: '71', front: 'Happy', back: '😊' },
            { id: '72', front: 'Sad', back: '😢' },
            { id: '73', front: 'Excited', back: '🤩' },
            { id: '74', front: 'Surprised', back: '😲' },
            { id: '75', front: 'Calm', back: '😌' }
          ]
        },
        {
          id: '16',
          name: 'Ocean Friends',
          category: 'animals',
          artStyle: 'underwater-world',
          createdAt: new Date('2024-01-30'),
          cards: [
            { id: '76', front: 'Fish', back: '🐠' },
            { id: '77', front: 'Whale', back: '🐋' },
            { id: '78', front: 'Dolphin', back: '🐬' },
            { id: '79', front: 'Octopus', back: '🐙' },
            { id: '80', front: 'Shark', back: '🦈' }
          ]
        },
        {
          id: '17',
          name: 'Dinosaur Discovery',
          category: 'animals',
          artStyle: 'dinosaur-land',
          createdAt: new Date('2024-01-31'),
          cards: [
            { id: '81', front: 'T-Rex', back: '🦖' },
            { id: '82', front: 'Triceratops', back: '🦕' },
            { id: '83', front: 'Stegosaurus', back: '🦴' },
            { id: '84', front: 'Pterodactyl', back: '🦅' },
            { id: '85', front: 'Brontosaurus', back: '🦕' }
          ]
        },
        {
          id: '18',
          name: 'Pirate Treasure',
          category: 'fantasy',
          artStyle: 'pirate-treasure',
          createdAt: new Date('2024-02-01'),
          cards: [
            { id: '86', front: 'Treasure', back: '💰' },
            { id: '87', front: 'Ship', back: '🚢' },
            { id: '88', front: 'Map', back: '🗺️' },
            { id: '89', front: 'Compass', back: '🧭' },
            { id: '90', front: 'Parrot', back: '🦜' }
          ]
        },
        {
          id: '19',
          name: 'Garden Party',
          category: 'nature',
          artStyle: 'fairy-tale',
          createdAt: new Date('2024-02-02'),
          cards: [
            { id: '91', front: 'Rose', back: '🌹' },
            { id: '92', front: 'Tulip', back: '🌷' },
            { id: '93', front: 'Sunflower', back: '🌻' },
            { id: '94', front: 'Butterfly', back: '🦋' },
            { id: '95', front: 'Bee', back: '🐝' }
          ]
        },
        {
          id: '20',
          name: 'Kitchen Fun',
          category: 'food',
          artStyle: 'cartoon-animals',
          createdAt: new Date('2024-02-03'),
          cards: [
            { id: '96', front: 'Bread', back: '🍞' },
            { id: '97', front: 'Milk', back: '🥛' },
            { id: '98', front: 'Egg', back: '🥚' },
            { id: '99', front: 'Cheese', back: '🧀' },
            { id: '100', front: 'Soup', back: '🍲' }
          ]
        }
      ]
    },

    async generateFlashcards(category: string, artStyle: string, customWords?: string[]) {
      this.isGenerating = true
      
      try {
        // Simulate AI generation (in real app, call OpenRouter API)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const categoryData = this.categoryById(category)
        const styleData = this.artStyleById(artStyle)
        
        const defaultWords = {
          fruits: ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry', 'Pineapple', 'Mango', 'Kiwi'],
          animals: ['Lion', 'Elephant', 'Tiger', 'Monkey', 'Giraffe', 'Zebra', 'Hippo', 'Rhino'],
          sweets: ['Candy', 'Chocolate', 'Lollipop', 'Cookie', 'Ice Cream', 'Cake', 'Donut', 'Gummy'],
          food: ['Pizza', 'Burger', 'Pasta', 'Sandwich', 'Salad', 'Soup', 'Rice', 'Bread'],
          colors: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Pink', 'Brown'],
          shapes: ['Circle', 'Square', 'Triangle', 'Rectangle', 'Star', 'Heart', 'Diamond', 'Oval'],
          numbers: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'],
          vehicles: ['Car', 'Airplane', 'Train', 'Boat', 'Bicycle', 'Bus', 'Truck', 'Motorcycle'],
          nature: ['Tree', 'Flower', 'Mountain', 'Ocean', 'Sun', 'Moon', 'River', 'Forest'],
          space: ['Rocket', 'Planet', 'Star', 'Moon', 'Astronaut', 'Satellite', 'Comet', 'Galaxy'],
          sports: ['Soccer', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Baseball', 'Golf', 'Skiing'],
          music: ['Piano', 'Guitar', 'Drums', 'Violin', 'Microphone', 'Flute', 'Trumpet', 'Harp'],
          clothes: ['Shirt', 'Pants', 'Shoes', 'Hat', 'Dress', 'Jacket', 'Socks', 'Gloves'],
          weather: ['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Windy', 'Stormy', 'Foggy', 'Hot'],
          emotions: ['Happy', 'Sad', 'Excited', 'Surprised', 'Calm', 'Angry', 'Scared', 'Proud']
        }
        
        const words = customWords && customWords.length > 0 
          ? customWords 
          : defaultWords[category as keyof typeof defaultWords] || []
        
        const cards: Flashcard[] = words.map((word, index) => ({
          id: `${Date.now()}-${index}`,
          front: word,
          back: this.getEmojiForWord(word, category),
          image: `https://images.pexels.com/photos/${100000 + index}/pexels-photo-${100000 + index}.jpeg?auto=compress&cs=tinysrgb&w=300`
        }))
        
        const newSet: FlashcardSet = {
          id: Date.now().toString(),
          name: `${categoryData?.name} - ${styleData?.name}`,
          category,
          artStyle,
          cards,
          createdAt: new Date(),
          customWords
        }
        
        // Save to database if not guest
        const authStore = useAuthStore()
        if (!authStore.isGuest && authStore.user) {
          const { createFlashcardSet, createFlashcards } = useSupabaseData()
          
          try {
            const savedSet = await createFlashcardSet(authStore.user.id, {
              name: newSet.name,
              category: newSet.category,
              art_style: newSet.artStyle,
              custom_words: newSet.customWords
            })
            
            await createFlashcards(savedSet.id, newSet.cards)
            newSet.id = savedSet.id
          } catch (error) {
            console.error('Failed to save flashcard set:', error)
          }
        }
        
        this.flashcardSets.unshift(newSet)
        this.currentSet = newSet
        
        return newSet
      } catch (error) {
        console.error('Failed to generate flashcards:', error)
        throw error
      } finally {
        this.isGenerating = false
      }
    },

    getEmojiForWord(word: string, category: string): string {
      const emojiMap: { [key: string]: string } = {
        // Fruits
        'Apple': '🍎', 'Banana': '🍌', 'Orange': '🍊', 'Grape': '🍇', 'Strawberry': '🍓',
        'Pineapple': '🍍', 'Mango': '🥭', 'Kiwi': '🥝',
        // Animals
        'Lion': '🦁', 'Elephant': '🐘', 'Tiger': '🐅', 'Monkey': '🐒', 'Giraffe': '🦒',
        'Zebra': '🦓', 'Hippo': '🦛', 'Rhino': '🦏', 'Fish': '🐠', 'Whale': '🐋',
        'Dolphin': '🐬', 'Octopus': '🐙', 'Shark': '🦈', 'T-Rex': '🦖', 'Triceratops': '🦕',
        // Sweets
        'Candy': '🍬', 'Chocolate': '🍫', 'Lollipop': '🍭', 'Cookie': '🍪', 'Ice Cream': '🍦',
        'Cake': '🎂', 'Donut': '🍩', 'Gummy': '🍬',
        // Food
        'Pizza': '🍕', 'Burger': '🍔', 'Pasta': '🍝', 'Sandwich': '🥪', 'Salad': '🥗',
        'Soup': '🍲', 'Rice': '🍚', 'Bread': '🍞', 'Milk': '🥛', 'Egg': '🥚', 'Cheese': '🧀',
        // Colors
        'Red': '🔴', 'Blue': '🔵', 'Yellow': '🟡', 'Green': '🟢', 'Purple': '🟣',
        'Orange': '🟠', 'Pink': '🩷', 'Brown': '🤎',
        // Shapes
        'Circle': '⭕', 'Square': '⬜', 'Triangle': '🔺', 'Star': '⭐', 'Heart': '❤️',
        'Rectangle': '▭', 'Diamond': '💎', 'Oval': '⭕',
        // Numbers
        'One': '1️⃣', 'Two': '2️⃣', 'Three': '3️⃣', 'Four': '4️⃣', 'Five': '5️⃣',
        'Six': '6️⃣', 'Seven': '7️⃣', 'Eight': '8️⃣',
        // Vehicles
        'Car': '🚗', 'Airplane': '✈️', 'Train': '🚂', 'Boat': '⛵', 'Bicycle': '🚲',
        'Bus': '🚌', 'Truck': '🚛', 'Motorcycle': '🏍️',
        // Nature
        'Tree': '🌳', 'Flower': '🌸', 'Mountain': '⛰️', 'Ocean': '🌊', 'Sun': '☀️',
        'Moon': '🌙', 'River': '🏞️', 'Forest': '🌲', 'Rose': '🌹', 'Tulip': '🌷',
        'Sunflower': '🌻', 'Butterfly': '🦋', 'Bee': '🐝',
        // Space
        'Rocket': '🚀', 'Planet': '🪐', 'Star': '⭐', 'Moon': '🌙', 'Astronaut': '👨‍🚀',
        'Satellite': '🛰️', 'Comet': '☄️', 'Galaxy': '🌌',
        // Sports
        'Soccer': '⚽', 'Basketball': '🏀', 'Tennis': '🎾', 'Swimming': '🏊', 'Running': '🏃',
        'Baseball': '⚾', 'Golf': '⛳', 'Skiing': '⛷️',
        // Music
        'Piano': '🎹', 'Guitar': '🎸', 'Drums': '🥁', 'Violin': '🎻', 'Microphone': '🎤',
        'Flute': '🪈', 'Trumpet': '🎺', 'Harp': '🪕',
        // Clothes
        'Shirt': '👕', 'Pants': '👖', 'Shoes': '👟', 'Hat': '👒', 'Dress': '👗',
        'Jacket': '🧥', 'Socks': '🧦', 'Gloves': '🧤',
        // Weather
        'Sunny': '☀️', 'Rainy': '🌧️', 'Cloudy': '☁️', 'Snowy': '❄️', 'Windy': '💨',
        'Stormy': '⛈️', 'Foggy': '🌫️', 'Hot': '🔥',
        // Emotions
        'Happy': '😊', 'Sad': '😢', 'Excited': '🤩', 'Surprised': '😲', 'Calm': '😌',
        'Angry': '😠', 'Scared': '😨', 'Proud': '😤',
        // Fantasy/Pirate
        'Treasure': '💰', 'Ship': '🚢', 'Map': '🗺️', 'Compass': '🧭', 'Parrot': '🦜'
      }
      
      return emojiMap[word] || '❓'
    },

    async deleteFlashcardSet(setId: string) {
      const authStore = useAuthStore()
      
      // Remove from local state
      this.flashcardSets = this.flashcardSets.filter(set => set.id !== setId)
      
      // Delete from database if not guest
      if (!authStore.isGuest && authStore.user) {
        const { deleteFlashcardSet } = useSupabaseData()
        try {
          await deleteFlashcardSet(setId)
        } catch (error) {
          console.error('Failed to delete flashcard set:', error)
        }
      }
    },

    setCurrentSet(set: FlashcardSet) {
      this.currentSet = set
    }
  }
})