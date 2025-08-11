<script setup lang="ts">
import type { PropType } from 'vue'
import type { StorySleep } from '../../src/story/types'

defineProps({
  item: {
    type: Object as PropType<StorySleep>,
    required: true
  }
})
</script>

<template>
  <div class="sleep-item">
    <label>
      Duration (ms): 
      <input type="number" v-model.number="item.duration" min="0" step="100" />
    </label>
  </div>
</template>

<style scoped>
.sleep-item {
  padding: 10px;
}

.sleep-item label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sleep-item input {
  width: 150px;
}
</style>