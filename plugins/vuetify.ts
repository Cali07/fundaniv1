import '@mdi/font/css/materialdesignicons.min.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#6366F1',
            secondary: '#14B8A6',
            accent: '#F97316',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6',
            success: '#10B981',
            surface: '#FFFFFF',
            background: '#F8FAFC',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        style: 'text-transform: none; font-weight: 600;',
      },
      VCard: {
        elevation: 8,
      },
    },
  })
  app.vueApp.use(vuetify)
})