<script setup lang="ts">
import 'phaser'
import { Game, Rectangle, Scene } from 'phavuer'
import Story from '../../src/components/Story.vue'
import { useStoryPlayer } from '../../src/components/Story.vue'
import { preloadAssets } from '../../src/lib/preload'
import config from '../../src/lib/config.ts'
import type { PropType } from 'vue'
defineProps({
  storyPlayer: {
    type: Object as PropType<ReturnType<typeof useStoryPlayer>>,
    required: true
  }
})
const gameConfig = { width: config.WIDTH, height: config.HEIGHT }
const preload = (scene: Phaser.Scene) => {
  preloadAssets(scene)
}
</script>

<template>
  <div class="preview">
    <Game :config="gameConfig">
      <Scene name="MainScene" @preload="preload">
        <Story :player="storyPlayer" :static="true" />
      </Scene>
    </Game>
  </div>
</template>

<style>
.preview {
  position: sticky;
  margin: 0 0 0 auto;
  right: 20px;
  bottom: 20px;
  width: 300px;
  z-index: 10000;
}
.preview:hover {
  width: min(calc(100vw - 40px), 1000px);
}
</style>
