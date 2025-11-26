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

export const useDamage = (scene: Phaser.Scene) => {
  const alpha = ref(0)
  const exec = (callback: () => void) => {
    scene.add.tween({
      targets: alpha,
      value: 0.5,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        callback()
      }
    })
  }
  return {
    get alpha () { return alpha.value },
    exec
  }
}
