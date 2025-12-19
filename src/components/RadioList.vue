<script lang="ts">
import { Container } from 'phavuer'
import RadioItem from './RadioItem.vue'
export type RadioConfig = {
  text: string
  value: string
}
</script>

<script setup lang="ts">
const props = defineProps({
  list: { type: Array as () => RadioConfig[], default: () => [] },
  active: { type: Boolean, default: false }
})
const model = defineModel({ type: String, required: true })
const click = (lang: string) => {
  model.value = lang
}
</script>

<template>
  <Container>
    <RadioItem v-for="item in list" :key="item.value" :text="item.text" :width="100" :x="(list.indexOf(item)) * 100" @click="click(item.value)" :active="model === item.value" />
  </Container>
</template>
