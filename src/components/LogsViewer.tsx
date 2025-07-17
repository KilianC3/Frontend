import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  apiBase: string;
}

export default function LogsViewer({ apiBase }: Props) {
  const [logs, setLogs] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    fetch(`${apiBase}/api/logs`)
      .then((r) => r.text())
      .then((text) => {
        setLogs(text);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
    const id = setInterval(fetchLogs, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <Button variant="outline" size="sm" onClick={fetchLogs}>
        Refresh
      </Button>
      <pre className="overflow-auto max-h-96 bg-black text-green-200 p-2 text-xs rounded-md">
        {loading ? "Loading..." : logs}
      </pre>
    </div>
  );
}
