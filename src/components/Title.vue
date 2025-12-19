<script setup lang="ts">
import { Container, Rectangle, Image, useScene } from 'phavuer'
import config from '../lib/config'
import CustomText from './CustomText.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { state } from '../lib/state'
const scene = useScene()
const bgm = scene.sound.add('bgm/letter-to-neml', { loop: true, volume: state.value.settings.volume })
bgm.play()
onBeforeUnmount(() => {
  bgm.stop()
})
const type = ref<'title' | 'menu' | 'gallery' | 'config'>('title')
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
    }
  },
  {
    label: computed(() => '設定'),
    action: () => {
    }
  },
  {
    label: computed(() => '終了'),
    action: () => {
    }
  },
]
</script>

<template>
  <Container>
    <Rectangle 
      v-if="type === 'title'"
      :width="config.WIDTH" 
      :height="config.HEIGHT" 
      :origin="0"
      :fillColor="0x000000"
      @pointerdown="type = 'menu'"
    />
    <Image texture="etc/title-bg" :origin="0" />
    <Image texture="etc/logo-bg" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" />
    <Image texture="etc/logo-color" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" :blendMode="1" />
    <!-- <Image texture="etc/logo" :origin="0.5" :x="config.WIDTH / 2" :y="config.HEIGHT * 0.3" /> -->
    <CustomText
      v-if="type === 'title'"
      :text="'Click to Start'"
      :x="config.WIDTH / 2"
      :y="config.HEIGHT * 0.8"
      :origin="0.5"
      :style="{ fontSize: '22px' }"
    />
    <Container :x="config.WIDTH / 2" :y="config.HEIGHT * 0.62" v-if="type === 'menu'">
      <Container v-for="(item, i) in menu" :key="i" :y="i * 50">
        <Rectangle :width="360" :height="36" :fillColor="0x000000" :alpha="0.2" :origin="0.5" @pointerdown="item.action" />
        <CustomText :text="item.label.value" :origin="0.5" :style="{ fontSize: '17px' }" />
      </Container>
    </Container>
  </Container>
</template>
