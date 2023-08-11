import { FC, ReactNode } from 'react';
import React from 'react';
import styles from '../styles/Designer.module.css';
import { Block } from './block';
import {
  AsphaltConcreteStyle,
  BlockType,
  asphaltBlockStylePaletteOrder,
} from '../lib/eco-data/blocks';
import { useSelection } from './selection-manager';

export const Palette: FC = () => {
  const { setSelection } = useSelection();
  return (
    /* TODO right side for desktop, below for mobile */
    <div className={styles.grid} style={{ border: '2px solid black', padding: '.25rem' }}>
      <p>
        <big style={{ margin: '1rem' }}>Palette</big>
      </p>

      <BlockSelectionBorder type={BlockType.Grass}>
        <Block type={BlockType.Grass} onClick={() => setSelection([BlockType.Grass])} />
      </BlockSelectionBorder>
      <BlockSelectionBorder type={BlockType.StoneRoad}>
        <Block type={BlockType.StoneRoad} onClick={() => setSelection([BlockType.StoneRoad])} />
      </BlockSelectionBorder>
      {asphaltBlockStylePaletteOrder.map((style) => (
        <BlockSelectionBorder key={style} type={BlockType.AsphaltConcrete} style={style}>
          <Block
            type={BlockType.AsphaltConcrete}
            style={style}
            onClick={() => setSelection([BlockType.AsphaltConcrete, style])}
            neighbors={{ north: style }}
          />
        </BlockSelectionBorder>
      ))}
    </div>
  );
};

const BlockSelectionBorder: FC<{
  children: ReactNode;
  type: BlockType;
  style?: AsphaltConcreteStyle;
}> = ({ children, type, style }) => {
  const { type: selectedType, style: selectedStyle } = useSelection();
  return (
    <div
      className={`${styles['palette-block']} ${
        styles[selectedType === type && selectedStyle === style ? 'selected' : 'unselected']
      }`}
    >
      {children}
    </div>
  );
};
