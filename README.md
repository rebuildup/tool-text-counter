# @rebuildup/tool-text-counter

Standalone embeddable React 19 tool that analyzes input text: characters, words, lines, paragraphs, sentences, character types (hiragana / katakana / kanji / alphanumeric / symbols), and `o200k_base` token counts via `js-tiktoken`.

This package is extracted from `my-web-2025` and consumed by that host Next.js 16 application.

## Install

```sh
bun add @rebuildup/tool-text-counter
```

Peer dependency: `next ^16.3.0` (host app requirement).

## Embed

```tsx
import TextCounterApp from "@rebuildup/tool-text-counter";

export default function Page() {
	return <TextCounterApp />;
}
```

`TextCounterApp` carries a `"use client"` boundary, so it can be imported from any Server Component. See `.claude/skills/nextjs-embed/SKILL.md` for full embed patterns.

## Project layout

```
src/
  index.ts                       entry: re-exports TextCounterApp
  TextCounterApp.tsx             client wrapper with local RawDOMContainer shell
  components/
    TextCounterTool.tsx          interactive component
    RawDOMContainer.tsx          local minimal fallback shell
  types/index.ts                 public TypeScript types
  utils/textAnalysis.ts          pure text-analysis functions
docs/adr/                        architecture / toolchain decisions
.claude/skills/                  project-local Agent Skills
```

## Development

Requires Bun 1.4+.

```sh
bun install
bun run check          # biome format + lint
bun run typecheck      # tsc --noEmit
bun run knip           # dependency analysis
bun run test           # vitest
bun run test:coverage  # vitest + coverage
bun run build          # type-check based build verification
```

## Quality gates

The following are enforced locally and in CI (`.github/workflows/quality.yml`):

- Biome format + lint (`bun run check`)
- TypeScript type-check (`bun run typecheck`)
- Knip dependency analysis (`bun run knip`)
- Vitest with ≥ 80% coverage across lines / statements / functions / branches
- Build verification (`bun run build`)

See `.claude/skills/quality-gate/SKILL.md` for the canonical verification workflow.

## Architecture decisions

See `docs/adr/`:

- `0001-package-manager-bun.md`
- `0002-toolchain-selection.md`
- `0003-no-backward-compat-shim.md`
- `0004-architecture-extracted-tool.md`
- `0005-ci-github-actions.md`

## License

MIT. See [LICENSE](./LICENSE).