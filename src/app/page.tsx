"use client";

import { useState } from "react";

import { SnackbarProvider } from "notistack";
import CsvUpload from "@/components/CsvUpload";
import { ProcessedCsvRow } from "@/components/CsvUpload/types";
import PreviewTable from "@/components/PreviewTable";
import { previewMaxRowIndex } from "@/app/constants";

export default function Home() {
  const [parsedData, setParsedData] = useState<ProcessedCsvRow[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <SnackbarProvider />
      <h2 className="justify-center text-4xl font-extrabold">
        YNAB CSV Formatter
      </h2>

      <CsvUpload setParsedData={setParsedData} parsedData={parsedData} />

      <div>{`Preview: (First ${previewMaxRowIndex} rows)`} </div>
      {parsedData.length !== 0 && <PreviewTable parsedData={parsedData} />}
    </main>
  );
}
