# Skill: nextjs-embed

## 概要

`@rebuildup/tool-text-counter` を Next.js 16 + React 19 の host app へ embed する手順。

## 発火条件

次の場合に必ず参照する:

- host app (`my-web-2025`) への install / 設定を更新するとき
- new embed pattern を追加するとき
- host app 側で text-counter の layout / theme を上書きするとき

## 責務

consumer 側で再現可能・決定論的に text-counter を表示し、standalone 検証と host embed 検証の境界を明確化する。

## canonical embed pattern

### 1. install

```sh
# host app (my-web-2025) 側
bun add @rebuildup/tool-text-counter
```

peer dependency として Next.js 16 / React 19 を host が持つことが前提。

### 2. App Router page からの利用

`src/app/tools/text-counter/page.tsx` 等で:

```tsx
import TextCounterApp from "@rebuildup/tool-text-counter";

export default function Page() {
  return <TextCounterApp />;
}
```

`TextCounterApp` は `"use client"` 境界を持つため、Server Component からもそのまま import 可能 (Next.js 16 App Router 公式推奨パターン)。

### 3. theme / layout 上書き

`TextCounterApp` は host の `RawDOMContainer` を import しない (本 repository 内に standalone 用 `RawDOMContainer` を持つ)。host 側で独自の shell に wrap したい場合は次のパターンを使う:

```tsx
import TextCounterTool from "@rebuildup/tool-text-counter/text-counter-tool";

export default function Page() {
  return (
    <HostShell title="Text Counter" breadcrumbs={[...]}>
      <TextCounterTool />
    </HostShell>
  );
}
```

(`@rebuildup/tool-text-counter/text-counter-tool` subpath export が将来必要になる。現状は default export 経由。)

## 必要な tool

- host app の package manager (Bun)
- Next.js 16 の App Router

## 関連

- `AGENTS.md` §1
- `docs/adr/0004-architecture-extracted-tool.md`