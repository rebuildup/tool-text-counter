# ADR-0004: 抽出した standalone tool のアーキテクチャ

- **status**: accepted
- **date**: 2026-08-29
- **decision driver**: project-agent-init §12, 抽出元 `my-web-2025` との整合

## Context

本 repository は `my-web-2025` から standalone React 19 ベース tool として抽出された。

抽出元で `<RawDOMContainer>` を host app の `external/ui/src/RawDOMContainer` から import していたが、抽出時にこの import path は本 repository に存在しない。

抽出元と本 repository の責務境界:

- 抽出元 (`my-web-2025`): Next.js 16 host app、共通 UI shell、`RawDOMContainer` 等の layout primitive を提供。
- 本 repository: 単一機能 (text counter) の standalone tool。host app へ embed される。

公式 Next.js 16 guidance では library author に対し「client-only 機能を使う entry point には `"use client"` を付ける」「host が提供する wrapper は host の Server Component から Client Component へそのまま import できる」と示されている。本 repository の `src/index.ts` は `TextCounterApp` を re-export しており、`TextCounterApp` 自体は `"use client"` を持つため host の Server Component から安全 import 可能。

## Decision

- `<RawDOMContainer>` の責務は host app 側 (`my-web-2025`) に属するとみなし、本 repository 内に **最小限の local fallback** を持つ。
- host app 側は host 自身の `RawDOMContainer` 実装を使うか、本 repository の local fallback を使うかを選択できる。
- `TextCounterApp` (default export) は host-agnostic な最小 shell を含む。host で完全に上書きしたい場合は `TextCounterTool` を直接 import する subpath export を将来追加できる。

## Structure

```
src/
  index.ts                       # entry: re-export TextCounterApp
  TextCounterApp.tsx             # "use client" wrapper, host-agnostic shell
  components/
    TextCounterTool.tsx          # main interactive component
    RawDOMContainer.tsx          # local minimal fallback (title + breadcrumbs)
  types/index.ts                 # public types
  utils/textAnalysis.ts          # pure text analysis functions
```

dependency direction:

```
index.ts → TextCounterApp.tsx → TextCounterTool.tsx → RawDOMContainer.tsx (local)
                                            ↘ utils/textAnalysis.ts
                                            ↘ types/index.ts
```

## Alternatives considered

| 代替案 | 採用しなかった理由 |
|--------|--------------------|
| `RawDOMContainer` を peer dependency 化し host 提供を必須にする | 抽出元との同期期間中に standalone verification が不可能になる。 |
| shell を完全に削除し host 側提供を前提にする | subpath export 機構の追加が必要で、ADR scope を越える。 |
| 抽出元 `external/ui` を vendor / submodule で取り込む | policy §31 により `.reference/` 以外での vendor を禁止。 |

## Consequences

positive:

- standalone で build / test でき、host app なしでも design 確認できる。
- host app 側は自身の shell で上書き可能。

negative:

- local fallback の visual design が host app の shell と一致する保証はない。host embed pattern を `.claude/skills/nextjs-embed/SKILL.md` に記載し、host app 側で上書きする手順を明示。

## Re-evaluation condition

- host app 側が RawDOMContainer を完全分離して提供する安定した contract になった場合、local fallback を削除する。
- subpath export 機構 (`@rebuildup/tool-text-counter/text-counter-tool`) が必要になったタイミングで ADR を revise。