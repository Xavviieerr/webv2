import { useEffect, useState } from "react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  } from "@/components/ui/select"
  import { GenericFixtureCard } from "./genericFixtureCard"
import {
  useGetFootballLeaguesQuery,
  useGetFootballFixturesQuery,
} from "@/slice/endpoints"
import type { FootballLeagueItem } from "@/slice/footballLeaguesSlice"
import { setFootballLeagues } from "@/slice/sportsSlice"
import type { RootState } from "@/store/store"

const PREMIER_LEAGUE_ID = 39

export const HomeTab = () => {
  const dispatch = useDispatch()
  const storedLeagues = useSelector((state: RootState) => state.sports.leagues)
  const hasStoredLeagues = storedLeagues.length > 0

  const { data: leaguesData, isLoading: leaguesLoading, isError: leaguesError } = useGetFootballLeaguesQuery(
    undefined,
    { skip: hasStoredLeagues }
  )

  useEffect(() => {
    if (leaguesData?.data?.length) {
      dispatch(setFootballLeagues(leaguesData.data))
    }
  }, [dispatch, leaguesData?.data])

  const leagues = hasStoredLeagues ? storedLeagues : (leaguesData?.data ?? [])
  const [selectedLeagueId, setSelectedLeagueId] = useState<number>(PREMIER_LEAGUE_ID)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-10">
      <div className="col-span-1 md:col-span-3">
        <MatchesColumn
          selectedLeagueId={selectedLeagueId}
          leagues={leagues}
        />
      </div>
      <div className="col-span-1 md:col-span-1">
        <LeaguesColumn
          leagues={leagues}
          selectedLeagueId={selectedLeagueId}
          onSelectLeague={setSelectedLeagueId}
          isLoading={leaguesLoading}
          isError={leaguesError}
        />
      </div>
    </div>
  )
}

/* function formatDateForApi(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
} */

interface MatchesColumnProps {
  selectedLeagueId: number
  leagues: FootballLeagueItem[]
}

const MatchesColumn = ({ selectedLeagueId, leagues }: MatchesColumnProps) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const hasReachedAugust = now.getMonth() >= 7 // 0-based month index; 7 = August
  const firstSeasonYear = hasReachedAugust ? currentYear : currentYear - 1
  const [season, setSeason] = useState(String(firstSeasonYear))
  /* const [anchorDate, setAnchorDate] = useState<Date>(new Date()) */
  /* const [activeIndex, setActiveIndex] = useState<number>(2) // center chip */

  const seasonNum = parseInt(season, 10) || firstSeasonYear

  // Keep date scroll in the selected season year when user changes season
/*   useEffect(() => {
    setAnchorDate((prev) => {
      const targetYear = seasonNum
      if (prev.getFullYear() === targetYear) return prev
      return new Date(targetYear, prev.getMonth(), prev.getDate())
    })
  }, [seasonNum]) */
