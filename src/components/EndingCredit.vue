<script setup lang="ts">
import { Container, Image } from 'phavuer'
import config from '../lib/config'
import CustomText from './CustomText.vue'
const emit = defineEmits(['end'])
const props = defineProps({
  endingIndex: Number
})
const list = [
  {
    title: 'Created by',
    list: [
      { name: 'Laineus' }
    ]
  },
  {
    title: 'AI tools',
    list: [
      { title: 'Graphics', name: 'ChatGPT / Flux Dev / NanoBanana' },
      { title: 'Music', name: 'Suno' },
      { title: 'Sound effects', name: 'Adobe Firefly' },
      { title: 'Translation', name: 'ChatGPT' }
    ]
  },
  {
    title: 'Game Engine',
    list: [
      { image: 'etc/phaser3' },
      { image: 'etc/phavuer' }
    ]
  }
]
const calcYOffset = (sectionList: typeof list[number]['list']) => {
  return sectionList.reduce((sum, item) => {
    if ('image' in item) return sum + 100
    if ('title' in item) return sum + 40
    return  sum + 40
  }, 70)
}
const calcSectionHeight = (sections: typeof list) => {
  return sections.reduce((sum, item) => {
    return sum + calcYOffset(item.list) + 200
  }, 0)
}
const tween = {
  y: {
    from: config.HEIGHT,
    to: -calcSectionHeight(list),
    duration: 30000
  },
  onComplete: () => {
    emit('end')
  }
}
</script>

<template>
  <Container :x="config.WIDTH.half()" :y="0" :scale="1" :tween="tween">
    <Container v-for="(section, i) in list" :key="section.title" :x="0" :y="calcSectionHeight(list.slice(0, i))">
      <CustomText :text="section.title" :origin="0.5" :x="0" :y="0" :style="{ fontSize: '24px', fontStyle: 'bold' }" />
      <template v-for="(item, j) in section.list" :key="j">
        <template v-if="'image' in item">
          <Image :texture="item.image" :originX="0.5" :originY="0" :scale="0.7" :y="calcYOffset(section.list.slice(0, j))" />
        </template>
        <template v-else-if="'title' in item">
          <CustomText :text="item.title" :originX="1" :originY="0" :x="-10" :y="calcYOffset(section.list.slice(0, j))" :style="{ fontSize: '18px' }" />
          <CustomText :text="item.name" :originX="0" :originY="0" :x="10" :y="calcYOffset(section.list.slice(0, j))" :style="{ fontSize: '18px' }" />
        </template>
        <template v-else>
          <CustomText :text="item.name" :originX="0.5" :originY="0" :x="0" :y="calcYOffset(section.list.slice(0, j))" :style="{ fontSize: '22px' }" />
        </template>
      </template>
    </Container>
  </Container>
</template>
