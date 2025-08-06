<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryMessages } from '../../src/story/types'

const props = defineProps({
  item: {
    type: Object as PropType<StoryMessages>,
    required: true
  }
})

const addMessage = (index: number) => {
  props.item.list.splice(index, 0, { name: '', text: '' })
}

const removeMessage = (index: number) => {
  props.item.list.splice(index, 1)
}

const moveMessage = (index: number, direction: 'up' | 'down') => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= props.item.list.length) return
  
  const message = props.item.list[index]
  props.item.list.splice(index, 1)
  props.item.list.splice(newIndex, 0, message)
}
</script>

<template>
  <div class="messages-editor">
    <button @click="addMessage(0)" class="btn btn-add">+ Add</button>
    <div v-for="(message, index) in item.list" :key="index">
      <div class="editor-item">
        <div class="item-controls">
          <button @click="moveMessage(index, 'up')" :disabled="index === 0" class="btn">↑</button>
          <button @click="moveMessage(index, 'down')" :disabled="index === item.list.length - 1" class="btn">↓</button>
          <button @click="removeMessage(index)" class="btn btn-remove">×</button>
        </div>
        <label>
          <input type="text" v-model="message.name" placeholder="キャラクター名" />
        </label>
        <label>
          <textarea v-model="message.text" placeholder="メッセージ内容" rows="3"></textarea>
        </label>
      </div>
      <button @click="addMessage(index + 1)" class="btn btn-add">+ Add</button>
    </div>
  </div>
</template>

<style scoped>
.messages-editor {
  padding: 10px;
}
textarea {
  width: 100%;
  resize: vertical;
}

/* Styles moved to common.css */
</style>