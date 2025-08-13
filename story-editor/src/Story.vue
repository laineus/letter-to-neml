<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PropType } from 'vue'
import type { Story } from '../../src/story/types'
import StoryItem from './StoryItem.vue'
import StoryItemSummary from './StoryItemSummary.vue'
import Preview from './Preview.vue'
import { useStoryPlayer } from '../../src/components/Story.vue'

const props = defineProps({
  story: {
    type: Object as PropType<Story>,
    required: true
  }
})

const storyPlayer = useStoryPlayer([props.story])
const selectedIndex = ref<number>()
watch(selectedIndex, (newIndex) => {
  if (newIndex === undefined) return
  storyPlayer.storyItemIndex = newIndex
  storyPlayer.messageIndex = 0
})
const itemTypes = ['background', 'speakers', 'messages', 'sleep'] as const

const addItem = (index: number, type: typeof itemTypes[number]) => {
  let newItem: any
  switch (type) {
    case 'background':
      newItem = { type: 'background', image: '' }
      break
    case 'speakers':
      const prevSpeakers = props.story.list.slice(0, index).reverse().find(item => item.type === 'speakers')
      newItem = { type: 'speakers', list: prevSpeakers?.list || [] }
      break
    case 'messages':
      newItem = { type: 'messages', list: [] }
      break
    case 'sleep':
      newItem = { type: 'sleep', duration: 500 }
      break
  }
  props.story.list.splice(index, 0, newItem)
  selectedIndex.value = index
}

const removeItem = (index: number) => {
  props.story.list.splice(index, 1)
  selectedIndex.value = undefined
}

const moveItem = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= props.story.list.length) return
  
  const item = props.story.list[index]
  props.story.list.splice(index, 1)
  props.story.list.splice(newIndex, 0, item)
  selectedIndex.value = newIndex
}
</script>

<template>
  <div class="story-editor">
    <div class="story-header">
      <label>
        タイトル: <input type="text" v-model="story.title" placeholder="Title" />
      </label>
      <div v-if="story.if" class="condition">
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
    </div>
    <div class="story-items">
      <div class="add-item-section">
        <button v-for="type in itemTypes" :key="type" @click="addItem(0, type)" class="btn btn-add">
          + {{ type }}
        </button>
      </div>
      <div v-for="(item, index) in story.list" :key="index" class="story-item-container">
        <div class="story-item" :class="{ selected: selectedIndex === index }">
          <div class="item-header" @click="selectedIndex !== index ? selectedIndex = index : selectedIndex = undefined">
            <StoryItemSummary :item="item" />
            <div class="item-controls" @click.stop>
              <button @click.stop="moveItem(index, 'up')" :disabled="index === 0" class="btn">↑</button>
              <button @click.stop="moveItem(index, 'down')" :disabled="index === story.list.length - 1" class="btn">↓</button>
              <button @click.stop="removeItem(index)" class="btn btn-remove">×</button>
            </div>
          </div>
          <div v-if="selectedIndex === index" class="item-editor">
            <StoryItem :item="item" />
          </div>
        </div>
        <div class="add-item-section">
          <button v-for="type in itemTypes" :key="type" @click="addItem(index + 1, type)" class="btn btn-add">
            + {{ type }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <Preview :storyPlayer="storyPlayer" />
</template>

<style scoped>
.story-editor {
  max-width: 1200px;
  margin: 20px auto;
}

.story-header {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.story-header input {
  width: 100%;
  font-size: 18px;
  font-weight: 500;
}

.condition {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.condition select {
  min-width: 120px;
}

.story-items {
  margin-top: 20px;
}

.add-item-section {
  margin: 10px 0;
  display: flex;
  gap: 10px;
}

/* Button styles moved to common.css */

.story-item-container {
  margin: 10px 0;
}

.story-item {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.story-item.selected {
  border-color: #2196F3;
  box-shadow: 0 0 5px rgba(33, 150, 243, 0.3);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}


/* Control styles moved to common.css */

.item-editor {
  padding: 10px;
  border-top: 1px solid #eee;
}
</style>
