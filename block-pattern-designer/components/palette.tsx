import { FC, ReactNode } from 'react';
import React from 'react';
import styles from '../styles/Designer.module.css';
import { Block } from './block';
import { asphaltBlockStylePaletteOrder } from '../lib/eco-data/blocks';
import { useSelection } from './selection-manager';

export const Palette: FC = () => {
  const { setSelection } = useSelection();
  return (
    /* TODO right side for desktop, below for mobile */
    <div className={styles.grid} style={{ border: '2px solid black', padding: '.25rem' }}>
      <p>
        <big style={{ margin: '1rem' }}>Palette</big>
      </p>

      <BlockSelectionBorder type="GRASS">
        <Block type="GRASS" onClick={() => setSelection(['GRASS'])} />
      </BlockSelectionBorder>
      <BlockSelectionBorder type="STONE-ROAD">
        <Block type="STONE-ROAD" onClick={() => setSelection(['STONE-ROAD'])} />
      </BlockSelectionBorder>
      {asphaltBlockStylePaletteOrder.map((style) => (
        <BlockSelectionBorder key={style} type="ASPHALT-CONCRETE" style={style}>
          <Block
            type="ASPHALT-CONCRETE"
            style={style}
            onClick={() => setSelection(['ASPHALT-CONCRETE', style])}
            neighbors={{ north: style }}
          />
        </BlockSelectionBorder>
      ))}
    </div>
  );
};

const BlockSelectionBorder: FC<{ children: ReactNode; type: string; style?: string }> = ({
  children,
  type,
  style,
}) => {
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
