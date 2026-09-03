import { SearchNav } from "@/features/search/components/nav";
import OldSearchPage from "@/features/search/deadcode/oldSearchPage";

type SearchPageProps = { searchParams?: Promise<{ q?: string }> };

export default async function Search({ searchParams }: SearchPageProps) {
	const params = searchParams ? await searchParams : {};
	const initialQuery = params?.q ?? undefined;

	return (
		<div className="flex flex-col">
			<SearchNav searchQuery={initialQuery} />

			<OldSearchPage initialQuery={initialQuery} />
		</div>
	);
}
