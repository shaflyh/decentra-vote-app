import React from "react";

interface CardProps {
  children?: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="w-full p-6 mt-4 bg-white border border-blue-100 shadow-md rounded-xl">
      {children}
    </div>
  );
}
