<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryItem } from '../../src/story/types'
import BackgroundItem from './BackgroundItem.vue'
import SpeakersItem from './SpeakersItem.vue'
import MessagesItem from './MessagesItem.vue'
import SleepItem from './SleepItem.vue'

defineProps({
  item: {
    type: Object as PropType<StoryItem>,
    required: true
  }
})
</script>

<template>
  <div class="story-item-editor">
    <BackgroundItem v-if="item.type === 'background'" :item="item" />
    <SpeakersItem v-else-if="item.type === 'speakers'" :item="item" />
    <MessagesItem v-else-if="item.type === 'messages'" :item="item" />
    <SleepItem v-else-if="item.type === 'sleep'" :item="item" />
  </div>
</template>

<style scoped>
.story-item-editor {
}
</style>
