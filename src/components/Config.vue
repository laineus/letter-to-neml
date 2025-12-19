<script setup lang="ts">
import { Container, Rectangle, useGame, FxBlur, useScene } from 'phavuer'
import CustomText from './CustomText.vue'
import { computed, ref } from 'vue'
import { save, state } from '../lib/state'
import config from '../lib/config'
import Button from './Button.vue'
import Slider from './Slider.vue'
import RadioList from './RadioList.vue'
import Dialog from './Dialog.vue'

defineEmits(['close'])
defineProps({
  showBackToTitle: { type: Boolean, default: true }
})

const game = useGame()
const scene = useScene()
const volume = computed({
  get: () => state.value.settings.volume * 100,
  set: (value: number) => {
    state.value.settings.volume = value / 100
    game.sound.volume = state.value.settings.volume
    save()
  }
})
const lang = computed({
  get: () => state.value.settings.lang,
  set: (value: string) => {
    state.value.settings.lang = value
    save()
  }
})

const confirmBackToTitle = ref(false)
const backToTitle = () => {
  scene.scene.start('TitleScene')
}
</script>

<template>
  <Container>
    <Rectangle :width="config.WIDTH" :height="config.HEIGHT" :origin="0" :fillAlpha="0" @pointerdown="null" />
    <Dialog
      v-if="confirmBackToTitle"
      title="確認"
      desc="タイトルに戻りますか？"
      :options="[{ text: 'OK', action: backToTitle }, { text: 'キャンセル', close: true }]"
      @close="confirmBackToTitle = false"
    />
    <Container v-else :x="config.WIDTH.half()" :y="config.HEIGHT.half()" :tween="{ alpha: { from: 0, to: 1 }, duration: 300 }">
      <Rectangle :width="500" :height="420" :fillColor="0x000000" :alpha="0.6" :origin="0.5" :radius="0">
        <FxBlur :strength="1.5" :quality="1" :steps="4" />
      </Rectangle>
      <CustomText :text="'設定'" :style="{ fontSize: 24, shadow: { blur: 10, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-160" />
      <CustomText :text="'BGM音量'" :style="{ fontSize: 19, shadow: { blur: 5, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-100" />
      <Slider :x="0" :y="-60" :origin="0.5" v-model="volume" :max="100" :min="0" :step="10" :width="230" />
      <CustomText :text="'Language'" :style="{ fontSize: 19, shadow: { blur: 5, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-20" />
      <RadioList :x="-100" :y="5" :list="[{ text: '日本語', value: 'ja' }, { text: 'English', value: 'en' }]" v-model="lang" />
      <Button v-if="showBackToTitle" :text="'Back to Title'" :size="15" :width="240" :x="0" :y="80" :origin="0.5" :outline="false" @click="confirmBackToTitle = true" />
      <Button :text="'OK'" :width="420" :x="0" :y="150" :origin="0.5" @click="$emit('close')" />
    </Container>
  </Container>
</template>
