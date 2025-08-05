<script setup lang="ts">
import { ref } from 'vue'
import { chatAi } from '../lib/ai.ts'
const chatMode = ref(false)
const textareaModel = ref('')
const onSubmit = () => {
  const startAt = new Date()
  console.log('submit')
  chatAi(textareaModel.value).then((response) => {
    const diffSec = (new Date().getTime() - startAt.getTime()) / 1000 
    console.log(diffSec)
    console.log(response)
  })
}
</script>

<template>
  <section>
    <button @click="chatMode = true" v-if="!chatMode">Chat</button>
    <form v-if="chatMode" @submit.prevent="onSubmit">
      <div>
        <textarea v-model="textareaModel"></textarea>
      </div>
      <button>submit</button>
    </form>
  </section>
</template>

<style>
section {
  padding: 10px;
}
button {
  padding: 3px 8px;
}
textarea {
  padding: 8px;
  width: 800px;
  height: 500px;
  font-size: 10px;
  background-color: #444;
  color: white;
}
</style>
