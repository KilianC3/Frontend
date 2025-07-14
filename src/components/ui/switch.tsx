import React from "react";

interface Props {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

export function Switch({ checked, onCheckedChange }: Props) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`h-4 w-8 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <span
          className={`block h-4 w-4 bg-white rounded-full shadow transform transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </span>
    </label>
  );
}
