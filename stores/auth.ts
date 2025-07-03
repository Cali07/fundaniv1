import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    isGuest: false,
    loading: false,
    profile: null as any
  }),

  getters: {
    isAuthenticated: (state) => !!state.user || state.isGuest,
    userDisplayName: (state) => {
      if (state.isGuest) return 'Guest Explorer'
      if (state.profile?.display_name) return state.profile.display_name
      return state.user?.user_metadata?.full_name || state.user?.email || 'Young Learner'
    }
  },

  actions: {
    async signInWithEmail(email: string, password: string) {
      this.loading = true
      const { signIn } = useSupabaseAuth()
      const { getUserProfile } = useSupabaseData()
      
      try {
        const data = await signIn(email, password)
        this.user = data.user
        
        // Load user profile
        if (data.user) {
          this.profile = await getUserProfile(data.user.id)
        }
        
        await navigateTo('/home')
        return data
      } catch (error) {
        console.error('Email sign in error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async signUpWithEmail(email: string, password: string, fullName?: string) {
      this.loading = true
      const { signUp } = useSupabaseAuth()
      
      try {
        const data = await signUp(email, password, fullName)
        
        // If email confirmation is disabled, user will be signed in immediately
        if (data.user && !data.user.email_confirmed_at) {
          // Email confirmation required
          return { needsConfirmation: true, data }
        }
        
        this.user = data.user
        if (data.user) {
          const { getUserProfile } = useSupabaseData()
          this.profile = await getUserProfile(data.user.id)
        }
        
        await navigateTo('/home')
        return data
      } catch (error) {
        console.error('Email sign up error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async signInAsGuest() {
      this.isGuest = true
      this.user = {
        id: 'guest',
        email: 'guest@questedted.app',
        user_metadata: { full_name: 'Guest Explorer' }
      }
      this.profile = {
        id: 'guest',
        display_name: 'Guest Explorer',
        total_xp: 0,
        level: 1
      }
      await navigateTo('/home')
    },

    async resetPassword(email: string) {
      const { resetPassword } = useSupabaseAuth()
      
      try {
        await resetPassword(email)
        return { success: true }
      } catch (error) {
        console.error('Password reset error:', error)
        throw error
      }
    },

    async updatePassword(newPassword: string) {
      const { updatePassword } = useSupabaseAuth()
      
      try {
        await updatePassword(newPassword)
        return { success: true }
      } catch (error) {
        console.error('Password update error:', error)
        throw error
      }
    },

    async signOut() {
      if (!this.isGuest) {
        const { signOut } = useSupabaseAuth()
        await signOut()
      }
      
      this.user = null
      this.isGuest = false
      this.profile = null
      await navigateTo('/login')
    },

    async initAuth() {
      const { getSession, onAuthStateChange } = useSupabaseAuth()
      const { getUserProfile } = useSupabaseData()
      
      const session = await getSession()
      if (session?.user) {
        this.user = session.user
        this.profile = await getUserProfile(session.user.id)
      }

      onAuthStateChange(async (event, session) => {
        if (session?.user) {
          this.user = session.user
          this.isGuest = false
          this.profile = await getUserProfile(session.user.id)
        } else if (!this.isGuest) {
          this.user = null
          this.profile = null
        }
      })
    },

    async loadProfile() {
      if (this.user && !this.isGuest) {
        const { getUserProfile } = useSupabaseData()
        this.profile = await getUserProfile(this.user.id)
      }
    }
  }
})