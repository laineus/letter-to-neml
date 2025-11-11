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
    <div class="form-group">
      <label>
        ID:
        <select v-model="item.id">
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
    </div>
    <div class="form-group">
      <label>
        結果ID:
        <select v-model="item.resultId">
          <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scoped>
.if-item {
  display: flex;
  gap: 20px;
  align-items: center;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-group select {
  min-width: 80px;
}
</style>