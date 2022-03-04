import { MatchReader } from "./MatchReader";
import { Summary } from "./Summary";

const matchReader = MatchReader.fromCsv('football.csv')
matchReader.load();

const summary = Summary.WinsAnalysisWithHtmlReport('Arsenal');
summary.buildAndPrintReport(matchReader.matches);