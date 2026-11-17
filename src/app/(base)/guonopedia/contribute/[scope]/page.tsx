import { ScopeContributionView } from "@/features/guonopedia/contributors";

export default async function ContributorScopePage({
	params,
}: {
	params: Promise<{ scope: string }>;
}) {
	const { scope } = await params;
	return <ScopeContributionView scope={scope} />;
}
