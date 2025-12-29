const { contextBridge, ipcRenderer } = require('electron');

// Steam APIをWebページに公開（IPC経由でメインプロセスと通信）
contextBridge.exposeInMainWorld('steamAPI', {
  // ユーザー情報
  getPlayerName: () => ipcRenderer.invoke('steam:getPlayerName'),
  getSteamId: () => ipcRenderer.invoke('steam:getSteamId'),
  
  // アチーブメント
  activateAchievement: (name) => ipcRenderer.invoke('steam:activateAchievement', name),
  getAchievement: (name) => ipcRenderer.invoke('steam:getAchievement', name),
  
  // オーバーレイ
  activateOverlay: (dialog) => ipcRenderer.invoke('steam:activateOverlay', dialog),
  
  // クラウドセーブ
  saveToCloud: (filename, content) => ipcRenderer.invoke('steam:saveToCloud', filename, content),
  loadFromCloud: (filename) => ipcRenderer.invoke('steam:loadFromCloud', filename),
});
