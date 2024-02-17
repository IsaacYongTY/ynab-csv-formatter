import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { previewMaxRowIndex } from "@/app/constants";

export default function PreviewTable({ parsedData }) {
  return (
    <Table className="bg-white">
      <TableHead>
        <TableRow>
          {Object.keys(parsedData[0]).map((key, index) => (
            <TableCell key={index}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {parsedData.slice(0, previewMaxRowIndex).map((row, index) => (
          <TableRow key={index}>
            {Object.keys(row).map((key, index) => (
              <TableCell align="right" key={index}>
                {row[key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
