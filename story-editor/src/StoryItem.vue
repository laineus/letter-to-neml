<script setup lang="ts">
import type { PropType } from 'vue'
import type { StoryItem } from '../../src/story/types'
import BackgroundItem from './BackgroundItem.vue'
import SpeakersItem from './SpeakersItem.vue'
import MessagesItem from './MessagesItem.vue'
import SleepItem from './SleepItem.vue'
import FadeItem from './FadeItem.vue'
import IfItem from './IfItem.vue'
import EndIfItem from './EndIfItem.vue'
import FunctionItem from './FunctionItem.vue'

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
    <FadeItem v-else-if="item.type === 'fade'" :item="item" />
    <IfItem v-else-if="item.type === 'if'" :item="item" />
    <EndIfItem v-else-if="item.type === 'endIf'" :item="item" />
    <FunctionItem v-else-if="item.type === 'function'" :item="item" />
  </div>
</template>

<style scoped>
.story-item-editor {
}
</style>
