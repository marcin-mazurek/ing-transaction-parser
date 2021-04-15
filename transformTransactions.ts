import {guessCategory} from "./guessCategory";

const DATE_INDEX = 0;
const DESCRIPTION_LINE_1_INDEX = 2;
const DESCRIPTION_LINE_2_INDEX = 3;
const BANK_NAME_INDEX = 5;
const AMOUNT_INDEX = 8;

export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

function isInternalTransfer(transaction) {
  return (transaction[BANK_NAME_INDEX].includes('ING Bank') &&
    (transaction[DESCRIPTION_LINE_2_INDEX].includes('Przelew własny')
      || transaction[DESCRIPTION_LINE_2_INDEX].includes('Own transfer')));
}

function hasAmount(transaction) {
  if (!transaction[AMOUNT_INDEX] || !transaction[AMOUNT_INDEX].length || transaction[AMOUNT_INDEX].indexOf(',') === -1) {
    console.warn(`Unexpected amount: '${transaction[AMOUNT_INDEX]}'`);
    return false;
  }

  return true;
}

export const transformTransactions = (rawTransactions: Array<Array<string>>): Transaction[] => {
  return rawTransactions.reverse()
    .filter(transaction => !isInternalTransfer(transaction))
    .filter(hasAmount)
    .map(transaction => {
      
      const amount = Number(transaction[AMOUNT_INDEX]!.replace(',', '.'));
      const description = transaction[DESCRIPTION_LINE_1_INDEX].trim() + ' ' + transaction[DESCRIPTION_LINE_2_INDEX].trim();

      return {
        category: guessCategory(description),
        date: transaction[DATE_INDEX],
        amount: amount,
        description,
      };
    })
};
