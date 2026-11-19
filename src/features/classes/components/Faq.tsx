"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { CLASS_FAQS } from "../constants/faqs";
import { ClassesSection } from "./ClassesSection";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
	const { t } = useTranslation("common");

	return (
		<ClassesSection id="faq" tone="white">
			<div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
				<div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start">
					<SectionHeading
						eyebrow={t("personalClasses")}
						title={t("faqTitle")}
					/>

					<div className="flex flex-col gap-3 rounded-2xl bg-[#FBF5EA] p-5">
						<p className="text-sm font-semibold text-[#02474F]">
							{t("faqHelpTitle")}
						</p>
						<p className="text-xs leading-relaxed text-[#1A4349]/70">
							{t("faqHelpDescription")}
						</p>
						<Link
							href="#apply"
							className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#02474F] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#02474F]/90"
						>
							{t("faqHelpCta")}
							<ArrowRight className="h-3.5 w-3.5" />
						</Link>
					</div>
				</div>

				<div className="rounded-3xl border border-[#02474F]/10 bg-[#D4E8EA] px-5 sm:px-6">
					<Accordion type="single" collapsible>
						{CLASS_FAQS.map((faq) => (
							<AccordionItem key={faq.id} value={faq.id}>
								<AccordionTrigger className="text-left text-sm font-semibold text-[#02474F] sm:text-base">
									{t(faq.questionKey)}
								</AccordionTrigger>
								<AccordionContent className="text-sm leading-relaxed text-[#1A4349]/75">
									{t(faq.answerKey)}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</ClassesSection>
	);
}
