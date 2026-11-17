export interface LearningLevel {
	id: number;
	emoji: string;
	titleKey: string;
	descriptionKey: string;
	xp?: string;
}

export const LEARNING_LEVELS: LearningLevel[] = [
	{
		id: 1,
		emoji: "👋",
		titleKey: "level1Title",
		descriptionKey: "level1Description",
		xp: "+100 XP",
	},
	{
		id: 2,
		emoji: "🏠",
		titleKey: "level2Title",
		descriptionKey: "level2Description",
		xp: "+120 XP",
	},
	{
		id: 3,
		emoji: "🍲",
		titleKey: "level3Title",
		descriptionKey: "level3Description",
		xp: "+140 XP",
	},
	{
		id: 4,
		emoji: "🔢",
		titleKey: "level4Title",
		descriptionKey: "level4Description",
		xp: "+150 XP",
	},
	{
		id: 5,
		emoji: "📖",
		titleKey: "level5Title",
		descriptionKey: "level5Description",
		xp: "+180 XP",
	},
	{
		id: 6,
		emoji: "💬",
		titleKey: "level6Title",
		descriptionKey: "level6Description",
		xp: "+200 XP",
	},
	{
		id: 7,
		emoji: "👑",
		titleKey: "level7Title",
		descriptionKey: "level7Description",
	},
];
