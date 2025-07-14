import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Slider({ className = "", ...props }: Props) {
  return <input type="range" className={`w-full ${className}`} {...props} />;
}
