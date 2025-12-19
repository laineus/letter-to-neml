<script setup lang="ts">
import { Container, Rectangle, useGame, FxBlur } from 'phavuer'
import CustomText from './CustomText.vue'
import { computed } from 'vue'
import { save, state } from '../lib/state'
import config from '../lib/config'
import Button from './Button.vue'
import Slider from './Slider.vue'

defineEmits(['back'])
const game = useGame()
const volume = computed({
  get: () => state.value.settings.volume * 100,
  set: (value: number) => {
    state.value.settings.volume = value / 100
    game.sound.volume = state.value.settings.volume
    save()
  }
})
</script>

<template>
  <Container :x="config.WIDTH.half()" :y="config.HEIGHT.half()">
    <Rectangle :width="400" :height="400" :fillColor="0x000000" :alpha="0.6" :origin="0.5" :radius="0">
      <FxBlur :strength="1.5" :quality="1" :steps="4" />
    </Rectangle>
    <CustomText :text="'設定'" :style="{ fontSize: 24, shadow: { blur: 10, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-140" />
    <CustomText :text="'BGM音量'" :style="{ fontSize: 19, shadow: { blur: 5, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-40" />
    <Slider :x="0" :y="0" :origin="0.5" v-model="volume" :max="100" :min="0" :step="10" :width="310" />
    <Button :text="'Back'" :x="0" :y="140" :origin="0.5" @click="$emit('back')" />
  </Container>
</template>
