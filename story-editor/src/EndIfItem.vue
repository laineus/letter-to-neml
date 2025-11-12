<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryEndIf } from '../../src/story/types'

defineProps({
  item: {
    type: Object as PropType<StoryEndIf>,
    required: true
  }
})
</script>

<template>
  <div class="endif-item"></div>
</template>

<style scoped>
.endif-item {
}
</style>