import { GuonopediaWordDetail } from "@/features/guonopedia/search/GuonopediaWordDetail";

const GuonopediaWordPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ otaWord?: string }>;
}) => {
  const slug = (await params).slug;
  const otaWord = (await searchParams).otaWord;
  return <GuonopediaWordDetail slug={slug} otaWord={otaWord} />;
};

export default GuonopediaWordPage;
