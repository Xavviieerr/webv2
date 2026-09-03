export interface Match {
    id: number;
    homeTeam: string;
    awayTeam: string;
    time: string;
    date: string;      
    venue?: string;
    status?: "scheduled" | "live" | "finished";
    score?: {
      home: number;
      away: number;
    };
  }
  
  export interface Round {
    id: string;
    name: string;
    matches: Match[];
  }
  
  export interface Zone {
    id: string;
    name: string;     
    venue: string;
    lga: string;
    rounds: Round[];
  }
  
  export interface FixtureData {
    zones: Zone[];
    finalStage?: Round; 
  }
  