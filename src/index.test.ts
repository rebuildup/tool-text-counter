import { describe, expect, it } from "vitest";
import * as exported from "./index";

describe("index exports", () => {
	it("re-exports TextCounterApp as default", () => {
		expect(exported.default).toBeTypeOf("function");
	});
});
