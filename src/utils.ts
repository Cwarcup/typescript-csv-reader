export const dateStringToDate = (dateString: string): Date => {
  const dateParts = dateString
    .split('/')
    .map((value: string): number => {
      return parseInt(value);
    })
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0] )
}

// console.log(dateStringToDate("10/08/2018"));

// new Date(year, month, day, hour, minute, second)