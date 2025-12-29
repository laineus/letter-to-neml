const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const steamworks = require('steamworks.js');

// ゲームがホスティングされているURL
const GAME_URL = 'https://neml.laineus.com';

// Steamクライアントを初期化
const initSteamClient = () => {
  try {
    const client = steamworks.init(); // steam_appid.txtを使用
    console.log('Steam initialized successfully');
    return client;
  } catch (error) {
    console.error('Failed to initialize Steam:', error);
    return undefined;
  }
}
const client = initSteamClient();
const useSteamClient = () => {
  if (!client) {
    throw new Error('Steam client is not initialized.');
  }
  return client;
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

  // セキュリティ警告を開発時のみ無効化
  if (process.env.NODE_ENV === 'development') {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
  }

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
ipcMain.handle('steam:isAvailable', () => {
  return client !== undefined;
});

ipcMain.handle('steam:getPlayerName', () => {
  return useSteamClient().localplayer.getName();
});

ipcMain.handle('steam:getSteamId', () => {
  return useSteamClient().localplayer.getSteamId();
});

ipcMain.handle('steam:activateAchievement', (event, name) => {
  return useSteamClient().achievement.activate(name);
});

ipcMain.handle('steam:getAchievement', (event, name) => {
  return useSteamClient().achievement.isActivated(name);
});

ipcMain.handle('steam:activateOverlay', (event, dialog) => {
  useSteamClient().overlay.activateDialog(dialog);
});

ipcMain.handle('steam:saveToCloud', (event, filename, content) => {
  return useSteamClient().cloud.writeFile(filename, content);
});

ipcMain.handle('steam:loadFromCloud', (event, filename) => {
  try {
    return useSteamClient().cloud.readFile(filename);
  } catch (e) {
    return null;
  }
});
