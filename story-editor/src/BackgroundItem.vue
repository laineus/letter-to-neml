<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryBackground } from '../../src/story/types'
import assets from '../../src/assets.json'

defineProps({
  item: {
    type: Object as PropType<StoryBackground>,
    required: true
  }
})

const imageOptions = assets.image.map(([key]) => key)
</script>

<template>
  <div class="background-editor">
    <label>
      背景画像:
      <select v-model="item.image">
        <option v-for="image in imageOptions" :key="image" :value="image">
          {{ image }}
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.background-editor {
  padding: 10px;
}

/* Form styles moved to common.css */
</style>