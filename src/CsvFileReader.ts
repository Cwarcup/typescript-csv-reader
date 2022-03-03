import fs from 'fs';
import { dateStringToDate } from "./utils";
import { matchResult } from "./matchResult";

//tuple
type MatchData = [ Date, string, string, number, number, matchResult, string]


export class CsvFileReader {
  data: MatchData[] = [];
  
  constructor(public filename: string) {}

  read(): void {
    this.data = fs
      .readFileSync(this.filename, {
      encoding: 'utf-8'
      })
      .split('\n')
      .map((row: string): string[] => {
        return row.split(',');
      })
      .map((row: string[]): MatchData => {
        return [
          dateStringToDate(row[0]),
          row[1],
          row[2],
          parseInt(row[3]),
          parseInt(row[4]),
          row[5] as matchResult,
          row[6]
        ]
      })
  }
}


// open and read CSV data