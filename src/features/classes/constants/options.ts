export interface ClassOption {
	value: string;
	labelKey: string;
}

export const AUDIENCE_OPTIONS: ClassOption[] = [
	{ value: "myself", labelKey: "whoMyself" },
	{ value: "child", labelKey: "whoChild" },
	{ value: "family", labelKey: "whoFamily" },
	{ value: "partner", labelKey: "whoPartner" },
];

export const LEVEL_OPTIONS: ClassOption[] = [
	{ value: "none", labelKey: "levelOptionNone" },
	{ value: "understand", labelKey: "levelOptionUnderstand" },
	{ value: "little", labelKey: "levelOptionLittle" },
	{ value: "conversation", labelKey: "levelOptionConversation" },
	{ value: "fluent", labelKey: "levelOptionFluent" },
];

export const GOAL_OPTIONS: ClassOption[] = [
	{ value: "family", labelKey: "goalFamily" },
	{ value: "kids", labelKey: "goalKids" },
	{ value: "wedding", labelKey: "goalWedding" },
	{ value: "roots", labelKey: "goalRoots" },
	{ value: "work", labelKey: "goalWork" },
];

export interface DialectOption {
	value: string;
	labelKey?: string;
	label?: string;
}

// Dialect names are proper nouns; only the "I don't know" option needs a
// translated label.
export const DIALECT_OPTIONS: DialectOption[] = [
	{ value: "unknown", labelKey: "dialectUnknown" },
	{ value: "ughelli", label: "Ughelli" },
	{ value: "warri", label: "Warri" },
	{ value: "uvwie", label: "Uvwie" },
	{ value: "okpe", label: "Okpe" },
	{ value: "udu", label: "Udu" },
	{ value: "agbarho", label: "Agbarho" },
	{ value: "sapele", label: "Sapele" },
	{ value: "abraka", label: "Abraka" },
	{ value: "other", labelKey: "other" },
];

export const SESSION_TIME_OPTIONS: ClassOption[] = [
	{ value: "evening", labelKey: "sessionEvening" },
	{ value: "morning", labelKey: "sessionMorning" },
	{ value: "afternoon", labelKey: "sessionAfternoon" },
	{ value: "weekend", labelKey: "sessionWeekend" },
];

export const PACKAGE_OPTIONS: ClassOption[] = [
	{ value: "not-sure", labelKey: "packageNotSure" },
	{ value: "starter", labelKey: "packageStarter" },
	{ value: "standard", labelKey: "packageStandard" },
	{ value: "intensive", labelKey: "packageIntensive" },
];

export const PRACTICE_TIME_OPTIONS: ClassOption[] = [
	{ value: "15", labelKey: "practice15" },
	{ value: "30", labelKey: "practice30" },
	{ value: "60", labelKey: "practice60" },
];
