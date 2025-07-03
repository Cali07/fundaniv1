<template>
  <v-app>
    <!-- Bottom Navigation for Mobile -->
    <v-bottom-navigation
        v-if="authStore.isAuthenticated && isMobile"
        v-model="activeTab"
        color="primary"
        grow
        fixed
        height="80"
        class="mobile-nav"
    >
      <v-btn to="/home" value="home" class="nav-btn">
        <v-icon size="20">mdi-home</v-icon>
        <span class="nav-label">Home</span>
      </v-btn>

      <v-btn to="/tutor-call" value="aitutor" class="nav-btn">
        <v-icon size="20">mdi-robot</v-icon>
        <span class="nav-label">AI Tutor</span>
      </v-btn>

      <v-btn to="/progress" value="progress" class="nav-btn">
        <v-icon size="20">mdi-chart-line</v-icon>
        <span class="nav-label">Progress</span>
      </v-btn>

      <v-btn to="/avatar" value="avatar" class="nav-btn">
        <v-icon size="20">mdi-account</v-icon>
        <span class="nav-label">Avatar</span>
      </v-btn>

      <v-btn to="/flashcard-generator" value="flashcards" class="nav-btn">
        <v-icon size="20">mdi-cards</v-icon>
        <span class="nav-label">Cards</span>
      </v-btn>
    </v-bottom-navigation>

    <!-- Side Navigation for Desktop -->
    <v-navigation-drawer
        v-if="authStore.isAuthenticated && !isMobile"
        v-model="desktopNavOpen"
        :rail="!desktopNavExpanded"
        :permanent="false"
        color="surface"
        :width="desktopNavExpanded ? 280 : 72"
        class="desktop-nav"
        elevation="2"
        @click="handleNavClick"
    >
      <!-- Toggle Button -->
      <div class="nav-toggle-container">
        <v-btn
            @click="toggleDesktopNav"
            :icon="desktopNavExpanded ? 'mdi-chevron-left' : 'mdi-menu'"
            size="small"
            variant="text"
            class="nav-toggle-btn"
        />
      </div>

      <!-- User Profile Section -->
      <div v-if="desktopNavExpanded" class="user-profile">
        <v-list-item
            class="user-info"
            prepend-avatar="🦋"
            :title="authStore.userDisplayName || 'Student'"
            :subtitle="`Level ${progressStore.level} Explorer`"
        >
          <template #append>
            <v-chip
                size="small"
                color="primary"
                variant="elevated"
            >
              {{ progressStore.totalXP }} XP
            </v-chip>
          </template>
        </v-list-item>
        
        <!-- XP Progress Bar -->
        <div class="xp-progress">
          <v-progress-linear
              :model-value="progressStore.levelProgress"
              color="primary"
              height="6"
              rounded
              class="mb-2"
          />
          <div class="progress-text">
            <span class="text-caption">{{ progressStore.levelProgress }}% to next level</span>
          </div>
        </div>
      </div>

      <!-- Collapsed User Profile -->
      <div v-else class="user-profile-collapsed">
        <v-avatar
            size="40"
            class="mx-auto mb-2"
        >
          🦋
        </v-avatar>
        <div class="text-center">
          <v-chip
              size="x-small"
              color="primary"
              variant="elevated"
              class="xp-chip-small"
          >
            {{ progressStore.totalXP }}
          </v-chip>
        </div>
      </div>

      <v-divider class="my-4" />

      <!-- Navigation Menu -->
      <v-list density="comfortable" nav>
        <v-list-item
            to="/home"
            prepend-icon="mdi-home"
            :title="desktopNavExpanded ? 'Home' : ''"
            value="home"
            class="nav-item"
        >
          <v-tooltip
              v-if="!desktopNavExpanded"
              activator="parent"
              location="end"
          >
            Home
          </v-tooltip>
        </v-list-item>

        <v-list-item
            to="/progress"
            prepend-icon="mdi-chart-line"
            :title="desktopNavExpanded ? 'Progress' : ''"
            value="progress"
            class="nav-item"
        >
          <v-tooltip
              v-if="!desktopNavExpanded"
              activator="parent"
              location="end"
          >
            Progress
          </v-tooltip>
        </v-list-item>

        <v-list-item
            to="/tutor-call"
            prepend-icon="mdi-robot"
            :title="desktopNavExpanded ? 'AI Tutor' : ''"
            value="aitutor"
            class="nav-item"
        >
          <v-tooltip
              v-if="!desktopNavExpanded"
              activator="parent"
              location="end"
          >
            AI Tutor
          </v-tooltip>
        </v-list-item>

        <v-list-item
            to="/avatar"
            prepend-icon="mdi-account"
            :title="desktopNavExpanded ? 'Avatar' : ''"
            value="avatar"
            class="nav-item"
        >
          <v-tooltip
              v-if="!desktopNavExpanded"
              activator="parent"
              location="end"
          >
            Avatar
          </v-tooltip>
        </v-list-item>

        <v-list-item
            to="/flashcard-generator"
            prepend-icon="mdi-cards"
            :title="desktopNavExpanded ? 'Flashcards' : ''"
            value="flashcards"
            class="nav-item"
        >
          <v-tooltip
              v-if="!desktopNavExpanded"
              activator="parent"
              location="end"
          >
            Flashcards
          </v-tooltip>
        </v-list-item>

        <v-list-item
            to="/my-flashcards"
            prepend-icon="mdi-book-open"
            :title="desktopNavExpanded ? 'My Sets' : ''"
            value="my-sets"
            class="nav-item"
        >
          <v-tooltip
              v-if="!desktopNavExpanded"
              activator="parent"
              location="end"
          >
            My Sets
          </v-tooltip>
        </v-list-item>
      </v-list>

      <!-- Bottom Section -->
      <template #append>
        <v-divider class="mb-4" />
        <v-list density="comfortable">
          <v-list-item
              @click="authStore.signOut"
              prepend-icon="mdi-logout"
              :title="desktopNavExpanded ? 'Sign Out' : ''"
              class="text-error nav-item"
          >
            <v-tooltip
                v-if="!desktopNavExpanded"
                activator="parent"
                location="end"
            >
              Sign Out
            </v-tooltip>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- Top App Bar for Mobile -->
    <v-app-bar
        v-if="authStore.isAuthenticated && isMobile"
        color="primary"
        elevation="0"
        height="64"
        class="mobile-header"
    >
      <template #prepend>
        <div class="user-avatar">🦋</div>
      </template>
      
      <v-app-bar-title class="mobile-title">
        {{ getPageTitle }}
      </v-app-bar-title>

      <template #append>
        <v-btn 
            icon="mdi-logout" 
            @click="authStore.signOut"
            size="small"
            variant="text"
        />
      </template>
    </v-app-bar>

    <!-- Desktop Header with Nav Toggle -->
    <v-app-bar
        v-if="authStore.isAuthenticated && !isMobile"
        color="transparent"
        elevation="0"
        height="64"
        class="desktop-header"
    >
      <template #prepend>
        <v-btn
            @click="toggleDesktopNav"
            :icon="desktopNavOpen ? 'mdi-menu-open' : 'mdi-menu'"
            variant="text"
            class="nav-toggle-main"
        />
      </template>
      
      <v-app-bar-title class="desktop-title">
        {{ getPageTitle }}
      </v-app-bar-title>

      <template #append>
        <v-btn 
            icon="mdi-logout" 
            @click="authStore.signOut"
            size="small"
            variant="text"
        />
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main :class="mainContentClasses">
      <div class="main-content">
        <slot />
      </div>
    </v-main>

    <!-- Bolt.new Tag -->
    <BoltTag />

    <!-- Toast Notifications -->
    <UNotifications />
  </v-app>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const authStore = useAuthStore()
