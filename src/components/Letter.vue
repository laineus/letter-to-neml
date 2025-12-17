<script setup lang="ts">
import { computed, ref } from 'vue'
import { Container, FxBlur, Image, Rectangle } from 'phavuer'
import Dialog from './Dialog.vue'
import config from '../lib/config'
import type { SuccessResponse, ErrorResponse } from '../../server/types'
import { state } from '../lib/state'
import CustomText from './CustomText.vue'
import CustomButton from './Button.vue'

const DEFAULT_MESSAGE = `ネムルへ、
急に出かけないといけなくなっちゃった。
お留守番お願いね。`

const emit = defineEmits(['submit'])

type LetterState = 'rules' | 'preview' | 'edit' | 'alert' | 'error' | 'loading' | 'submit'

const message = ref<string>(state.value.current?.letter ?? DEFAULT_MESSAGE)
const status = ref<LetterState>('rules')
const error = ref<ErrorResponse>()
const submit = () => {
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
    body: JSON.stringify({ letter: message.value })
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
  changeStatus('submit')
  emit('submit', undefined)
}
const startEdit = () => {
  if (!state.value.completedEndings.length) {
    changeStatus('alert')
    return
  }
  changeStatus('edit')
}
const cancelEdit = () => {
  message.value = state.value.current?.letter ?? DEFAULT_MESSAGE
  changeStatus('preview')
}
const reset = () => {
   message.value = DEFAULT_MESSAGE
}
const RULES = `このゲームは手紙のテキスト入力によってキャラクターの行動が変化します。

手紙には以下の内容を書くことはできません
・ニーナが未来の出来事を知っているかのような内容
・ネムルに対する暴言等の不適切な内容`

const ERROR_MESSAGES: { [key: string]: string } = {
  'E1': 'プロンプトインジェクションやゲームシステムを不正に突破する指示が含まれています。',
  'E2': 'ネムルに対して乱暴な言葉遣いや、酷い指示、嘘の情報が含まれています。',
  'E3': 'ニーナがネムルにこれから起こることを知っているかのような内容が含まれています。',
  'E4': '出かけることを伝える旨が欠けています。',
  'E5': '出かける理由や居場所を伝えることはできません。'
}
const errorMessage = computed(() => {
  if (!error.value) return undefined
  if (!('error' in error.value)) return '不明なエラーが発生しました。'
  if (error.value.error.code === 'unknown') return `APIエラーが発生しました。\n${error.value.error.ref}`
  const ref = error.value.error.ref ? `\n\n（該当部分: "${error.value.error.ref}"）` : ''
  return ERROR_MESSAGES[error.value.error.code] + ref
})
</script>

<template>
  <Rectangle :x="0" :y="0" :width="config.WIDTH" :height="config.HEIGHT" :origin="0" @pointerdown="null" :depth="10000" />
  <Dialog title="手紙の作成" :desc="RULES" :depth="20000" v-if="status === 'rules'" @close="changeStatus('preview')" />
  <Dialog title="エラー" :desc="errorMessage" :depth="20000" v-else-if="status === 'error'" @close="changeStatus('edit')" />
  <Dialog :desc="'まずは手紙の内容を変更せず、物語がどのように進むかを見届けましょう。'" :depth="20000" v-else-if="status === 'alert'" @close="changeStatus('preview')" />
  <Container v-else-if="status === 'loading'" :depth="20000" :x="config.WIDTH.half()" :y="config.HEIGHT.half()">
    <CustomText :text="'手紙の内容を確認しています'" :style="{ shadow: { blur: 10, color: '#000', offsetX: 0, offsetY: 0, fill: true } }" :origin="0.5" :y="-55" />
    <div class="Loading"></div>
  </Container>
  <Container v-else-if="status === 'preview'" :depth="20000" :x="config.WIDTH.half()" :y="config.HEIGHT.half()">
    <Rectangle :width="600" :height="600" :fillColor="0x000000" :alpha="0.6" :origin="0.5" :radius="0" @pointerdown="">
      <FxBlur :strength="1.5" :quality="1" :steps="4" />
    </Rectangle>
    <Image texture="etc/frame2" :x="-210" :y="-210" :scale="0.3" :alpha="0.2" />
    <Image texture="etc/frame1" :x="190" :y="190" :scale="0.35" :alpha="0.2" :rotation="Math.PI" />
    <textarea class="Textarea preview" v-model="message" maxlength="800" readonly></textarea>
    <CustomButton :text="'変更する'" :origin="0.5" :y="180" @click="startEdit" />
    <CustomButton :text="'変更せず進む'" :origin="0.5" :y="240" @click="continueWithoutEdit" />
  </Container>
  <Container v-else-if="status === 'edit'" :depth="20000" :x="config.WIDTH.half()" :y="config.HEIGHT.half()">
    <Rectangle :width="600" :height="600" :fillColor="0x000000" :alpha="0.6" :origin="0.5" :radius="0" @pointerdown="">
      <FxBlur :strength="1.5" :quality="1" :steps="4" />
    </Rectangle>
    <Image texture="etc/frame2" :x="-210" :y="-210" :scale="0.3" :alpha="0.2" />
    <Image texture="etc/frame1" :x="190" :y="190" :scale="0.35" :alpha="0.2" :rotation="Math.PI" />
    <textarea class="Textarea edit" v-model="message" maxlength="800"></textarea>
    <CustomButton :text="'確定する'" :origin="0.5" :y="120" @click="submit" />
    <CustomButton :text="'初期状態に戻す'" :origin="0.5" :y="180" @click="reset" />
    <CustomButton :text="'キャンセル'" :origin="0.5" :y="240" @click="cancelEdit" />
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
