import { AdminClaimList } from "@/features/dashboard/places";

export const metadata = {
	title: "Place Claims — Admin",
	description: "Manage pending place ownership claims",
};

export default function Page() {
	return (
		<div className="w-full min-h-screen bg-[#F2FEFF]">
			<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<AdminClaimList />
			</div>
		</div>
	);
}
