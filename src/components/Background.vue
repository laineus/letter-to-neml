<script lang="ts" setup>
import { Image } from 'phavuer'
import { computed } from 'vue'
import config from '../lib/config'

const props = defineProps({
  texture: {
    type: String,
    required: true
  }
})
const currentTexture = computed(() => props.texture)
</script>

<template>
  <Image :texture="currentTexture" :displayWidth="config.WIDTH" :displayHeight="config.HEIGHT" :origin="0" />
</template>
