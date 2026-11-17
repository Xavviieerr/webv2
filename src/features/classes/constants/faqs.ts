export interface ClassFaq {
	id: string;
	questionKey: string;
	answerKey: string;
}

export const CLASS_FAQS: ClassFaq[] = [
	{ id: "who", questionKey: "faqWhoQuestion", answerKey: "faqWhoAnswer" },
	{
		id: "dialect",
		questionKey: "faqDialectQuestion",
		answerKey: "faqDialectAnswer",
	},
	{ id: "need", questionKey: "faqNeedQuestion", answerKey: "faqNeedAnswer" },
	{ id: "miss", questionKey: "faqMissQuestion", answerKey: "faqMissAnswer" },
	{ id: "kids", questionKey: "faqKidsQuestion", answerKey: "faqKidsAnswer" },
	{
		id: "guarantee",
		questionKey: "faqGuaranteeQuestion",
		answerKey: "faqGuaranteeAnswer",
	},
];
