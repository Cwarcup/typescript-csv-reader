// takes all match data, runs an analysis on it, and returns a result.
// in theory, we could create as many classes as we want with a different analysis. For example, could make an analysis for AverageGoalsAnalysis

import { MatchData } from "../MatchData";
import { MatchResult } from "../matchResult";
import { Analyzer } from "../Summary"

export class WinsAnalysis implements Analyzer {
  constructor(public team: string) {}

  run(matches: MatchData[]): string {
    let wins = 0;

    for (let match of matches) {
      if (match[1] === 'Man United' && match[5] === MatchResult.HomeWin) {
        wins++;
      } else if (match[2] === 'Man United' && match[5] === MatchResult.AwayWin) {
        wins++;
      }
    }
    return `Team ${this.team} won ${wins} number of games.`
  }
};
