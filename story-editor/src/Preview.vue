<script setup lang="ts">
import 'phaser'
import { Game, Scene } from 'phavuer'
import Story from '../../src/components/Story.vue'
import { preloadAssets } from '../../src/lib/preload'
import config from '../../src/lib/config.ts'
import { ref, type PropType } from 'vue'
import type { useStoryPlayer } from '../../src/lib/storyPlayer.ts'
import { state } from '../../src/lib/state.ts'
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
state.value.current = {
  letter: '',
  branches: [
    { code: 101, result: true, ref: '悪夢予防薬の空き瓶は片付けておいて' },
    { code: 102, result: true, ref: 'DUMMY' },
    { code: 103, result: true, ref: '護身用のナイフはベッドの下にあるよ' },
    { code: 104, result: true, ref: 'DUMMY' },
    { code: 201, result: true, ref: 'お金のトラブルには介入しないで' },
    { code: 202, result: true, ref: 'でかけるときは身分を証明できるものを持っていって' },
    { code: 203, result: true, ref: '市場のボロにはパンをあげると喜ぶよ' },
    { code: 301, result: true, ref: 'いつもと違う薬は飲んじゃだめ' },
    { code: 302, result: true, ref: '精神安定剤はカスラの実があれば作れるよ' },
    { code: 303, result: true, ref: 'DUMMY' },
    { code: 401, result: true, ref: '海は危ないから入っちゃだめ' },
    { code: 501, result: true, ref: 'ネムルのこと、好きだよ' }
  ]
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
canvas {
  display: block;
  width: 100%;
}
[data-phavuer-game] {
  position: relative;
}
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
