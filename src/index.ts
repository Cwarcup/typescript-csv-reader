import { MatchReader } from "./MatchReader";
import { CsvFileReader } from "./CsvFileReader";
import { ConsoleReport } from './reportTargets/ConsoleReport'
import { WinsAnalysis } from "./analyzers/WinsAnalysis";
import { Summary } from "./Summary";
import { HtmlReport } from "./reportTargets/HtmlReport"

//create an object that satisfies the 'DataReader' interface.
// code required to read the csv file.
const csvFileReader = new CsvFileReader('football.csv');

// take the data from the csv file and parse it into a readable string. Uses method `load()` to parse the csvFileReader string.
const matchReader = new MatchReader(csvFileReader);
matchReader.load();

const summary = new Summary(
  new WinsAnalysis('Man United'),
  new HtmlReport(),
);

summary.buildAndPrintReport(matchReader.matches);