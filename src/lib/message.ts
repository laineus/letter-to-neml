import { computed, ref } from 'vue'
import type { MessageConfig } from '../story/types'
export const useMessagePlayer = (messages: MessageConfig[]) => {
  const index = ref(0)
  const current = computed(() => messages[index.value])
  const eventTarget = new EventTarget()
  
  const next = () => {
    if (index.value < messages.length - 1) {
      index.value++
    } else {
      eventTarget.dispatchEvent(new Event('end'))
    }
  }
  const prev = () => {
    if (index.value > 0) {
      index.value--
    }
  }
  return {
    get current () {
      return current.value
    },
    next,
    prev,
    on: eventTarget.addEventListener.bind(eventTarget),
    off: eventTarget.removeEventListener.bind(eventTarget)
  }
}
