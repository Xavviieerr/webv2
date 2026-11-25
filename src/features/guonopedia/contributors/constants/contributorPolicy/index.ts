import { CONTRIBUTOR_POLICY_EN } from "./en";
import { CONTRIBUTOR_POLICY_URHOBO } from "./urhobo";
import type { ContributorPolicyContent } from "./types";

export type {
	ContributorPolicyContent,
	PolicySection,
} from "./types";

/**
 * Pick the policy body that matches the active language. Unknown languages
 * fall back to English rather than showing a mixed-language document.
 */
export function getContributorPolicyContent(
	language: string | undefined,
): ContributorPolicyContent {
	return language?.toLowerCase().startsWith("urhobo")
		? CONTRIBUTOR_POLICY_URHOBO
		: CONTRIBUTOR_POLICY_EN;
}
