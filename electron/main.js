const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const steamworks = require('steamworks.js');

// ゲームがホスティングされているURL
const GAME_URL = 'https://neml.laineus.com';

// Steamクライアントを初期化
let client;
try {
  client = steamworks.init(); // steam_appid.txtを使用
  console.log('Steam initialized successfully');
} catch (error) {
  console.error('Failed to initialize Steam:', error);
}

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

  // 開発時はDevToolsを開く
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

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

// Steam Overlayを有効化
if (client) {
  steamworks.electronEnableSteamOverlay();
}

// Steam APIのIPCハンドラ
if (client) {
  ipcMain.handle('steam:getPlayerName', () => {
    return client.localplayer.getName();
  });

  ipcMain.handle('steam:getSteamId', () => {
    return client.localplayer.getSteamId();
  });

  ipcMain.handle('steam:activateAchievement', (event, name) => {
    return client.achievement.activate(name);
  });

  ipcMain.handle('steam:getAchievement', (event, name) => {
    return client.achievement.isActivated(name);
  });

  ipcMain.handle('steam:activateOverlay', (event, dialog) => {
    client.overlay.activateDialog(dialog);
  });

  ipcMain.handle('steam:saveToCloud', (event, filename, content) => {
    return client.cloud.writeFile(filename, content);
  });

  ipcMain.handle('steam:loadFromCloud', (event, filename) => {
    try {
      return client.cloud.readFile(filename);
    } catch (e) {
      return null;
    }
  });
}
