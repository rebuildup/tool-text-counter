# Skill: ui-verification

## 概要

visible UI を変更した実装タスクで、source 上の判定だけでなく実際の rendered result を確認する手順。

## 発火条件

次の場合に必ず実行する:

- `src/components/**/*.tsx` の編集
- 新規 UI 追加 / 既存 UI の layout / interaction 変更
- デザイン調整 (color, spacing, typography 等)
- ユーザーから「表示を確認して」「screenshot を撮って」と指示された時

## 責務

rendered DOM / screenshot を取得し、設計と一致することを視覚的に検証する。

## canonical command

このリポジトリは host app (`my-web-2025`) で embed される standalone tool である。standalone の verification は host app 側、または Storybook / Playwright Component Test で行う。

```sh
# host app 側 (my-web-2025) で text-counter tool を表示した状態で Playwright を使う例
bunx playwright test --grep "text-counter"
```

verification artifact (screenshot, trace, video) は repository root 直下ではなく `.tmp/` 配下に保存する。

## 確認観点

最低次を確認:

- desktop viewport (1280×800 程度)
- mobile viewport (375×667 程度)
- empty state (テキスト空)
- loading / 計算中 (トークナイザー details 展開時)
- error state (js-tiktoken 失敗時)
- interaction states (Clear / Copy ボタン押下後)
- overflow (長文入力時)
- visibility (ダーク / ライト)
- console errors (Playwright `list_console_messages`)
- network failures (Playwright `list_network_requests`)

## 出力

- screenshot: `.tmp/ui/<timestamp>-<viewport>-<state>.png`
- trace / video: `.tmp/ui/<timestamp>/`
- console / network log: `.tmp/ui/<timestamp>.log`

## 必要な tool

- Playwright (host app 側 / standalone test fixture)
- Chrome DevTools MCP (host app 上で動いている場合)

## 関連

- `AGENTS.md` §6
- `docs/adr/0004-architecture-extracted-tool.md`