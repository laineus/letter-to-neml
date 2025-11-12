<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryFunction } from '../../src/story/types'

defineProps({
  item: {
    type: Object as PropType<StoryFunction>,
    required: true
  }
})
</script>

<template>
  <div class="function-item">
    <input type="text" v-model="item.function" placeholder="関数名">
  </div>
</template>

<style scoped>
.function-item {
}
input {
  width: 100%;
}
</style>