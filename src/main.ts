import { createApp } from 'vue'
import './lib/extendsNativeClassFunctions'
import './style.css'
import App from './App.vue'
import { loadFromSteamCloud } from './lib/state'

/** Phavuer起動前に必要な処理 */
const prepare = async () => {
  await loadFromSteamCloud()
}

prepare().then(() => {
  createApp(App).mount('#app')
})

window.steamAPI?.getPlayerName().then(name => {
  console.log('Steam Player Name:', name)
})
