<script setup lang="ts">
import type { StoryFade } from '../../src/story/types'

defineProps<{
  item: StoryFade
}>()

const durationOptions = [
  { label: '即時', value: 0 },
  { label: '高速', value: 300 },
  { label: '普通', value: 600 },
  { label: '低速', value: 1200 }
]
</script>

<template>
  <div class="fade-controls">
    <label>
      <select v-model="item.fade">
        <option value="in">暗転開始</option>
        <option value="out">暗転終了</option>
      </select>
    </label>
    <label>
      <select v-model.number="item.duration">
        <option v-for="opt in durationOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.fade-controls {
  padding: 10px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.fade-controls label {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fade-controls select {
  min-width: 120px;
}
</style>
