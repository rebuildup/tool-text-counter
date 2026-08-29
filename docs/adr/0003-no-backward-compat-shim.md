# ADR-0003: 初期開発段階における backward compatibility shim を残さない

- **status**: accepted
- **date**: 2026-08-29
- **decision driver**: project-agent-init §16

## Context

本 repository は version `0.1.0` の初期開発段階にある。`my-web-2025` から抽出されたばかりであり、外部 stable contract としての commit はまだ存在しない。

## Decision

次の目的で implementation を追加しない:

- backward compatibility (旧 API 維持)
- obsolete internal API の温存
- deprecated schema の併存
- old behavior のための分岐
- historical data migration 経路
- compatibility shim

目的とする設計へ直接移行する。

## Exception

- ユーザーから stable external contract として明示的に指定された API のみ維持する。
- host app (`my-web-2025`) 側の embed pattern を破壊する変更は、本 ADR を revise する前に user agreement を取る。

## Consequences

positive:

- 「念のため」の layer を排除し、codebase の意図が明瞭になる。
- 新規 contributor が legacy code を読み解く負担を負わない。

negative:

- 抽出元の `my-web-2025` と本 repository の同期が一時的に崩れる期間が発生する。commit log と ADR で補完する。

## Re-evaluation condition

- version `1.0.0` を越え stable external contract として公開する場合、本 ADR を revise して SemVer 規約に従う commitment を明示する。