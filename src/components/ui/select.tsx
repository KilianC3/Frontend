import React from "react";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = "", children, ...props }: Props) {
  return (
    <select
      className={`border rounded px-2 py-1 bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
