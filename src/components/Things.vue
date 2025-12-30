<script lang="ts">
import { Container } from 'phavuer'
import ThingComponent from './Thing.vue'
import type { PropType } from 'vue'
import type { Thing } from '../story/types'
import { useGamePad } from '../lib/gamePad'
import { useUISound } from '../lib/se'
</script>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits(['select', 'unfocus'])
const props = defineProps({
  visible: { type: Boolean, default: true },
  focus: { type: Boolean, default: false },
  things: { type: Array as PropType<Thing[]>, required: true }
})

const se = useUISound()

watch(() => props.focus, (newFocus) => {
  if (newFocus) {
    selectedThingId.value = findRightTopMost()?.id
  }
})
const gamePad = useGamePad()
const findRightTopMost = () => {
  if (props.things.length === 0) return undefined
  return findClosestThing({ x: 1, y: 0 }, 'down')
}
const findClosestThing = (currentThing: Thing | { x: number, y: number }, direction: 'up' | 'down' | 'left' | 'right'): Thing | undefined => {
  const candidates = props.things.filter(thing => {
    if ('id' in currentThing && thing.id === currentThing.id) return false
    const dx = thing.x - currentThing.x
    const dy = thing.y - currentThing.y
    if (direction === 'up' && dy >= 0) return false
    if (direction === 'down' && dy <= 0) return false
    if (direction === 'left' && dx >= 0) return false
    if (direction === 'right' && dx <= 0) return false
    return true
  })
  if (candidates.length === 0) return undefined
  // 距離が最も近いものを選択
  return candidates.reduce((closest, thing) => {
    const dx = thing.x - currentThing.x
    const dy = thing.y - currentThing.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const closestDx = closest.x - currentThing.x
    const closestDy = closest.y - currentThing.y
    const closestDistance = Math.sqrt(closestDx * closestDx + closestDy * closestDy)
    return distance < closestDistance ? thing : closest
  })
}
gamePad.onPress(key => {
  if (!props.focus) return
  if (!props.visible) return
  if (key === 'a') {
    if (selectedThingId.value) {
      const thing = props.things.find(t => t.id === selectedThingId.value)
      if (thing) {
        emit('select', thing)
      }
    }
  } else if (key === 'b') {
    selectedThingId.value = undefined
    emit('unfocus')
    se.cancel()
  } else if (key === 'up' || key === 'down' || key === 'left' || key === 'right') {
    se.select()
    if (selectedThingId.value === undefined) {
      // 最初の選択
      if (props.things.length > 0) {
        selectedThingId.value = props.things[0].id
      }
    } else {
      const currentThing = props.things.find(t => t.id === selectedThingId.value)
      if (currentThing) {
        const nextThing = findClosestThing(currentThing, key)
        if (nextThing) {
          selectedThingId.value = nextThing.id
          return
        }
        if (key === 'right' || key === 'up') {
          selectedThingId.value = undefined
          emit('unfocus')
        }
      }
    }
  }
})
gamePad.onDeactivate(() => {
  selectedThingId.value = undefined
})
const selectedThingId = ref<string | undefined>(gamePad.active ? findRightTopMost()?.id : undefined)
</script>

<template>
  <Container :depth="2000" :visible>
    <ThingComponent v-for="thing in things" :key="thing.name" :thing="thing" :active="selectedThingId === thing.id" @pointerdown="$emit('select', thing)" />
  </Container>
</template>
