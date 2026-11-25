/**
 * Shared shape for the Contributor Policy. Each language provides the full
 * policy body in its own module; the page chrome stays in i18n resources.
 */
export interface PolicySection {
	id: string;
	title: string;
	paragraphs: string[];
	bullets?: string[];
}

export interface ContributorPolicyContent {
	title: string;
	intro: string;
	sections: PolicySection[];
}
