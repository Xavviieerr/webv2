
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetFootballStandingsQuery } from "@/slice/endpoints"

interface StandingsProps {
  leagueId: number
  season: number
}

const getFormPattern = (form: string | null | undefined): string[] => {
  if (!form) return []
  const trimmed = form.trim()
  if (!trimmed) return []
  return trimmed.slice(-5).split("")
}

export const Standings = ({ leagueId, season }: StandingsProps) => {
  const { data, isLoading, isError } = useGetFootballStandingsQuery({
    leagueId,
    season,
  })

  const table =
    data?.data?.[0]?.league?.standings?.[0] ?? []

  return (
    <section className="rounded-2xl bg-white p-4 sm:p-6 space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-slate-900">
        Standings
      </h2>

      <div className="px-3 py-3 sm:px-4 sm:py-4 ">
        {isLoading && (
          <p className="text-xs sm:text-sm text-slate-500">Loading standings…</p>
        )}

        {isError && !isLoading && (
          <p className="text-xs sm:text-sm text-red-600">Failed to load standings.</p>
        )}

        {!isLoading && !isError && (
          <>
            {/* Header row */}
            <div className="hidden sm:grid grid-cols-[minmax(0,1.8fr)_repeat(4,minmax(0,0.8fr))_minmax(0,1.6fr)] items-center gap-2 border-b border-slate-100 pb-2 text-[11px] sm:text-xs font-medium text-slate-500">
              <span>Club</span>
              <span className="text-center">P</span>
              <span className="text-center">W</span>
              <span className="text-center">D</span>
              <span className="text-center">L</span>
              <span className="text-right pr-2 sm:pr-4">Last 5</span>
            </div>

            <ScrollArea className="mt-1 h-[260px] sm:h-[280px]">
              <div className="space-y-1 pr-2">
                {table.map((row, idx) => {
                  const formPattern = getFormPattern(row.form)
                  const played = row.all.played

                  return (
                    <div
                      key={`${row.team.id}-${idx}`}
                      className="rounded-lg border border-transparent px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm hover:border-slate-100 transition-colors"
                    >
                      {/* Mobile layout: compact row */}
                      <div className="flex items-center justify-between gap-2 sm:hidden">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 text-[11px] font-medium text-slate-500">
                            {row.rank}
                          </span>
                          <span className="inline-flex items-center justify-center rounded-full bg-white p-0.5">
                            <Image
                              src={row.team.logo}
                              alt={row.team.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          </span>
                          <span className="truncate font-medium text-slate-900">
                            {row.team.name}
                          </span>
                        </div>
                        <div className="flex flex-col items-end text-[11px]">
                          <span className="font-semibold text-slate-900">
                            {row.points} pts
                          </span>
                          <span className="text-slate-500">
                            {row.all.win}W {row.all.draw}D {row.all.lose}L
                          </span>
                        </div>
                      </div>

                      {/* Desktop layout: table-like grid */}
                      <div className="hidden sm:grid grid-cols-[minmax(0,1.8fr)_repeat(4,minmax(0,0.8fr))_minmax(0,1.6fr)] items-center gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 text-[11px] font-medium text-slate-500">
                            {row.rank}
                          </span>
                          <span className="inline-flex items-center justify-center rounded-full bg-white p-0.5">
                            <Image
                              src={row.team.logo}
                              alt={row.team.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          </span>
                          <span className="truncate font-medium text-slate-900">
                            {row.team.name}
                          </span>
                        </div>

                        <span className="text-center text-slate-900">
                          {played}
                        </span>
                        <span className="text-center text-slate-900">
                          {row.all.win}
                        </span>
                        <span className="text-center text-slate-900">
                          {row.all.draw}
                        </span>
                        <span className="text-center text-slate-900">
                          {row.all.lose}
                        </span>

                        <div className="flex justify-end gap-1 pr-1 sm:pr-3">
                          {formPattern.map((res, i) => (
                            <span
                              key={`${row.team.id}-res-${i}`}
                              className={`inline-flex size-4 items-center justify-center rounded-full text-[9px] font-bold ${
                                res === "W"
                                  ? "bg-emerald-500 text-white"
                                  : res === "D"
                                  ? "bg-slate-400 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </section>
  )
}
