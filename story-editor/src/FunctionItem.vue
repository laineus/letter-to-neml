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
    <label>
      関数名:
      <input type="text" v-model="item.function" placeholder="関数名">
    </label>
    <label>
      引数:
      <input type="text" v-model="item.argument" placeholder="引数（オプション）">
    </label>
  </div>
</template>

<style scoped>
.function-item {
  display: flex;
  flex-direction: column;
}
label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
input {
  width: 100%;
}
</style>