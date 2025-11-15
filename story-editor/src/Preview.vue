<script setup lang="ts">
import 'phaser'
import { Game, Rectangle, Scene } from 'phavuer'
import Story from '../../src/components/Story.vue'
import { useStoryPlayer } from '../../src/components/Story.vue'
import { preloadAssets } from '../../src/lib/preload'
import config from '../../src/lib/config.ts'
import { ref, type PropType } from 'vue'
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
const size = ref(0)
</script>

<template>
  <div class="preview" :class="`size${size}`" @click="size = (size + 1) % 3">
    <Game :config="gameConfig">
      <Scene name="MainScene" @preload="preload">
        <Story :player="storyPlayer" :static="true" />
      </Scene>
    </Game>
    <div class="cover"></div>
  </div>
</template>

<style>
.preview {
  position: sticky;
  margin: 0 0 0 auto;
  right: 20px;
  bottom: 20px;
  width: 90px;
  z-index: 10000;
  &.size1 {
    width: min(400px, 50vw);
  }
  &.size2 {
    width: 1280px;
  }
  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
  }
}
</style>
