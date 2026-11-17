"use client";

import { useTranslation } from "react-i18next";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { CLASS_FAQS } from "../constants/faqs";

export function Faq() {
	const { t } = useTranslation("common");

	return (
		<section className="flex flex-col gap-5">
			<h2 className="text-2xl font-semibold text-[#02474F] sm:text-3xl">
				{t("faqTitle")}
			</h2>
			<div className="rounded-2xl border-2 border-[#D4E8EA] bg-white px-5">
				<Accordion type="single" collapsible>
					{CLASS_FAQS.map((faq) => (
						<AccordionItem key={faq.id} value={faq.id}>
							<AccordionTrigger className="text-sm font-semibold text-[#02474F] sm:text-base">
								{t(faq.questionKey)}
							</AccordionTrigger>
							<AccordionContent className="text-sm leading-relaxed text-[#1A4349]/80">
								{t(faq.answerKey)}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
