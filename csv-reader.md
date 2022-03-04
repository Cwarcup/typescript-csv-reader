# CSV Data

## Load Library with Node library
- need to read and load contents of the csv file.
- [readfilesync](https://nodejs.org/docs/latest-v15.x/api/fs.html#fs_fs_readfilesync_path_options)
- Will essentially get one big string with all of our data in it. 


## Install Type Definition File for Node JS
```
npm install @types/node
```

## Get string of all the matches
```typescript
const matches = fs.readFileSync('football.csv'. {
  encoding: 'utf-8'
})
```
- Now we have all our data in `matches`.

## Parse Data
- want to change data into a more useable data structure.

![csv1.png](https://github.com/Cwarcup/notes/blob/f10ef28bbdc87f57afd3d77cf2603e9a1802f6ea/root/typescript/images/Section2/csv1.png)
1. `.split('/n')` splits the string into new lines.
2. Will use `map` to split at each ",".
3. End result is an array containing arrays of strings. 

```typescript
const matches = fs
  .readFileSync('football.csv', {
  encoding: 'utf-8'
  })
  .split('\n')
  .map((row: string): string[] => {
    return row.split(',');
  })
```

## Analysis on the data
[For..of loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

```typescript
//   index of data
// date = 0
// home team = 1
// away team = 2
// home or away = 5

let manUnitedWins = 0;

// want to increment manUnitedWins if Man U is home, and winner is home team
// or Man U is away, and away team wins
for(let match of matches) {
  if(match[1] === 'Man United' && match[5] ==='H') {
    manUnitedWins++;
  } else if (match[2] === 'Man United' && match[5] === 'A'){
    manUnitedWins++;
  }
}

console.log(`Man United won ${manUnitedWins} games`);
// Man United won 18 games 
```

## Improve Code with TypeScript

- Make homeWin and awayWin variables
- extract hardcoded values into a more meaningful variable.
```typescript
const homeWin = 'H';
const awayWin = 'A';

for (let match of matches) {
  if (match[1] === 'Man United' && match[5] === homeWin) {
    manUnitedWins++;
  } else if (match[2] === 'Man United' && match[5] === awayWin) {
    manUnitedWins++;
  }
}
```

## Using Enums

- about [enums](https://www.typescriptlang.org/docs/handbook/enums.html).
- enum - short for enumeration
- is an object that stores some closely related values.
  - are either numbers or strings. 

```typescript
// const matchResult = {
//   HomeWin: 'H',
//   AwayWin: 'A',
//   Draw: 'D',
// };
enum matchResult {
  HomeWin = 'H',
  AwayWin = 'A',
  Draw = 'D',
};

let manUnitedWins = 0;

for (let match of matches) {
  if (match[1] === 'Man United' && match[5] === matchResult.HomeWin) {
    manUnitedWins++;
  } else if (match[2] === 'Man United' && match[5] === matchResult.AwayWin) {
    manUnitedWins++;
  }
}
```

Why ise enums?
- signals to other people that this is a collection of closely related values. 

### When to use Enums

Accessing:
```typescript
enum matchResult {
  HomeWin = 'H',
  AwayWin = 'A',
  Draw = 'D',
};
matchResult.HomeWin // 'H'
```

Should we use an enum to represent..
- primary colors on a color picker? : YES.
- the set of movie categories on Netflix? : NO.
  - because new categories may be added.
- titles of blogposts by a particular user?: NO.
  - would have to make a network request to get titles. 
- sizes of drinks on ordering menu? : YES.
- all the years since 1750? : NO.
  - this is a large set of values. We typically don't use enums for larger sets.
- read status of a text message? : YES. 

## Extracting CSV Reading
```typescript
import fs from 'fs';

export class CsvFileReader {
  data: string[][] = [];
  
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
  }
}
```

## Parse Strings to correct data type

![data ](https://github.com/Cwarcup/notes/blob/93a2de6076c9c21ac45034e3fca929f932429575/root/typescript/images/Section2/data.png)

## Date String to Date object

How to create date object
```
new Date(year, month, day, hour, minute, second)
```
- need to split the string.
- extract the month, day and year.

```typescript
export const dateStringToDate = (dateString: string): Date => {
  const dateParts = dateString.split('/');
  return dateParts
}

console.log(dateStringToDate("10/08/2018")); // [ '10', '08', '2018' ]
```

So, we are taking in an array of strings (row), and converting some of the values, then returning it.
```typescript
// CsvFileReader.ts file
.map((row: string[]): any => {
        return [
          dateStringToDate(row[0]),
          row[1],
          row[2],
          parseInt(row[3]),
          parseInt(row[4]),
          row[5] as matchResult,
          row[6]
        ]
```

## Create a new tuple to describe a row

1. define the tuple a a new type.
   1. [ date string string number number matchResult string]
2. convert the row of strings into the appropriate types
   1. "10/08/2018" -> parseDate() -> Date
   2. and so on..

```typescript
//tuple
type MatchData = [ Date, string, string, number, number, matchResult, string]

export class CsvFileReader {
  data: string[][] = [];
  
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
```

But now we have an error at `this.data = fs`. Need to change:
```typescript
data: string[][] = [];
// to
data: MatchData[] = [];
```

## Refactor CsvFileReader to be reusable again

Will work on any csv file
```typescript
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
```

Can create a helper function:
```typescript
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
      .map(this.mapRow)
  }

  mapRow(row: string[]): MatchData {
    return [
      dateStringToDate(row[0]),
      row[1],
      row[2],
      parseInt(row[3]),
      parseInt(row[4]),
      row[5] as matchResult,
      row[6]
    ];
  };
}
```
- now we have our specialized Match Data in a separate method. 

## Create an Abstract Method
- will be creating a separate abstract method to ONLY handle the MatchData. 
- It will extend from CsvFileReader and use the `mapRow` method to work with the MatchData file.

---

## Generics
- Like function arguments, but for types in class/function definitions. 
- Allows us to define the type of a property/argument/return value at a point.
- Used heavily when making reusable code.

```typescript
//nothing to do with generics
const addOne = (a: number): number => {
  return a + 1;
};

const addTwo = (a: number): number => {
  return a + 2;
};

const addThree = (a: number): number => {
  return a + 3;
};
```
- this is very repetitive. 
- would better to have ONE reusable function
```typescript
const add = (a: number, b: number): number => {
  return a + b;
};
add(10,1) // 11
add(10,2) // 12
add(10,3) //13

// GENERICS not being used in a class:
class HoldNumber {
  data: number;
};
class HoldString {
  data: string;
};


const holdNumber = new HoldNumber();
holdNumber.data = 123;

const holdString = new HoldString();
holdString.data = 'sdfsd';
```
> this is like the EXACT same as above. 

- **GENERICS** being used
- Imagine `<TypeOfData>` being the same as (a: number, b: number)

```typescript
class HoldAnything<TypeOfData> {
  data: TypeOfData;
};

const holdNumber = new HoldAnything<number>();
holdNumber.data = 123;

const holdString = new HoldAnything<string>();
holdString.data = 'Hello there';
```
**Treat generics like function arguments**.

- "T" is often used to reference a generic type.

## Alternate Refactor
- still going to create a class MatchReader.
  - MatchReader will have its own class this time.
  - will have:
    - reader: DataReader;
    - load(): void;
- Will also have an **interface DataReader**.
  - has methods:
    - read(): void
    - data: string[][];
- Will eventually have several types of 'readers' in our 'CsvFileReader`

See 'alternative refactor' branch.

## Inheritance vs Composition

Inheritance:
- Had an **abstract class** CsvFileReader, with **abstract method** mapRow().
- Extended that class and customized the behavior.
  - created class MatchReader
```typescript
//CsvFileReader.ts
export abstract class CsvFileReader<T> {
  data: T[] = [];
  
  constructor(public filename: string) {}

  abstract mapRow(row: string[]): T;

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

//MatchReader
import { CsvFileReader } from "./CsvFileReader";
import { matchResult } from "./matchResult";
import { dateStringToDate } from "./utils";

//tuple
type MatchData = [ Date, string, string, number, number, matchResult, string]

export class MatchReader extends CsvFileReader<MatchData> {
  mapRow(row: string[]): MatchData {
    return [
      dateStringToDate(row[0]),
      row[1],
      row[2],
      parseInt(row[3]),
      parseInt(row[4]),
      row[5] as matchResult,
      row[6]
    ]
  }
}
```

Composition:
- had a class "MatchReader" with an **interface** of `constructor(public reader: DataReader) {};`.
```typescript
import { dateStringToDate } from './Utils';
import { MatchResult } from "./MatchResult";

//tuple
type MatchData = [ Date, string, string, number, number, MatchResult, string]


interface DataReader {
  read(): void;
  data: string[][];
};

export class MatchReader {
  matches: MatchData[] = [];

  constructor(public reader: DataReader) {};

  load(): void {
    this.reader.read();
    this.matches = this.reader.data.map(
      (row: string[]): MatchData => {
        return [
          dateStringToDate(row[0]),
          row[1],
          row[2],
          parseInt(row[3]),
          parseInt(row[4]),
          row[5] as MatchResult,
          row[6]
        ];
      }
    )
  }
}
```
---

Inheritance: characterized by an **'is an'** relationship between two classes.
Composition: Characterized by an **'has a'** relationship between two classes. 

### More on Inheritance vs Composition

[Video: ](https://www.udemy.com/course/typescript-the-complete-developers-guide/learn/lecture/15066834#overview)

```javascript
const rectangular = (state) => {
  return {
    area: () => {
      return state.heigh * state.width;
    }
  }
};

const openable = (state) => {
  return {
    toggleOpen: () => {
      state.open = !state.open;
    }
  }
}

// to compose these into an object

const buildRectangleWindow = (state) => {
  // basically taking the methods from rectangular(state), openable(state) and copying them into state
  return Object.assign(state, rectangular(state), openable(state));
};

const rectangleWindow = buildRectangleWindow({
  height: 20,
  width: 20,
  open: false
});

rectangleWindow.open // false
rectangleWindow.toggleOpen();
rectangleWindow.open // true
```

## Goal

- interface Analyzer
  - run(matches: MatchData[]): string

- interface OutputTarget
  - print(report: string): void

- class Summary
  - analyzer: Analyzer
  - outputTarget: OutputTarget
  - buildAndPrintReport(MatchData[])

- class AverageGaolsAnalysis
  - run(MatchData[]): string
  
- class WinsAnalysis
  -run(MatchData[]): string

- class ConsoleReport
  - print(report: string): void

- class HtmlReport
  - print(report: string): void

---

- Have to refer to `MatchData` numerous times. 
  - best to create its own file with this. 
  - create `MatchData.ts` file in src.

## Adding Summary Class
- Create `Summary.ts` class
  - will need to create two **interfaces** within here:
    - **Analyzer**
      - takes in the tuple `MatchData` and returns a string from running the analysis.
    - **OutputTarget**
  - create class
    - will pass in an **instance** to use **analyzer** and **outputTarget**
    - we need to pass `Summary` the `run` method from either `class AverageGoalsAnalysis` or `class WinsAnalysis`. 
    - As well as `print` method from `class ConsoleReport` or `class HtmlReport`.
      - these will be used to assign to the **"Analyzer" or "OutputTarget" property**. 
```typescript
import { MatchData } from "./MatchData";

export interface Analyzer {
  run(matches: MatchData[]): string;
}

export interface OutputTarget {
  print(report: string): void;
}

export class Summary {
  constructor(
    public analyzer: Analyzer,
    public outputTarget: OutputTarget) {}
}

// will eventually use Summary() like so:
new Summary(new WinsAnalysis, new ConsoleReport);
```

## class WinsAnalysis

- will provide a team, and tell us how many games the team has won.
- remember this class must **satisfy** the `Analyzer` **interface**
  - can do this im **importing** the `Analyzer interface` and using **implements keyword** to check out class. 
```typescript
import { MatchData } from "../MatchData";
import {Analyzer} from "../Summary"

export class WinsAnalysis implements Analyzer {
  constructor(public team: string) {}

  run(matches: MatchData[]): string {
    // code to run the analysis
  }
}
```
Remember, `MatchResult` was our enum 
```
export enum MatchResult {
  HomeWin = 'H',
  AwayWin = 'A',
  Draw = 'D',
};
```

> Takes all match data, runs an analysis on it, and returns a result. In theory, we could create as many classes as we want with a different analysis. For example, could make an analysis for AverageGoalsAnalysis.

## class ConsoleReport

```typescript
import { OutputTarget } from '../Summary'

export class ConsoleReport implements OutputTarget {
  print(report: string): void{
    console.log(report);
  }
}
```

## Implement BuildAndPrintReport inside of class Summary

```typescript
export class Summary {
  constructor(
    public analyzer: Analyzer,
    public outputTarget: OutputTarget) {}

    buildAndPrintReport(matches: MatchData[]): void {
      const output = this.analyzer.run(matches);
      this.outputTarget.print(output);
    }
  }
```

- class Summary does not have a lot of actual behavior in it. 
  - I.stead it uses different objects (analyzer and outputTargets) to do the heavy lifting. 
    - we can also change which objects are used to get different outputs of information.

## Bringing it all together in index.ts
```typescript
import { MatchReader } from "./MatchReader";
import { CsvFileReader } from "./CsvFileReader";
import { ConsoleReport } from './reportTargets/ConsoleReport'
import { WinsAnalysis } from "./analyzers/WinsAnalysis";
import { Summary } from "./Summary";

//create an object that satisfies the 'DataReader' interface.
// code required to read the csv file.
const csvFileReader = new CsvFileReader('football.csv');

// take the data from the csv file and parse it into a readable string. Uses method `load()` to parse the csvFileReader string.
const matchReader = new MatchReader(csvFileReader);
matchReader.load();

const summary = new Summary(
  new WinsAnalysis('Man United'),
  new ConsoleReport(),
);

summary.buildAndPrintReport(matchReader.matches);
// fire up nodemon with `npm start`
// Team Man United won 18 number of games.
```

## Generate HTML Report

Need to import the OutputTarget interface and use the print method to generate HTML.
Will also need to use the `fs`  method from the built in Node module. Remember, we used this module in the CsvFileReader to read a file. Now will be using `fs` to [write a file](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fswritefilesyncfile-data-options).


```typescript
//HtmlReport.ts
import fs from 'fs';
import { OutputTarget } from '../Summary';

export class HtmlReport implements OutputTarget {
  print(report: string): void {
    const html = `
      <div>
        <h1>Analysis Report</h1>
        <div>${report}</div>
      </div>
    `;
    fs.writeFileSync('report.html',html);
  }
}
 //index.ts
// change summary to use HtmlReport
const summary = new Summary(
  new WinsAnalysis('Man United'),
  new HtmlReport(),
);
```
> can now save and run this. Will generate a new file called 'report.html' in the root directory, which can then be opened in the browser. 

---

Right now we have to call...
 `const summary = new Summary()`
 `summary.buildAndPrintReport`
to make ANY summary. 

But we can simplify this by using a **static method**. See more [here](https://www.typescriptlang.org/docs/handbook/2/classes.html#static-members)
- could then call the method without creating an instance of summary.

```typescript
export class Summary {
  static WinsAnalysisWithHtmlReport(team: string): Summary {
    return new Summary(
      new WinsAnalysis(team),
      new HtmlReport()
    );
  }
  constructor(
    public analyzer: Analyzer,
    public outputTarget: OutputTarget) {}

  buildAndPrintReport(matches: MatchData[]): void {
    const output = this.analyzer.run(matches);
    this.outputTarget.print(output);
  }
}
```

Back in the index.ts add `const summary = Summary.WinsAnalysisWithHtmlReport('Man United');`
