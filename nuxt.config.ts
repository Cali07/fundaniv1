import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],

  vite: {
    plugins: [
      vuetify({ theme: { defaultTheme: 'light' } })
    ]
  },

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/main.css'
  ],

  build: {
    transpile: ['vuetify']
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      openrouterApiKey: process.env.OPENROUTER_API_KEY,
      
      dailyRoomUrl: process.env.NUXT_PUBLIC_DAILY_ROOM_URL || '',
      tavusApiKey: process.env.TAVUS_API_KEY || '',
      tavusReplicaId: process.env.NUXT_PUBLIC_TAVUS_REPLICA_ID || '',
      tavusPersonaId: process.env.NUXT_PUBLIC_PERSONA_ID || ''

    }
  },

  pwa: {
    manifest: {
      name: 'Quested Ed - AI Learning',
      short_name: 'Quested Ed',
      description: 'AI-powered gamified learning for kids',
      theme_color: '#6366F1',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    }
  },

  app: {
    head: {
      title: 'Quested Ed - AI Learning Adventure',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Fun AI-powered learning quests for kids aged 7-13' }
      ]
    }
  }
})