const progressStore = useProgressStore()
const route = useRoute()
const { mobile } = useDisplay()

// Navigation state
const desktopNavOpen = ref(true)
const desktopNavExpanded = ref(true)

// Reactive computed properties
const isMobile = computed(() => mobile.value)

const activeTab = computed(() => {
  const path = route.path
  if (path.includes('progress')) return 'progress'
  if (path.includes('avatar')) return 'avatar'
  if (path.includes('flashcard')) return 'flashcards'
  if (path.includes('tutor-call')) return 'aitutor'
  return 'home'
})

const getPageTitle = computed(() => {
  const path = route.path
  if (path.includes('progress')) return 'Progress'
  if (path.includes('avatar')) return 'Avatar'
  if (path.includes('flashcard')) return 'Flashcards'
  if (path.includes('tutor-call')) return 'AI Tutor'
  if (path.includes('home')) return 'Home'
  return 'Quested Ed'
})

const mainContentClasses = computed(() => ({
  'with-mobile-nav': authStore.isAuthenticated && isMobile.value,
  'with-desktop-nav': authStore.isAuthenticated && !isMobile.value && desktopNavOpen.value,
  'with-desktop-nav-collapsed': authStore.isAuthenticated && !isMobile.value && desktopNavOpen.value && !desktopNavExpanded.value,
  'without-desktop-nav': authStore.isAuthenticated && !isMobile.value && !desktopNavOpen.value
}))

