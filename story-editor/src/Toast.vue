<script lang="ts">
import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: symbol
  message: string
  type: ToastType
}

const toasts = ref<Toast[]>([])

const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  const id = Symbol('toast_id')
  const toast: Toast = { id, message, type }
  
  toasts.value.push(toast)
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

const removeToast = (id: symbol) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

const getIcon = (type: ToastType): string => {
  switch (type) {
    case 'success': return '✓'
    case 'error': return '✗'
    case 'info': return 'ℹ'
    default: return ''
  }
}

// Toast manager for external use
export const toastManager = {
  success: (message: string, duration?: number) => {
    addToast(message, 'success', duration)
  },
  error: (message: string, duration?: number) => {
    addToast(message, 'error', duration)
  },
  info: (message: string, duration?: number) => {
    addToast(message, 'info', duration)
  }
}
</script>

<script lang="ts" setup>
defineExpose({
  toasts
})
</script>

<template>
  <div class="toast-container">
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      :class="['toast', `toast-${toast.type}`]"
      @click="removeToast(toast.id)"
    >
      <div class="toast-content">
        <span class="toast-icon">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 80px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #4CAF50;
  background: #333;
}

.toast-error {
  border-left-color: #f44336;
  background: #333;
}

.toast-info {
  border-left-color: #2e7d32;
  background: #333;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 18px;
  font-weight: bold;
}

.toast-success .toast-icon {
  color: #4CAF50;
}

.toast-error .toast-icon {
  color: #f44336;
}

.toast-info .toast-icon {
  color: #2e7d32;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}
</style>