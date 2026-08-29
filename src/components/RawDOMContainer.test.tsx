import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RawDOMContainer } from "./RawDOMContainer";

describe("RawDOMContainer", () => {
	it("renders the title as a heading", () => {
		render(
			<RawDOMContainer title="My Tool">
				<div>content</div>
			</RawDOMContainer>,
		);
		expect(screen.getByRole("heading", { level: 1, name: "My Tool" })).toBeTruthy();
	});

	it("renders children inside the container", () => {
		render(
			<RawDOMContainer title="Tool">
				<span data-testid="child">hello</span>
			</RawDOMContainer>,
		);
		expect(screen.getByTestId("child")).toBeTruthy();
	});

	it("renders breadcrumbs as a nav with links for non-last items", () => {
		render(
			<RawDOMContainer
				title="Tool"
				breadcrumbs={[{ label: "Home", href: "/" }, { label: "Current" }]}
			>
				<div>x</div>
			</RawDOMContainer>,
		);
		expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
		expect(screen.getByText("Home").tagName).toBe("A");
		const current = screen.getByText("Current");
		expect(current.getAttribute("aria-current")).toBe("page");
	});

	it("renders no breadcrumbs nav when none provided", () => {
		render(
			<RawDOMContainer title="Tool">
				<div>x</div>
			</RawDOMContainer>,
		);
		expect(screen.queryByRole("navigation")).toBeNull();
	});
});
