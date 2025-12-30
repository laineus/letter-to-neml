<script lang="ts">
import { Container } from 'phavuer'
import RadioItem from './RadioItem.vue'
import { useUISound } from '../lib/se'
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
const se = useUISound()
const click = (v: string) => {
  if (model.value === v) return
  model.value = v
  se.select()
}
</script>

<template>
  <Container>
    <RadioItem v-for="item in list" :key="item.value" :text="item.text" :width="100" :x="(list.indexOf(item)) * 100" @click="click(item.value)" :active="model === item.value" />
  </Container>
</template>
