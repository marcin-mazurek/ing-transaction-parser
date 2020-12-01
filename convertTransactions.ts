import jetpack from 'fs-jetpack';
import path from 'path';
import {extractFromFile} from "./extractFromFile";
import {transformTransactions} from "./transformTransactions";
import stringifyCSV from 'csv-stringify/lib/sync';
import {callerDirname} from 'caller-dirname';

export const convertTransactions = async () => {
  const fileName = process.argv[2];
  const fileBuffer = await jetpack.read(path.resolve(fileName), 'buffer');

  if (!fileBuffer) {
    console.log(`File ${fileName} not found`);
    return;
  }

  const rawTransactions = extractFromFile(fileBuffer);
  const transformedTransactions = transformTransactions(rawTransactions);

  const expenses = transformedTransactions
    .filter(transaction => transaction.amount < 0)
    .map(transaction => ({ ...transaction, amount: Math.abs(transaction.amount) }));
  const expensesCSV = stringifyCSV(expenses);

  const income = transformedTransactions
    .filter(transaction => transaction.amount > 0);
  const incomeCSV = stringifyCSV(income);

  const directoryToWriteTo = callerDirname();
  const timestamp = +new Date();
  const incomeCSVFilePath = path.join(directoryToWriteTo, `income_${timestamp}.csv`);
  const expensesCSVFilePath = path.join(directoryToWriteTo, `expenses_${timestamp}.csv`);

  await jetpack.writeAsync(incomeCSVFilePath, incomeCSV);
  console.log('Income saved to: ' + incomeCSVFilePath);

  await jetpack.writeAsync(expensesCSVFilePath, expensesCSV);
  console.log('Expenses saved to: ' + incomeCSVFilePath);
};

convertTransactions().catch(error => console.error(error));
