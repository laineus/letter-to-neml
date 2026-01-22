<script setup lang="ts">
import { Container, Rectangle, Image } from 'phavuer'
import CustomText from './CustomText.vue'
import { ref } from 'vue'
import { state } from '../lib/state'
import config from '../lib/config'
import Button from './Button.vue'
import { useGamePad } from '../lib/gamePad'
import { uiTexts } from '../lib/ui'
import { useUISound } from '../lib/se'
import { endings, type Ending } from '../story/endings'

const emit = defineEmits(['back'])

const se = useUISound()

const selectedEnding = ref<Ending>()

const isUnlocked = (endingId: number) => {
  return state.value.completedEndings.includes(endingId)
}

const handleThumbnailClick = (ending: Ending) => {
  if (!isUnlocked(ending.id)) return
  selectedEnding.value = ending
  se.click()
}

const handleCloseFullscreen = () => {
  selectedEnding.value = undefined
  se.cancel()
}

const cols = 4
const rows = 2
const thumbWidth = 240
const thumbHeight = 135
const rectHeight = thumbHeight + 40
const padding = 20
const sumWidth = (cols * thumbWidth) + ((cols - 1) * padding)
const sumHeight = (rows * rectHeight) + ((rows - 1) * padding)

const gamePad = useGamePad()
const selectedIndex = ref<number | 'back' | undefined>(gamePad.active ? 0 : undefined)

gamePad.onPress(key => {
  if (selectedEnding.value !== undefined) {
    // フルスクリーン表示モード
    if (key === 'a' || key === 'b') {
      handleCloseFullscreen()
    }
  } else {
    // サムネイル一覧モード
    if (key === 'b') {
      se.cancel()
      emit('back')
    } else if (key === 'left' || key === 'right' || key === 'up' || key === 'down') {
      se.select()
      if (selectedIndex.value === undefined) {
        selectedIndex.value = 0
      } else if (selectedIndex.value === 'back') {
        if (key === 'up') {
          selectedIndex.value = cols + 1
        } else if (key === 'down') {
          selectedIndex.value = 1
        }
      } else {
        const currentRow = Math.floor(selectedIndex.value / cols)
        const currentCol = selectedIndex.value % cols

        if (key === 'left') {
          const newCol = (currentCol - 1 + cols) % cols
          selectedIndex.value = currentRow * cols + newCol
        } else if (key === 'right') {
          const newCol = (currentCol + 1) % cols
          selectedIndex.value = currentRow * cols + newCol
        } else if (key === 'up') {
          if (currentRow === 0) {
            // 1行目から上を押したら戻るボタンに
            selectedIndex.value = 'back'
            return
          }
          const newRow = (currentRow - 1 + rows) % rows
          selectedIndex.value = newRow * cols + currentCol
        } else if (key === 'down') {
          if (currentRow === 1) {
            // 2行目から下を押したら戻るボタンに
            selectedIndex.value = 'back'
            return
          }
          const newRow = (currentRow + 1) % rows
          selectedIndex.value = newRow * cols + currentCol
        }
      }
    } else if (key === 'a') {
      if (selectedIndex.value === 'back') {
        emit('back')
        se.click()
      } else if (typeof selectedIndex.value === 'number') {
        const ending = endings.value.find(e => e.id === selectedIndex.value)
        if (ending && isUnlocked(ending.id)) {
          handleThumbnailClick(ending)
        }
      }
    }
  }
})

gamePad.onDeactivate(() => {
  selectedIndex.value = undefined
})

const tween = { props: { alpha: { from: 0, to: 1 } }, duration: 800 }
</script>

<template>
  <Container>
    <!-- サムネイル -->
    <Container v-if="!selectedEnding" :x="config.WIDTH.half() - sumWidth.half()" :y="config.HEIGHT.half() - sumHeight.half()">
      <Container
        v-for="(ending, index) in endings"
        :key="ending.id"
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
          v-if="isUnlocked(ending.id)"
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
          :text="isUnlocked(ending.id) ? ending.title : '？？？'"
          :x="thumbWidth / 2"
          :y="thumbHeight + 20"
          :origin="0.5"
          :style="{ fontSize: 17, color: '#ffffff' }"
        />
        <Rectangle
          :visible="selectedIndex === index"
          :width="thumbWidth"
          :height="rectHeight"
          :fillAlpha="0"
          :origin="0"
          :strokeColor="0x66bb00"
          :lineWidth="2"
        />
      </Container>
      <CustomText text="Gallery" :x="sumWidth.half()" :y="-60" :origin="0.5" :style="{ fontSize: 42 }" :tween />
      <Button :active="selectedIndex === 'back'" :text="uiTexts.common.back" :origin="0.5" :x="sumWidth.half()" :y="sumHeight + 70" @click="emit('back'), se.click()" :tween />
    </Container>
    <!-- フルスクリーン表示 -->
    <Image
      v-if="selectedEnding !== undefined"
      :texture="selectedEnding.image"
      :x="0"
      :y="0"
      :origin="0"
      :displayWidth="config.WIDTH"
      :displayHeight="config.HEIGHT"
      :tween="{ props: { alpha: { from: 0, to: 1 } }, duration: 200 }"
      @pointerdown="handleCloseFullscreen"
    />
  </Container>
</template>
