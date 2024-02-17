import {
  deriveStandardCharteredCreditCardFormat, deriveUobAccountFormat,
  deriveUobCreditCardFormat,
} from "@/components/CsvUpload/utils";
import { CsvCleanupParamsMap } from "@/components/CsvUpload/types";

export const csvCleanupParamsMap: CsvCleanupParamsMap = {
  standardCharteredCreditCard: {
    removeFirstNLines: 4,
    removeLastNLines: 5,
    transformFunction: deriveStandardCharteredCreditCardFormat,
  },
  uobCreditCard: {
    removeFirstNLines: 9,
    removeLastNLines: 0,
    transformFunction: deriveUobCreditCardFormat,
  },
  uobAccount: {
    removeFirstNLines: 7,
    removeLastNLines: 0,
    transformFunction: deriveUobAccountFormat,
  },
};

export const dropdownMenu = [
  {
    value: "standardCharteredCreditCard",
    label: "Standard Chartered Credit Card",
  },
  {
    value: "uobCreditCard",
    label: "UOB Credit Card",
  },
  {
    value: "uobAccount",
    label: "UOB Account",
  },
];
