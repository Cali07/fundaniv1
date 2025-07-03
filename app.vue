<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>

<script setup>
// Initialize auth on app start
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})
</script>