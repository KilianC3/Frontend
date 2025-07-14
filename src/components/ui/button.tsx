import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "xs" | "default";
}

export function Button({
  variant = "default",
  size = "default",
  className = "",
  ...props
}: Props) {
  const variantClass =
    variant === "outline"
      ? "border border-gray-300 bg-white hover:bg-gray-100"
      : "bg-blue-600 text-white hover:bg-blue-700";
  const sizeClass =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "xs"
        ? "px-2 py-0.5 text-xs"
        : "px-4 py-2";
  return (
    <button
      className={`${variantClass} ${sizeClass} rounded ${className}`}
      {...props}
    />
  );
}
