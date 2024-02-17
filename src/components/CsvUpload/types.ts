export type ParsedCsvRow = {
  [key: string]: string;
};

export type ProcessedCsvRow = {
  date: string;
  payee: string;
  memo?: string;
  outflow?: string;
  inflow?: string;
  amount?: string;
};

export type CsvCleanupParamsMap = { [key: string]: CsvCleanupParams };

export type CsvCleanupParams = {
  removeFirstNLines: number;
  removeLastNLines: number;
  transformFunction: (csv: ParsedCsvRow[]) => ProcessedCsvRow[];
};
