import { FixtureData, Round } from "@/types/fixtures";
import { useState } from "react";

interface FixtureTabsProps {
  data: FixtureData;
}

export default function FixtureTabs({ data }: FixtureTabsProps) {
  const [activeZoneId, setActiveZoneId] = useState<string>(
    data.zones[0]?.id ?? ""
  );

  const activeZone = data.zones.find((z) => z.id === activeZoneId);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Tab Nav */}
      <div className="flex space-x-2 overflow-x-auto mb-6">
        {data.zones.map((zone) => (
          <button
            key={zone.id}
            className={`px-4 py-2 rounded-t-lg border-b-2 transition
              ${
                zone.id === activeZoneId
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-gray-600 hover:text-primary"
              }
            `}
            onClick={() => setActiveZoneId(zone.id)}
          >
            {zone.name}
          </button>
        ))}

        {data.finalStage && (
          <button
            key="final"
            className={`px-4 py-2 rounded-t-lg border-b-2 transition
              ${"final" === activeZoneId
                ? "border-primary text-primary bg-white"
                : "border-transparent text-gray-600 hover:text-primary"}
            `}
            onClick={() => setActiveZoneId("final")}
          >
            Final Stage
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white shadow-lg rounded-b-lg p-4">
        {activeZoneId === "final" && data.finalStage ? (
          <RoundSection round={data.finalStage} />
        ) : activeZone ? (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Venue: <span className="font-semibold">{activeZone.venue}</span> • LGA:{" "}
              <span className="font-semibold">{activeZone.lga}</span>
            </div>

            {activeZone.rounds.map((round) => (
              <RoundSection key={round.id} round={round} />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

// Subcomponent
function RoundSection({ round }: { round: Round }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-3">{round.name}</h3>
      <ul className="divide-y divide-gray-200">
        {round.matches.map((match) => (
          <li
            key={match.id}
            className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">{match.homeTeam}</span>
                <span className="text-gray-500">vs</span>
                <span className="font-medium text-gray-800">{match.awayTeam}</span>
              </div>
            </div>

            <div className="text-right">
              {match.status === "live" ? (
                <span className="text-red-600 font-bold">Live</span>
              ) : match.status === "finished" && match.score ? (
                <span className="font-bold text-gray-900">
                  {match.score.home} — {match.score.away}
                </span>
              ) : (
                <span className="text-gray-600">{match.time}</span>
              )}
              <div className="text-xs text-gray-500">{match.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
