<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryIf } from '../../src/story/types'

defineProps({
  item: {
    type: Object as PropType<StoryIf>,
    required: true
  }
})
</script>

<template>
  <div class="if-item">
    <input type="text" v-model="item.if" placeholder="条件名">
  </div>
</template>

<style scoped>
.if-item {
}
input {
  width: 100%;
}
</style>