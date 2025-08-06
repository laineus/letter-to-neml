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
  <header @click="selectedStory = undefined">StoryEditor</header>
  <div>
    <button @click="onSubmit">Submit</button>
    <StoryComponent v-if="selectedStory" :story="selectedStory" />
    <div v-else>
      <button @click="addStory(0)">＋</button>
      <div v-for="(story, i) in stories">
        <div @click="selectedStory = story">{{ story.title || 'Untitled Story' }}</div>
        <button @click="addStory(i + 1)">＋</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
