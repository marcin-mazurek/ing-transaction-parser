import parseCSV from 'csv-parse/lib/sync';
import windows1250 from 'windows-1250';

const START_PATTERN = '"Data transakcji";';
const END_PATTERN = '"Dokument ma charakter informacyjny';

export const extractFromFile = (fileBuffer: Buffer): Array<Array<string>> => {
  const fileContent: string = windows1250.decode(fileBuffer!.toString('binary'));
  const startPatternIndex = fileContent.indexOf(START_PATTERN);
  const endPatternIndex = fileContent.indexOf(END_PATTERN);
  const transactionsListCSV = fileContent.substring(startPatternIndex, endPatternIndex).trim();

  return parseCSV(transactionsListCSV, {delimiter: ";", fromLine: 2});
}