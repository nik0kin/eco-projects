import { FC, ReactElement, createContext, useContext, useState } from 'react';
import React from 'react';
import { AsphaltBlockStyles } from '../lib/eco-data/blocks';

const DEFAULT_STYLE_SELECTED = 'middleLine';

interface SelectionContextType {
  // type: '';
  style: AsphaltBlockStyles;
  setStyle: (style: AsphaltBlockStyles) => void;
}

const SelectionContext = createContext<SelectionContextType>(undefined as any);

export const SelectionManager: FC<{ children: ReactElement }> = ({ children }) => {
  const [style, setStyle] = useState<AsphaltBlockStyles>(DEFAULT_STYLE_SELECTED);
  return (
    <SelectionContext.Provider value={{ style, setStyle }}>{children}</SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext).style;
export const useSetSelection = () => useContext(SelectionContext).setStyle;
