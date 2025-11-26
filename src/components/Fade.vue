<script setup lang="ts">
import { Rectangle, useScene, type Phavuer } from 'phavuer'
import { computed, watch, type PropType } from 'vue'
import config from '../lib/config'
import type { StoryFade } from '../story/types'

const emit = defineEmits(['end'])
const props = defineProps({
  fade: {
    type: Object as PropType<StoryFade>,
    required: true
  }
})

const scene = useScene()

watch(() => props.fade, (newFade, oldFade) => {
  if (newFade === oldFade) return
  scene.time.addEvent({
    delay: newFade.duration,
    callback: () => {
      emit('end')
    }
  })
}, { immediate: true })
const tween = computed<Phavuer.TweenConfig>(() => {
  return {
    duration: props.fade.duration,
    props: {
      alpha: props.fade.fade === 'in'
      ? { from: 0, to: 1 }
      : { from: 1, to: 0 }
    },
    ease: 'Linear'
  }
})
</script>

<template>
  <Rectangle 
    :width="config.WIDTH" 
    :height="config.HEIGHT" 
    :origin="0"
    :fillColor="0x000000"
    :alpha="fade.fade === 'in' ? 0 : 1"
    :tween="tween"
  />
</template>
