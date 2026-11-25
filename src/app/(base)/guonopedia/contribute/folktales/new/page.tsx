import { FolktaleCreateForm } from "@/features/guonopedia/contributors";

export const metadata = {
	title: "Contribute a folktale | Guọnọpedia",
	description:
		"Share a story you know with Guọnọpedia. Add the words and details now; pictures and narration are added by our team later.",
};

export default function NewFolktalePage() {
	return <FolktaleCreateForm />;
}
