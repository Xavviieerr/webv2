import { apiSlice } from "./requestSlice";

export interface FootballLeagueItem {
  league: {
    id: number;
    name: string;
  };
  country: {
    name: string;
  };
}

export interface FootballLeaguesResponse {
  data: FootballLeagueItem[];
  message: string;
}

/** Params for GET /football/fixtures */
export interface FootballFixturesParams {
  leagueId: number;
  season: number;
  date?: string;
  status?: string;
}

/** Params for GET /football/live-scores */
export interface FootballLiveScoresParams {
  leagueId: number;
  status?: string;
  teamId?: number;
}

export interface FootballFixtureItem {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: { first: number | null; second: number | null };
    venue: { id: number | null; name: string; city: string };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
      extra: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
    standings: boolean;
  };
  teams: {
    home: { id: number; name: string; logo: string; winner: boolean | null };
    away: { id: number; name: string; logo: string; winner: boolean | null };
  };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface FootballFixturesResponse {
  data: FootballFixtureItem[];
  message?: string;
}

export interface FootballLineupPlayer {
  id: number;
  name: string;
  number: number | null;
  pos: string;
  grid: string | null;
}

export interface FootballLineupTeamData {
  team: {
    id: number;
    name: string;
    logo: string;
    colors?: {
      player?: { primary?: string; number?: string; border?: string };
      goalkeeper?: { primary?: string; number?: string; border?: string };
    };
  };
  coach: {
    id: number;
    name: string;
    photo: string;
  };
  formation: string;
  startXI: { player: FootballLineupPlayer }[];
  substitutes: { player: FootballLineupPlayer }[];
}

export interface FootballLineupResponse {
  data: FootballLineupTeamData[];
  message?: string;
}

export interface FootballLineupParams {
  fixtureId: number;
}

export interface FootballStandingsParams {
  leagueId: number;
  season: number;
  status?: string;
  teamId?: number;
}

export interface FootballStandingEntry {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  form: string | null;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

export interface FootballStandingsLeagueBlock {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    standings: FootballStandingEntry[][];
  };
}

export interface FootballStandingsResponse {
  data: FootballStandingsLeagueBlock[];
  message?: string;
}

function buildFixturesUrl(params: FootballFixturesParams): string {
  const { leagueId, season, date, status } = params
  const search = new URLSearchParams()
  search.set("leagueId", String(leagueId))
  search.set("season", String(season))
  if (date) search.set("date", date)
  if (status) search.set("status", status)
  return `/football/fixtures?${search.toString()}`
}

function buildLiveScoresUrl(params: FootballLiveScoresParams): string {
  const { leagueId, status, teamId } = params
  const search = new URLSearchParams()
  search.set("leagueId", String(leagueId))
  if (status) search.set("status", status)
  if (teamId != null) search.set("teamId", String(teamId))
  return `/football/live-scores?${search.toString()}`
}

function buildLineupUrl(params: FootballLineupParams): string {
  const search = new URLSearchParams()
  search.set("fixtureId", String(params.fixtureId))
  return `/football/line-up?${search.toString()}`
}

function buildStandingsUrl(params: FootballStandingsParams): string {
  const { leagueId, season, status, teamId } = params
  const search = new URLSearchParams()
  search.set("leagueId", String(leagueId))
  search.set("season", String(season))
  if (status) search.set("status", status)
  if (teamId != null) search.set("teamId", String(teamId))
  return `/football/standings?${search.toString()}`
}

const LEAGUES_CACHE_SECONDS = 60 * 60 * 24 * 7 // 7 days – cache leagues so we don't refetch
const FIXTURES_CACHE_SECONDS = 60 * 60 * 6 // 6 hours – cache fixtures per league/season

export const footballLeaguesEndpoints = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFootballLeagues: builder.query<FootballLeaguesResponse, void>({
      query: () => ({ url: "/football/leagues", method: "GET" }),
      keepUnusedDataFor: LEAGUES_CACHE_SECONDS,
    }),
    getFootballFixtures: builder.query<FootballFixturesResponse, FootballFixturesParams>({
      query: (params) => ({
        url: buildFixturesUrl(params),
        method: "GET",
      }),
      // Cache fixtures for a league/season combo so we only refetch
      // when query args (e.g. season) change or data expires.
      keepUnusedDataFor: FIXTURES_CACHE_SECONDS,
    }),
    getFootballLiveScores: builder.query<FootballFixturesResponse, FootballLiveScoresParams>({
      query: (params) => ({
        url: buildLiveScoresUrl(params),
        method: "GET",
      }),
      keepUnusedDataFor: 60, // 1 min – live scores should refresh often
    }),
    getFootballLineup: builder.query<FootballLineupResponse, FootballLineupParams>({
      query: (params) => ({
        url: buildLineupUrl(params),
        method: "GET",
      }),
      keepUnusedDataFor: FIXTURES_CACHE_SECONDS,
    }),
    getFootballStandings: builder.query<FootballStandingsResponse, FootballStandingsParams>({
      query: (params) => ({
        url: buildStandingsUrl(params),
        method: "GET",
      }),
      keepUnusedDataFor: FIXTURES_CACHE_SECONDS,
    }),
  }),
});

export const {
  useGetFootballLeaguesQuery,
  useGetFootballFixturesQuery,
  useGetFootballLiveScoresQuery,
  useGetFootballLineupQuery,
   useGetFootballStandingsQuery,
} = footballLeaguesEndpoints;
