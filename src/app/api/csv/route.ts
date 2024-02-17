// import {readCsv} from "@/app/api/csv/utils";
import fs from "fs";
import csv from "csv-parser";

export const readCsv = (file: File) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on("error", (error) => reject(error))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log(results);
        resolve(results);
      });
  });
};
export async function POST(request: Request) {
  console.log("in");
  // console.log(request.formData())
  const body = await request.formData();
  console.log(body);
  // if(!request.body) return;
  // const { csv } = body
  const csvFile = body.get("file");
  // console.log(csv)
  if (!csvFile || typeof csvFile === "string") {
    return Response.json({ error: "400" });
  }

  csv().
  // const data = await readCsv(csvFile);

  return Response.json({ data });
}
