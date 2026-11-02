"use client";

import TextCounterTool from "./components/TextCounterTool";
import TokenizerDetails from "./components/TokenizerDetails";

/**
 * The full application face: the core text statistics PLUS the optional
 * BPE tokenizer panel.
 *
 * This is the face a host application imports (`src/index.ts` re-exports
 * it). It keeps the tokenizer because a host that imports the package
 * directly can afford the `o200k_base` ranks table.
 *
 * The standalone face (`src/main.tsx`) leaves the panel out: the built
 * bundle is served inside a budgeted iframe, and the ranks table alone
 * is ~2.3 MB. See `src/components/TokenizerDetails.tsx`.
 */
export default function TextCounterApp() {
	return <TextCounterTool tokenizer={TokenizerDetails} />;
}
