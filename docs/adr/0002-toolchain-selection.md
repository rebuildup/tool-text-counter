# ADR-0002: Toolchain 選定 (Biome / Vitest / Knip / TypeScript / Playwright)

- **status**: accepted
- **date**: 2026-08-29
- **decision driver**: project-agent-init §6-8, §26-29

## Context

本 repository は standalone React 19 ベース embeddable tool で、source code の量に対して quality gate が必須。

次の capability gap が当初未充足だった:

- formatter / linter (存在せず)
- type-check (TypeScript 自体未 install)
- unit / component test runner (存在せず)
- dependency / unused export analysis (存在せず)
- E2E / UI verification (host app 側で実行前提、未整備)

## Decision

| 役割 | 採用 | 理由 |
|------|------|------|
| formatter + linter | **Biome** | policy §26 で優先可。単一 binary で format / lint を統合でき、ESM 親和性高い。 |
| type-check | **TypeScript (`tsc --noEmit`)** | 言語 standard。 |
| unit / component test | **Vitest** | policy §29 で明示優先。ESM + TypeScript + React Testing Library と素直に統合できる。 |
| dependency analysis | **Knip** | policy §26 で `Knip` または同等を要求。 |
| E2E / UI verification | **Playwright** | policy §8, §38 で推奨。host app (`my-web-2025`) 側で実行する想定。 |

すべて `devDependencies` に置き、`bunx` 経由で呼び出す。

## Alternatives considered

| 代替案 | 採用しなかった理由 |
|--------|--------------------|
| ESLint + Prettier | Biome の単一 binary で代替可能。Redux 排除と context cost 削減を優先。 |
| Jest | Vitest の方が ESM / TypeScript / Bun との統合で simple。policy でも Vitest が第一候補。 |
| TSLint | deprecated。 |
| madge / depcheck | Knip のほうが unused export / file / config problem も検出できる。 |
| Cypress | Playwright が cross-browser / multi-language 親和性で優位。 |

## Consequences

positive:

- lint / format / type-check / test / dep analysis を 1 つの `bun run check`-style script 群に統合できる。
- 全 tool が ESM / TypeScript / React 19 と互換。

negative:

- Biome の rule セットと既存 style (2-space indent + tab) の不一致があれば調整コストが発生する。`biome.json` で project 設定にする。
- Playwright は host app 側に置くため、本 repository の CI では unit test までを実行する。

## Re-evaluation condition

- Biome が破壊的変更で React 19 / Next 16 と不整合になった場合。
- Vitest の代替 (例: Node test runner 安定化) が project 要件に十分になった場合。
- Knip の maintenance が停止した場合。