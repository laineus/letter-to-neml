<script setup lang="ts">
import { computed, type PropType } from 'vue'
import type { StoryEndIf, StoryIf } from '../../src/story/types'

const props = defineProps({
  item: {
    type: Object as PropType<StoryIf | StoryEndIf>,
    required: true
  }
})
const type = computed<'if' | 'endIf'>({
  get: () => {
    return props.item.type
  },
  set: (v: 'if' | 'endIf') => {
    props.item.type = v
    if (v === 'if') {
      // @ts-ignore
      props.item.if = ''
    } else {
      // @ts-ignore
      delete props.item.if
    }
  }
})
</script>

<template>
  <div class="if-item">
    <select v-model="type">
      <option value="if">分岐開始</option>
      <option value="endIf">分岐終了</option>
    </select>
    <input v-if="item.type === 'if'" type="text" v-model="item.if" placeholder="条件名">
  </div>
</template>

<style scoped>
.if-item {
}
input {
  width: 100%;
}
</style>