export interface ClassCoach {
	id: string;
	nameKey: string;
	tagKey: string;
	descriptionKey: string;
	rating: string;
	years: string;
}

export const CLASS_COACHES: ClassCoach[] = [
	{
		id: "oghenero",
		nameKey: "coach1Name",
		tagKey: "coach1Tag",
		descriptionKey: "coach1Description",
		rating: "4.9",
		years: "6",
	},
	{
		id: "eloho",
		nameKey: "coach2Name",
		tagKey: "coach2Tag",
		descriptionKey: "coach2Description",
		rating: "5.0",
		years: "5",
	},
	{
		id: "oghenekevwe",
		nameKey: "coach3Name",
		tagKey: "coach3Tag",
		descriptionKey: "coach3Description",
		rating: "4.9",
		years: "8",
	},
];
