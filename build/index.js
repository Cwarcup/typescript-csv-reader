"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MatchReader_1 = require("./MatchReader");
const CsvFileReader_1 = require("./CsvFileReader");
const Summary_1 = require("./Summary");
//create an object that satisfies the 'DataReader' interface.
// code required to read the csv file.
const csvFileReader = new CsvFileReader_1.CsvFileReader('football.csv');
// take the data from the csv file and parse it into a readable string. Uses method `load()` to parse the csvFileReader string.
const matchReader = new MatchReader_1.MatchReader(csvFileReader);
matchReader.load();
const summary = Summary_1.Summary.WinsAnalysisWithHtmlReport('Arsenal');
summary.buildAndPrintReport(matchReader.matches);
