# Skill: quality-gate

## 概要

実装タスク完了前に必ず実行する formatter / linter / type-check / 依存解析 / test / build の統合 gate。

## 発火条件

次の場合に必ず実行する:

- 新規実装 / 修正タスクの完了直前
- PR 作成前
- ユーザーから「検証して」「check して」「全部回して」と指示された時
- 実装 loop の各 verify 段階

## 責務

`AGENTS.md` §6 に従い、project で利用可能なすべての check を error / actionable warning なく pass させる。

## canonical command

```sh
bun run check
bun run typecheck
bun run knip
bun run test
bun run build
```

`check` は formatter + lint を含む。type-check と build は個別。

## 適用規則

1. 変更した部分だけでなく、project / package に含まれる適用可能な validation をすべて実行する。
2. focused test のみで完了判定しない。
3. skip / `.only` / disabled suite / blanket ignore / `|| true` / no-fail で green に見せかけない。
4. exit code が 0 でない限り「完了」と報告しない。
5. project から修正不能な upstream / toolchain warning は明示し「完全 clean」と表現しない。

## coverage

Vitest の場合、最低限次の threshold を維持する (§ ADR-0002):

- lines ≥ 80%
- statements ≥ 80%
- functions ≥ 80%
- branches ≥ 80%

threshold を下げる、または困難 file を除外することで数値を偽装しない。

## error / warning ゼロ方針

- actionable な error / warning は root cause を修正する。
- narrow exclusion が許されるのは generated / vendor code 等、本当に meaningful validation domain 外の場合のみ。
- 除外は specific / minimal / justified でなければならない。

## 必要な tool

- Bun 1.4+
- Biome (`bunx biome`)
- TypeScript (`bunx tsc`)
- Knip (`bunx knip`)
- Vitest (`bunx vitest`)

## 関連

- `AGENTS.md` §6
- `docs/adr/0002-toolchain-selection.md`