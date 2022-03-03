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

# Improve Code with TypeScript

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

### Using Enums

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

#### When to use Enums

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

#### Date String to Date object

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

