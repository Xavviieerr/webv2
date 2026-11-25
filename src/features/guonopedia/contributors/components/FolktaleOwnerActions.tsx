"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
	IconArrowBackUp,
	IconAlertTriangle,
	IconEdit,
	IconLoader2,
	IconSend,
	IconTrash,
} from "@tabler/icons-react";
import {
	useDeleteFolktaleMutation,
	useSubmitFolktaleMutation,
	useWithdrawFolktaleMutation,
} from "../api/folktaleEndpoints";
import type { FolktaleDetail } from "../types/folktales";

const LIST_HREF = "/guonopedia/contribute/folktales";

function readErrorMessage(error: unknown, fallback: string): string {
	const message = (error as { data?: { message?: string | string[] } })?.data
		?.message;
	const readable = Array.isArray(message) ? message[0] : message;
	return readable ?? fallback;
}

/**
 * Owner-only lifecycle controls. Editing is limited to drafts; once a folktale
 * is submitted the owner can only withdraw it, and drafts can be deleted.
 */
export function FolktaleOwnerActions({
	folktale,
}: {
	folktale: FolktaleDetail;
}) {
	const { t } = useTranslation("common");
	const router = useRouter();
	const [confirmingDelete, setConfirmingDelete] = useState(false);

	const [submitFolktale, { isLoading: isSubmitting }] =
		useSubmitFolktaleMutation();
	const [withdrawFolktale, { isLoading: isWithdrawing }] =
		useWithdrawFolktaleMutation();
	const [deleteFolktale, { isLoading: isDeleting }] =
		useDeleteFolktaleMutation();

	const isDraft = folktale.status === "draft";
	const isSubmitted =
		folktale.status === "submitted" || folktale.status === "pending";

	if (!isDraft && !isSubmitted) return null;

	const handleSubmit = async () => {
		try {
			await submitFolktale(folktale.id).unwrap();
			toast.success(t("folktaleSubmitted"));
		} catch (error) {
			toast.error(readErrorMessage(error, t("folktaleActionFailed")));
		}
	};

	const handleWithdraw = async () => {
		try {
			await withdrawFolktale(folktale.id).unwrap();
			toast.success(t("folktaleWithdrawn"));
		} catch (error) {
			toast.error(readErrorMessage(error, t("folktaleActionFailed")));
		}
	};

	const handleDelete = async () => {
		try {
			await deleteFolktale(folktale.id).unwrap();
			toast.success(t("folktaleDeleted"));
			router.push(LIST_HREF);
		} catch (error) {
			toast.error(readErrorMessage(error, t("folktaleActionFailed")));
			setConfirmingDelete(false);
		}
	};

	return (
		<section className="flex flex-col gap-4 rounded-2xl border border-[#0D4D4D]/10 bg-[#F2FEFF] p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-col gap-0.5">
					<h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#0D4D4D]/60">
						{t("manageFolktale")}
					</h2>
					<p className="text-xs text-[#0D4D4D]/60">
						{isDraft ? t("draftManageHint") : t("submittedManageHint")}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					{isDraft && (
						<>
							<Link
								href={`${LIST_HREF}/${folktale.id}/edit`}
								className="inline-flex items-center gap-2 rounded-full border border-[#0D4D4D]/20 bg-white px-4 py-2 text-xs font-semibold text-[#0D4D4D] transition-colors hover:border-[#0D4D4D]/40"
							>
								<IconEdit className="h-4 w-4" />
								{t("editFolktale")}
							</Link>
							<button
								type="button"
								onClick={handleSubmit}
								disabled={isSubmitting}
								className="inline-flex items-center gap-2 rounded-full bg-[#0D4D4D] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
							>
								{isSubmitting ? (
									<IconLoader2 className="h-4 w-4 animate-spin" />
								) : (
									<IconSend className="h-4 w-4" />
								)}
								{t("submitForReview")}
							</button>
							<button
								type="button"
								onClick={() => setConfirmingDelete(true)}
								className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
							>
								<IconTrash className="h-4 w-4" />
								{t("deleteFolktale")}
							</button>
						</>
					)}

					{isSubmitted && (
						<button
							type="button"
							onClick={handleWithdraw}
							disabled={isWithdrawing}
							className="inline-flex items-center gap-2 rounded-full border border-[#0D4D4D]/20 bg-white px-4 py-2 text-xs font-semibold text-[#0D4D4D] transition-colors hover:border-[#0D4D4D]/40 disabled:opacity-60"
						>
							{isWithdrawing ? (
								<IconLoader2 className="h-4 w-4 animate-spin" />
							) : (
								<IconArrowBackUp className="h-4 w-4" />
							)}
							{t("withdrawFolktale")}
						</button>
					)}
				</div>
			</div>

			{confirmingDelete && (
				<div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-start gap-2 text-sm text-red-800">
						<IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
						<div className="flex flex-col gap-0.5">
							<p className="font-semibold">
								{t("deleteDraftConfirmTitle")}
							</p>
							<p className="text-xs leading-relaxed">
								{t("deleteDraftConfirmDescription")}
							</p>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<button
							type="button"
							onClick={() => setConfirmingDelete(false)}
							disabled={isDeleting}
							className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 disabled:opacity-60"
						>
							{t("cancel")}
						</button>
						<button
							type="button"
							onClick={handleDelete}
							disabled={isDeleting}
							className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
						>
							{isDeleting && (
								<IconLoader2 className="h-4 w-4 animate-spin" />
							)}
							{t("confirmDelete")}
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
