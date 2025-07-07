import React, { useEffect, useState } from "react";

export default function DynamicBackground() {
  const [gradient, setGradient] = useState(
    "from-blue-800 via-purple-800 to-indigo-800",
  );

  useEffect(() => {
    const colors = [
      "from-blue-800 via-purple-800 to-indigo-800",
      "from-teal-700 via-cyan-700 to-blue-700",
      "from-rose-800 via-pink-800 to-purple-800",
    ];
    let i = 0;
    const id = setInterval(() => {
      setGradient(colors[i % colors.length]);
      i += 1;
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`fixed inset-0 -z-10 bg-gradient-to-br ${gradient} transition-colors duration-1000`}
    />
  );
}
