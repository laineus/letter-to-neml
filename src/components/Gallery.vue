<script setup lang="ts">
import { Container, Rectangle, Image } from 'phavuer'
import CustomText from './CustomText.vue'
import { computed, ref, type ComputedRef } from 'vue'
import { state } from '../lib/state'
import config from '../lib/config'
import Button from './Button.vue'

defineEmits(['back'])

type EndingData = {
  title: ComputedRef<string>
  image: string
  storyIndex: number
}

const endings: EndingData[] = [
  { title: computed(() => '復讐'), image: 'bg/go1', storyIndex: 0 },
  { title: computed(() => '投獄'), image: 'bg/go2', storyIndex: 1 },
  { title: computed(() => '昏睡'), image: 'bg/go3', storyIndex: 2 },
  { title: computed(() => '心中'), image: 'bg/go4', storyIndex: 3 },
  { title: computed(() => 'ニーナのいない夜'), image: 'bg/ed1', storyIndex: 4 },
  { title: computed(() => 'ニーナの使命'), image: 'bg/ed2', storyIndex: 5 },
  { title: computed(() => '二人で過ごす終焉'), image: 'bg/ed3', storyIndex: 6 },
  { title: computed(() => 'ネムルの見た夢'), image: 'bg/ed4', storyIndex: 7 }
]

const selectedEnding = ref<EndingData>()

const isUnlocked = (storyIndex: number) => {
  return state.value.completedEndings.includes(storyIndex)
}

const handleThumbnailClick = (ending: EndingData) => {
  if (!isUnlocked(ending.storyIndex)) return
  selectedEnding.value = ending
}

const handleCloseFullscreen = () => {
  selectedEnding.value = undefined
}

const cols = 4
const rows = 2
const thumbWidth = 240
const thumbHeight = 135
const rectHeight = thumbHeight + 40
const padding = 20
const sumWidth = (cols * thumbWidth) + ((cols - 1) * padding)
const sumHeight = (rows * rectHeight) + ((rows - 1) * padding)
</script>

<template>
  <Container>
    <!-- サムネイル -->
    <Container v-if="!selectedEnding" :x="config.WIDTH.half() - sumWidth.half()" :y="config.HEIGHT.half() - sumHeight.half()">
      <Container
        v-for="(ending, index) in endings"
        :key="ending.storyIndex"
        :x="(index % cols) * (thumbWidth + padding)"
        :y="Math.floor(index / cols) * (rectHeight + padding)"
        :alpha="0"
        :tween="{ props: { alpha: 1 }, delay: 40 * index, duration: 500 - (20 * index) }"
      >
        <Rectangle
          :width="thumbWidth"
          :height="rectHeight"
          :fillColor="0x000000"
          :alpha="0.4"
          :origin="0"
          @pointerdown="() => handleThumbnailClick(ending)"
        />
        <Image
          v-if="isUnlocked(ending.storyIndex)"
          :texture="ending.image"
          :displayWidth="thumbWidth"
          :displayHeight="thumbHeight"
          :origin="0"
        />
        <Rectangle
          v-else
          :width="thumbWidth"
          :height="thumbHeight"
          :fillColor="0x000000"
          :alpha="0.5"
          :origin="0"
        />
        <CustomText
          :text="isUnlocked(ending.storyIndex) ? ending.title.value : '？？？'"
          :x="thumbWidth / 2"
          :y="thumbHeight + 20"
          :origin="0.5"
          :style="{ fontSize: 17, color: '#ffffff' }"
        />
      </Container>
      <CustomText text="Gallery" :x="sumWidth.half()" :y="-60" :origin="0.5" :style="{ fontSize: 42 }" :tween="{ props: { alpha: { from: 0, to: 1 } }, duration: 800 }" />
      <Button :text="'戻る'" :origin="0.5" :x="sumWidth.half()" :y="sumHeight + 70" @click="$emit('back')" :tween="{ props: { alpha: { from: 0, to: 1 } }, duration: 800 }" />
    </Container>
    <!-- フルスクリーン表示 -->
    <Image
      v-if="selectedEnding !== undefined"
      :texture="selectedEnding.image"
      :x="1920 / 2"
      :y="1080 / 2"
      :origin="0.5"
      width="1920"
      height="1080"
      :tween="{ props: { alpha: { from: 0, to: 1 } }, duration: 200 }"
      @pointerdown="handleCloseFullscreen"
    />
  </Container>
</template>
