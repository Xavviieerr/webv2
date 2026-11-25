import { FolktaleEditForm } from "@/features/guonopedia/contributors";

export const metadata = {
	title: "Edit folktale | Guọnọpedia",
	description: "Edit a folktale draft before sending it for review.",
};

export default async function EditFolktalePage({
	params,
}: {
	params: Promise<{ folktaleId: string }>;
}) {
	const { folktaleId } = await params;
	return <FolktaleEditForm folktaleId={folktaleId} />;
}
