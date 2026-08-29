import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TextCounterTool from "./TextCounterTool";

describe("TextCounterTool", () => {
	it("renders the input textarea and basic sections", () => {
		render(<TextCounterTool />);
		expect(screen.getByPlaceholderText("Enter text here...")).toBeTruthy();
		expect(screen.getByText("Settings")).toBeTruthy();
		expect(screen.getByText("Progress")).toBeTruthy();
		expect(screen.getByText("Basic Statistics")).toBeTruthy();
		expect(screen.getByText("Character Types")).toBeTruthy();
	});

	it("updates character statistics when text is entered", async () => {
		const user = userEvent.setup();
		render(<TextCounterTool />);
		const textarea = screen.getByPlaceholderText("Enter text here...") as HTMLTextAreaElement;
		await user.type(textarea, "hello");
		const totalRow = screen.getByText("Total Characters").parentElement;
		expect(totalRow?.textContent).toContain("5");
	});

	it("clears the input when Clear is clicked", async () => {
		const user = userEvent.setup();
		render(<TextCounterTool />);
		const textarea = screen.getByPlaceholderText("Enter text here...") as HTMLTextAreaElement;
		await user.type(textarea, "hello");
		await user.click(screen.getByRole("button", { name: "Clear" }));
		expect(textarea.value).toBe("");
	});

	it("exposes a target-length progress meter that reflects text length", async () => {
		const user = userEvent.setup();
		render(<TextCounterTool />);
		await user.type(screen.getByPlaceholderText("Enter text here..."), "abcdef");
		const progressBars = document.querySelectorAll("progress");
		expect(progressBars.length).toBeGreaterThanOrEqual(1);
		expect(progressBars[0]?.getAttribute("value")).toBe("6");
	});

	it("toggles tokenizer details when summary is clicked", async () => {
		const user = userEvent.setup();
		render(<TextCounterTool />);
		await user.type(screen.getByPlaceholderText("Enter text here..."), "hello world");
		const summary = screen.getByText(/Tokenizer/);
		const details = summary.closest("details");
		expect(details?.open).toBe(false);
		await user.click(summary);
		expect(details?.open).toBe(true);
	});

	it("exposes specific string count when configured", async () => {
		const user = userEvent.setup();
		render(<TextCounterTool />);
		const specificInput = screen.getByPlaceholderText("Count occurrences...");
		await user.type(specificInput, "e");
		await user.type(screen.getByPlaceholderText("Enter text here..."), "hello");
		expect(screen.getByText('"e"')).toBeTruthy();
	});
});
