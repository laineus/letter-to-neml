<script lang="ts" setup>
import { Image } from 'phavuer'
import { computed, watch } from 'vue'
import config from '../lib/config'

const emit = defineEmits(['end'])
const props = defineProps({
  texture: {
    type: String,
    required: true
  }
})
const currentTexture = computed(() => props.texture)
watch(() => props.texture, (newTexture, oldTexture) => {
  // TODO: tweenでフェードインアウトさせる
})
emit('end')
</script>

<template>
  <Image :texture="currentTexture" :displayWidth="config.WIDTH" :displayHeight="config.HEIGHT" :origin="0" />
</template>
