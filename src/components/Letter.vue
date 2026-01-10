<script setup lang="ts">
import { computed, ref } from 'vue'
import { Container, FxBlur, Image, Rectangle } from 'phavuer'
import Dialog from './Dialog.vue'
import config from '../lib/config'
import type { SuccessResponse, ErrorResponse } from '../../server/types'
import { state, getUserId } from '../lib/state'
import CustomText from './CustomText.vue'
import CustomButton from './Button.vue'
import { useGamePad } from '../lib/gamePad'
import { uiTexts } from '../lib/ui'
import { useUISound } from '../lib/se'

const defaultMessage = computed(() => uiTexts.value.letter.defaultMessage)

const emit = defineEmits(['submit'])

const se = useUISound()

type LetterState = 'rules' | 'preview' | 'edit' | 'alert' | 'error' | 'loading' | 'submit'
type PreviewButton = 'edit' | 'continue'
type EditButton = 'textarea' | 'submit' | 'reset' | 'cancel'

const message = ref<string>(state.value.current?.letter ?? defaultMessage.value)
const status = ref<LetterState>('rules')
const error = ref<ErrorResponse>()
const textareaRef = ref<HTMLTextAreaElement>()
const textareaFocused = ref(false)
const submit = () => {
  se.click()
  if (state.value.current && message.value === state.value.current.letter) {
    continueWithoutEdit()
    return
  }
  if (status.value === 'loading') return
  changeStatus('loading')
  error.value = undefined
  fetch('/api/letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId: getUserId(),
      letter: message.value 
    })
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error(`HTTP Error - Status: ${res.status}`)
    }
    return res.json() as Promise<SuccessResponse | ErrorResponse>
  }).then((response) => {
    console.log('AI Response:', response)
    if ('error' in response) {
      error.value = response
      changeStatus('error')
    } else if ('result' in response) {
      changeStatus('submit')
      emit('submit', { letter: message.value, branches: response.result })
    } else {
      throw new Error('Unexpected response format')
    }
  }).catch((e: Error) => {
    console.error('API Error:', e)
    error.value = { error: { code: 'unknown', ref: e.message } }
    changeStatus('error')
  })
}
const changeStatus = (newStatus: LetterState) => {
  status.value = newStatus
}
const continueWithoutEdit = () => {
  se.click()
  changeStatus('submit')
  emit('submit', undefined)
}
const startEdit = () => {
  se.click()
  if (!state.value.completedEndings.length) {
    changeStatus('alert')
    return
  }
  changeStatus('edit')
}
const cancelEdit = () => {
  se.cancel()
  message.value = state.value.current?.letter ?? defaultMessage.value
  changeStatus('preview')
}
const reset = () => {
  se.click()
  message.value = defaultMessage.value
}

const errorMessage = computed(() => {
  if (!error.value) return undefined
  if (!('error' in error.value)) return uiTexts.value.letter.unknownError
  if (error.value.error.code === 'unknown') return `${uiTexts.value.letter.apiError}\n${error.value.error.ref}`
  if (error.value.error.code === 'RATE_LIMIT') return uiTexts.value.letter.errorRateLimit
  const errorMessages: { [key: string]: string } = {
    'E1': uiTexts.value.letter.errorE1,
    'E2': uiTexts.value.letter.errorE2,
    'E3': uiTexts.value.letter.errorE3,
    'E4': uiTexts.value.letter.errorE4,
    'E5': uiTexts.value.letter.errorE5
  }
  const ref = error.value.error.ref ? `\n\n${uiTexts.value.letter.errorRef.replace('{ref}', error.value.error.ref)}` : ''
  return errorMessages[error.value.error.code] + ref
})

const gamePad = useGamePad()

const previewButtons: PreviewButton[] = ['edit', 'continue']
const editButtons: EditButton[] = ['textarea', 'submit', 'reset', 'cancel']
const selectedPreviewButton = ref<PreviewButton | undefined>(gamePad.active ? 'edit' : undefined)
const selectedEditButton = ref<EditButton | undefined>(undefined)

gamePad.onPress(key => {
  if (status.value === 'preview') {
    if (key === 'up' || key === 'down') {
      se.select()
      const direction = key === 'down' ? 1 : -1
      if (selectedPreviewButton.value === undefined) {
        selectedPreviewButton.value = previewButtons[0]
      } else {
        const currentIndex = previewButtons.indexOf(selectedPreviewButton.value)
        const nextIndex = (currentIndex + direction + previewButtons.length) % previewButtons.length
        selectedPreviewButton.value = previewButtons[nextIndex]
      }
    } else if (key === 'a') {
      if (selectedPreviewButton.value === 'edit') {
        selectedEditButton.value = 'textarea'
        startEdit()
      } else if (selectedPreviewButton.value === 'continue') {
        continueWithoutEdit()
      }
    } else if (key === 'b') {
      selectedPreviewButton.value = 'continue'
    }
  } else if (status.value === 'edit') {
    if (textareaFocused.value) {
      if (key === 'b') {
        se.cancel()
        textareaFocused.value = false
        textareaRef.value?.blur()
      }
      return
    }
    if (key === 'up' || key === 'down') {
      se.select()
      const direction = key === 'down' ? 1 : -1
      if (selectedEditButton.value === undefined) {
        selectedEditButton.value = editButtons[0]
      } else {
        const currentIndex = editButtons.indexOf(selectedEditButton.value)
        const nextIndex = (currentIndex + direction + editButtons.length) % editButtons.length
        selectedEditButton.value = editButtons[nextIndex]
      }
    } else if (key === 'a') {
      if (selectedEditButton.value === 'textarea') {
        textareaFocused.value = true
        textareaRef.value?.focus()
        se.click()
      } else if (selectedEditButton.value === 'submit') {
        submit()
      } else if (selectedEditButton.value === 'reset') {
        reset()
      } else if (selectedEditButton.value === 'cancel') {
        cancelEdit()
      }
    } else if (key === 'b') {
      if (document.activeElement === textareaRef.value) {
        textareaFocused.value = false
        textareaRef.value?.blur()
        selectedEditButton.value = 'textarea'
        return
      }
      cancelEdit()
    }
  }
})

