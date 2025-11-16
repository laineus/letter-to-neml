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
  set: (index: number | undefined) => {
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
  const newStory: Story = { title: '', list: [], if: '' }
  stories.value.splice(index, 0, newStory)
}

const removeStory = (index: number) => {
  if (!stories.value) return
  stories.value.splice(index, 1)
}

const moveStory = (index: number, direction: 'up' | 'down') => {
  if (!stories.value) return
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= stories.value.length) return
  const story = stories.value[index]
  stories.value.splice(index, 1)
  stories.value.splice(newIndex, 0, story)
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
          <div class="story-item" @click="selectedStoryIndex = i">
            <div class="story-title">
              {{ story.title || 'Untitled Story' }}
            </div>
            <div class="item-controls" @click.stop>
              <button @click.stop="moveStory(i, 'up')" :disabled="i === 0" class="btn">↑</button>
              <button @click.stop="moveStory(i, 'down')" :disabled="i === stories.length - 1" class="btn">↓</button>
              <button @click.stop="removeStory(i)" class="btn btn-remove">×</button>
            </div>
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
  background: #1a237e;
  color: #90caf9;
  padding: 16px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 20px;
}

.story-item-wrapper {
  margin: 10px 0;
}

.story-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #252525;
  border: 1px solid #777;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.story-item:hover {
  background: #2d2d2d;
}

.story-title {
  flex: 1;
  padding: 5px;
  color: #e0e0e0;
}

.item-controls {
  display: flex;
  gap: 5px;
}
</style>
