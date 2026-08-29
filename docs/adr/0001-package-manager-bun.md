# ADR-0001: Package Manager を Bun に統一する

- **status**: accepted
- **date**: 2026-08-29
- **decision driver**: project-agent-init / 既存 `bun.lock` の存在

## Context

本 repository は `bun.lock` を含み、`node_modules/` は既に Bun 経由で install されている (Next 16.3.3, React 19.2.8, js-tiktoken 1.0.21)。

`package.json` は `"type": "module"` (ESM) で書かれており、Bun の ESM 親和性と整合する。

policy (project-agent-init §10) は JavaScript / TypeScript で Bun を standard としており、具体的非互換性がなければ npm / pnpm / Yarn / `npx` を追加導入しないことを求めている。

## Decision

- **package manager**: Bun 1.4+
- **lockfile**: `bun.lock` のみ (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock` を導入しない)
- **command 統一**: `bun install` / `bun add` / `bunx`
- **`npx` 等の代替**: 禁止

## Alternatives considered

| 代替案 | 理由 |
|--------|------|
| pnpm | 既存 `bun.lock` を破棄し再生成する必要があり、移行利益が小さい。policy §10 と矛盾。 |
| npm workspaces | 同上。 |
| Yarn (Berry / Classic) | 同上。 |

## Consequences

positive:

- lockfile の source of truth が 1 つに絞られる。
- `bunx` 経由でローカル install した CLI (`biome`, `tsc`, `vitest`, `knip`) を直接実行できる。
- ESM + Next.js 16 / React 19 と整合。

negative:

- Windows + WSL / WSL Containers で Bun が未提供の場合 fresh clone に失敗する。検証済み環境では Bun 1.4+ を提供できる前提を置く。

## Re-evaluation condition

- Bun 自体のメンテナンス停止または破壊的変更が入った場合。
- 既存 host (`my-web-2025`) が Bun 以外を要求し、本 repository と整合しなくなった場合。