gamePad.onDeactivate(() => {
  selectedPreviewButton.value = undefined
  selectedEditButton.value = undefined
})
</script>

<template>
  <Rectangle :x="0" :y="0" :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="null" :depth="10000" />
  <Dialog :title="uiTexts.letter.createLetterTitle" :desc="uiTexts.letter.rules" :depth="20000" v-if="status === 'rules'" @close="changeStatus('preview')" />
  <Dialog :title="uiTexts.letter.errorTitle" :desc="errorMessage" :depth="20000" v-else-if="status === 'error'" @close="changeStatus('edit')" />
  <Dialog :desc="uiTexts.letter.alertMessage" :depth="20000" v-else-if="status === 'alert'" @close="changeStatus('preview')" />
  <Container v-else-if="status === 'loading'" :depth="20000" :x="config.WIDTH.half()" :y="config.HEIGHT.half()">
    <CustomText :text="uiTexts.letter.checking" :style="{ shadow: { blur: 10, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-55" />
    <div class="Loading"></div>
  </Container>
  <Container v-else-if="status === 'preview'" :depth="20000" :x="config.WIDTH.half()" :y="config.HEIGHT.half()">
    <Rectangle :width="600" :height="600" :fillColor="0x000000" :alpha="0.6" :origin="0.5" :radius="0">
      <FxBlur :strength="1.5" :quality="1" :steps="4" />
    </Rectangle>
    <Image texture="etc/frame2" :x="-210" :y="-210" :scale="0.3" :alpha="0.2" />
    <Image texture="etc/frame1" :x="190" :y="190" :scale="0.35" :alpha="0.2" :rotation="Math.PI" />
    <textarea class="Textarea preview" v-model="message" maxlength="800" readonly></textarea>
    <CustomButton :active="selectedPreviewButton === 'edit'" :text="uiTexts.letter.edit" :origin="0.5" :y="180" @click="startEdit" />
    <CustomButton :active="selectedPreviewButton === 'continue'" :text="uiTexts.letter.continueWithoutEdit" :origin="0.5" :y="240" @click="continueWithoutEdit" />
  </Container>
  <Container v-else-if="status === 'edit'" :depth="20000" :x="config.WIDTH.half()" :y="config.HEIGHT.half()">
    <Rectangle :width="600" :height="600" :fillColor="0x000000" :alpha="0.6" :origin="0.5" :radius="0">
      <FxBlur :strength="1.5" :quality="1" :steps="4" />
    </Rectangle>
    <Image texture="etc/frame2" :x="-210" :y="-210" :scale="0.3" :alpha="0.2" />
    <Image texture="etc/frame1" :x="190" :y="190" :scale="0.35" :alpha="0.2" :rotation="Math.PI" />
    <Rectangle v-if="selectedEditButton === 'textarea'" :width="540" :height="338" :fillColor="0x000000" :fillAlpha="0" :origin="0.5" :strokeColor="0x66bb00" :lineWidth="2" :y="-97" />
    <textarea ref="textareaRef" class="Textarea edit" :class="selectedEditButton === 'textarea' ? 'gamePad' : undefined" v-model="message" maxlength="800" @blur="textareaFocused = false"></textarea>
    <CustomButton :active="selectedEditButton === 'submit'" :text="uiTexts.letter.submit" :origin="0.5" :y="120" @click="submit" />
    <CustomButton :active="selectedEditButton === 'reset'" :text="uiTexts.letter.reset" :origin="0.5" :y="180" @click="reset" />
    <CustomButton :active="selectedEditButton === 'cancel'" :text="uiTexts.common.cancel" :origin="0.5" :y="240" @click="cancelEdit" />
  </Container>
</template>

<style scoped>
.Textarea {
  position: absolute;
  top: 13%;
  left: 29%;
  right: 29%;
  bottom: 32%;
  width: auto;
  height: auto;
  resize: none;
  padding: 1vw;
  background-color: transparent;
  border: 1px dashed transparent;
  font-size: 1.5vw;
  font-weight: bold;
  line-height: 1.7;
  text-align: center;
  color: white;
}
.Textarea:focus {
  outline: none;
}
.Textarea.gamePad:focus {
  background-color: #67bb0033;
}
.Textarea.edit {
  bottom: 40%;
  border: 1px dashed rgba(255, 255, 255, 0.15);
}
.Loading {
  position: absolute;
  top: 48%;
  left: calc(50% - 3.5vw);
  width: 6vw;
  height: 6vw;
  border: 0.6vw solid rgba(0, 0, 0, 0.3);
  border-top-color: #ddd;
  border-radius: 100%;
  animation: linear rotate 1s infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
