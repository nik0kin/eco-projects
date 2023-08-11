import { FC, ReactElement, createContext, useContext, useState } from 'react';
import React from 'react';
import { AsphaltConcreteStyle, BlockType } from '../lib/eco-data/blocks';

const DEFAULT_STYLE_SELECTED: [BlockType, AsphaltConcreteStyle] = [
  BlockType.AsphaltConcrete,
  AsphaltConcreteStyle.MiddleLine,
];

interface SelectionContextType {
  type: BlockType;
  style: AsphaltConcreteStyle | undefined;
  setSelection: (style: [BlockType] | [BlockType, AsphaltConcreteStyle]) => void;
}

const SelectionContext = createContext<SelectionContextType>(undefined as any);

export const SelectionManager: FC<{ children: ReactElement }> = ({ children }) => {
  const [[type, style], setSelection] = useState<[BlockType] | [BlockType, AsphaltConcreteStyle]>(
    DEFAULT_STYLE_SELECTED,
  );
  return (
    <SelectionContext.Provider value={{ type, style, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);
