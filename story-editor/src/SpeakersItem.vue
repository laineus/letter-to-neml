<script setup lang="ts">
import type { PropType } from 'vue'
import type { StorySpeakers } from '../../src/story/types'
import assets from '../../src/assets.json'

const props = defineProps({
  item: {
    type: Object as PropType<StorySpeakers>,
    required: true
  }
})

const imageOptions = assets.image.map(([key]) => key)

const addSpeaker = (index: number) => {
  props.item.list.splice(index, 0, { image: '', x: 0 })
}

const removeSpeaker = (index: number) => {
  props.item.list.splice(index, 1)
}

const moveSpeaker = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= props.item.list.length) return
  
  const speaker = props.item.list[index]
  props.item.list.splice(index, 1)
  props.item.list.splice(newIndex, 0, speaker)
}
</script>

<template>
  <div class="speakers-editor">
    <button @click="addSpeaker(0)" class="btn btn-add">+ Add</button>
    <div v-for="(speaker, index) in item.list" :key="index">
      <div class="editor-item">
        <div class="item-controls">
          <button @click="moveSpeaker(index, 'up')" :disabled="index === 0" class="btn">↑</button>
          <button @click="moveSpeaker(index, 'down')" :disabled="index === item.list.length - 1" class="btn">↓</button>
          <button @click="removeSpeaker(index)" class="btn btn-remove">×</button>
        </div>
        <label>
          画像:
          <select v-model="speaker.image">
            <option v-for="image in imageOptions" :key="image" :value="image">
              {{ image }}
            </option>
          </select>
        </label>
        <label>
          位置:
          <input type="number" v-model.number="speaker.x" min="0" max="1" step="0.05" />
        </label>
      </div>
      <button @click="addSpeaker(index + 1)" class="btn btn-add">+ Add</button>
    </div>
  </div>
</template>

<style scoped>
.speakers-editor {
  padding: 10px;
}
.editor-item {
  display: flex;
  align-items: center;
}
label + label {
  margin-left: 15px;
}

/* Styles moved to common.css */
</style>