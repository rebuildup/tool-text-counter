import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TextCounterApp from "./TextCounterApp";

describe("TextCounterApp", () => {
	it("renders the TextCounterTool inside its shell", () => {
		render(<TextCounterApp />);
		expect(screen.getByRole("heading", { level: 1, name: "Text Counter" })).toBeTruthy();
		expect(screen.getByPlaceholderText("Enter text here...")).toBeTruthy();
	});
});
