import { defineStore } from 'pinia'

export interface Quest {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  xp_reward: number
  progress: number
  completed: boolean
  icon: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
}

export const useProgressStore = defineStore('progress', {
  state: () => ({
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: 200,
    quests: [] as Quest[],
    badges: [] as Badge[],
    loading: false
  }),

  getters: {
    levelProgress: (state) => {
      if (state.nextLevelXP === 0) return 0
      return Math.min((state.currentLevelXP / state.nextLevelXP) * 100, 100)
    },
    completedQuests: (state) => state.quests.filter(q => q.completed),
    earnedBadges: (state) => state.badges.filter(b => b.earned),
    currentQuest: (state) => state.quests.find(q => !q.completed && q.progress > 0)
  },

  actions: {
    async loadUserData() {
      const authStore = useAuthStore()
      if (!authStore.user || authStore.isGuest) {
        this.loadGuestData()
        return
      }

      this.loading = true
      const { 
        getUserProfile, 
        getQuests, 
        getUserQuestProgress, 
        getBadges, 
        getUserBadges 
      } = useSupabaseData()

      try {
        // Load user profile
        const profile = await getUserProfile(authStore.user.id)
        if (profile) {
          this.totalXP = profile.total_xp || 0
          this.level = profile.level || 1
          this.calculateLevelProgress()
        }

        // Load quests and progress
        const [allQuests, userProgress] = await Promise.all([
          getQuests(),
          getUserQuestProgress(authStore.user.id)
        ])

        // Merge quest data with user progress
        this.quests = allQuests.map(quest => {
          const progress = userProgress.find(p => p.quest_id === quest.id)
          return {
            id: quest.id,
            title: quest.title,
            description: quest.description,
            category: quest.category,
            difficulty: quest.difficulty,
            xp_reward: quest.xp_reward,
            progress: progress?.progress || 0,
            completed: progress?.completed || false,
            icon: quest.icon
          }
        })

        // Load badges
        const [allBadges, userBadges] = await Promise.all([
          getBadges(),
          getUserBadges(authStore.user.id)
        ])

        this.badges = allBadges.map(badge => {
          const earned = userBadges.find(ub => ub.badge_id === badge.id)
          return {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earned: !!earned,
            earnedAt: earned?.earned_at ? new Date(earned.earned_at) : undefined
          }
        })

      } catch (error) {
        console.error('Failed to load user data:', error)
        this.loadGuestData()
      } finally {
        this.loading = false
      }
    },

    loadGuestData() {
      // Load default guest data
      this.totalXP = 150
      this.level = 1
      this.currentLevelXP = 150
      this.nextLevelXP = 300
      
      this.quests = [
        {
          id: '1',
          title: 'Math Adventure',
          description: 'Learn addition and subtraction through fun challenges!',
          category: 'Mathematics',
          difficulty: 'easy' as const,
          xp_reward: 50,
          progress: 75,
          completed: false,
          icon: '🔢'
        },
        {
          id: '2',
          title: 'Grammar Galaxy',
          description: 'Explore the universe of words and sentences!',
          category: 'Language',
          difficulty: 'medium' as const,
          xp_reward: 75,
          progress: 25,
          completed: false,
          icon: '📚'
        },
        {
          id: '3',
          title: 'Science Safari',
          description: 'Discover amazing facts about animals and nature!',
          category: 'Science',
          difficulty: 'medium' as const,
          xp_reward: 75,
          progress: 0,
          completed: false,
          icon: '🔬'
        },
        {
          id: '4',
          title: 'History Heroes',
          description: 'Meet famous people from the past!',
          category: 'History',
          difficulty: 'hard' as const,
          xp_reward: 100,
          progress: 0,
          completed: false,
          icon: '🏛️'
        }
      ]

      this.badges = [
        {
          id: '1',
          name: 'First Steps',
          description: 'Complete your first quest',
          icon: '👶',
          earned: true,
          earnedAt: new Date('2024-01-15')
        },
        {
          id: '2',
          name: 'Math Wizard',
          description: 'Complete 5 math quests',
          icon: '🧙‍♂️',
          earned: false
        },
        {
          id: '3',
          name: 'Word Master',
          description: 'Learn 100 new words',
          icon: '📖',
          earned: false
        },
        {
          id: '4',
          name: 'Explorer',
          description: 'Try quests from 3 different categories',
          icon: '🗺️',
          earned: true,
          earnedAt: new Date('2024-01-20')
        }
      ]
    },

    calculateLevelProgress() {
      // Calculate current level XP and next level requirement
      const baseXP = 200
      const totalXPForCurrentLevel = (this.level - 1) * baseXP
      const totalXPForNextLevel = this.level * baseXP
      
      this.currentLevelXP = this.totalXP - totalXPForCurrentLevel
      this.nextLevelXP = totalXPForNextLevel - totalXPForCurrentLevel
    },

    async addXP(amount: number) {
      const authStore = useAuthStore()
      this.totalXP += amount
      
      // Check for level up
      const newLevel = Math.floor(this.totalXP / 200) + 1
      if (newLevel > this.level) {
        this.level = newLevel
        this.calculateLevelProgress()
        
        // Update in database if not guest
        if (!authStore.isGuest && authStore.user) {
          const { updateUserProfile } = useSupabaseData()
          try {
            await updateUserProfile(authStore.user.id, {
              total_xp: this.totalXP,
              level: this.level
            })
          } catch (error) {
            console.error('Failed to update user profile:', error)
          }
        }
      } else {
        this.calculateLevelProgress()
        
        // Update XP in database if not guest
        if (!authStore.isGuest && authStore.user) {
          const { updateUserProfile } = useSupabaseData()
          try {
            await updateUserProfile(authStore.user.id, {
              total_xp: this.totalXP
            })
          } catch (error) {
            console.error('Failed to update user XP:', error)
          }
        }
      }
    },

    async updateQuestProgress(questId: string, progress: number) {
      const authStore = useAuthStore()
      const quest = this.quests.find(q => q.id === questId)
      
      if (quest) {
        const oldProgress = quest.progress
        quest.progress = Math.min(progress, 100)
        
        if (quest.progress === 100 && !quest.completed) {
          quest.completed = true
          await this.addXP(quest.xp_reward)
        }
        
        // Update in database if not guest
        if (!authStore.isGuest && authStore.user) {
          const { updateQuestProgress } = useSupabaseData()
          try {
            await updateQuestProgress(authStore.user.id, questId, quest.progress)
          } catch (error) {
            console.error('Failed to update quest progress:', error)
          }
        }
      }
    },

    async earnBadge(badgeId: string) {
      const authStore = useAuthStore()
      const badge = this.badges.find(b => b.id === badgeId)
      
      if (badge && !badge.earned) {
        badge.earned = true
        badge.earnedAt = new Date()
        
        // Update in database if not guest
        if (!authStore.isGuest && authStore.user) {
          const { earnBadge } = useSupabaseData()
          try {
            await earnBadge(authStore.user.id, badgeId)
          } catch (error) {
            console.error('Failed to earn badge:', error)
          }
        }
      }
    }
  }
})