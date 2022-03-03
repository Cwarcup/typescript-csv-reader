import fs from 'fs';
import { matchResult } from "./matchResult";

//tuple
type MatchData = [ Date, string, string, number, number, matchResult, string]


export abstract class CsvFileReader<TypeOfData> {
  data: TypeOfData[] = [];
  
  constructor(public filename: string) {}

  abstract mapRow(row: string[]): TypeOfData;

  read(): void {
    this.data = fs
      .readFileSync(this.filename, {
      encoding: 'utf-8'
      })
      .split('\n')
      .map((row: string): string[] => {
        return row.split(',');
      })
      .map(this.mapRow)
  }

}


// open and read CSV data