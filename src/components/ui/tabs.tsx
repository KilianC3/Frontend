import React, { createContext, useContext } from "react";

interface TabsContext {
  value: string;
  onValueChange: (v: string) => void;
}
const Context = createContext<TabsContext | null>(null);

interface TabsProps {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}
export function Tabs({
  value,
  onValueChange,
  children,
  className = "",
}: TabsProps) {
  return (
    <Context.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </Context.Provider>
  );
}

export function TabsList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`flex ${className}`}>{children}</div>;
}

interface TriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}
export function TabsTrigger({ value, children, className = "" }: TriggerProps) {
  const ctx = useContext(Context);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      className={`${active ? "font-bold border-b-2" : ""} px-3 py-1 ${className}`}
      onClick={() => ctx.onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = useContext(Context);
  if (!ctx || ctx.value !== value) return null;
  return <div>{children}</div>;
}
