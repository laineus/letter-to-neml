import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import './common.css'
import App from './App.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {  path: '/', component: App }
  ]
})

createApp(App).use(router).mount('#app')
