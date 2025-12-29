const { app, BrowserWindow } = require('electron');
const path = require('path');

// ゲームがホスティングされているURL
const GAME_URL = 'http://localhost:5173'; // 開発用URL（後で本番URLに変更）

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // ゲームURLを読み込み
  mainWindow.loadURL(GAME_URL);

  // 開発時はDevToolsを開く（本番時はコメントアウト）
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
