import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: Props) {
  return (
    <div className={`bg-white p-4 rounded shadow ${className}`} {...props} />
  );
}

export function CardHeader({ className = "", ...props }: Props) {
  return <div className={`font-semibold mb-2 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: Props) {
  return <div className={className} {...props} />;
}
