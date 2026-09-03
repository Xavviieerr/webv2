import Image from "next/image"
import Link from "next/link"
import type { FootballFixtureItem } from "@/slice/footballLeaguesSlice"

interface GenericFixtureCardProps {
  fixture?: FootballFixtureItem | null
  fixtureId?: string
}

function formatFixtureTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

export const GenericFixtureCard = ({
  fixture,
}: GenericFixtureCardProps) => {
  if (!fixture) {
    return (
      <div className="flex w-full items-stretch rounded-md bg-[#F2FEFF] px-4 py-3 text-xs sm:text-sm text-slate-500">
        <div className="flex w-full items-center justify-center py-6">
          No match data
        </div>
      </div>
    )
  }

  const { fixture: f, teams, goals, score } = fixture
  const status = f.status.short
  const elapsed = f.status.elapsed != null ? `${f.status.elapsed}` : ""
  const homeGoals = score?.fulltime?.home ?? goals?.home ?? 0
  const awayGoals = score?.fulltime?.away ?? goals?.away ?? 0
  const linkId = String(f.id)
  const leagueId = fixture.league.id
  const season = fixture.league.season

  return (
    <Link
      href={`/sports/${linkId}?leagueId=${leagueId}&season=${season}`}
      className="flex w-full flex-col gap-3 rounded-md bg-[#F2FEFF] px-4 py-3 text-xs sm:text-sm text-slate-800 transition hover:bg-[#E4F8FF] sm:flex-row sm:items-stretch"
    >
      {/* Left: status & time */}
      <div className="flex w-full flex-row items-center justify-between gap-2 sm:w-1/3 sm:flex-col sm:justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-medium text-slate-500 shrink-0">
            {status}
          </span>
          <span className="text-[11px] text-slate-600 truncate max-w-[100px] sm:max-w-[60px]">
            {fixture.league.round}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600 min-w-0">
          <span className="shrink-0">
            {elapsed ? `${elapsed} min` : formatFixtureTime(f.date)}
          </span>
          <span className="font-medium truncate">
            {f.status.long}
          </span>
        </div>
      </div>

      {/* Middle: scores (desktop/tablet only – mobile scores are beside each team) */}
      <div className="hidden w-full flex-row items-center justify-between gap-4 font-semibold text-slate-900 sm:flex sm:w-1/3 sm:flex-col sm:items-center sm:justify-center sm:gap-1">
        <span className="text-base sm:text-lg">{homeGoals}</span>
        <span className="text-slate-500 font-normal">-</span>
        <span className="text-base sm:text-lg">{awayGoals}</span>
      </div>

      {/* Right: teams (mobile: scores aligned per team row) */}
      <div className="flex w-full flex-col items-start justify-between gap-1.5 text-left sm:w-1/3">
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white border border-slate-200">
              <Image
                src={teams.home.logo}
                alt={teams.home.name}
                width={20}
                height={20}
                className="rounded-full object-contain"
              />
            </span>
            <span className="text-[13px] font-medium text-slate-900 truncate">
              {teams.home.name}
            </span>
          </div>
          {/* Mobile-only home score aligned to the right of the row */}
          <span className="text-sm font-semibold text-slate-900 sm:hidden">
            {homeGoals}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white border border-slate-200">
              <Image
                src={teams.away.logo}
                alt={teams.away.name}
                width={20}
                height={20}
                className="rounded-full object-contain"
              />
            </span>
            <span className="text-[13px] font-medium text-slate-900 truncate">
              {teams.away.name}
            </span>
          </div>
          {/* Mobile-only away score aligned to the right of the row */}
          <span className="text-sm font-semibold text-slate-900 sm:hidden">
            {awayGoals}
          </span>
        </div>
      </div>
    </Link>
  )
}
