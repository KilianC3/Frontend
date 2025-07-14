import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={`border rounded px-2 py-1 focus:outline-none focus:ring ${className}`}
      {...props}
    />
  );
}
