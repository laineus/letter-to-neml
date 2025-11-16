<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  target: number
}>()

const percentage = computed(() => {
  if (props.target === 0) return 0
  return Math.min((props.current / props.target) * 100, 100)
})

const isComplete = computed(() => props.current >= props.target)
</script>

<template>
  <div class="progress-indicator">
    <div class="progress-text">
      <span class="progress-label">進捗状況</span>
      <span class="progress-numbers" :class="{ complete: isComplete }">
        {{ percentage.toFixed(0) }}%
      </span>
    </div>
    <div class="progress-bar-container">
      <div 
        class="progress-bar" 
        :style="{ width: `${percentage}%` }"
        :class="{ complete: isComplete }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.progress-indicator {
  background: #252525;
  border: 1px solid #777;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 30px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-label {
  font-size: 16px;
  font-weight: 500;
}

.progress-numbers {
  font-size: 16px;
  font-weight: bold;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background: #1a1a1a;
  border: 1px solid #777;
  border-radius: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2e7d32, #4caf50);
  border-radius: 20px;
  transition: width 0.3s ease;
}
</style>
