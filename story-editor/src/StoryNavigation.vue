<script setup lang="ts">
defineProps<{
  currentIndex: number
  total: number
}>()

const emit = defineEmits<{
  navigate: [index: number]
}>()
</script>

<template>
  <div class="story-navigation">
    <a 
      v-if="currentIndex > 0" 
      href="#" 
      @click.prevent="emit('navigate', currentIndex - 1)"
      class="nav-link"
    >
      ← 前のストーリー
    </a>
    <span v-else class="nav-link disabled">← 前のストーリー</span>
    <span class="nav-info">{{ currentIndex + 1 }} / {{ total }}</span>
    <a 
      v-if="currentIndex < total - 1" 
      href="#" 
      @click.prevent="emit('navigate', currentIndex + 1)"
      class="nav-link"
    >
      次のストーリー →
    </a>
    <span v-else class="nav-link disabled">次のストーリー →</span>
  </div>
</template>

<style scoped>
.story-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-link {
  color: #388e3c;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-link.disabled {
  color: #666;
  cursor: not-allowed;
}

.nav-info {
  color: #b0b0b0;
  font-size: 14px;
  font-weight: 500;
}
</style>
