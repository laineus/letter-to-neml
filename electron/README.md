# Letter to Neml - Steam版

このディレクトリは、Letter to NemlのSteam版ネイティブアプリです。

## セットアップ

```bash
yarn install
```

## 開発

`steam_appid.txt`にSteam App IDを記述してください（現在は開発用の480を使用）。

```bash
yarn start
```

## ビルド

### すべてのプラットフォーム
```bash
yarn build
```

### 個別のプラットフォーム
```bash
yarn build:linux   # Linux 64-bit
yarn build:win     # Windows 64-bit
yarn build:mac     # macOS (Intel & Apple Silicon)
```

ビルド成果物は `dist/` ディレクトリに出力されます。

## Steam SDK配布ファイル

本番ビルドでは、`node_modules/steamworks.js/sdk/redistributable_bin/`から対応するプラットフォームのSteam SDKファイルをビルド成果物のルートにコピーする必要があります:

- **Linux**: `linux64/libsteam_api.so`
- **Windows**: `win64/steam_api64.dll`
- **macOS**: `osx/libsteam_api.dylib`

## Steam API の使用方法

Webページ（フロントエンド）から、`window.steamAPI`を通じてSteam APIを呼び出すことができます。

### サンプルコード

```javascript
// Steam APIが利用可能かチェック
const isSteamAvailable = await window.steamAPI.isAvailable();
if (!isSteamAvailable) {
  console.warn('Steam API is not available');
  return;
}

// プレイヤー名を取得
window.steamAPI.getPlayerName().then(name => {
  console.log('Steam Player Name:', name);
});

// Steam IDを取得
window.steamAPI.getSteamId().then(steamId => {
  console.log('Steam ID:', steamId);
});

// アチーブメントを解除
window.steamAPI.activateAchievement('ACHIEVEMENT_NAME').then(result => {
  console.log('Achievement activated:', result);
});

// クラウドセーブに保存
window.steamAPI.saveToCloud('savegame.json', JSON.stringify(gameData)).then(result => {
  console.log('Saved to cloud:', result);
});

// クラウドセーブから読み込み
window.steamAPI.loadFromCloud('savegame.json').then(data => {
  if (data) {
    const gameData = JSON.parse(data);
    console.log('Loaded from cloud:', gameData);
  }
});
```

### ブラウザコンソールでのテスト

開発時（`yarn start`）は検証ツールが開くので、コンソールで直接APIをテストできます:

```javascript
await window.steamAPI.getPlayerName()
```

## 注意事項

- このアプリは https://neml.laineus.com をロードするだけのシンプルなブラウザです
- ゲームロジックやアセットは一切含まれていません
- Steam APIとの統合のみを提供します
