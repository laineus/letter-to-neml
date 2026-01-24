<script lang="ts">
import { useGame } from 'phavuer'
import { ref } from 'vue'
const MEDIA_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm'
]
const VIDEO_BITRATE = 5 * 1000 * 1000 // 5Mbps
const TIME_SLICE = 1000
const mimeType = MEDIA_TYPES.find((type) => MediaRecorder.isTypeSupported(type))
/** Canvas映像とAudioNode(BGM等)を合成して録画する */
const recordGameWithAudio = (game: Phaser.Game) => {
  if (!('context' in game.sound)) throw new Error('AudioContextが利用できません')
  if (!mimeType) throw new Error('サポートされている録画形式が見つかりません')

  // 各ストリームからトラックを取得
  const videoStream = game.canvas.captureStream(30)
  const audioContext = game.sound.context
  const audioDestination = audioContext.createMediaStreamDestination()
  const audioStream = audioDestination.stream
  const gainNode = game.sound.masterVolumeNode
  // AudioNodeをMediaStreamDestinationに接続
  gainNode.connect(audioDestination)

  // 映像と音声のトラックを組み合わせて新しいMediaStream,MediaRecorderを作成
  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...audioStream.getAudioTracks()
  ])
  const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: VIDEO_BITRATE })

  // 録画データの処理
  const chunks: Blob[] = []
  recorder.ondataavailable = (e: BlobEvent) => {
    if (e.data.size > 0) chunks.push(e.data)
  }
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mimeType })
    const url = URL.createObjectURL(blob)
    window.open(url) // 別タブで開く
  }
  recorder.start(TIME_SLICE)

  /** 録画を停止 */
  const stop = () => {
    recorder.requestData()
    recorder.stop()
    gainNode.disconnect(audioDestination)
  }

  return {
    stop
  }
}
</script>

<script setup lang="ts">
const game = useGame()
const recorder = ref<ReturnType<typeof recordGameWithAudio>>()
const start = () => {
  recorder.value = recordGameWithAudio(game)
}
const stop = () => {
  recorder.value?.stop()
  recorder.value = undefined
}
</script>

<template>
  <div class="VideoRecorder">
    <button @click="start" v-if="!recorder">● 録画スタート</button>
    <button @click="stop" v-else>■ 録画ストップ</button>
  </div>
</template>

<style scoped>
.VideoRecorder {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
