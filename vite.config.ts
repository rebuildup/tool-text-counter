import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Standalone build configuration.
 *
 * The host (`my-web-2026`) serves the built artefact from its own origin
 * under `/tools/<slug>/app/` and rewrites the root-absolute asset paths
 * in `index.html` at collection time, so `base` stays at Vite's default
 * (`/`) here. The Tool does not know the namespace it will be served
 * from — that is the host's decision (ADR-0006 §3 in the host repo).
 */
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: false,
	},
});