/* 
  const dateChips = useMemo(() => {
    const offsets = [-2, -1, 0, 1, 2, 3]

    return offsets.map((offset, idx) => {
      const d = new Date(anchorDate)
      d.setDate(anchorDate.getDate() + offset)

      let label: string
      if (offset === -1) label = "Yesterday"
      else if (offset === 0) label = "Today"
      else if (offset === 1) label = "Tomorrow"
      else {
        const day = d
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            weekday: "short",
          })
          .split(" ")
        label = `${day[1]} ${day[0].replace(",", "")}`
      }

      return {
        id: idx,
        date: d,
        label,
      }
    })
  }, [anchorDate])
 */
  /* const activeDate = dateChips[activeIndex]?.date ?? anchorDate */ 

  const { data: fixturesData, isLoading: fixturesLoading } = useGetFootballFixturesQuery(
    {
      leagueId: selectedLeagueId,
      season: seasonNum,
      /* date: dateParam,  */
    },
    {
      // Let RTK Query cache fixtures per league/season and only refetch
      // when args change or cache expires, instead of on every remount.
      skip: selectedLeagueId <= 0,
    }
  )

  const fixtures = fixturesData?.data ?? []

  const groupedByStatus = fixtures.reduce<Record<string, typeof fixtures>>((acc, fx) => {
    const key = fx.fixture.status.short || "OTHER"
    if (!acc[key]) acc[key] = []
    acc[key].push(fx)
    return acc
  }, {})

  const statusOrder = (key: string) => {
    if (key === "FT") return 0
    return 1
  }

  const sortedGroups = Object.entries(groupedByStatus).sort(
    ([aKey], [bKey]) => statusOrder(aKey) - statusOrder(bKey)
  )

  const getGroupLabel = (key: string, sampleLong?: string) => {
    if (key === "FT") return "Full Time"
    return sampleLong || key
  }
  const selectedLeague = leagues.find((item) => item.league.id === selectedLeagueId)

  return (
    <section className="w-full h-full rounded-2xl bg-[#8AA5A81A] p-4 sm:p-6 flex flex-col gap-4">
      {/* Calendar month and date chips UI temporarily disabled */}
      {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm sm:text-base font-medium text-slate-900">
          Calendar month:{" "}
          <span className="font-semibold">
            {activeDate.toLocaleDateString("en-GB", { month: "long" })}
            {" – "}
            {new Date(
              activeDate.getFullYear(),
              activeDate.getMonth() + 1,
              0
            ).toLocaleDateString("en-GB", { month: "long" })}
          </span>
        </p>
      </div> */}

      <div className="flex items-center gap-6 text-sm">
          <div className="inline-flex items-center gap-2 text-slate-900">
            <span className="inline-flex size-6 items-center justify-center rounded-full overflow-hidden bg-white">
              <Image
                src={`https://media.api-sports.io/football/leagues/${selectedLeagueId}.png`}
                alt={selectedLeague?.league.name ?? "League"}
                width={24}
                height={24}
                className="rounded-full object-contain"
              />
            </span>
            <span className="text-xs sm:text-sm font-medium">
              {selectedLeague?.league.name ?? "League"}
            </span>
          </div>

          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger
              size="sm"
              className="h-auto border-none bg-transparent px-0 py-0 text-xs sm:text-sm text-slate-900 shadow-none hover:bg-transparent focus-visible:ring-0 focus-visible:border-transparent"
            >
              <SelectValue placeholder="Season">Season</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 30 }).map((_, index) => {
                const year = firstSeasonYear - index
                return (
                  <SelectItem key={year} value={String(year)}>
                    {year} / {year + 1}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
      </div>

      {/* Date chips temporarily disabled */}
      {/* <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full justify-between">
        ...
      </div> */}
      
      <div className="w-full space-y-4">
        {fixturesLoading ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#0E808D] animate-pulse" aria-hidden />
              Fetching fixtures…
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="h-20 rounded-md bg-slate-200/60 animate-pulse" />
              <div className="h-20 rounded-md bg-slate-200/60 animate-pulse" />
            </div>
          </div>
        ) : fixtures.length === 0 ? (
          <p className="text-sm text-slate-600 py-4">
            No fixtures available.
          </p>
        ) : (
          sortedGroups.map(([statusKey, items]) => (
            <div key={statusKey} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {getGroupLabel(statusKey, items[0]?.fixture.status.long)}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((fixture) => (
                  <GenericFixtureCard key={fixture.fixture.id} fixture={fixture} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}


interface LeaguesColumnProps {
  leagues: FootballLeagueItem[]
  selectedLeagueId: number
  onSelectLeague: (id: number) => void
  isLoading: boolean
  isError: boolean
}

const LeaguesColumn = ({
  leagues,
  selectedLeagueId,
  onSelectLeague,
  isLoading,
  isError,
}: LeaguesColumnProps) => {
  const selectedId = selectedLeagueId

  if (isLoading) {
    return (
      <aside className="w-full h-full rounded-2xl bg-[#8AA5A81A] p-4 sm:p-5 flex flex-col gap-4">
        <h2 className="text-base font-medium tracking-[0.18em] text-slate-700">
          LEAGUES
        </h2>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-11 rounded-lg bg-slate-200/60 animate-pulse"
            />
          ))}
        </div>
      </aside>
    )
  }

  if (isError) {
    return (
      <aside className="w-full h-full rounded-2xl bg-[#8AA5A81A] p-4 sm:p-5 flex flex-col gap-4">
        <h2 className="text-base font-medium tracking-[0.18em] text-slate-700">
          LEAGUES
        </h2>
        <p className="text-sm text-slate-600">Failed to load leagues.</p>
      </aside>
    )
  }

  return (
    <aside className="w-full h-full rounded-2xl bg-[#8AA5A81A] p-4 sm:p-5 flex flex-col gap-4">
      <h2 className="text-[16px] font-medium">
        LEAGUES
      </h2>

      <div className="space-y-2">
        {leagues.map((item) => {
          const isActive = item.league.id === selectedId
          return (
            <button
              key={item.league.id}
              type="button"
              onClick={() => onSelectLeague(item.league.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[#0E808D] text-white"
                  : "text-slate-800 hover:bg-white/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-full overflow-hidden bg-white">
                  <Image
                    src={`https://media.api-sports.io/football/leagues/${item.league.id}.png`}
                    alt={item.league.name}
                    width={24}
                    height={24}
                    className="rounded-full object-contain"
                  />
                </span>
                <span className="text-[14px] font-medium">{item.league.name}</span>
              </span>

              {isActive && (
                <span className="inline-block size-1.5 rounded-full bg-white" />
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
