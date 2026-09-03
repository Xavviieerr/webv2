"use client";

import { useState } from "react";
import { useGetPendingClaimsQuery } from "../../api/placeEndpoints";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function AdminClaimList() {
	const [page, setPage] = useState(1);
	const { data, isLoading, isFetching } = useGetPendingClaimsQuery({ page, limit: 20 });

	const claims = data?.items ?? [];
	const totalPages = data?.totalPages ?? 0;

	if (isLoading) {
		return (
			<div className="space-y-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
						<div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
						<div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
						<div className="h-3 bg-gray-200 rounded w-1/3" />
					</div>
				))}
			</div>
		);
	}

	if (claims.length === 0) {
		return (
			<div className="text-center py-12 text-gray-500">
				<p className="text-sm">No pending claims.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-medium text-[#0D4D4D]">Pending Claims</h2>
				<span className="text-sm text-gray-600">{data?.total ?? 0} total</span>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-3 px-4 font-medium text-gray-600">Place</th>
							<th className="text-left py-3 px-4 font-medium text-gray-600">Claimant</th>
							<th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
							<th className="text-left py-3 px-4 font-medium text-gray-600">Message</th>
							<th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
						</tr>
					</thead>
					<tbody>
						{claims.map((claim) => (
							<tr key={claim.id} className="border-b border-gray-100 hover:bg-gray-50">
								<td className="py-3 px-4">
									<span className="font-medium text-[#0D4D4D]">
										{claim.place?.name ?? "Unknown"}
									</span>
								</td>
								<td className="py-3 px-4 text-gray-700">
									{claim.user.firstName} {claim.user.lastName}
								</td>
								<td className="py-3 px-4 text-gray-500">
									{new Date(claim.createdAt).toLocaleDateString()}
								</td>
								<td className="py-3 px-4 text-gray-600 max-w-xs truncate">
									{claim.note}
								</td>
								<td className="py-3 px-4 text-right">
									<div className="flex items-center justify-end gap-2">
										<button
											type="button"
											className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-pointer"
											title="Approve"
										>
											<CheckCircle className="w-4 h-4" />
										</button>
										<button
											type="button"
											className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
											title="Reject"
										>
											<XCircle className="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="flex items-center justify-center gap-2 pt-4">
					<button
						type="button"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page <= 1}
						className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						Prev
					</button>
					<span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
					<button
						type="button"
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page >= totalPages}
						className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
}
