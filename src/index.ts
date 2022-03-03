import { MatchReader } from "./MatchReader";
import { MatchResult } from "./MatchResult";
import { CsvFileReader } from "./CsvFileReader";

//create an object that satisfies the 'DataReader' interface.

const csvFileReader = new CsvFileReader('football.csv');

//create an instance of MatchReader and pass in something to satisfy the 'DataReader' interface.

const matchReader = new MatchReader(csvFileReader);
matchReader.load();
// matchRerader.matches

let manUnitedWins = 0;

for (let match of matchReader.matches) {
  if (match[1] === 'Man United' && match[5] === MatchResult.HomeWin) {
    manUnitedWins++;
  } else if (match[2] === 'Man United' && match[5] === MatchResult.AwayWin) {
    manUnitedWins++;
  }
}

console.log(`Man United won ${manUnitedWins} games!`);