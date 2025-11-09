<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Story } from '../../src/story/types.ts'
import StoryComponent from './Story.vue'
import Toast, { toastManager } from './Toast.vue'
import { useRouter } from 'vue-router'

const stories = ref<Story[]>()
const router = useRouter()
const selectedStoryIndex = computed({
  get: () => {
    return router.currentRoute.value.query.story ? Number(router.currentRoute.value.query.story) : undefined
  },
  set: (index: number) => {
    if (index === undefined) {
      router.push({ query: {} })
    } else {
      router.push({ query: { story: String(index) } })
    }
  }
})
const selectedStory = computed(() => {
  if (stories.value === undefined || selectedStoryIndex.value === undefined) return undefined
  return stories.value[selectedStoryIndex.value]
})

const loadStories = () => {
  fetch('/api')
    .then(response => response.json())
    .then(data => {
      data.forEach((story: any) => {
        if (!story.if) {
          story.if = { id: NaN, resultId: NaN }
        }
      })
      stories.value = data as Story[]
    })
    .catch(err => {
      toastManager.error('Failed to load stories')
      console.error('Error loading stories:', err)
    })
}
onMounted(() => {
  loadStories()
})

const onSubmit = () => {
  if (!stories.value) return
  fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stories.value)
  })
    .then(response => response.json())
    .then(() => {
      toastManager.success('Stories saved successfully!')
    })
    .catch(err => {
      toastManager.error('Failed to save stories')
      console.error('Error saving stories:', err)
    })
}
const addStory = (index: number) => {
  if (!stories.value) return
  const newStory: Story = { title: '', list: [], if: { id: NaN, resultId: NaN } }
  stories.value.splice(index, 0, newStory)
}
</script>

<template>
  <header class="app-header">
    <a href="#" @click="selectedStoryIndex = undefined">StoryEditor</a>
    <button v-if="stories" @click="onSubmit" class="btn btn-add">Save</button>
  </header>
  <div class="app-content">
    <div v-if="!stories" class="loading-message">
      Loading...
    </div>
    <div v-else>
      <StoryComponent v-if="selectedStory" :story="selectedStory" />
      <div v-else class="story-list">
        <button @click="addStory(0)" class="btn btn-add">+ Add Story</button>
        <div v-for="(story, i) in stories" :key="i" class="story-item-wrapper">
          <div class="story-title" :class="{ 'selected-story': selectedStory === story }" @click="selectedStoryIndex = i">
            {{ story.title || 'Untitled Story' }}
          </div>
          <button @click="addStory(i + 1)" class="btn btn-add">+ Add Story</button>
        </div>
      </div>
    </div>
  </div>
  <Toast />
</template>

<style scoped>
.app-content {
  padding: 20px;
}

.loading-message {
  background: #e3f2fd;
  color: #1976d2;
  padding: 16px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 20px;
}
</style>
