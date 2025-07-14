import React from "react";

interface Props {
  value: [Date, Date];
  onChange: (v: [Date, Date]) => void;
}

export function DatePicker({ value, onChange }: Props) {
  return (
    <div className="flex space-x-2">
      <input
        type="date"
        value={value[0].toISOString().slice(0, 10)}
        onChange={(e) => onChange([new Date(e.target.value), value[1]])}
        className="border rounded px-2 py-1"
      />
      <span>to</span>
      <input
        type="date"
        value={value[1].toISOString().slice(0, 10)}
        onChange={(e) => onChange([value[0], new Date(e.target.value)])}
        className="border rounded px-2 py-1"
      />
    </div>
  );
}
