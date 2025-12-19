<script setup lang="ts">
import { Container, Rectangle, Image, useScene, FxBlur } from 'phavuer'
import config from '../lib/config'
import CustomText from './CustomText.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { state } from '../lib/state'
import Gallery from './Gallery.vue'
import Config from './Config.vue'
const scene = useScene()
const bgm = scene.sound.add('bgm/letter-to-neml', { loop: true })
bgm.play()
onBeforeUnmount(() => {
  bgm.stop()
})
const type = ref<'title' | 'menu' | 'gallery' | 'config'>('config')
const menu = [
  {
    label: computed(() => {
      if (state.value.current) {
        return 'ゲームを再開'
      }
      return 'ゲームを開始'
    }),
    action: () => {
      scene.scene.start('MainScene')
    }
  },
  {
    label: computed(() => 'ギャラリー'),
    action: () => {
      type.value = 'gallery'
    }
  },
  {
    label: computed(() => '設定'),
    action: () => {
      type.value = 'config'
    }
  },
  {
    label: computed(() => '終了'),
    action: () => {
      type.value = 'title'
    }
  },
]
const TITLE_FADE_IN = {
  alpha: 1,
  y: (config.HEIGHT * 0.3) - 10,
  duration: 1500
}
</script>

<template>
  <Container>
    <Rectangle
      :visible="type === 'title'"
      :width="config.WIDTH" 
      :height="config.HEIGHT" 
      :origin="0"
      :fillColor="0x000000"
      @pointerdown="type = 'menu'"
    />
    <Image texture="etc/title-bg" :origin="0">
      <FxBlur :quality="1" :x="4" :y="4" :steps="5" :strength="1.5" v-if="type === 'gallery' || type === 'config'" />
    </Image>
    <Container v-if="type === 'title' || type === 'menu'" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" :alpha="0" :tween="TITLE_FADE_IN">
      <Image texture="etc/logo-bg" :origin="0.5" />
      <Image texture="etc/logo-color" :origin="0.5" :blendMode="1" />
    </Container>
    <!-- <Image texture="etc/logo" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" /> -->
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
        <Rectangle :width="360" :height="36" :fillColor="0x000000" :alpha="0.4" :origin="0.5" @pointerdown="item.action" />
        <CustomText :text="item.label.value" :origin="0.5" :style="{ fontSize: '17px' }" />
      </Container>
    </Container>
    <Gallery v-else-if="type === 'gallery'" @back="type = 'menu'" />
    <Config v-else-if="type === 'config'" @back="type = 'menu'" />
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
