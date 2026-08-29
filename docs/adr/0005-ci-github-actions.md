# ADR-0005: CI を GitHub Actions で構成する

- **status**: accepted
- **date**: 2026-08-29
- **decision driver**: project-agent-init §34

## Context

本 repository は GitHub 上で host されている。CI を未整備のまま commit を重ねると、quality gate が local 依存になり再現性が低下する。

policy §34 は CI/CD に GitHub Actions を標準とし、local と CI で同一の project scripts を呼び出すことを求めている。

## Decision

- **provider**: GitHub Actions
- **workflow 配置**: `.github/workflows/quality.yml`
- **jobs**:
  - `quality`: Bun install → `bun run check` → `bun run typecheck` → `bun run knip` → `bun run test` → `bun run build`
  - ローカルと同一 script を呼び出す。
- **trigger**: pull_request, push to main
- **blocking policy**: `quality` は blocking (PR merge の前提条件)
- **release**: 初期開発段階では tag-triggered release は設けない。stable external contract が成立した時点で別途 ADR を起こす。

## Alternatives considered

| 代替案 | 採用しなかった理由 |
|--------|--------------------|
| CircleCI | GitHub 親和性で GitHub Actions が優位。policy §34 と整合。 |
| Drone / Buildkite | infra 維持負担。 |
| local script のみ (CI 不在) | policy §34, §41 に違反。fresh-clone audit で再現性が取れない。 |

## Consequences

positive:

- local と CI で同じ `package.json` scripts を経由するため挙動の drift が起きにくい。
- 環境差 (Bun version 等) を GitHub-hosted runner の pinned version で明示できる。

negative:

- GitHub Actions runner で Bun 1.4+ を提供する setup step が必要。`oven-sh/setup-bun` v2 を採用。

## Re-evaluation condition

- policy §34 に従い、別 provider への移行が必要になった時点で revise。
- release workflow を追加する時点で ADR を追加。