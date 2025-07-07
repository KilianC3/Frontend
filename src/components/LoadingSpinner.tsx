import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
    </div>
  );
}
