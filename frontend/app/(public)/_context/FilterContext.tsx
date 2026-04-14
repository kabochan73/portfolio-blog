"use client";

import { createContext, useContext, useState } from "react";

const FilterContext = createContext<{
  open: boolean;
  toggle: () => void;
}>({ open: false, toggle: () => {} });

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <FilterContext.Provider value={{ open, toggle: () => setOpen((p) => !p) }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}
