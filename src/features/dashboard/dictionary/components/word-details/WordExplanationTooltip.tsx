"use client";

import React from "react";

/**
 * Word explanation tooltip modal.
 * Pure presentation; all data flows in through props.
 * Parent owns `showWordExplanation` state and passes `onClose`.
 */
export function WordExplanationTooltip({
	open,
	creationReason,
	onClose,
	t,
}: {
	open: boolean;
	creationReason: string;
	onClose: () => void;
	t: (key: string) => string;
}) {
	return (
		<>
			{open && creationReason && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					onClick={() => onClose()}
					onKeyDown={(e) => {
						if (e.key === "Escape") onClose();
					}}
				>
					<div
						role="dialog"
						aria-modal="true"
						aria-label={t("wordExplanation")}
						className="bg-[#F5F5DC] rounded-xl p-5 max-w-md w-full shadow-xl relative"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-3">
							<div className="flex items-center gap-2.5">
								<div className="w-5 h-5 rounded-full border-2 border-[#02474F] flex items-center justify-center bg-[#02474F] shrink-0">
									<span className="text-[10px] font-bold text-white">i</span>
								</div>
								<h3 className="text-base font-bold text-[#02474F]">
									{t("wordExplanation")}
								</h3>
							</div>
							<button
								type="button"
								onClick={() => onClose()}
								className="text-[#02474F] hover:text-[#0E808D] transition-colors shrink-0"
								aria-label="Close"
							>
								<svg
									className="w-4 h-4"
									viewBox="0 0 18 18"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125ZM10.1813 5.95898C10.7666 5.95898 11.2412 5.55469 11.2412 4.95176C11.2412 4.34883 10.7666 3.94453 10.1813 3.94453C9.5959 3.94453 9.12305 4.34883 9.12305 4.95176C9.12305 5.55469 9.59766 5.96074 10.1813 5.96074M10.3869 12.2906C10.3869 12.1711 10.4291 11.8582 10.4045 11.6789L9.47988 12.7441C9.28828 12.9445 9.04922 13.0852 8.93672 13.0482C8.88595 13.0293 8.84359 12.9929 8.81718 12.9455C8.79078 12.8982 8.78206 12.843 8.79258 12.7898L10.3324 7.9207C10.459 7.30195 10.1127 6.73945 9.37793 6.66738C8.60449 6.66738 7.46191 7.45312 6.76758 8.45156C6.76758 8.57109 6.74473 8.86641 6.76758 9.0457L7.69219 7.98047C7.88555 7.78008 8.10703 7.63945 8.21953 7.67812C8.27427 7.69878 8.319 7.73964 8.34451 7.79229C8.37002 7.84494 8.37436 7.90538 8.35664 7.96113L6.82734 12.8074C6.65156 13.3734 6.98555 13.9289 7.7959 14.0555C8.98945 14.0555 9.69434 13.2891 10.3887 12.2906H10.3869Z"
										fill="#02474F"
									/>
								</svg>
								<span className="text-[#02474F] text-xs">Close</span>
							</button>
						</div>
						<p className="text-[#02474F] text-sm leading-relaxed">
							{creationReason}
						</p>
					</div>
				</div>
			)}
		</>
	);
}
