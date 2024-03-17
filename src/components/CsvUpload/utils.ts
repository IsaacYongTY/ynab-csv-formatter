import { ParsedCsvRow, ProcessedCsvRow } from "@/components/CsvUpload/types";

export const deriveStandardCharteredCreditCardFormat = (
  parsedCsv: ParsedCsvRow[],
) => {
  return parsedCsv.map((row) => {
    let inflow = "";
    let outflow = "";

    const amount = row.__parsed_extra
      ? row.__parsed_extra[0]
      : row["SGD Amount"];

    let result = {
        date: row["Date"],
        payee: row["DESCRIPTION"],
        memo: row["Foreign Currency Amount"],
        outflow: outflow,
        inflow: inflow,
    }

    if(!amount) {
      return result
    }

    if(amount.includes("DR")) {
      result.outflow = amount.slice(4, amount.length - 3);

      return result
    }

    result.inflow = amount.slice(4, amount.length - 3);

    return result
  });
};

export const deriveUobCreditCardFormat = (
  parsedCsv: ParsedCsvRow[],
): ProcessedCsvRow[] => {
  // remove Previous Balance row
  parsedCsv.shift();

  return parsedCsv.map((row, index) => {
    return {
      date: row["Transaction Date"],
      payee: row["Description"],
      memo: row["Transaction Amount(Foreign)"],
      amount: row["Transaction Amount(Local)"],
    };
  });
};

export const deriveUobAccountFormat = (
  parsedCsv: ParsedCsvRow[],
): ProcessedCsvRow[] => {
  return parsedCsv.map((row, index) => {
    return {
      date: row["Transaction Date"],
      payee: row["Transaction Description"],
      outflow: row["Withdrawal"],
      inflow: row["Deposit"],
    };
  });
};

export const deriveDbsAccountFormat = (
  parsedCsv: ParsedCsvRow[],
): ProcessedCsvRow[] => {
  return parsedCsv.map((row, index) => {
    return {
      date: row["Transaction Date"],
      payee: row["Reference"],
      memo: row["Transaction Ref1"] + "\n" + row["Transaction Ref2"],
      outflow: row["Debit Amount"],
      inflow: row["Credit Amount"],
    };
  });
};

export const renameFilenameExtensionToCsv = (filename: string): string => {
  const delimiter = ".";
  if (!filename.includes(delimiter)) {
    return "";
  }

  return `${filename.split(delimiter)[0]}.csv`;
};

export const deriveOcbcBusinessAccountFormat = (
    parsedCsv: ParsedCsvRow[],
): ProcessedCsvRow[] => {
  return parsedCsv.map((row, index) => {
    return {
      date: row["Statement Value Date"],
      payee: row["Ref For Account Owner"],
      memo: row["Statement Details Info"],
      outflow: row["Debit Amount"],
      inflow: row["Credit Amount"],
    };
  });
};