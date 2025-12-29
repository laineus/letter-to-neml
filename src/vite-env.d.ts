/// <reference types="vite/client" />

interface SteamAPI {
  isAvailable(): Promise<boolean>
  getPlayerName(): Promise<string>
  getSteamId(): Promise<{ steamId64: string; accountId: number }>
  activateAchievement(name: string): Promise<boolean>
  getAchievement(name: string): Promise<boolean>
  activateOverlay(dialog: number): Promise<void>
  saveToCloud(filename: string, content: string): Promise<boolean>
  loadFromCloud(filename: string): Promise<string | null>
}

interface Window {
  steamAPI?: SteamAPI
}
