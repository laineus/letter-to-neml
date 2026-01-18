<script lang="ts" setup>
import { Container, Image } from 'phavuer'
import { computed } from 'vue'
import config from '../lib/config'

const props = defineProps({
  texture: {
    type: String,
    required: true
  }
})
const baseImage = computed(() => props.texture.split('.')[0])
const objImage = computed(() =>  props.texture.split('.')[1] ? props.texture : undefined)
</script>

<template>
  <Container>
    <Image :texture="baseImage" :displayWidth="config.WIDTH" :displayHeight="config.HEIGHT" :origin="0" />
    <Image v-if="objImage" :texture="objImage" :displayWidth="config.WIDTH" :displayHeight="config.HEIGHT" :origin="0" />
  </Container>
</template>
