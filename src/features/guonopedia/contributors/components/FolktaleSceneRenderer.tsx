"use client";

import { useTranslation } from "react-i18next";
import { IconPhoto } from "@tabler/icons-react";
import type { FolktaleIllustration } from "../types/folktales";

interface FolktaleSceneRendererProps {
	body: string;
	illustrations?: FolktaleIllustration[];
}

const SCENE_PATTERN = /(\{\{scene-\d+\}\})/g;

function normalizeAnchor(value: string): string {
	return value.replace(/[{}]/g, "").trim().toLowerCase();
}

export function FolktaleSceneRenderer({
	body,
	illustrations = [],
}: FolktaleSceneRendererProps) {
	const byAnchor = new Map<string, FolktaleIllustration>();

	for (const illustration of illustrations) {
		if (!illustration?.anchorKey) continue;
		byAnchor.set(normalizeAnchor(illustration.anchorKey), illustration);
	}

	const parts = body.split(SCENE_PATTERN);
	const nodes: React.ReactNode[] = [];
	let paragraphKey = 0;

	parts.forEach((part) => {
		const sceneMatch = part.match(/^\{\{(scene-\d+)\}\}$/);
		if (sceneMatch) {
			const anchor = sceneMatch[1];
			const illustration = byAnchor.get(anchor);

			if (illustration) {
				nodes.push(
					<IllustrationBlock
						key={`scene-${anchor}`}
						illustration={illustration}
					/>,
				);
			}
			return;
		}

		const paragraphs = part.split(/\n{2,}/);
		for (const paragraph of paragraphs) {
			const text = paragraph.trim();
			if (!text) continue;
			nodes.push(
				<p
					key={`paragraph-${paragraphKey++}`}
					className="whitespace-pre-line break-words text-[15px] leading-8 text-gray-700 [overflow-wrap:anywhere] sm:text-base"
				>
					{text}
				</p>,
			);
		}
	});

	if (nodes.length === 0) {
		return null;
	}

	return <div className="flex flex-col gap-5">{nodes}</div>;
}

function IllustrationBlock({
	illustration,
}: {
	illustration: FolktaleIllustration;
}) {
	const { t } = useTranslation("common");

	return (
		<figure className="my-2 overflow-hidden rounded-2xl border border-[#0D4D4D]/10 bg-[#F2FEFF]">
			{illustration.imageUrl ? (
				<img
					src={illustration.imageUrl}
					alt={illustration.altText ?? ""}
					className="max-h-[420px] w-full object-cover"
				/>
			) : (
				<div className="flex min-h-[180px] flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,#FFFFFF_0%,#F2FEFF_55%,#D4E8EA_100%)] p-6 text-center">
					<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0D4D4D] shadow-sm">
						<IconPhoto className="h-5 w-5" />
					</span>
					{illustration.altText && (
						<p className="max-w-md text-sm text-[#0D4D4D]/70">
							{illustration.altText}
						</p>
					)}
				</div>
			)}
			{(illustration.caption || illustration.illustrator) && (
				<figcaption className="flex flex-col gap-0.5 border-t border-[#0D4D4D]/10 bg-white px-4 py-3 text-xs text-gray-600">
					{illustration.caption && <span>{illustration.caption}</span>}
					{illustration.illustrator && (
						<span className="text-[#0D4D4D]/60">
							{t("illustratedBy", {
								name: illustration.illustrator,
							})}
						</span>
					)}
				</figcaption>
			)}
		</figure>
	);
}
