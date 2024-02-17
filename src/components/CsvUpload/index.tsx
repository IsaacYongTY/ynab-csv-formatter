import { ChangeEvent, FC, useRef, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Papa from "papaparse";
import { enqueueSnackbar } from "notistack";
import * as XLSX from "xlsx";

import classnames from "classnames/bind";

import style from "./CsvUpload.module.scss";
import { WorkBook } from "xlsx";
import { ParsedCsvRow, ProcessedCsvRow } from "@/components/CsvUpload/types";
import {
  csvCleanupParamsMap,
  dropdownMenu,
} from "@/components/CsvUpload/constants";
import { renameFilenameExtensionToCsv } from "@/components/CsvUpload/utils";
const cx = classnames.bind(style);

type CsvUploadProps = {
  setParsedData: (data: ProcessedCsvRow[]) => void;
  parsedData: ParsedCsvRow[];
};

export default function CsvUpload({
  setParsedData,
  parsedData,
}: CsvUploadProps) {
  const [selectedType, setSelectedType] = useState<any>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileUploadInput = useRef<HTMLInputElement | null>(null);

  const detectBankAndTypeByFileName = (filename: string) => {
    console.log(filename);
    if (filename.includes("CardTransactions")) {
      setSelectedType("standardCharteredCreditCard");
      return;
    }

    if (filename.includes("ACC_TXN_History")) {
      setSelectedType("uobAccount");
      return;
    }

    if (filename.includes("CC_TXN_History")) {
      setSelectedType("uobCreditCard");
      return;
    }
  };
  function handleUploadOnChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target?.files[0]) return;

    const file = e.target?.files[0];
    setSelectedFile(file);

    detectBankAndTypeByFileName(file.name);
  }

  const handleSelectChange = (value: string) => {
    setParsedData([]);
    setSelectedType(value);
  };

  const processCsv = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target.result;

      if (typeof csvText !== "string") return;

      parseCsv(csvText);
    };

    if (!selectedFile) {
      return;
    }

    reader.readAsText(selectedFile);
  };

  const processXls = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target.result === "string") return;

      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const csvText = convertToCsv(workbook);

      parseCsv(csvText);
    };

    if (!selectedFile) {
      return;
    }

    reader.readAsArrayBuffer(selectedFile);
  };

  const convertToCsv = (workbook: WorkBook) => {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    return XLSX.utils.sheet_to_csv(worksheet);
  };

  const cleanCsv = (firstNLines: number, lastNLines: number, chunk: string) => {
    const chunkArray = chunk.split("\n");
    return chunkArray
      .slice(firstNLines, chunkArray.length - lastNLines)
      .join("\n");
  };

  const parseCsv = (file) => {
    const cleanedCsv = cleanCsv(
      csvCleanupParamsMap[selectedType].removeFirstNLines,
      csvCleanupParamsMap[selectedType].removeLastNLines,
      file,
    ).replaceAll(`\t`, "");

    return Papa.parse(cleanedCsv, {
      complete: (result) => {
        const processedData = csvCleanupParamsMap[
          selectedType
        ].transformFunction(result.data);

        setParsedData(processedData);
      },
      header: true,
      skipEmptyLines: true,
      delimiter: ",",
    });
  };

  const handleProcessFile = () => {
    console.log(selectedFile);
    if (selectedFile?.type === "text/csv") {
      return processCsv();
    }

    if (selectedFile?.type === "application/vnd.ms-excel") {
      return processXls();
    }
  };

  const handleDownload = () => {
    // unparse the data
    const csvString = Papa.unparse(parsedData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = selectedFile?.name
      ? `formatted_${renameFilenameExtensionToCsv(selectedFile?.name)}`
      : "parsedCsv.csv";
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cx("container")}>
      <label className={cx("custom-upload")}>
        <input
          ref={fileUploadInput}
          type="file"
          onChange={handleUploadOnChange}
          name="file"
          accept="text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, xls, xlsx"
        />
        <span className="material-icons">file_upload</span>
        <div>Click to Upload CSV</div>

        {selectedFile && (
          <div className={cx("file-name")}> {selectedFile.name}</div>
        )}
        {/*{errorMessage && (*/}
        {/*    <div className="error-message">{errorMessage}</div>*/}
        {/*)}*/}
        {/*{successMessage && <div>{successMessage}</div>}*/}
      </label>

      {selectedFile && (
        <FormControl sx={{ m: 1, minWidth: 270 }}>
          <InputLabel id="demo-simple-select-label">Bank & Type</InputLabel>
          <Select
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            value={selectedType}
            label="Bank & Type"
            onChange={(e) => handleSelectChange(e.target.value)}
          >
            <MenuItem value={""}>
              <em>None</em>
            </MenuItem>
            {dropdownMenu.map((item) => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <div className={cx("buttons-container")}>
        <Button onClick={handleProcessFile}>Process</Button>
        {parsedData.length !== 0 && (
          <Button onClick={handleDownload}>Download</Button>
        )}
      </div>
    </div>
  );
}
