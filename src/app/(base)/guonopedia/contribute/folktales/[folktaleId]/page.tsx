import { FolktaleDetailView } from "@/features/guonopedia/contributors";

export const metadata = {
	title: "Folktale | Guọnọpedia",
	description: "A folktale you have submitted to Guọnọpedia.",
};

export default async function FolktaleDetailPage({
	params,
}: {
	params: Promise<{ folktaleId: string }>;
}) {
	const { folktaleId } = await params;
	return <FolktaleDetailView folktaleId={folktaleId} />;
}
