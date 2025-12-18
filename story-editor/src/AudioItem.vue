<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryAudio } from '../../src/story/types'
import assets from '../../src/assets.json'

defineProps({
  item: {
    type: Object as PropType<StoryAudio>,
    required: true
  }
})

const audioOptions = assets.audio.map(([key]) => key)
const bgmOptions = audioOptions.filter(v => v.startsWith('bgm/'))
const seOptions = audioOptions.filter(v => v.startsWith('se/'))
</script>

<template>
  <div class="audio-editor">
    <label>
      <span>タイプ:</span>
      <select v-model="item.audioType">
        <option value="bgm">BGM</option>
        <option value="se">SE</option>
      </select>
    </label>
    <label>
      <span>オーディオ:</span>
      <select v-model="item.audio">
        <option value="">停止</option>
        <template v-if="item.audioType === 'bgm'">
          <option v-for="audio in bgmOptions" :key="audio" :value="audio">
            {{ audio }}
          </option>
        </template>
        <template v-else>
          <option v-for="audio in seOptions" :key="audio" :value="audio">
            {{ audio }}
          </option>
        </template>
      </select>
    </label>
  </div>
</template>

<style scoped>
.audio-editor {
  padding: 10px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.audio-editor label {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.audio-editor select {
  min-width: 200px;
}

.audio-editor span {
  font-weight: 500;
}
</style>
