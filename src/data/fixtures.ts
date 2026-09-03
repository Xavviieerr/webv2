// data/fixtures.ts
import { FixtureData } from "@/types/fixtures";

export const fixtures: FixtureData["zones"] = [
  {
    id: "zone-a",
    name: "Zone A",
    venue: "Oviore Secondary School, Oviore",
    lga: "Ethiope East",
    rounds: [
      {
        id: "round-1",
        name: "First Round 🏁",
        matches: [
          { id: 1, homeTeam: "Idjerhe", awayTeam: "Okpe", time: "3:00 PM", date: "Friday, 1st August", status: "scheduled" },
          { id: 2, homeTeam: "Oghara", awayTeam: "Uvwie", time: "8:00 AM", date: "Saturday, 2nd August", status: "scheduled" },
          { id: 3, homeTeam: "Udu", awayTeam: "Agbarha Warri", time: "10:00 AM", date: "Saturday, 2nd August", status: "scheduled" },
          { id: 4, homeTeam: "Agbon", awayTeam: "Oruaivie Abraka", time: "12:00 Noon", date: "Saturday, 2nd August", status: "scheduled" },
          { id: 5, homeTeam: "Umiagwha Abraka", awayTeam: "Okere Urhobo", time: "2:00 PM", date: "Saturday, 2nd August", status: "scheduled" },
          { id: 6, homeTeam: "Agbarho", awayTeam: "Mosogar", time: "4:00 PM", date: "Saturday, 2nd August", status: "scheduled" },
        ],
      },
      {
        id: "round-2",
        name: "Second Round 🥈",
        matches: [
          { id: 7, homeTeam: "Winner Match 1", awayTeam: "Winner Match 2", time: "10:00 AM", date: "Thursday, 7th August", status: "scheduled" },
          { id: 8, homeTeam: "Winner Match 3", awayTeam: "Winner Match 4", time: "12:00 Noon", date: "Thursday, 7th August", status: "scheduled" },
          { id: 9, homeTeam: "Winner Match 5", awayTeam: "Winner Match 6", time: "2:00 PM", date: "Thursday, 7th August", status: "scheduled" },
        ],
      },
      {
        id: "semi-finals",
        name: "Semi Finals ⚔️",
        matches: [
          { id: 10, homeTeam: "Winner Match 7", awayTeam: "Winner Match 9", time: "9:00 AM", date: "Saturday, 9th August", status: "scheduled" },
          { id: 11, homeTeam: "Winner Match 8", awayTeam: "Best Loser (Matches 7, 8, 9)", time: "11:00 AM", date: "Saturday, 9th August", status: "scheduled" },
        ],
      },
      {
        id: "zone-a-final",
        name: "Zone A Final 🎖️",
        matches: [
          { id: 12, homeTeam: "Winner Match 10", awayTeam: "Winner Match 11", time: "10:00 AM", date: "Monday, 11th August", status: "scheduled" },
        ],
      },
    ],
  },
  {
    id: "zone-b",
    name: "Zone B",
    venue: "Ovwor Secondary School, Ovwor",
    lga: "Ughelli South",
    rounds: [
      {
        id: "round-1",
        name: "First Round 🏁",
        matches: [
          { id: 1, homeTeam: "Orogun", awayTeam: "Ughievwen", time: "8:00 AM", date: "Monday, 4th August", status: "scheduled" },
          { id: 2, homeTeam: "Ughelli", awayTeam: "Effurun Otor", time: "10:00 AM", date: "Monday, 4th August", status: "scheduled" },
          { id: 3, homeTeam: "Evwreni", awayTeam: "Olomu", time: "12:00 Noon", date: "Monday, 4th August", status: "scheduled" },
          { id: 4, homeTeam: "Ogor", awayTeam: "Uwherun", time: "2:00 PM", date: "Monday, 4th August", status: "scheduled" },
          { id: 5, homeTeam: "Agbarha Otor", awayTeam: "Ewu", time: "4:00 PM", date: "Monday, 4th August", status: "scheduled" },
        ],
      },
      {
        id: "round-2",
        name: "Second Round 🥈",
        matches: [
          { id: 6, homeTeam: "Winner Match 1", awayTeam: "Winner Match 2", time: "10:00 AM", date: "Friday, 8th August", status: "scheduled" },
          { id: 7, homeTeam: "Winner Match 3", awayTeam: "Winner Match 4", time: "12:00 Noon", date: "Friday, 8th August", status: "scheduled" },
          { id: 8, homeTeam: "Winner Match 5", awayTeam: "Best Loser (Matches 1–5)", time: "2:00 PM", date: "Friday, 8th August", status: "scheduled" },
        ],
      },
      {
        id: "semi-finals",
        name: "Semi Finals ⚔️",
        matches: [
          { id: 9, homeTeam: "Winner Match 6", awayTeam: "Winner Match 8", time: "1:00 PM", date: "Sunday, 10th August", status: "scheduled" },
          { id: 10, homeTeam: "Winner Match 7", awayTeam: "Best Loser (Matches 6–8)", time: "2:00 PM", date: "Sunday, 10th August", status: "scheduled" },
        ],
      },
      {
        id: "zone-b-final",
        name: "Zone B Final 🎖️",
        matches: [
          { id: 11, homeTeam: "Winner Match 9", awayTeam: "Winner Match 10", time: "10:00 AM", date: "Tuesday, 12th August", status: "scheduled" },
        ],
      },
    ],
  },
];
