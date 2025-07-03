import { defineStore } from 'pinia'

export interface AvatarItem {
  id: string
  name: string
  category: 'hair' | 'outfit' | 'accessory' | 'background'
  image: string
  xpRequired: number
  unlocked: boolean
  equipped: boolean
}

export const useAvatarStore = defineStore('avatar', {
  state: () => ({
    items: [] as AvatarItem[],
    loading: false
  }),

  getters: {
    equippedItems: (state) => state.items.filter(item => item.equipped),
    itemsByCategory: (state) => (category: string) => 
      state.items.filter(item => item.category === category),
    unlockedItems: (state) => state.items.filter(item => item.unlocked)
  },

  actions: {
    async loadAvatarData() {
      const authStore = useAuthStore()
      if (!authStore.user || authStore.isGuest) {
        this.loadGuestData()
        return
      }

      this.loading = true
      const { getAvatarItems, getUserAvatarItems } = useSupabaseData()

      try {
        const [allItems, userItems] = await Promise.all([
          getAvatarItems(),
          getUserAvatarItems(authStore.user.id)
        ])

        // Merge avatar items with user data
        this.items = allItems.map(item => {
          const userItem = userItems.find(ui => ui.item_id === item.id)
          return {
            id: item.id,
            name: item.name,
            category: item.category,
            image: item.image,
            xpRequired: item.xp_required,
            unlocked: userItem?.unlocked || false,
            equipped: userItem?.equipped || false
          }
        })

      } catch (error) {
        console.error('Failed to load avatar data:', error)
        this.loadGuestData()
      } finally {
        this.loading = false
      }
    },

    loadGuestData() {
      // Load default guest avatar data
      this.items = [
        // Hair options
        {
          id: 'hair-1',
          name: 'Brown Hair',
          category: 'hair' as const,
          image: '👦',
          xpRequired: 0,
          unlocked: true,
          equipped: true
        },
        {
          id: 'hair-2',
          name: 'Blonde Hair',
          category: 'hair' as const,
          image: '👱',
          xpRequired: 50,
          unlocked: false,
          equipped: false
        },
        {
          id: 'hair-3',
          name: 'Curly Hair',
          category: 'hair' as const,
          image: '👨‍🦱',
          xpRequired: 100,
          unlocked: false,
          equipped: false
        },
        // Outfits
        {
          id: 'outfit-1',
          name: 'Casual Wear',
          category: 'outfit' as const,
          image: '👕',
          xpRequired: 0,
          unlocked: true,
          equipped: true
        },
        {
          id: 'outfit-2',
          name: 'Superhero Costume',
          category: 'outfit' as const,
          image: '🦸',
          xpRequired: 150,
          unlocked: false,
          equipped: false
        },
        {
          id: 'outfit-3',
          name: 'Wizard Robes',
          category: 'outfit' as const,
          image: '🧙',
          xpRequired: 200,
          unlocked: false,
          equipped: false
        },
        // Accessories
        {
          id: 'accessory-1',
          name: 'Cool Sunglasses',
          category: 'accessory' as const,
          image: '🕶️',
          xpRequired: 75,
          unlocked: false,
          equipped: false
        },
        {
          id: 'accessory-2',
          name: 'Magic Hat',
          category: 'accessory' as const,
          image: '🎩',
          xpRequired: 125,
          unlocked: false,
          equipped: false
        },
        // Backgrounds
        {
          id: 'bg-1',
          name: 'Forest',
          category: 'background' as const,
          image: '🌲',
          xpRequired: 0,
          unlocked: true,
          equipped: true
        },
        {
          id: 'bg-2',
          name: 'Space',
          category: 'background' as const,
          image: '🌌',
          xpRequired: 100,
          unlocked: false,
          equipped: false
        },
        {
          id: 'bg-3',
          name: 'Castle',
          category: 'background' as const,
          image: '🏰',
          xpRequired: 175,
          unlocked: false,
          equipped: false
        }
      ]
    },

    async checkUnlocks(currentXP: number) {
      const authStore = useAuthStore()
      let hasUnlocks = false

      this.items.forEach(item => {
        if (!item.unlocked && currentXP >= item.xpRequired) {
          item.unlocked = true
          hasUnlocks = true
        }
      })

      // Update unlocks in database if not guest
      if (hasUnlocks && !authStore.isGuest && authStore.user) {
        const { updateAvatarItem } = useSupabaseData()
        
        for (const item of this.items) {
          if (item.unlocked && currentXP >= item.xpRequired) {
            try {
              await updateAvatarItem(authStore.user.id, item.id, {
                unlocked: true,
                unlocked_at: new Date().toISOString()
              })
            } catch (error) {
              console.error('Failed to update avatar item unlock:', error)
            }
          }
        }
      }
    },

    async equipItem(itemId: string) {
      const authStore = useAuthStore()
      const item = this.items.find(i => i.id === itemId)
      
      if (item && item.unlocked) {
        // Unequip other items in the same category
        this.items
          .filter(i => i.category === item.category && i.id !== itemId)
          .forEach(i => i.equipped = false)
        
        // Equip the selected item
        item.equipped = true

        // Update in database if not guest
        if (!authStore.isGuest && authStore.user) {
          const { equipAvatarItem } = useSupabaseData()
          try {
            await equipAvatarItem(authStore.user.id, itemId, item.category)
          } catch (error) {
            console.error('Failed to equip avatar item:', error)
          }
        }
      }
    },

    async saveAvatar() {
      // Avatar is automatically saved when items are equipped
      console.log('Avatar saved!', this.equippedItems)
    }
  }
})