# rebuildup/tool-text-counter

Standalone text-counter tool. See my-web-2025 spec for embed instructions.

## Two faces

| face | entry | what it renders |
| --- | --- | --- |
| library | `src/index.ts` → `<TextCounterApp />` | the core statistics **and** the optional BPE tokenizer panel |
| standalone | `src/main.tsx` + `index.html` | the core statistics only |

Both faces render the same core surface: total characters, characters
without spaces / newlines / whitespace, word count, line count, paragraph
count, sentence count, character types (hiragana / katakana / kanji /
alphanumeric / symbols), UTF-8 byte size, the 400-character page
estimate, and the per-line averages.

The standalone face leaves the BPE tokenizer panel out on purpose. The
`o200k_base` ranks table `js-tiktoken` needs is ~2.3 MB, and the package's
default entry inlines every encoding (~5.6 MB) — more than the whole rest
of the Tool. A host that embeds the built bundle inside a size-budgeted
iframe therefore gets the statistics surface without that table; a host
that imports the package directly (the library face) still gets the
tokenizer.

## Standalone build

```bash
bun install --frozen-lockfile
bun run build      # → dist/ (index.html + assets/)
bun run preview    # serve dist/ locally
bun run dev        # dev server
bun run typecheck  # tsc --noEmit
```

The build is deterministic and self-contained: `dist/` holds a static
`index.html` plus one hashed JS bundle and no CSS file. The bundle makes
no network request of its own — every statistic is computed in the
browser from the text the visitor typed.

The host that embeds this Tool owns the URL namespace the artefact is
served from, and owns the iframe sandbox. The Tool does not know either.
