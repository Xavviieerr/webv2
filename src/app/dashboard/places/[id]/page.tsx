import { PlaceDetailPage } from "@/features/dashboard/places";

export const metadata = {
	title: "Place",
	description: "View place details",
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
	return <PlaceDetailPage params={params} />;
}