// Navigation methods
const toggleDesktopNav = () => {
  if (!desktopNavOpen.value) {
    desktopNavOpen.value = true
    desktopNavExpanded.value = true
  } else if (desktopNavExpanded.value) {
    desktopNavExpanded.value = false
  } else {
    desktopNavOpen.value = false
  }
}

const handleNavClick = () => {
  if (!desktopNavExpanded.value) {
    desktopNavExpanded.value = true
  }
}

onMounted(() => {
  authStore.initAuth()
})
</script>

<style scoped>
/* Main Content Styling */
.main-content {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
  transition: all 0.3s ease;
}

/* Mobile Layout */
.main-content.with-mobile-nav {
  padding-top: 80px; /* Account for app bar */
  padding-bottom: 96px; /* Account for bottom nav */
  min-height: calc(100vh - 176px);
}

/* Desktop Layout */
.main-content.with-desktop-nav {
  padding: 24px;
  padding-top: 88px; /* Account for desktop header */
  margin-left: 280px;
  transition: margin-left 0.3s ease;
}

.main-content.with-desktop-nav-collapsed {
  padding: 24px;
  padding-top: 88px;
  margin-left: 72px;
  transition: margin-left 0.3s ease;
}

.main-content.without-desktop-nav {
  padding: 24px;
  padding-top: 88px;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

/* Navigation Toggle */
.nav-toggle-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
}

.nav-toggle-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.nav-toggle-btn:hover {
  opacity: 1;
}

.nav-toggle-main {
  margin-left: -8px;
}

/* User Profile Section */
.user-profile {
  padding: 16px;
  background: rgba(var(--v-theme-primary), 0.05);
  margin: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.user-profile-collapsed {
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.xp-chip-small {
  font-size: 10px !important;
  height: 20px !important;
  min-width: 30px !important;
}

.user-info {
  padding: 0;
}

.xp-progress {
  margin-top: 12px;
  padding: 0 16px;
}

.progress-text {
  display: flex;
  justify-content: center;
  margin-top: 4px;
}

/* Navigation Items */
.nav-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

/* Mobile Navigation */
.mobile-nav {
  border-radius: 20px 20px 0 0 !important;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.nav-btn {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  height: 100% !important;
  min-width: 60px !important;
}

.nav-label {
  font-size: 10px !important;
  font-weight: 500 !important;
  line-height: 1 !important;
}

/* Mobile Header */
.mobile-header {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-primary), 0.95) !important;
}

/* Desktop Header */
.desktop-header {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8) !important;
  border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
}

.user-avatar {
  font-size: 24px;
  margin-right: 8px;
}

.mobile-title, .desktop-title {
  font-weight: 600;
  font-size: 18px;
}

/* Desktop Navigation */
.desktop-nav {
  border-right: 1px solid rgba(var(--v-theme-surface-variant), 0.3);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  transition: width 0.3s ease, transform 0.3s ease;
}

/* Responsive Breakpoints */
@media (max-width: 600px) {
  .main-content {
    padding: 12px;
  }
  
  .main-content.with-mobile-nav {
    padding: 12px;
    padding-top: 76px;
    padding-bottom: 92px;
  }
  
  .nav-label {
    font-size: 9px !important;
  }
  
  .user-profile {
    margin: 12px;
    padding: 12px;
  }
}

@media (max-width: 960px) {
  .main-content.with-desktop-nav {
    margin-left: 240px;
  }
  
  .main-content.with-desktop-nav-collapsed {
    margin-left: 72px;
  }
  
  .main-content.with-desktop-nav,
  .main-content.with-desktop-nav-collapsed,
  .main-content.without-desktop-nav {
    padding: 16px;
    padding-top: 88px;
  }
}

@media (min-width: 1264px) {
  .main-content.with-desktop-nav,
  .main-content.with-desktop-nav-collapsed,
  .main-content.without-desktop-nav {
    padding: 32px;
    padding-top: 96px;
  }
  
  .user-profile {
    margin: 20px;
    padding: 20px;
  }
}

/* Override Vuetify styles */
:deep(.v-bottom-navigation) {
  border-radius: 20px 20px 0 0 !important;
}

:deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}

:deep(.v-list-item__prepend > .v-icon) {
  opacity: 0.8;
}

:deep(.v-list-item--active .v-list-item__prepend > .v-icon) {
  opacity: 1;
  color: rgb(var(--v-theme-primary));
}

:deep(.v-app-bar-title__content) {
  font-family: 'Fredoka', sans-serif;
}

/* Animation for smooth transitions */
.v-navigation-drawer,
.v-bottom-navigation,
.v-app-bar {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Tooltip styling */
:deep(.v-tooltip > .v-overlay__content) {
  background: rgba(var(--v-theme-surface), 0.9);
  color: rgb(var(--v-theme-on-surface));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
}
</style>