import React from "react";
import clsx from "clsx";

export function Button({ children, className, ...props }) {
  return (
    <button
      className={clsx(
        "px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
