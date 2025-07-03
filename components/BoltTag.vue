<template>
  <div class="bolt-tag">
    <a 
      href="https://bolt.new" 
      target="_blank" 
      rel="noopener noreferrer"
      class="bolt-link"
    >
      <span class="bolt-icon">⚡</span>
      <span class="bolt-text">Made with Bolt.new</span>
    </a>
  </div>
</template>

<script setup>
// No script needed for this simple component
</script>

<style scoped>
.bolt-tag {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Fredoka', sans-serif;
}

.bolt-link {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.bolt-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.bolt-icon {
  font-size: 14px;
  animation: pulse 2s infinite;
}

.bolt-text {
  white-space: nowrap;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .bolt-tag {
    bottom: 100px; /* Account for mobile navigation */
    right: 16px;
  }
  
  .bolt-link {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .bolt-icon {
    font-size: 12px;
  }
}

/* Desktop adjustments when navigation is open */
@media (min-width: 769px) {
  .bolt-tag {
    right: 20px;
  }
}
</style>