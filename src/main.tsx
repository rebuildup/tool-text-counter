import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TextCounterTool from "./components/TextCounterTool";

/**
 * Standalone entry point.
 *
 * The Tool ships two faces on purpose:
 *
 *   - the library face (`src/index.ts` → `<TextCounterApp />`), which
 *     includes the optional BPE tokenizer panel;
 *   - the standalone face (this file + `index.html` + `vite.config.ts`),
 *     which builds a self-contained static bundle a host can serve from
 *     its own origin and frame in a sandboxed iframe.
 *
 * The standalone face renders the core statistics WITHOUT the BPE
 * tokenizer panel: `js-tiktoken`'s `o200k_base` ranks table is ~2.3 MB
 * (and the package's default entry inlines every encoding, ~5.6 MB),
 * which is more than the whole rest of the Tool. A host that embeds the
 * Tool inside a size-budgeted iframe therefore gets the statistics
 * surface without that table. A host that imports the package directly
 * (the library face) still gets the tokenizer.
 *
 * The host never imports this file: it consumes the built artefact.
 */
const container = document.getElementById("root");
if (!container) {
	throw new Error("standalone build: #root container is missing from index.html");
}

createRoot(container).render(
	<StrictMode>
		<TextCounterTool />
	</StrictMode>,
);
