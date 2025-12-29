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

## 注意事項

- このアプリは https://neml.laineus.com をロードするだけのシンプルなブラウザです
- ゲームロジックやアセットは一切含まれていません
- Steam APIとの統合のみを提供します
