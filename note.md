  {/* {
          records.length === 0 && (
            <div className="mt-10 max-w-xl mx-auto bg-white border border-[#05353A]/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#05353A] mb-2">
                Word not found
              </h2>

              <p className="text-gray-600 mb-4">
                We couldn’t find an exact match for <strong>{term}</strong>.
              </p>

              {isSuggesting ? (
                <div className="flex items-center gap-2 text-[#05353A]">
                  <RiLoader2Fill className="animate-spin" />
                  <span>Searching for similar words…</span>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <p className="font-medium text-[#05353A] mb-3">
                    Did you mean:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleWordClick(sug)}
                        className="px-4 py-2 rounded-full bg-[#05353A]/10 text-[#05353A] font-medium hover:bg-[#05353A]/20 transition"
                      >
                        {sug.word}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">
                  No similar words found.
                </p>
              )}
            </div>
          )
        } */}