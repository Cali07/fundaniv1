<template>
  <v-app>
    <v-main class="reset-main">
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card class="reset-card" elevation="12" rounded="xl">
              <v-card-text class="pa-8">
                <!-- Icon -->
                <div class="text-center mb-6">
                  <div class="icon-container">
                    <v-icon size="64" color="primary">mdi-lock-reset</v-icon>
                  </div>
                </div>

                <!-- Title -->
                <div class="text-center mb-6">
                  <h1 class="text-h4 font-weight-bold text-primary mb-2">
                    Reset Your Password
                  </h1>
                  <p class="text-subtitle-1 text-medium-emphasis">
                    Enter your new password below
                  </p>
                </div>

                <!-- Reset Form -->
                <v-form @submit.prevent="handlePasswordReset" class="mb-4">
                  <v-text-field
                    v-model="newPassword"
                    label="New Password"
                    type="password"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    class="mb-3"
                    density="comfortable"
                    rounded
                    required
                    :rules="passwordRules"
                  />
                  
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    prepend-inner-icon="mdi-lock-check"
                    variant="outlined"
                    class="mb-4"
                    density="comfortable"
                    rounded
                    required
                    :rules="confirmPasswordRules"
                  />

                  <v-btn
                    type="submit"
                    :loading="loading"
                    :disabled="!isPasswordValid"
                    color="primary"
                    size="large"
                    block
                    class="mb-4"
                    rounded
                  >
                    <v-icon start>mdi-check</v-icon>
                    Update Password
                  </v-btn>
                </v-form>

                <!-- Back to Login -->
                <div class="text-center">
                  <v-btn
                    to="/login"
                    variant="text"
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                  >
                    Back to Login
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Toast Notifications -->
    <UNotifications />
  </v-app>
</template>

<script setup>
const authStore = useAuthStore()

definePageMeta({
  layout: false
})

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)

// Form validation
const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => v.length >= 6 || 'Password must be at least 6 characters',
]

const confirmPasswordRules = [
  (v) => !!v || 'Please confirm your password',
  (v) => v === newPassword.value || 'Passwords do not match',
]

const isPasswordValid = computed(() => {
  return newPassword.value.length >= 6 && 
         newPassword.value === confirmPassword.value
})

const handlePasswordReset = async () => {
  if (!isPasswordValid.value) {
    useToast().add({
      title: 'Password Error',
      description: 'Passwords must be at least 6 characters and match.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
    return
  }

  loading.value = true
  
  try {
    await authStore.updatePassword(newPassword.value)
    
    useToast().add({
      title: 'Password Updated!',
      description: 'Your password has been successfully updated.',
      icon: 'i-heroicons-check-circle'
    })
    
    // Redirect to home after successful password reset
    setTimeout(() => {
      navigateTo('/home')
    }, 2000)
    
  } catch (error) {
    useToast().add({
      title: 'Update Error',
      description: error.message || 'Failed to update password. Please try again.',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.reset-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.icon-container {
  display: inline-block;
  padding: 20px;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

/* Vuetify overrides */
:deep(.v-text-field .v-field) {
  border-radius: 12px !important;
}

:deep(.v-btn) {
  border-radius: 12px !important;
}

@media (max-width: 600px) {
  :deep(.v-card-text) {
    padding: 24px !important;
  }
}
</style>