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
  <div class="endif-item">
    条件分岐の終了
  </div>
</template>

<style scoped>
.endif-item {
  padding: 5px 10px;
  color: #999;
}
</style>