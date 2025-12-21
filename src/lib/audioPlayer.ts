import { ref } from 'vue'

export const useAudioPlayer = (scene: Phaser.Scene) => {
  const current = ref<ReturnType<typeof scene.sound.add>>()
  const play = (key: string | null) => {
    if (current.value?.key === key) return
    if (current.value) {
      scene.tweens.add({
        targets:  current.value,
        volume:   0,
        duration: 1000
      })
    }
    if (!key) {
      current.value = undefined
      return
    }
    current.value = scene.sound.add(key)
    current.value.play({ loop: true })
  }
  const stop = () => {
    if (!current.value) return
    current.value.stop()
    current.value = undefined
  }
  return {
    play,
    stop
  }
}
