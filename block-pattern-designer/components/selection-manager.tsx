import { FC, ReactElement, createContext, useContext, useState } from 'react';
import React from 'react';
import { AsphaltBlockStyles } from '../lib/eco-data/blocks';

const DEFAULT_STYLE_SELECTED: [string, AsphaltBlockStyles] = ['ASPHALT-CONCRETE', 'middleLine'];

interface SelectionContextType {
  type: string;
  style: AsphaltBlockStyles | undefined;
  setSelection: (style: [string] | [string, AsphaltBlockStyles]) => void;
}

const SelectionContext = createContext<SelectionContextType>(undefined as any);

export const SelectionManager: FC<{ children: ReactElement }> = ({ children }) => {
  const [[type, style], setSelection] = useState<[string] | [string, AsphaltBlockStyles]>(
    DEFAULT_STYLE_SELECTED,
  );
  return (
    <SelectionContext.Provider value={{ type, style, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);
