import { describe, expect, it } from "vitest";
import type { CountSettings } from "../types";
import { calculateTextStats } from "./textAnalysis";

const baseSettings: CountSettings = {
	includeSpaces: true,
	includeNewlines: true,
	includeWhitespace: true,
	countMethod: "all",
	targetLength: 400,
	minLength: 1000,
	maxLength: 1000,
	checkHalfKana: false,
	specificString: "",
	excludeHtml: false,
	excludeUrls: false,
};

describe("calculateTextStats", () => {
	it("returns all-zero stats for empty input", () => {
		const stats = calculateTextStats("", baseSettings);
		expect(stats.totalCharacters).toBe(0);
		expect(stats.charactersWithoutSpaces).toBe(0);
		expect(stats.charactersWithoutNewlines).toBe(0);
		expect(stats.charactersWithoutWhitespace).toBe(0);
		expect(stats.wordCount).toBe(0);
		expect(stats.lineCount).toBe(0);
		expect(stats.paragraphCount).toBe(0);
		expect(stats.sentenceCount).toBe(0);
		expect(stats.byteSizeUTF8).toBe(0);
	});

	it("counts ASCII characters including whitespace", () => {
		const stats = calculateTextStats("hello world", baseSettings);
		expect(stats.totalCharacters).toBe(11);
		expect(stats.charactersWithoutSpaces).toBe(10);
		expect(stats.charactersWithoutNewlines).toBe(11);
		expect(stats.charactersWithoutWhitespace).toBe(10);
		expect(stats.wordCount).toBe(2);
		expect(stats.lineCount).toBe(1);
	});

	it("counts Japanese character types", () => {
		const stats = calculateTextStats("こんにちは世界 hello", baseSettings);
		expect(stats.characterTypes.hiragana).toBe(5);
		expect(stats.characterTypes.kanji).toBe(2);
		expect(stats.characterTypes.alphanumeric).toBe(5);
	});

	it("counts lines and paragraphs", () => {
		const text = "line1\nline2\n\nline3\nline4";
		const stats = calculateTextStats(text, baseSettings);
		expect(stats.lineCount).toBe(5);
		expect(stats.paragraphCount).toBe(2);
	});

	it("counts half-width kana when checkHalfKana is true", () => {
		const text = "ｶﾀﾅ";
		const stats = calculateTextStats(text, { ...baseSettings, checkHalfKana: true });
		expect(stats.halfKanaCount).toBe(3);
	});

	it("counts half-width kana as zero when checkHalfKana is false", () => {
		const stats = calculateTextStats("ｶﾀﾅ", baseSettings);
		expect(stats.halfKanaCount).toBe(0);
	});

	it("counts specific string occurrences with regex-safe escaping", () => {
		const stats = calculateTextStats("foo bar foo.baz foo", {
			...baseSettings,
			specificString: "foo.",
		});
		expect(stats.specificStringCount).toBe(1);
	});

	it("returns zero specificStringCount when specificString is empty", () => {
		const stats = calculateTextStats("hello world", baseSettings);
		expect(stats.specificStringCount).toBe(0);
	});

	it("excludes HTML when excludeHtml is true", () => {
		const stats = calculateTextStats("hello<div>world</div>", {
			...baseSettings,
			excludeHtml: true,
		});
		expect(stats.totalCharacters).toBe(10);
	});

	it("excludes URLs when excludeUrls is true", () => {
		const stats = calculateTextStats("see https://example.com/path today", {
			...baseSettings,
			excludeUrls: true,
		});
		expect(stats.totalCharacters).toBe("see  today".length);
	});

	it("computes UTF-8 byte size for multibyte characters", () => {
		const stats = calculateTextStats("あ", baseSettings);
		expect(stats.byteSizeUTF8).toBe(3);
	});

	it("computes manuscript pages as ceiling of totalCharacters/400", () => {
		const stats = calculateTextStats("a".repeat(401), baseSettings);
		expect(stats.manuscriptPages400).toBe(2);
	});

	it("computes character density as percentage of non-whitespace chars", () => {
		const stats = calculateTextStats("hello world", baseSettings);
		expect(stats.characterDensity).toBeCloseTo((10 / 11) * 100);
	});

	it("counts sentences by English and Japanese sentence endings", () => {
		const stats = calculateTextStats("Hello. World! こんにちは。さようなら？", baseSettings);
		expect(stats.sentenceCount).toBe(4);
	});

	it("returns 1 sentence minimum when there is content without endings", () => {
		const stats = calculateTextStats("no ending here", baseSettings);
		expect(stats.sentenceCount).toBe(1);
	});

	it("tracks longest line length", () => {
		const stats = calculateTextStats("short\nmuch longer line\nmid", baseSettings);
		expect(stats.longestLineLength).toBe(16);
	});

	it("computes average characters per line for non-empty lines only", () => {
		const stats = calculateTextStats("ab\ncd\n\n", baseSettings);
		expect(stats.averageCharactersPerLine).toBe(2);
	});
});
