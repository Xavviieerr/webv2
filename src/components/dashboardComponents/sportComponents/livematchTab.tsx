"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { GenericFixtureCard } from "./genericFixtureCard"
import { useGetFootballLeaguesQuery } from "@/slice/endpoints"
import { footballLeaguesEndpoints } from "@/slice/footballLeaguesSlice"
import type { FootballFixtureItem } from "@/slice/footballLeaguesSlice"
import { setFootballLeagues } from "@/slice/sportsSlice"
import type { AppDispatch, RootState } from "@/store/store"

export const LiveMatchTab = () => {
  const dispatch = useDispatch<AppDispatch>()
  const storedLeagues = useSelector((state: RootState) => state.sports.leagues)
  const hasStoredLeagues = storedLeagues.length > 0

  const { data: leaguesData } = useGetFootballLeaguesQuery(undefined, {
    skip: hasStoredLeagues,
  })

  useEffect(() => {
    if (leaguesData?.data?.length) {
      dispatch(setFootballLeagues(leaguesData.data))
    }
  }, [dispatch, leaguesData?.data])

  const leagues = hasStoredLeagues ? storedLeagues : (leaguesData?.data ?? [])

  const [allFixtures, setAllFixtures] = useState<FootballFixtureItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!leagues.length) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    const fetchAll = async () => {
      const results = await Promise.all(
        leagues.map((league) =>
          dispatch(
            footballLeaguesEndpoints.endpoints.getFootballLiveScores.initiate({
              leagueId: league.league.id,
            })
          )
        )
      )

      if (cancelled) return

      const combined = results.flatMap((result) => {
        const r = result as { data?: { data?: FootballFixtureItem[] } }
        return r?.data?.data ?? []
      })

      setAllFixtures(combined)
      setLoading(false)
    }

    fetchAll()
    return () => {
      cancelled = true
      setLoading(false)
    }
  }, [dispatch, leagues])

  // Group by league id, then by league name for display
  const byLeague = allFixtures.reduce<
    Record<number, { name: string; logo: string; fixtures: FootballFixtureItem[] }>
  >((acc, fixture) => {
    const id = fixture.league.id
    if (!acc[id]) {
      acc[id] = {
        name: fixture.league.name,
        logo: fixture.league.logo,
        fixtures: [],
      }
    }
    acc[id].fixtures.push(fixture)
    return acc
  }, {})

  const leagueEntries = Object.entries(byLeague).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name)
  )

  return (
    <div className="pt-10">
      <section className="w-full h-full rounded-2xl bg-[#8AA5A81A] p-4 sm:p-6 flex flex-col gap-6">
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <span
                  className="size-2 rounded-full bg-[#0E808D] animate-pulse"
                  aria-hidden
                />
                Fetching live scores for all leagues…
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="h-20 rounded-md bg-slate-200/60 animate-pulse" />
                <div className="h-20 rounded-md bg-slate-200/60 animate-pulse" />
              </div>
            </div>
          ) : leagueEntries.length === 0 ? (
            <p className="text-sm text-slate-600 py-4">
              No live matches at the moment.
            </p>
          ) : (
            leagueEntries.map(([leagueId, { name, logo, fixtures }]) => (
              <div key={leagueId} className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <span className="inline-flex size-6 items-center justify-center rounded-full overflow-hidden bg-white">
                    <Image
                      src={logo}
                      alt={name}
                      width={24}
                      height={24}
                      className="rounded-full object-contain"
                    />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {name}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fixtures.map((fixture) => (
                    <GenericFixtureCard
                      key={fixture.fixture.id}
                      fixture={fixture}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
