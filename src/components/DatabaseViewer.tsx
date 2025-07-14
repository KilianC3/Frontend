import React, { useEffect, useState } from "react";
import { exportToCSV } from "@/utils/export";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface Props {
  apiBase: string;
}

interface TableData {
  [key: string]: any;
}

export default function DatabaseViewer({ apiBase }: Props) {
  const [tables, setTables] = useState<string[]>([]);
  const [table, setTable] = useState("");
  const [data, setData] = useState<TableData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${apiBase}/api/tables`)
      .then((r) => r.json())
      .then((d) => setTables(d.tables || []))
      .catch((e) => setError(e.message));
  }, [apiBase]);

  useEffect(() => {
    if (!table) return;
    fetch(`${apiBase}/api/table/${table}`)
      .then((r) => r.json())
      .then((d) => setData(d.records || d.data || []))
      .catch((e) => setError(e.message));
  }, [apiBase, table]);

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex items-center space-x-4">
        <Select
          value={table}
          onChange={(e) => setTable(e.target.value)}
          className="w-48"
        >
          <option value="" disabled>
            Choose table
          </option>
          {tables.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToCSV(data, `${table}.csv`)}
          disabled={!data.length}
        >
          Export
        </Button>
      </div>
      <div className="overflow-auto max-h-96">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {data[0] &&
                Object.keys(data[0]).map((h) => (
                  <th key={h} className="px-2 py-1 text-left">
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-t">
                {Object.keys(row).map((k) => (
                  <td key={k} className="px-2 py-1 whitespace-nowrap">
                    {String(row[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
