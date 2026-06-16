import React from "react";
import { DocumentRenderer, defaultRenderers } from "@keystatic/core/renderer";

interface Props {
	document: any;
	/** Slugs de los H2/H3 en orden de aparición, para anclar los encabezados. */
	headingSlugs?: string[];
}

/**
 * Renderiza el documento de Keystatic añadiendo `id` a los encabezados H2/H3,
 * de modo que la tabla de contenidos pueda enlazar a cada sección. Se renderiza
 * en el servidor (SSG) → HTML estático, sin JS en el cliente.
 */
export default function PostContent({ document, headingSlugs = [] }: Props) {
	let headingIndex = 0;

	return (
		<DocumentRenderer
			document={document}
			renderers={{
				...defaultRenderers,
				block: {
					...defaultRenderers.block,
					heading: ({ level, children, textAlign }: any) => {
						let id: string | undefined;
						if (level === 2 || level === 3) {
							id = headingSlugs[headingIndex];
							headingIndex += 1;
						}
						return React.createElement(
							`h${level}`,
							{ id, style: textAlign ? { textAlign } : undefined },
							children,
						);
					},
				},
			}}
		/>
	);
}
