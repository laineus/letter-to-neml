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

const imageOptions = assets.image.map(([key]) => key).filter(v => v.startsWith('bg/'))
</script>

<template>
  <div class="background-editor">
    <select v-model="item.image">
      <option v-for="image in imageOptions" :key="image" :value="image">
        {{ image }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.background-editor {
  padding: 10px;
}
</style>