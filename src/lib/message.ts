import { computed, ref } from 'vue'
type Message = {
  image: string
  name: string
  text: string
}
export const useMessagePlayer = (messages: Message[]) => {
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
