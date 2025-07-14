import React from "react";

interface Props {
  data: number[][];
}

export default function Heatmap({ data }: Props) {
  const max = Math.max(...data.flat().map(Math.abs));
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(${data[0]?.length || 0}, 1fr)` }}
    >
      {data.map((row, i) =>
        row.map((v, j) => {
          const intensity = max ? Math.abs(v) / max : 0;
          const color =
            v >= 0
              ? `rgba(59,130,246,${intensity})`
              : `rgba(220,38,38,${intensity})`;
          return (
            <div
              key={`${i}-${j}`}
              className="h-6 flex items-center justify-center text-xs"
              style={{ backgroundColor: color }}
            >
              {v.toFixed(2)}
            </div>
          );
        }),
      )}
    </div>
  );
}
