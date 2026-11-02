import { getEncoding } from "js-tiktoken";
import { useMemo } from "react";

type TokenBlock = { id: number; str: string };

/**
 * The BPE tokenizer panel.
 *
 * This panel is OPTIONAL. It is the only part of the Tool that depends on
 * `js-tiktoken`, whose `o200k_base` ranks table alone is ~2.3 MB (the
 * package's default entry inlines every encoding and is ~5.6 MB). A host
 * that embeds the Tool inside a budgeted iframe therefore usually leaves
 * this panel out — see `src/main.tsx` (the standalone face) and the
 * upstream pull request that introduced it.
 *
 * The library face (`src/TextCounterApp.tsx`) keeps it: a host that
 * imports the package directly can afford the table.
 */
export interface TokenizerPanelProps {
	text: string;
	isOpen: boolean;
	onToggle: (open: boolean) => void;
}

export default function TokenizerDetails({
	text,
	isOpen,
	onToggle,
}: TokenizerPanelProps) {
	const tokenData = useMemo(() => {
		if (!isOpen || !text)
			return { count: null as number | null, blocks: [] as TokenBlock[] };
		try {
			const enc = getEncoding("o200k_base");
			const tokens = enc.encode(text);
			const blocks: TokenBlock[] = tokens.map((id) => ({
				id,
				str: enc.decode([id]),
			}));
			return { count: tokens.length, blocks };
		} catch (e) {
			console.error("Tokenizer error:", e);
			return { count: null as number | null, blocks: [] as TokenBlock[] };
		}
	}, [text, isOpen]);

	return (
		<details
			style={{ border: "1px solid #ccc", padding: "10px" }}
			onToggle={(e) => onToggle((e.target as HTMLDetailsElement).open)}
		>
			<summary style={{ cursor: "pointer", fontSize: "0.95rem" }}>
				Tokenizer (o200k_base) -{" "}
				<strong>
					{tokenData.count !== null ? tokenData.count : "Click to calculate"}
				</strong>{" "}
				Tokens
			</summary>
			<div className="mt-2.5 p-2.5 border border-gray-200 bg-white max-h-[300px] overflow-y-auto text-[0.95rem] whitespace-pre-wrap break-all leading-[1.4]">
				{tokenData.blocks.map((block, i) => (
					<span
						key={`${block.id}-${i}`}
						style={{
							backgroundColor: TOKEN_COLORS[i % TOKEN_COLORS.length],
						}}
						title={`Token ID: ${block.id}`}
					>
						{block.str}
					</span>
				))}
				{tokenData.blocks.length === 0 && isOpen && text.length > 0 && (
					<span>Loading tokens...</span>
				)}
				{text.length === 0 && <span style={{ color: "#999" }}>[ No Data ]</span>}
			</div>
		</details>
	);
}

const TOKEN_COLORS = ["#ffecb3", "#b3e5fc", "#c8e6c9", "#f8bbd0", "#e1bee7"];
