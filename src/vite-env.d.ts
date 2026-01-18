/// <reference types="vite/client" />

interface SteamAPI {
  isAvailable(): Promise<boolean>
  getPlayerName(): Promise<string>
  getSteamId(): Promise<{ steamId64: string; accountId: number }>
  getAchievement(name: string): Promise<boolean>
  activateAchievement(name: string): Promise<boolean>
  clearAchievement(name: string): Promise<boolean>
  activateOverlay(dialog: number): Promise<void>
  saveToCloud(filename: string, content: string): Promise<boolean>
  loadFromCloud(filename: string): Promise<string | null>
}

interface ElectronAPI {
  quit(): Promise<void>
}

interface Window {
  steamAPI?: SteamAPI
  electronAPI?: ElectronAPI
}
