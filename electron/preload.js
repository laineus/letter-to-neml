const { contextBridge } = require('electron');

// Steam APIをWebページに公開する準備
// steamworks.jsインストール後に実装
contextBridge.exposeInMainWorld('steamAPI', {
  // Steam APIの関数をここで公開
});
