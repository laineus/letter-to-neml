import type { PhaserAssets } from 'phaser-assets-loader'
import assets from '../assets.json'
export const preloadAssets = (scene: Phaser.Scene) => {
  const phaserAssets = assets as unknown as PhaserAssets
  Object.entries(phaserAssets).forEach(([method, list]) => {
    switch (method) {
      case 'image': return list.forEach(([name, path]) => scene.load.image(name, path))
      case 'audio': return list.forEach(([name, path]) => scene.load.audio(name, path))
    }
  })
}
