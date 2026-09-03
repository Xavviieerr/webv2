import React from "react";

interface FormatOptions {
	content: string;
	textarea: HTMLTextAreaElement;
	setContent: (value: string) => void;
}

interface MarkdownOptions extends FormatOptions {
	before: string;
	after: string;
}

export function insertMarkdown({
	content,
	textarea,
	setContent,
	before,
	after,
}: MarkdownOptions): void {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selected = content.slice(start, end);
	const newText =
		content.slice(0, start) + before + selected + after + content.slice(end);

	setContent(newText);
	textarea.focus();

	requestAnimationFrame(() => {
		const newStart = start + before.length;
		const newEnd = newStart + selected.length;
		textarea.setSelectionRange(newStart, newEnd);
	});
}

export function insertBold(opts: FormatOptions): void {
	insertMarkdown({ ...opts, before: "**", after: "**" });
}

export function insertItalic(opts: FormatOptions): void {
	insertMarkdown({ ...opts, before: "*", after: "*" });
}

export function insertCode(opts: FormatOptions): void {
	insertMarkdown({ ...opts, before: "```", after: "```" });
}

export function insertList(opts: FormatOptions): void {
	const { content, textarea, setContent } = opts;
	const start = textarea.selectionStart;
	const lineStart = content.lastIndexOf("\n", start - 1) + 1;
	const newText = content.slice(0, lineStart) + "- " + content.slice(lineStart);
	setContent(newText);
	textarea.focus();
	requestAnimationFrame(() => {
		textarea.setSelectionRange(start + 2, start + 2);
	});
}

export function renderMarkdown(text: string): React.ReactNode[] {
	const regex = /(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
	const parts: React.ReactNode[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(text.slice(lastIndex, match.index));
		}

		const segment = match[0];
		if (segment.startsWith("```")) {
			const code = segment.slice(3, -3);
			parts.push(
				<pre
					key={match.index}
					className="bg-[#0D4D4D]/5 rounded-lg p-3 my-2 overflow-x-auto"
				>
					<code className="text-[13px] font-mono text-[#02474F]/80">
						{code}
					</code>
				</pre>,
			);
		} else if (segment.startsWith("`")) {
			parts.push(
				<code
					key={match.index}
					className="px-1.5 py-0.5 rounded bg-[#0D4D4D]/5 text-[13px] font-mono text-[#0E808D]"
				>
					{segment.slice(1, -1)}
				</code>,
			);
		} else if (segment.startsWith("**")) {
			parts.push(
				<strong
					key={match.index}
					className="font-semibold text-[#02474F]"
				>
					{segment.slice(2, -2)}
				</strong>,
			);
		} else if (segment.startsWith("*")) {
			parts.push(
				<em key={match.index} className="italic">
					{segment.slice(1, -1)}
				</em>,
			);
		}

		lastIndex = match.index + segment.length;
	}

	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}

	return parts;
}
