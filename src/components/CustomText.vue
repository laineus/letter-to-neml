<script setup lang="ts">
import { Text } from 'phavuer'
import { computed, ref, watch } from 'vue'
const props = defineProps<{
  text: string,
  style?: Partial<Phaser.Types.GameObjects.Text.TextStyle>
}>()
const mergedStyle = computed<Phaser.Types.GameObjects.Text.TextStyle>(() => {
  return {
    fontFamily: 'Hina Mincho',
    fontSize: 22,
    color: '#FFFFFF',
    ...props.style
  }
})
const revision = ref(0)
watch(() => props.text, text => {
  document.fonts.load('20px "Hina Mincho"', text).then(() => {
    revision.value++
  })
}, { immediate: true })
</script>

<template>
  <Text :text="text" :style="mergedStyle" :key="revision" />
</template>
