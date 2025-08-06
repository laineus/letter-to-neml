<script setup lang="ts">
import { ref } from 'vue'
import storiesJson from '../../src/story/story.json' with { type: 'json' }
import type { Story } from '../../src/story/types.ts'
import StoryComponent from './Story.vue'
const stories = ref(storiesJson as Story[])
stories.value.forEach(story => {
  if (!story.if) {
    story.if = { id: NaN, resultId: NaN }
  }
})

const onSubmit = () => {
  stories.value.forEach(story => {
    if (!story.if?.id || !story.if?.resultId) {
      delete story.if
    }
  })
  fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stories.value)
  })
}
const selectedStory = ref<Story>()
const addStory = (index: number) => {
  const newStory: Story = { title: '', list: [], if: { id: NaN, resultId: NaN } }
  stories.value.splice(index, 0, newStory)
}
</script>

<template>
  <header class="app-header" @click="selectedStory = undefined">StoryEditor</header>
  <div class="app-content">
    <div class="button-group">
      <button @click="onSubmit" class="btn btn-add">Save</button>
    </div>
    <StoryComponent v-if="selectedStory" :story="selectedStory" />
    <div v-else class="story-list">
      <button @click="addStory(0)" class="btn btn-add">+ Add Story</button>
      <div v-for="(story, i) in stories" :key="i" class="story-item-wrapper">
        <div class="story-title" :class="{ 'selected-story': selectedStory === story }" @click="selectedStory = story">
          {{ story.title || 'Untitled Story' }}
        </div>
        <button @click="addStory(i + 1)" class="btn btn-add">+ Add Story</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-content {
  padding: 20px;
}
</style>
