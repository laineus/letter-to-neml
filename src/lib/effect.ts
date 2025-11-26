import { ref } from 'vue'

export const useShake = (scene: Phaser.Scene) => {
  const shake = ref({ x: 0, y: 0 })
  const exec = (callback: () => void) => {
    Array.range(1, 20).forEach(i => {
      scene.time.addEvent({
        delay: 15 * i,
        callback: () => {
          if (i === 20) {
            shake.value.x = 0
            shake.value.y = 0
            callback()
          } else {
            shake.value.x = Math.random() * 30 - 15
            shake.value.y = Math.random() * 30 - 15
          }
        }
      })
    })
  }
  return {
    get x () { return shake.value.x },
    get y () { return shake.value.y },
    exec
  }
}
