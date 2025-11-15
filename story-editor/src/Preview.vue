<script setup lang="ts">
import 'phaser'
import { Game, Scene } from 'phavuer'
import Story from '../../src/components/Story.vue'
import { useStoryPlayer } from '../../src/components/Story.vue'
import { preloadAssets } from '../../src/lib/preload'
import config from '../../src/lib/config.ts'
import { ref, type PropType } from 'vue'
defineEmits(['stop'])
const props = defineProps({
  storyPlayer: {
    type: Object as PropType<ReturnType<typeof useStoryPlayer>>,
    required: true
  },
  static: {
    type: Boolean,
    required: true
  }
})
const gameConfig = { width: config.WIDTH, height: config.HEIGHT }
const preload = (scene: Phaser.Scene) => {
  preloadAssets(scene)
}
const size = ref(0)
const resize = () => {
  size.value = (size.value + 1) % 3
}
</script>

<template>
  <div class="preview" :class="[`size${size}`, static ? 'static' : 'dynamic']">
    <Game :config="gameConfig">
      <Scene name="MainScene" @preload="preload">
        <Story :player="storyPlayer" :static="static" :key="static ? 'static' : 'dynamic'" />
      </Scene>
    </Game>
    <div class="cover" @click="resize" v-if="static"></div>
    <div class="stop btn" @click="$emit('stop')" v-else>Stop</div>
  </div>
</template>

<style>
.preview.static {
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
.preview.dynamic {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  backdrop-filter: blur(5px);
  .stop {
    margin-top: 15px;
    font-size: 14px;
  }
}
</style>
