import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs"
import Image from "next/image"
import { useState } from "react"
import { Standings } from "./standings"
import type { FootballFixtureItem, FootballLineupTeamData } from "@/slice/footballLeaguesSlice"
import { useGetFootballLineupQuery } from "@/slice/endpoints"

interface SingleFixtureProps {
  fixture: FootballFixtureItem | null
}

export const SingleFixture = ({ fixture }: SingleFixtureProps) => {
  const fixtureId = fixture?.fixture.id
  const { data: lineupData, isLoading: lineupLoading } = useGetFootballLineupQuery(
    { fixtureId: fixtureId ?? 0 },
    { skip: !fixtureId }
  )

  return (
    <div className="w-full space-y-6">
      <MainFixureCard fixture={fixture} />
      <FixtureInformation
        fixture={fixture}
        lineup={lineupData?.data}
        lineupLoading={lineupLoading}
      />
    </div>
  )
}

interface MainFixtureCardProps {
  fixture: FootballFixtureItem | null
}

const MainFixureCard = ({ fixture }: MainFixtureCardProps) => {
  if (!fixture) {
    return (
      <section className="relative w-full min-h-[254px] overflow-hidden rounded-2xl bg-white px-4 py-4 sm:px-10 sm:py-6">
        <div className="h-full w-full animate-pulse rounded-2xl bg-slate-200/60" />
      </section>
    )
  }

  const { league, teams, score, fixture: f } = fixture
  const homeGoals = score.fulltime.home ?? score.halftime.home ?? 0
  const awayGoals = score.fulltime.away ?? score.halftime.away ?? 0
  const statusShort = f.status.short
  const statusLong = f.status.long
  const minute = f.status.elapsed

  return (
    <section className="relative w-full min-h-[254px] overflow-hidden rounded-2xl bg-white px-4 py-4 sm:px-10 sm:py-6">
      {/* Faded background flags */}
      <div className="pointer-events-none absolute inset-0 flex justify-between opacity-10">
        <Image
          src={teams.home.logo}
          alt="Portugal flag background"
          width={260}
          height={260}
          className="object-cover w-1/3 translate-x-[-50px]"
        />
        <Image
          src={teams.away.logo}
          alt="Belgium flag background"
          width={260}
          height={260}
          className="object-cover w-1/3 translate-x-10"
        />
      </div>

      {/* Foreground content */}
      <div className="relative flex flex-col gap-4">
        {/* Top row: league + stadium */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-900">
          <div className="flex items-center gap-2 min-w-0">
            <Image
              src={league.logo}
              alt={league.name}
              width={22}
              height={22}
              className="rounded-full object-contain bg-white"
            />
            <span className="font-medium truncate max-w-[180px] sm:max-w-xs">
              {league.name}
            </span>
          </div>

          <div className="rounded-full px-3 py-1 text-[11px] sm:text-xs font-medium text-slate-900 bg-white/70 truncate max-w-full sm:max-w-[220px]">
            {f.venue.name || "Stadium"}
          </div>
        </div>

        {/* Middle row: teams and centered score/time */}
        <div className="mt-6 mb-4 flex flex-col items-stretch gap-4 sm:mt-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Home team */}
          <div className="flex w-full items-center justify-center gap-x-3 sm:justify-end">
            <span className="inline-flex items-center justify-center rounded-full bg-white p-0.5">
              <Image
                src={teams.home.logo}
                alt={teams.home.name}
                width={28}
                height={28}
                className="rounded-full object-contain"
              />
            </span>
            <span className="truncate text-base sm:text-xl font-medium text-slate-900 max-w-[55%] sm:max-w-none">
              {teams.home.name}
            </span>
          </div>

          {/* Score + time (centered) */}
          <div className="flex w-full flex-col items-center justify-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-2xl sm:text-3xl font-semibold text-slate-900">
              <span className="min-w-6 text-center">{homeGoals}</span>
              <span className="font-normal text-slate-500">-</span>
              <span className="min-w-6 text-center">{awayGoals}</span>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-[#0E8F3C]">
              {statusShort === "FT"
                ? statusLong
                : minute != null
                ? `${minute}'`
                : statusLong}
            </span>
          </div>

          {/* Away team */}
          <div className="flex w-full items-center justify-center gap-x-3 sm:justify-start">
            <span className="truncate text-base sm:text-xl font-medium text-slate-900 max-w-[55%] sm:max-w-none text-right sm:text-left">
              {teams.away.name}
            </span>
            <span className="inline-flex items-center justify-center rounded-full bg-white p-0.5">
              <Image
                src={teams.away.logo}
                alt={teams.away.name}
                width={28}
                height={28}
                className="rounded-full object-contain"
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

interface FixtureInformationProps {
  fixture: FootballFixtureItem | null
  lineup?: FootballLineupTeamData[]
  lineupLoading?: boolean
}

const FixtureInformation = ({ fixture, lineup, lineupLoading }: FixtureInformationProps) => {
  const [activeTab, setActiveTab] = useState("stats")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }
  return (
    <div className="space-y-6">
      <div className="w-full rounded-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          defaultValue="stats"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="w-full justify-start overflow-x-auto overflow-y-hidden rounded-md bg-[#F2FEFF]">
           
            <TabsTrigger
              value="team-formation"
              className="px-4 h-8 rounded-md text-xs sm:text-sm text-slate-600 data-[state=active]:bg-[#0E808D] data-[state=active]:text-white"
            >
              Team Formation
            </TabsTrigger>
            <TabsTrigger
              value="line-ups"
              className="px-4 h-8 rounded-md text-xs sm:text-sm text-slate-600 data-[state=active]:bg-[#0E808D] data-[state=active]:text-white"
            >
              Line-ups
            </TabsTrigger>
            <TabsTrigger
              value="standings"
              className="px-4 h-8 rounded-md text-xs sm:text-sm text-slate-600 data-[state=active]:bg-[#0E808D] data-[state=active]:text-white"
            >
              Standings
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "team-formation" && (() => {
        const homeTeamId = fixture?.teams.home.id
        const awayTeamId = fixture?.teams.away.id
        const homeLineup =
          lineup?.find((l) => l.team.id === homeTeamId) ?? (lineup && lineup[0]) ?? undefined
        const awayLineup =
          lineup?.find((l) => l.team.id === awayTeamId) ?? (lineup && lineup[1]) ?? undefined

        const homeTeamName = homeLineup?.team.name ?? fixture?.teams.home.name ?? "Home"
        const awayTeamName = awayLineup?.team.name ?? fixture?.teams.away.name ?? "Away"
        const homeFormation = homeLineup?.formation ?? "3-5-2"
        const awayFormation = awayLineup?.formation ?? "4-5-1"
        const homeLogo = homeLineup?.team.logo ?? fixture?.teams.home.logo ?? "/images/dish.svg"
        const awayLogo = awayLineup?.team.logo ?? fixture?.teams.away.logo ?? "/images/dish.svg"

        const homeKeeper =
          homeLineup?.startXI.find((p) => p.player.pos === "G")?.player.number ?? null
        const awayKeeper =
          awayLineup?.startXI.find((p) => p.player.pos === "G")?.player.number ?? null

        const homeOutfield =
          homeLineup?.startXI
            .filter((p) => p.player.pos !== "G")
            .map((p) => p.player.number ?? null) ?? []
        const awayOutfield =
          awayLineup?.startXI
            .filter((p) => p.player.pos !== "G")
            .map((p) => p.player.number ?? null) ?? []

        return (
          <TeamFormation
            homeTeam={homeTeamName}
            awayTeam={awayTeamName}
            homeFormation={homeFormation}
            awayFormation={awayFormation}
            homeLogo={homeLogo}
            awayLogo={awayLogo}
            homeKeeperNumber={homeKeeper}
            awayKeeperNumber={awayKeeper}
            homeOutfieldNumbers={homeOutfield}
            awayOutfieldNumbers={awayOutfield}
          />
        )
      })()}

      {activeTab === "line-ups" && (
        <LineUps
          fixture={fixture}
          lineup={lineup}
          isLoading={!!lineupLoading}
        />
      )}

      {activeTab === "standings" && fixture && (
        <Standings leagueId={fixture.league.id} season={fixture.league.season} />
      )}
    </div>
  )
}


type FormationLine = number[]

interface TeamFormationProps {
  homeTeam?: string
  awayTeam?: string
  homeFormation?: string
  awayFormation?: string
  homeLogo?: string
  awayLogo?: string
  homeKeeperNumber?: number | null
  awayKeeperNumber?: number | null
  homeOutfieldNumbers?: (number | null)[]
  awayOutfieldNumbers?: (number | null)[]
}

const parseFormation = (formation: string): FormationLine => {
  return formation
    .split("-")
    .map((part) => parseInt(part, 10))
    .filter((n) => !Number.isNaN(n))
}


const TeamFormation = ({
  homeTeam = "Idjerhe",
  awayTeam = "Okpe",
  homeFormation = "3-5-2",
  awayFormation = "4-5-1",
  homeLogo = "/images/portugal.svg",
  awayLogo = "/images/belgiumsv.svg",
  homeKeeperNumber = 1,
  awayKeeperNumber = 1,
  homeOutfieldNumbers,
  awayOutfieldNumbers,
}: TeamFormationProps) => {
  const homeLines = parseFormation(homeFormation)
  const awayLines = parseFormation(awayFormation)

  // Outfield player numbers (goalkeeper handled separately at each box).
  // If real numbers from lineup are provided, use them; otherwise fall back to a default sequence.
  const defaultOutfield = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const homeNumbers = (homeOutfieldNumbers && homeOutfieldNumbers.length > 0
    ? homeOutfieldNumbers
    : defaultOutfield) as (number | null)[]
  const awayNumbers = (awayOutfieldNumbers && awayOutfieldNumbers.length > 0
    ? awayOutfieldNumbers
    : defaultOutfield) as (number | null)[]

  const renderSide = (
    lines: FormationLine,
    numbers: (number | null)[],
    keeperNumber: number | null,
    isLeft: boolean,
    color: "home" | "away"
  ) => {
    // For the away team (right side) we reverse both the lines and the
    // sequence of shirt numbers so that defenders still sit closest to
    // their own goal and forwards furthest up the pitch.
    let idx = 0
    const orderedLines = isLeft ? lines : [...lines].reverse()
    const numberSeq = isLeft ? numbers : [...numbers].reverse()

    return (
      <div
        className={`relative flex h-full w-1/2 ${
          isLeft ? "pr-2 justify-start" : "pl-2 justify-end"
        }`}
      >
        {/* Outfield players */}
        <div className="flex h-full flex-1 px-8 sm:px-4 gap-4 sm:gap-2">
          {orderedLines.map((count, colIndex) => (
            <div
              key={`${color}-${colIndex}`}
              className="flex flex-1 flex-col items-center justify-center gap-2 py-1 sm:gap-16 sm:py-8"
            >
              {Array.from({ length: count }).map((_, i) => {
                const num = numberSeq[idx++] ?? null
                return (
                  <div
                    key={`${color}-${colIndex}-${i}`}
                    className={`flex size-5 sm:size-7 items-center justify-center rounded-full text-[9px] sm:text-[11px] font-semibold ${
                      color === "home"
                        ? "bg-red-600 text-white"
                        : "bg-yellow-300 text-black"
                    }`}
                  >
                    {num != null ? num : ""}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Goalkeeper */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 flex ${
            isLeft ? "left-[3%] justify-start" : "right-[3%] justify-end"
          }`}
        >
          <div
            className={`flex size-6 sm:size-8 items-center justify-center rounded-full text-[9px] sm:text-[11px] font-semibold ${
              color === "home"
                ? "bg-red-600 text-white"
                : "bg-yellow-300 text-black"
            }`}
          >
            {keeperNumber ?? ""}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="rounded-2xl sm:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 text-sm text-slate-900 sm:text-base">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-white ">
            <Image
              src={homeLogo}
              alt={homeTeam}
              width={28}
              height={28}
              className="rounded-full"
            />
          </span>
          <div className="flex flex-col">
            <span className="font-medium">{homeTeam}</span>
            <span className="text-xs text-slate-500">{homeFormation}</span>
          </div>
        </div>

        <span className="text-xs sm:text-sm text-slate-500">Formation</span>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="font-medium">{awayTeam}</span>
            <span className="text-xs text-slate-500">{awayFormation}</span>
          </div>
          <span className="inline-flex items-center justify-center rounded-full bg-white p-0.5">
            <Image
              src={awayLogo}
              alt={awayTeam}
              width={28}
              height={28}
              className="rounded-full"
            />
          </span>
        </div>
      </div>

      {/* Pitch */}
      <div className="relative mx-auto  aspect-4/3 w-full max-w-4xl rounded-xl bg-[#075B1C] border border-white/20 overflow-hidden sm:aspect-video">
        {/* Center line & circle */}
        <div className="absolute inset-y-4 left-1/2 w-px bg-white/60" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/60" />

        {/* Penalty boxes (detailed) */}
        {/* Left penalty area */}
        <div className="absolute top-[14%] bottom-[14%] left-0 w-[18%] border border-white/70 border-l-0 rounded-tr-sm rounded-br-sm" />
        <div className="absolute top-[28%] bottom-[28%] left-0 w-[9%] border border-white/70 border-l-0 rounded-tr-sm rounded-br-sm" />
        {/* Left goal */}
        <div className="absolute top-1/2 left-0 h-10 w-[2%] -translate-y-1/2 border border-white/80 border-l-0 rounded-tr-sm rounded-br-sm" />
        {/* Left penalty arc */}
        <div className="absolute top-1/2 left-[18%] h-16 w-16 -translate-y-1/2 -translate-x-1/2 rounded-full border border-white/60 border-l-0" />

        {/* Right penalty area */}
        <div className="absolute top-[14%] bottom-[14%] right-0 w-[18%] border border-white/70 border-r-0 rounded-tl-sm rounded-bl-sm" />
        <div className="absolute top-[28%] bottom-[28%] right-0 w-[9%] border border-white/70 border-r-0 rounded-tl-sm rounded-bl-sm" />
        {/* Right goal */}
        <div className="absolute top-1/2 right-0 h-10 w-[2%] -translate-y-1/2 border border-white/80 border-r-0 rounded-tl-sm rounded-bl-sm" />
        {/* Right penalty arc */}
        <div className="absolute top-1/2 right-[18%] h-16 w-16 -translate-y-1/2 translate-x-1/2 rounded-full border border-white/60 border-r-0" />

        <div className="absolute inset-1 sm:inset-2 flex">
          {renderSide(homeLines, homeNumbers, homeKeeperNumber, true, "home")}
          {renderSide(awayLines, awayNumbers, awayKeeperNumber, false, "away")}
        </div>
      </div>
    </section>
  )
}

interface LineUpsRow {
  number: string
  name: string
}

interface LineUpsBlock {
  title: string
  rows: LineUpsRow[]
}

interface LineUpsProps {
  fixture: FootballFixtureItem | null
  lineup?: FootballLineupTeamData[]
  isLoading: boolean
}

const buildBlocksFromLineup = (team: FootballLineupTeamData | undefined): LineUpsBlock[] => {
  if (!team) return []

  const starters: LineUpsBlock = {
    title: "Team Line Up",
    rows: team.startXI.map((entry) => ({
      number: entry.player.number != null ? String(entry.player.number) : "",
      name: entry.player.name,
    })),
  }

  const subs: LineUpsBlock = {
    title: "Substitutes",
    rows: team.substitutes.map((entry) => ({
      number: entry.player.number != null ? String(entry.player.number) : "",
      name: entry.player.name,
    })),
  }

  const manager: LineUpsBlock = {
    title: "Manager",
    rows: [
      {
        number: "",
        name: team.coach.name,
      },
    ],
  }

  return [starters, subs, manager]
}

const LineUps = ({ fixture, lineup, isLoading }: LineUpsProps) => {
  const homeTeamId = fixture?.teams.home.id
  const awayTeamId = fixture?.teams.away.id

  const homeLineup =
    lineup?.find((l) => l.team.id === homeTeamId) ?? (lineup && lineup[0]) ?? undefined
  const awayLineup =
    lineup?.find((l) => l.team.id === awayTeamId) ?? (lineup && lineup[1]) ?? undefined

  const homeBlocks = buildBlocksFromLineup(homeLineup)
  const awayBlocks = buildBlocksFromLineup(awayLineup)

  const renderBlock = (block: LineUpsBlock, keyPrefix: string) => (
    <div key={`${keyPrefix}-${block.title}`} className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {block.title}
      </h3>
      <div className="space-y-1 text-xs sm:text-sm text-slate-800">
        {block.rows.map((row, idx) => (
          <div
            key={`${keyPrefix}-${block.title}-${idx}`}
            className="flex items-center justify-between gap-4"
          >
            <span className="font-medium text-[#0E8F3C]">
              {row.number && <span className="mr-1">{row.number}</span>}
              {row.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className="rounded-2xl bg-white p-4 sm:p-8 space-y-6">
      <h2 className="text-base sm:text-lg font-semibold text-slate-900">
        Line-ups
      </h2>

      {isLoading && (
        <p className="text-xs sm:text-sm text-slate-500">
          Loading line-ups…
        </p>
      )}

      {!isLoading && (!homeBlocks.length || !awayBlocks.length) && (
        <p className="text-xs sm:text-sm text-slate-500">
          Line-ups are not available for this fixture.
        </p>
      )}

      {(homeBlocks.length > 0 || awayBlocks.length > 0) && (
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
          {/* Left team */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-full bg-white p-0.5">
                <Image
                  src={homeLineup?.team.logo ?? fixture?.teams.home.logo ?? "/images/dish.svg"}
                  alt={homeLineup?.team.name ?? fixture?.teams.home.name ?? "Home team"}
                  width={28}
                  height={28}
                  className="rounded-full object-contain"
                />
              </span>
              <span className="text-lg font-semibold text-slate-900">
                {homeLineup?.team.name ?? fixture?.teams.home.name ?? "Home"}
              </span>
            </div>

            <div className="space-y-4">
              {homeBlocks.map((block) => renderBlock(block, "left"))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-slate-200/80" />

          {/* Right team */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-full bg-white p-0.5">
                <Image
                  src={awayLineup?.team.logo ?? fixture?.teams.away.logo ?? "/images/dish.svg"}
                  alt={awayLineup?.team.name ?? fixture?.teams.away.name ?? "Away team"}
                  width={28}
                  height={28}
                  className="rounded-full object-contain"
                />
              </span>
              <span className="text-lg font-semibold text-slate-900">
                {awayLineup?.team.name ?? fixture?.teams.away.name ?? "Away"}
              </span>
            </div>

            <div className="space-y-4">
              {awayBlocks.map((block) => renderBlock(block, "right"))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
