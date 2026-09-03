import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { session } from "@/features/auth/services/session";

const NewlyAddedWords = () => {
  const router = useRouter();
  const handleNext = (word: string) => {
    router.push(
      `/dashboard/dictionary/word-details?term=${encodeURIComponent(word)}`,
    );
  };

  const [words, setWords] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchNewWords = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/word/to-review-and-ratings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch newly coined words");
      }
      const { data } = await res.json();
      return setWords(data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { accessToken } = session.loadTokens();
    if (accessToken) {
      fetchNewWords(accessToken);
    }
  }, []);

  // Transform API response to component format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      approved: "Approved",
      pending: "Open for Review",
      rejected: "Rejected",
    };
    return statusMap[status.toLowerCase()] || "Open for Review";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getPronunciation = (word: any) => {
    if (word?.oho && word.oho.length > 0) {
      const firstOho = word.oho[0];
      return firstOho.uphoesio || firstOho.upho || "";
    }
    return "";
  };
  return (
    <section className="w-full py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Tag */}
        <div className="lg:mb-6 flex justify-start">
          <div
            className="inline-block rounded-xl py-2.5 px-4 text-center"
            style={{ backgroundColor: "#F7E0B3" }}
          >
            <h2 className="text-base sm:text-lg font-medium text-[#02474F]">
              Newly Added Words
            </h2>
          </div>
        </div>

        {/* Grid of Word Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative rounded-lg p-4 sm:p-5 bg-white flex flex-col min-h-[160px] border border-gray-200/30 shadow-sm animate-pulse"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-full mt-auto"></div>
              </div>
            ))}
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No newly added words available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {words.map((word: any) => {
              const pronunciation = getPronunciation(word);
              const statusDisplay = getStatusDisplay(word.status);
              const dateAdded = formatDate(word.createdAt);

              return (
                <div
                  key={word.id}
                  onClick={() => handleNext(word.ota)}
                  className="relative cursor-pointer rounded-lg p-4 bg-white sm:p-5 flex flex-col min-h-[160px] border border-gray-200/30 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Top Row: Word + Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 min-w-0">
                      {word.ota}
                    </h3>
                    <div
                      className="shrink-0 rounded-md px-2.5 py-2 text-xs font-normal whitespace-nowrap"
                      style={{
                        backgroundColor: "#0E808D1A",
                        color: "#05353A",
                      }}
                    >
                      {statusDisplay}
                    </div>
                  </div>

                  {/* Pronunciation */}
                  {pronunciation && (
                    <p className="text-sm text-gray-600 italic mb-auto ">
                      /{pronunciation}/
                    </p>
                  )}

                  {/* Bottom Row: Date + View Link */}
                  <div className="flex items-center justify-between mt-auto pt-3 bg-white rounded-lg p-2">
                    <p className="text-xs text-gray-500">Added - {dateAdded}</p>
                    <button
                      type="button"
                      onClick={() => handleNext(word.ota)}
                      className="text-sm font-medium text-[#007BFF] hover:underline transition-colors"
                    >
                      View Word
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewlyAddedWords;
