import { useScene } from 'phavuer'

export const useUISound = () => {
  const scene = useScene()
  const click = () => scene.sound.play('se/click')
  const select = () => scene.sound.play('se/select')
  const cancel = () => scene.sound.play('se/cancel')
  const talk = () => scene.sound.play('se/talk')
  return { click, select, cancel, talk }
}
