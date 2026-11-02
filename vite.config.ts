import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Standalone build configuration.
 *
 * The host (`my-web-2026`) serves the built artefact from its own origin
 * under `/tools/<slug>/app/`. With Vite's default base (`/`) every asset
 * reference in `dist/index.html` is root-absolute, so the document asks
 * the host root for `/assets/index-<hash>.js` instead of the artefact's
 * own directory and the embedded app never boots. The same problem was
 * measured on the pilot Tool (`tool-color-palette`), where `base: "./"`
 * was the fix.
 *
 * `base: "./"` keeps every reference relative to the document URL, which
 * resolves correctly both when the artefact is served under the Tool's
 * own path and when a host rewrites the references at collection time.
 */
export default defineConfig({
	base: "./",
	plugins: [react()],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: false,
	},
});
