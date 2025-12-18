import { ref, watch } from 'vue'
import { state } from './state'

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
    if (!key) return
    current.value = scene.sound.add(key)
    current.value.play({ loop: true, volume: state.value.settings.volume })
  }
  const stop = () => {
    if (!current.value) return
    current.value.stop()
    current.value = undefined
  }
  watch(() => state.value.settings.volume, volume => current.value?.setVolume(volume))
  return {
    play,
    stop
  }
}
