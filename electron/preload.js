const { contextBridge, ipcRenderer } = require('electron')

// Steam APIをWebページに公開（IPC経由でメインプロセスと通信）
contextBridge.exposeInMainWorld('steamAPI', {
  // Steam APIが利用可能かチェック
  isAvailable: () => ipcRenderer.invoke('steam:isAvailable'),
  
  // ユーザー情報
  getPlayerName: () => ipcRenderer.invoke('steam:getPlayerName'),
  getSteamId: () => ipcRenderer.invoke('steam:getSteamId'),
  
  // アチーブメント
  getAchievement: (name) => ipcRenderer.invoke('steam:getAchievement', name),
  activateAchievement: (name) => ipcRenderer.invoke('steam:activateAchievement', name),
  clearAchievement: (name) => ipcRenderer.invoke('steam:clearAchievement', name),
  
  // オーバーレイ
  activateOverlay: (dialog) => ipcRenderer.invoke('steam:activateOverlay', dialog),
  
  // クラウドセーブ
  saveToCloud: (filename, content) => ipcRenderer.invoke('steam:saveToCloud', filename, content),
  loadFromCloud: (filename) => ipcRenderer.invoke('steam:loadFromCloud', filename)
})

// アプリケーション制御をWebページに公開
contextBridge.exposeInMainWorld('electronAPI', {
  quit: () => ipcRenderer.invoke('app:quit')
})
