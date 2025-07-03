<template>
  <v-app>
    <v-main class="login-main">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card class="login-card" elevation="12" rounded="xl">
              <v-card-text class="pa-8">
                <!-- Mascot Animation -->
                <div class="text-center mb-6">
                  <div class="mascot-container">
                    <div class="mascot bounce">🦋</div>
                  </div>
                </div>

                <!-- Title -->
                <div class="text-center mb-6">
                  <h1 class="text-h4 font-weight-bold text-primary mb-2">
                    Welcome to Quested Ed!
                  </h1>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    Learn through fun quests with your AI tutor!
                  </p>
                </div>

                <!-- Auth Mode Toggle -->
                <v-btn-toggle
                  v-model="authMode"
                  mandatory
                  class="mb-6"
                  color="primary"
                  variant="outlined"
                  divided
                  density="comfortable"
                >
                  <v-btn value="signin" class="flex-grow-1">
                    <v-icon start>mdi-login</v-icon>
                    Sign In
                  </v-btn>
                  <v-btn value="signup" class="flex-grow-1">
                    <v-icon start>mdi-account-plus</v-icon>
                    Sign Up
                  </v-btn>
                </v-btn-toggle>

                <!-- Email/Password Form -->
                <v-form @submit.prevent="handleEmailAuth" class="mb-4">
                  <v-text-field
                    v-if="authMode === 'signup'"
                    v-model="fullName"
                    label="Full Name (optional)"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    class="mb-3"
                    density="comfortable"
                    rounded
                  />
                  
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    class="mb-3"
                    density="comfortable"
                    rounded
                    required
                    :rules="emailRules"
                  />
                  
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    class="mb-4"
                    density="comfortable"
                    rounded
                    required
                    :rules="passwordRules"
                  />

                  <v-btn
                    type="submit"
                    :loading="authStore.loading"
                    :disabled="!isFormValid"
                    color="primary"
                    size="large"
                    block
                    class="mb-3"
                    rounded
                  >
                    <v-icon start>
                      {{ authMode === 'signin' ? 'mdi-login' : 'mdi-account-plus' }}
                    </v-icon>
                    {{ authMode === 'signin' ? 'Sign In' : 'Create Account' }}
                  </v-btn>
                </v-form>

                <!-- Forgot Password -->
                <div v-if="authMode === 'signin'" class="text-center mb-4">
                  <v-btn
                    @click="showForgotPassword = true"
                    variant="text"
                    color="primary"
                    size="small"
                  >
                    Forgot your password?
                  </v-btn>
                </div>

                <!-- Divider -->
                <v-divider class="my-6">
                  <span class="text-medium-emphasis px-4">or</span>
                </v-divider>

                <!-- Guest Access -->
                <div class="mb-6">
                  <v-btn
                    @click="authStore.signInAsGuest"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    block
                    rounded
                  >
                    <v-icon start>mdi-account-question</v-icon>
                    Try a Quest 🎯
                  </v-btn>
                </div>

                <!-- Features -->
                <v-row class="text-center">
                  <v-col cols="4">
                    <div class="feature-item">
                      <div class="feature-icon">🎮</div>
                      <div class="text-caption font-weight-medium">Gamified Learning</div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="feature-item">
                      <div class="feature-icon">🤖</div>
                      <div class="text-caption font-weight-medium">AI Tutor</div>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="feature-item">
                      <div class="feature-icon">🏆</div>
                      <div class="text-caption font-weight-medium">Earn Rewards</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Forgot Password Dialog -->
    <v-dialog v-model="showForgotPassword" max-width="400">
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold text-center pa-6">
          Reset Password
        </v-card-title>
        
        <v-card-text class="px-6">
          <p class="text-body-2 text-medium-emphasis mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <v-form @submit.prevent="handleForgotPassword">
            <v-text-field
              v-model="resetEmail"
              label="Email Address"
              type="email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              density="comfortable"
              rounded
              required
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-btn
            @click="showForgotPassword = false"
            variant="text"
            color="grey"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            @click="handleForgotPassword"
            :loading="resetLoading"
            color="primary"
            variant="flat"
          >
            Send Reset Link
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Toast Notifications -->
    <UNotifications />
  </v-app>
</template>

<script setup>
const authStore = useAuthStore()

definePageMeta({
  layout: false
})

// Form state
const authMode = ref('signin')
const email = ref('')
const password = ref('')
const fullName = ref('')

// Forgot password state
const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)

// Form validation
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => v.length >= 6 || 'Password must be at least 6 characters',
]

const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         /.+@.+\..+/.test(email.value) && 
         password.value.length >= 6
})

const handleEmailAuth = async () => {
  if (!isFormValid.value) return
  
  try {
    if (authMode.value === 'signin') {
      await authStore.signInWithEmail(email.value, password.value)
    } else {
      const result = await authStore.signUpWithEmail(email.value, password.value, fullName.value)
      
      if (result.needsConfirmation) {
        useToast().add({
          title: 'Check your email!',
          description: 'We sent you a confirmation link. Click it to activate your account.',
          icon: 'i-heroicons-envelope',
          timeout: 8000
        })
      }
    }
  } catch (error) {
    useToast().add({
      title: 'Authentication Error',
      description: error.message || 'Something went wrong. Please try again.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  }
}

const handleForgotPassword = async () => {
  if (!resetEmail.value) return
  
  resetLoading.value = true
  
  try {
    await authStore.resetPassword(resetEmail.value)
    
    useToast().add({
      title: 'Reset link sent!',
      description: 'Check your email for the password reset link.',
      icon: 'i-heroicons-check-circle'
    })
    
    showForgotPassword.value = false
    resetEmail.value = ''
  } catch (error) {
    useToast().add({
      title: 'Reset Error',
      description: error.message || 'Failed to send reset email. Please try again.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  } finally {
    resetLoading.value = false
  }
}

// Redirect if already authenticated
watchEffect(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/home')
  }
})
</script>

<style scoped>
.login-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mascot-container {
  display: inline-block;
  padding: 20px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.mascot {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

/* Vuetify overrides */
:deep(.v-btn-toggle) {
  width: 100%;
}

:deep(.v-btn-toggle .v-btn) {
  border-radius: 12px !important;
}

:deep(.v-text-field .v-field) {
  border-radius: 12px !important;
}

:deep(.v-btn) {
  border-radius: 12px !important;
}

@media (max-width: 600px) {
  .mascot {
    font-size: 36px;
  }
  
  .mascot-container {
    padding: 16px;
  }
  
  :deep(.v-card-text) {
    padding: 24px !important;
  }
}
</style>