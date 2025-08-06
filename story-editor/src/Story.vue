<script setup lang="ts">
import type { PropType } from 'vue'
import type { Story } from '../../src/story/types'

defineProps({
  story: {
    type: Object as PropType<Story>,
    required: true
  }
})
</script>

<template>
  <div>
    タイトル: <input type="text" v-model="story.title" placeholder="Title" />
    <div v-if="story.if">
      条件:
      <select v-model="story.if!.id">
        <option :value="NaN">条件なし</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
      <select v-model="story.if!.resultId">
        <option :value="NaN">条件なし</option>
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <ul>
      <li v-for="(item, index) in story.list" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<style scoped>
</style>
