"use strict";
// takes all match data, runs an analysis on it, and returns a result.
// in theory, we could create as many classes as we want with a different analysis. For example, could make an analysis for AverageGoalsAnalysis
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinsAnalysis = void 0;
const matchResult_1 = require("../matchResult");
class WinsAnalysis {
    constructor(team) {
        this.team = team;
    }
    run(matches) {
        let wins = 0;
        for (let match of matches) {
            if (match[1] === 'Man United' && match[5] === matchResult_1.MatchResult.HomeWin) {
                wins++;
            }
            else if (match[2] === 'Man United' && match[5] === matchResult_1.MatchResult.AwayWin) {
                wins++;
            }
        }
        return `Team ${this.team} won ${wins} number of games.`;
    }
}
exports.WinsAnalysis = WinsAnalysis;
;
