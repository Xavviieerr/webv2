"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/types/hooks";
import { IconUsers, IconLoaderQuarter, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import FigureCard from "./components/figure-card";
import { FigureSearchBar } from "./components/figure-search-bar";
import { FiguresPagination } from "./components/FiguresPagination";
import { SuggestFigureModal } from "./components/SuggestFigureModal";
import { fetchFigures } from "./lib/api/fetch-figures";
import { useFigureCountTotalQuery } from "@/features/search/lib/api/searchApi";
import type { MiniFigures } from "@/features/shared/types";

const FiguresPediaFeature = ({
	query,
}: {
	query: { page: string; search: string; category: string; status: string };
}) => {
	const { token } = useAppSelector((state) => state.auth);
	const router = useRouter();
	const searchParams = useSearchParams();
	const [figures, setFigures] = useState<MiniFigures[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
	const [showSuggestModal, setShowSuggestModal] = useState(false);

	const { data: figureCountResponse, isLoading: isCountLoading } =
		useFigureCountTotalQuery();
	const figureCount = figureCountResponse?.data ?? 0;

	const loadFigures = useCallback(async () => {
		if (!token) return;
		setIsLoading(true);
		try {
			const result = await fetchFigures({
				token,
				page: query.page,
				search: query.search,
				limit: "12",
				category: query.category || undefined,
				status: "approved",
			});
			setFigures(result.data.filter((f: MiniFigures) => f.status === "approved"));
			setPagination(result.pagination);
		} catch {
			setFigures([]);
		} finally {
			setIsLoading(false);
		}
	}, [token, query.page, query.search, query.category, query.status]);

	useEffect(() => {
		loadFigures();
	}, [loadFigures]);

	const handlePageChange = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("page", String(page));
			router.push(`?${params.toString()}`, { scroll: false });
		},
		[router, searchParams],
	);

	return (
		<div className="flex flex-col items-center absolute left-0 top-0 w-full h-full py-10 lg:px-20 md:px-10 px-4 font-plus-sans">
			<div className="flex flex-col items-center max-w-2xl w-full mt-8">
				<div className="h-18 w-18 bg-primary text-base-yellow flex justify-center items-center rounded-full mb-5">
					<IconUsers size={36} />
				</div>
				<h1 className="text-4xl max-md:text-2xl font-medium text-primary">
					Notable Figures
				</h1>
				<p className="text-lg max-md:text-base pt-3 pb-2 text-center">
					Discover notable Urhobo personalities, their profiles, and
					contributions to the culture.
				</p>

				<p className="text-sm text-gray-500 mb-2">
					Figure Count: {isCountLoading ? "…" : figureCount.toLocaleString()}
				</p>

				<div className="flex max-md:flex-col w-full items-center gap-4 pt-4">
					<FigureSearchBar />
				</div>
			</div>
			<div className="w-full flex justify-end mt-4">
				<button
					type="button"
					onClick={() => setShowSuggestModal(true)}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0E808D]/30 bg-[#0E808D]/5 text-[#0E808D] text-sm font-medium hover:bg-[#0E808D]/10 transition-colors"
				>
					<IconPlus className="w-4 h-4" />
					Suggest a Figure
				</button>
			</div>
			{isLoading ? (
				<div className="flex items-center justify-center py-20">
					<IconLoaderQuarter
						size={48}
						className="animate-spin text-foreground-50"
					/>
				</div>
			) : figures.length > 0 ? (
				<>
					<div className="grid lg:grid-cols-3 grid-cols-1 w-full gap-5 pt-10 pb-4">
						{figures.map((item) => (
							<FigureCard key={item.id} figure={item} />
						))}
					</div>
					<FiguresPagination
						currentPage={pagination.page}
						totalPages={pagination.totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			) : (
				<div className="flex flex-col items-center gap-4 text-gray-500 text-center mt-14 font-plus-sans text-sm">
					<Image
						src={"/images/sad.svg"}
						alt="sad image"
						width={80}
						height={70}
					/>
					<p>
						We couldn&apos;t find any Historical figures that match your search
						criteria.
					</p>
				</div>
			)}
			<SuggestFigureModal
				isOpen={showSuggestModal}
				onClose={() => setShowSuggestModal(false)}
			/>
		</div>
	);
};

export default FiguresPediaFeature;
