"use client"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SingleFixture } from "@/components/dashboardComponents/sportComponents/singleFixturePage"
import { Button } from "@/components/ui/button"
import { useGetFootballFixturesQuery } from "@/slice/endpoints"

export default function SportFixturePage() {
  const router = useRouter()
  const params = useParams<{ fixture: string }>()
  const searchParams = useSearchParams()

  const fixtureId = Number(params.fixture)
  const leagueId = Number(searchParams.get("leagueId") ?? 0)
  const season = Number(searchParams.get("season") ?? new Date().getFullYear())

  const { data, isLoading, isError } = useGetFootballFixturesQuery(
    { leagueId, season },
    { skip: !leagueId || !season }
  )

  const fixture =
    data?.data.find((fx) => fx.fixture.id === fixtureId) ?? null

  return (
    <div className="w-full space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="inline-flex items-center gap-2 px-0 text-sm text-slate-800 hover:bg-transparent hover:text-slate-900"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Button>

      {isLoading && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#0E808D] animate-pulse" aria-hidden />
            Loading fixture…
          </p>
          <div className="rounded-2xl bg-slate-200/60 h-40 animate-pulse" />
        </div>
      )}

      {isError && !isLoading && (
        <p className="text-sm text-red-600">
          Failed to load fixture.
        </p>
      )}

      {!isLoading && !isError && (
        <SingleFixture fixture={fixture} />
      )}
    </div>
  )
}
