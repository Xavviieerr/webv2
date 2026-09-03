"use client";

import { useWordCountTotalQuery } from "@/slice/wordEndpoints";
import { GenericSearchComponent } from "../genericSearchComponent";
import { FALLBACK_WORD_COUNT } from "../../constants/dictionary";

interface WelcomeToDictionaryProps {
	onSearch: (query: string) => void;
	onViewAllWords?: () => void;
}

export const WelcomeToDictionary = ({
	onSearch,
	onViewAllWords,
}: WelcomeToDictionaryProps) => {
	const { data: wordCountResponse, isLoading } = useWordCountTotalQuery();
	const wordCount =
		wordCountResponse?.data != null
			? wordCountResponse.data
			: FALLBACK_WORD_COUNT;

	return (
		<section className="w-full py-12 sm:py-16 lg:py-10 ">
			<div className="w-full max-w-7xl min-w-0 mx-auto flex flex-col items-center text-center px-0">
				{/* Icon */}
				<div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-6 bg-[#02474F]">
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden
					>
						<path
							d="M28.6666 6.84554C28.8462 6.94921 28.9991 7.09335 29.1132 7.26648C29.2273 7.43961 29.2995 7.63697 29.324 7.84287L29.3333 8.0002V25.3335C29.3333 25.5676 
                29.2717 25.7975 29.1546 26.0002C29.0376 26.2029 28.8693 26.3712 28.6666 26.4882C28.4639 26.6052 28.234 26.6668 28 26.6668C27.7659 
                26.6668 27.536 26.6052 27.3333 26.4882C25.8225 25.6158 24.1209 25.1273 22.3775 25.0655C20.634 25.0037 18.902 25.3704 17.3333 26.1335V5.90154C19.1751 
                5.21355 21.1463 4.94141 23.1057 5.10461C25.065 5.26781 26.964 5.86232 28.6666 6.84554ZM14.6666 5.90287L14.668 26.1349C13.161 
                25.4013 11.5024 25.0331 9.82665 25.0602C8.15086 25.0873 6.50505 25.5089 5.02263 26.2909L4.58663 26.5309L4.44929 26.5895L4.38396 
                26.6109L4.23729 26.6455L4.15596 26.6589L3.99996 26.6669H3.94396L3.79729 26.6509L3.69463 26.6322L3.55063 26.5895L3.38263 26.5149L3.25596 
                26.4402L3.13729 26.3509L3.05729 26.2762L2.95996 26.1669L2.87463 26.0482L2.84529 26.0002L2.80263 25.9202L2.74396 25.7829L2.72263 25.7175L2.68796 
                25.5709L2.67463 25.4895L2.66929 25.4242L2.66663 8.0002C2.66663 7.76616 2.72824 7.53624 2.84527 7.33356C2.96229 7.13087 3.13061 6.96256 3.33329 
                6.84554C5.03602 5.86253 6.93507 5.26826 8.89442 5.10529C10.8538 4.94232 12.8249 5.21468 14.6666 5.90287Z"
							fill="#F5DEB3"
						/>
					</svg>
				</div>

				{/* Title */}
				<h1 className="text-2xl lg:text-[32px] font-semibold text-gray-900 mb-3">
					Welcome to Urhobo Dictionary
				</h1>

				{/* Description */}
				<p className="text-base sm:text-lg text-gray-700 mb-2 max-w-xl">
					Discover meanings, pronunciations, and cultural context of Urhobo
					words.
				</p>

				{/* Word count  and view all words button*/}
				<div className="flex flex-col lg:flex-row items-center max-w-[450px] text-[20px] gap-4">
					<p className=" text-gray-600">
						Word Count: {isLoading ? "…" : wordCount.toLocaleString()}
					</p>
					{/* <button
            type="button"
            onClick={onViewAllWords}
            className="text-[#02474F] underline cursor-pointer hover:text-[#013238] transition-colors"
          >
            View all words
          </button> */}
				</div>

				{/* Search — GenericSearchComponent (suggestions, history, mobile drawer built-in) */}
				<div className="w-full max-w-2xl min-w-0 mt-5">
					<GenericSearchComponent onSearchOnly={onSearch} />
				</div>
			</div>
		</section>
	);
};
