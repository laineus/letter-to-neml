<script lang="ts">
import { Container } from 'phavuer'
import { computed } from 'vue'
import type { Thing } from './Thing.vue'
import ThingComponent from './Thing.vue'
const THINGS: { [key: string]: Thing[] } = {
  'bg/home': [
    { x: 0.21, y: 0.47, name: '薬学書', desc: 'ネムルとニーナが服用している「悪夢予防薬」「精神安定剤」に関しての記述がある\n精神安定剤はカスラの実によって調合されているらしい' },
    { x: 0.15, y: 0.37, name: '種族・世界に関する本', desc: 'トルメニアン: 多数派種族\nカオティクス: 混沌の種族\nノクタリアン: 変異をもたらす者たち\nシャマニ: 伝承の民' },
    { x: 0.21, y: 0.29, name: '本3', desc: '本です' },
    { x: 0.38, y: 0.32, name: '窓の外', desc: '大きな月が見える' },
    { x: 0.15, y: 0.75, name: 'ベッドの下', desc: '護身用のナイフが隠されている' },
    { x: 0.645, y: 0.41, name: '空きビン', desc: '悪夢予防薬が入っていた空きビン\n買い足す必要がある' },
    { x: 0.65, y: 0.6, name: '戸棚', desc: '果物とバゲットが入っている' },
    { x: 0.58, y: 0.5, name: '引き出し', desc: '硬貨と納税証明書が入っている' },
  ],
  'bg/stall': [
    { x: 0.55, y: 0.65, name: '商品', desc: '果物などが並んでいる' },
    { x: 0.8, y: 0.65, name: 'ボロ', desc: '……こんな顔だっけ？' },
  ]
}
</script>

<script setup lang="ts">
defineEmits(['select'])
const props = defineProps({
  place: { type: String, required: true }
})
const things = computed(() => THINGS[props.place] || [])
</script>

<template>
  <Container :depth="2000">
    <ThingComponent v-for="thing in things" :key="thing.name" :thing="thing" @pointerdown="$emit('select', thing)" />
  </Container>
</template>
