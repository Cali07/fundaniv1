<template>
  <div class="tutor-call-container">
    <div v-if="conversationUrl" class="video-container">
      <iframe
        :src="conversationUrl"
        allow="camera; microphone; fullscreen; display-capture"
        width="100%"
        height="100%"
        style="border: 0;"
      ></iframe>
    </div>
    <div v-else class="loading">
      <div class="loading-content">
        <h1>🚀 AI Tutor Session</h1>
        <p>Setting up your AI tutor session...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 🔐 ENV Keys from Nuxt config
const config = useRuntimeConfig()
const TAVUS_API_KEY = config.public.tavusApiKey
const TAVUS_REPLICA_ID = config.public.tavusReplicaId
const TAVUS_PERSONA_ID = config.public.tavusPersonaId

// 🔗 Conversation URL
const conversationUrl = ref('')
const conversationId = ref('')

// ✅ Create Tavus Conversation
const createTavusConversation = async () => {
  try {
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'x-api-key': TAVUS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        replica_id: TAVUS_REPLICA_ID,
        persona_id: TAVUS_PERSONA_ID
      })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to create conversation')
    }
    
    const data = await response.json()
    conversationId.value = data.conversation_id
    conversationUrl.value = data.conversation_url
    console.log('✅ Tavus Conversation Created:', data)
  } catch (err) {
    console.error('Error creating conversation:', err)
    alert(`Failed to start session: ${err.message}`)
  }
}

// 🔥 Start on mount
onMounted(() => {
  createTavusConversation()
})
</script>

<style scoped>
.tutor-call-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.video-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.loading-content {
  text-align: center;
}

.loading-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.loading-content p {
  font-size: 1.2rem;
  opacity: 0.9;
}
</style>