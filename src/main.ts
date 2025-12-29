import { createApp } from 'vue'
import './lib/extendsNativeClassFunctions'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

window.steamAPI?.getPlayerName().then(name => {
  console.log('Steam Player Name:', name)
})
