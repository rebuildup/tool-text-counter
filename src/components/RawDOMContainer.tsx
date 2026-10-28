import type { ReactNode } from "react";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

/**
 * Minimal standalone shell that mirrors the contract of the host app's
 * `RawDOMContainer`.
 *
 * The Tool repository owns this component: ADR-0006 §2 of the host's
 * Tool policy forbids a Tool from importing anything from the host
 * repository, so the Tool must ship its own shell rather than reach
 * back into the host's `src/components/tools-ui/`.
 *
 * Host apps can wrap or replace this with their own shell
 * implementation when embedding `@rebuildup/tool-text-counter`.
 */
export function RawDOMContainer({
	title,
	breadcrumbs = [],
	children,
}: {
	title: string;
	breadcrumbs?: BreadcrumbItem[];
	children: ReactNode;
}) {
	return (
		<section
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "15px",
				fontFamily:
					'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans JP", sans-serif',
				padding: "16px",
			}}
		>
			{breadcrumbs.length > 0 && (
				<nav aria-label="Breadcrumb">
					<ol
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "5px",
							listStyle: "none",
							padding: 0,
							margin: 0,
							fontSize: "0.85rem",
							color: "#666",
						}}
					>
						{breadcrumbs.map((crumb, i) => {
							const isLast = i === breadcrumbs.length - 1;
							return (
								<li
									key={crumb.label}
									style={{ display: "flex", alignItems: "center", gap: "5px" }}
								>
									{crumb.href && !isLast ? (
										<a href={crumb.href}>{crumb.label}</a>
									) : (
										<span aria-current={isLast ? "page" : undefined}>
											{crumb.label}
										</span>
									)}
									{!isLast && <span aria-hidden="true">/</span>}
								</li>
							);
						})}
					</ol>
				</nav>
			)}
			<h1 style={{ margin: 0, fontSize: "1.5rem" }}>{title}</h1>
			<div>{children}</div>
		</section>
	);
}
