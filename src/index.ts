import { MatchReader } from "./MatchReader";
import { MatchResult } from "./MatchResult";
import { CsvFileReader } from "./CsvFileReader";

//create an object that satisfies the 'DataReader' interface.
const csvFileReader = new CsvFileReader('football.csv');

//create an instance of MatchReader and pass in something to satisfy the 'DataReader' interface.
const matchReader = new MatchReader(csvFileReader);
matchReader.load();



console.log(`Man United won ${manUnitedWins} games!`);