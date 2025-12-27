import { onBeforeUnmount, ref } from 'vue'

type PressEventDetail = { button: GamePadKey }
type PressEvent = CustomEvent<PressEventDetail>
type GamePadKey = 'a' | 'b' | 'up' | 'down' | 'left' | 'right'

const active = ref(false)

const e = new EventTarget()

// gamepad
// TODO

// keyboard
window.addEventListener('keydown', evt => {
  const button: GamePadKey | undefined = (() => {
    // テキスト入力中
    if (evt.target instanceof HTMLTextAreaElement) {
      switch (evt.key) {
        case 'Escape':
          return 'b'
        default: return
      }
    }
    // 通常時
    switch (evt.key) {
      case 'z': return 'a'
      case 'x': return 'b'
      case 'Enter': return 'a'
      case 'Escape': return 'b'
      case 'ArrowUp': return 'up'
      case 'ArrowDown': return 'down'
      case 'ArrowLeft': return 'left'
      case 'ArrowRight': return 'right'
      default: return
    }
  })()
  if (!button) return
  evt.preventDefault()
  if (!active.value) {
    active.value = true
    const activateEvent = new Event('activate')
    e.dispatchEvent(activateEvent)
  }
  const event = new CustomEvent<PressEventDetail>('press', { detail: { button } })
  e.dispatchEvent(event)
})

window.addEventListener('mousedown', () => {
  if (!active.value) return
  active.value = false
  const deactivateEvent = new Event('deactivate')
  e.dispatchEvent(deactivateEvent)
})
window.addEventListener('touchstart', () => {
  if (!active.value) return
  active.value = false
  const deactivateEvent = new Event('deactivate')
  e.dispatchEvent(deactivateEvent)
})

export const useGamePad = () => {
  const onActivate = (callback: () => void) => {
    e.addEventListener('activate', callback)
    onBeforeUnmount(() => {
      e.removeEventListener('activate', callback)
    })
  }
  const onDeactivate = (callback: () => void) => {
    e.addEventListener('deactivate', callback)
    onBeforeUnmount(() => {
      e.removeEventListener('deactivate', callback)
    })
  }
  const onPress = (callback: (button: GamePadKey) => void) => {
    const handler: EventListener = evt => {
      const button = (evt as PressEvent).detail.button
      callback(button)
    }
    e.addEventListener('press', handler)
    onBeforeUnmount(() => {
      e.removeEventListener('press', handler)
    })
  }
  return {
    onActivate,
    onDeactivate,
    onPress,
    get active() { return active.value }
  }
}
