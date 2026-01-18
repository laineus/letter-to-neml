<script setup lang="ts">
import { Container, Rectangle, Image, useScene, FxBlur } from 'phavuer'
import config from '../lib/config'
import CustomText from './CustomText.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { state } from '../lib/state'
import Gallery from './Gallery.vue'
import Config from './Config.vue'
import { useGamePad } from '../lib/gamePad'
import { uiTexts } from '../lib/ui'
import { useUISound } from '../lib/se'
const scene = useScene()
const bgm = scene.sound.add('bgm/letter-to-neml', { loop: true })
bgm.play()
onBeforeUnmount(() => {
  bgm.stop()
})
const type = ref<'title' | 'menu' | 'gallery' | 'config'>('title')
const menu = [
  {
    label: computed(() => {
      return state.value.current ? uiTexts.value.title.continue : uiTexts.value.title.newGame
    }),
    action: () => {
      se.click()
      scene.scene.start('MainScene')
    }
  },
  {
    label: computed(() => uiTexts.value.common.gallery),
    action: () => {
      se.click()
      type.value = 'gallery'
    }
  },
  {
    label: computed(() => uiTexts.value.common.settings),
    action: () => {
      se.click()
      type.value = 'config'
    }
  },
  {
    label: computed(() => uiTexts.value.common.exit),
    action: () => {
      se.click()
      if (window.electronAPI) {
        window.electronAPI.quit()
      } else {
        type.value = 'title'
      }
    }
  },
]
const TITLE_FADE_IN = {
  alpha: 1,
  y: (config.HEIGHT * 0.36) - 10,
  duration: 1500
}

const se = useUISound()

const gamePad = useGamePad()
gamePad.onPress(key => {
  if (type.value === 'config' || type.value === 'gallery') return
  if (key === 'down') {
    selectedIndex.value = (selectedIndex.value === undefined) ? 0 : (selectedIndex.value + 1) % menu.length
    se.select()
  } else if (key === 'up') {
    selectedIndex.value = (selectedIndex.value === undefined) ? 0 : (selectedIndex.value - 1 + menu.length) % menu.length
    se.select()
  } else if (key === 'a') {
    if (type.value === 'title') {
      type.value = 'menu'
      selectedIndex.value = 0
      se.select()
    } else if (type.value === 'menu') {
      if (selectedIndex.value !== undefined) {
        menu[selectedIndex.value].action()
      }
    }
  } else if (key === 'b') {
    if (type.value === 'menu') {
      type.value = 'title'
      se.cancel()
    }
  }
})
gamePad.onActivate(() => {
})
gamePad.onDeactivate(() => {
  selectedIndex.value = undefined
})
const selectedIndex = ref<number | undefined>(gamePad.active ? 0 : undefined)
</script>

<template>
  <Container>
    <Rectangle
      :visible="type === 'title'"
      :width="config.WIDTH" 
      :height="config.HEIGHT" 
      :origin="0"
      :fillColor="0x000000"
      @pointerdown="type = 'menu', se.click()"
    />
    <Image texture="etc/title-bg" :origin="0">
      <FxBlur :quality="1" :x="4" :y="4" :steps="5" :strength="1.5" v-if="type === 'gallery' || type === 'config'" />
    </Image>
    <Container v-if="type === 'title' || type === 'menu'" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.36" :alpha="0" :tween="TITLE_FADE_IN">
      <Image :texture="state.settings.lang === 'ja' ? 'etc/logo-ja' : 'etc/logo-en'" :origin="0.5" :blendMode="1" :scale="0.65" />
    </Container>
    <CustomText
      v-if="type === 'title'"
      :text="'Click to Start'"
      :x="config.WIDTH / 2"
      :y="config.HEIGHT * 0.8"
      :origin="0.5"
      :style="{ fontSize: '22px' }"
      :tween="{ props: { alpha: { from: 0.3, to: 1 } }, duration: 1000, yoyo: true, repeat: -1 }"
    />
    <Container :x="config.WIDTH / 2" :y="config.HEIGHT * 0.62" v-else-if="type === 'menu'">
      <Container v-for="(item, i) in menu" :key="i" :y="i * 50" :tween="{ props: { alpha: 1 }, duration: 100 * (i + 1) }" :alpha="0">
        <Rectangle
          :width="360"
          :height="36"
          :fillColor="gamePad.active && selectedIndex === i ? 0x77bb00 : 0x000000"
          :alpha="gamePad.active && selectedIndex === i ? 0.6 : 0.4"
          :origin="0.5"
          @pointerdown="item.action"
        />
        <CustomText :text="item.label.value" :origin="0.5" :style="{ fontSize: '17px' }" />
      </Container>
    </Container>
    <Gallery v-else-if="type === 'gallery'" @back="type = 'menu'" />
    <Config v-else-if="type === 'config'" :showDataReset="true" @close="type = 'menu'" />
    <Rectangle
      :width="config.WIDTH" 
      :height="config.HEIGHT" 
      :origin="0"
      :fillColor="0x000000"
      :tween="{ duration: 1000, alpha: 0 }"
      :depth="100000"
    />
  </Container>
</template>
