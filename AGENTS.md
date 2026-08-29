# AGENTS.md

`@rebuildup/tool-text-counter` 向け canonical project contract。

このファイルは dispatcher としてのみ機能する。詳細 rule は `.claude/skills/` 配下の Agent Skills、toolchain 選定は `docs/adr/`、設計判断は関連 design document を参照。

---

## 1. Project identity

- **目的**: 文字列解析 (文字種 / 行 / 段落 / 文 / 単語 / トークン / manuscript page) を提供する React 19 ベースの standalone embeddable tool。
- **抽出元**: `my-web-2025`。本 repository は host app に依存せず単独で開発・検証・公開される。
- **consumer 契約**: peer dependency として `next ^16.3.0` を要求する。これは tool 自体の実行環境ではなく、host app の toolchain を示す。
- **配布形態**: `@rebuildup/tool-text-counter` private package (ESM, `"type": "module"`, `main` = `./src/index.ts`)。
- **current version**: `0.1.0` (初期開発段階。backward compatibility 維持は不要。§ ADR-0003)。

## 2. Toolchain

| 用途 | 採用 | 根拠 |
|------|------|------|
| package manager | Bun 1.4+ (`bun`, `bun install`, `bunx`) | § ADR-0001 |
| language | TypeScript (ESM) | § ADR-0002 |
| runtime target | React 19 / Next.js 16 (peer) | host 側要件 |
| lint / format | Biome | § ADR-0002 |
| test runner | Vitest | § ADR-0002 |
| dependency analysis | Knip | § ADR-0002 |
| UI verification | Playwright (host app 側で実行) | § ADR-0004 |

`npm`, `pnpm`, `yarn`, `npx` の追加導入は禁止。`bun add` / `bun install` で統一する。

## 3. Source language policy

- **source code**: 英語のみ (filename, identifier, comment, code doc, config identifier)。
- **internal development documentation**: 日本語 (`docs/adr/`, `AGENTS.md`, Agent Skill 本文, runbook 等)。
- **Git / GitHub message**: 英語 (commit, PR, Issue, review)。
- **外部向け README / LICENSE**: 内容に応じて英語 (現状は MIT, README は英語を維持)。

## 4. Task scope policy

- user request を独自に MVP へ縮小しない。
- 既存整合設計を流行りの代替へ機械的に置換しない (§ ADR-0002)。
- 初期開発段階では backward compatibility shim を残さない (§ ADR-0003)。
- full requested task が完了するまで `inspect → plan → implement → verify → rubber-duck → replan → continue` を回す。

## 5. Branch / worktree policy

- ユーザー明示指定がない限り local `main` のみで作業。
- feature branch / temporary branch / Git worktree を新規作成しない。
- agent / team 機構が worktree を必須とする場合はその機構を使用しない。
- 作業前に `git status` で current branch と未保存変更を確認。

## 6. Validation entry point

すべての実装タスクは完了前に次の gate を pass しなければならない:

1. `bun run check` — Biome (format + lint)
2. `bun run typecheck` — TypeScript
3. `bun run knip` — dependency / unused export 分析
4. `bun run test` — Vitest
5. `bun run build` — 適用可能な build 検証

詳細は `.claude/skills/quality-gate/SKILL.md` を参照。

## 7. Skill discovery

次の Skill が存在する。詳細は各 SKILL.md を trigger 時に読む。

| Skill | Trigger |
|-------|---------|
| `.claude/skills/quality-gate/SKILL.md` | formatter / lint / type-check / Knip / test / build を実行するとき |
| `.claude/skills/ui-verification/SKILL.md` | visible UI を変更したとき |
| `.claude/skills/nextjs-embed/SKILL.md` | host Next.js app への embed 手順を確認・更新するとき |

## 8. Architecture documentation

`docs/adr/` の ADR を起点に主要な意思決定が記録される。現在の ADR:

- `0001-package-manager-bun.md`
- `0002-toolchain-selection.md`
- `0003-no-backward-compat-shim.md`
- `0004-architecture-extracted-tool.md`
- `0005-ci-github-actions.md`

新しい主要な意思決定 (toolchain / architecture / dependency) を行う前に既存 ADR を確認し、必要なら追加する。

## 9. Mode / permission

- permission / mode / authentication gate は正当な user gate として尊重する。
- bypass を探さない、迂回のために無関係な tool を使わない。

## 10. Generated-code boundary

- source tree は手書き code と generated code を分離する (現状 generated code は無し)。
- 将来 generated code を導入する場合は generated であることを `// @generated` 等の marker で明示する。

---

**禁止事項 quick reference**

- `npm`, `pnpm`, `yarn`, `npx` の新規導入
- 新規 `.py` script の追加 (Python 自動化禁止)
- `.tmp/`, `.reference/` を repository root 直下に作成
- blanket ignore / `.only` / warning suppression での green 偽装
- coverage threshold の引き下げによる数値偽装
- compatibility shim の追加 (初期開発段階)
- worktree / temporary branch の作成 (明示指定なし)
- グローバル agent memory を project truth として参照