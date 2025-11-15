<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryItem } from '../../src/story/types'

const props = defineProps({
  item: {
    type: Object as PropType<StoryItem>,
    required: true
  }
})

const getSummary = (item: StoryItem): string => {
  switch (item.type) {
    case 'background':
      return item.image
    case 'speakers':
      return item.list.map(v => `${v.image} (${v.x}, ${v.facing === 'left' ? '←' : '→'})`).join(', ')
    case 'messages':
      const firstMsg = item.list[0]
      if (!firstMsg) return ''
      return `${firstMsg.name}: ${firstMsg.text.slice(0, 20)}${firstMsg.text.length > 20 ? '...' : ''}`
    case 'sleep':
      return `${item.duration}ms`
    case 'if':
      return item.if
    case 'endIf':
      return ''
    case 'function':
      return item.function
  }
}
const labels = {
  background: '背景',
  speakers: 'キャラ',
  messages: '台詞',
  sleep: 'ウェイト',
  if: '条件分岐',
  endIf: '分岐終了',
  function: '関数'
}
</script>

<template>
  <div class="story-item-summary">
    <span class="item-type">{{ labels[item.type] }}</span>
    <span class="item-content">{{ getSummary(item) }}</span>
  </div>
</template>

<style scoped>
.story-item-summary {
  display: flex;
  gap: 10px;
  align-items: center;
}

.item-type {
  min-width: 4.3em;
}

.item-content {
  margin-right: 10px;
  color: #999;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>