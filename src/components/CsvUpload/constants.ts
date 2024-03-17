import {
  deriveDbsAccountFormat, deriveOcbcBusinessAccountFormat,
  deriveStandardCharteredCreditCardFormat, deriveUobAccountFormat,
  deriveUobCreditCardFormat,
} from "@/components/CsvUpload/utils";
import { CsvCleanupParamsMap } from "@/components/CsvUpload/types";

export const csvCleanupParamsMap: CsvCleanupParamsMap = {
  standardCharteredCreditCard: {
    removeFirstNLines: 4,
    removeLastNLines: 6,
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
  dbsAccount: {
    removeFirstNLines: 17,
    removeLastNLines: 0,
    transformFunction: deriveDbsAccountFormat,
  },
  ocbcBusinessAccount: {
    removeFirstNLines: 0,
    removeLastNLines: 0,
    transformFunction: deriveOcbcBusinessAccountFormat
  }
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
  {
    value: "dbsAccount",
    label: "DBS Account",
  },
  {
    value: "ocbcBusinessAccount",
    label: "OCBC Business Account",
  },
];
