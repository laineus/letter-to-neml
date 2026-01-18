const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path')
const steamworks = require('steamworks.js')

app.commandLine.appendSwitch('--in-process-gpu', '--disable-direct-composition') // Allows the Steam overlay to work

const isDev = process.env.NODE_ENV === 'development' || true

const APP_ID = 4311740

// ゲームがホスティングされているURL
const GAME_URL = 'https://neml.laineus.com/app.html'
const GAME_URL_LOCAL = 'http://localhost:5900/app.html'

// Steamクライアントを初期化
const initSteamClient = () => {
  try {
    const client = steamworks.init(isDev ? APP_ID : undefined)
    console.log('Steam initialized successfully')
    return client
  } catch (error) {
    console.error('Failed to initialize Steam:', error)
    return undefined
  }
}
const steamClient = initSteamClient()

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // メニューバーを完全に非表示
  Menu.setApplicationMenu(null)

  // セキュリティ警告を開発時のみ無効化
  if (isDev) {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
  }

  // ゲームURLを読み込み
  mainWindow.loadURL(isDev ? GAME_URL_LOCAL : GAME_URL)

  // 開発時はDevToolsを開く
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Steam Overlayを有効化
if (steamClient) {
  steamworks.electronEnableSteamOverlay()
}

// Steam APIのIPCハンドラ
ipcMain.handle('steam:isAvailable', () => {
  return steamClient !== undefined
})

ipcMain.handle('steam:getPlayerName', () => {
  return steamClient?.localplayer.getName()
})

ipcMain.handle('steam:getSteamId', () => {
  return steamClient?.localplayer.getSteamId()
})

ipcMain.handle('steam:getAchievement', (event, name) => {
  return steamClient?.achievement.isActivated(name)
})

ipcMain.handle('steam:activateAchievement', (event, name) => {
  return steamClient?.achievement.activate(name)
})

ipcMain.handle('steam:clearAchievement', (event, name) => {
  return steamClient?.achievement.clear(name)
})

ipcMain.handle('steam:activateOverlay', (event, dialog) => {
  steamClient?.overlay.activateDialog(dialog)
})

ipcMain.handle('steam:saveToCloud', (event, filename, content) => {
  return steamClient?.cloud.writeFile(filename, content)
})

ipcMain.handle('steam:loadFromCloud', (event, filename) => {
  try {
    return steamClient?.cloud.readFile(filename)
  } catch (e) {
    return null
  }
})

// アプリ終了
ipcMain.handle('app:quit', () => {
  app.quit()
})
