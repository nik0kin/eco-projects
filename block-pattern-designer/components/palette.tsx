import { FC } from 'react';
import React from 'react';
import styles from '../styles/Designer.module.css';
import { Block } from './block';
import { asphaltBlockStylePaletteOrder } from '../lib/eco-data/blocks';
import { useSelection, useSetSelection } from './selection-manager';

export const Palette: FC = () => {
  const selection = useSelection();
  const setSelection = useSetSelection();
  return (
    <div className={styles.grid} style={{ border: '1px solid black' }}>
      <p>palette (right side for desktop, below for mobile)</p>

      {asphaltBlockStylePaletteOrder.map((style) => (
        <div
          key={style}
          className={`${styles['palette-block']} ${
            styles[selection === style ? 'selected' : 'unselected']
          }`}
        >
          <Block type="ASPHALT-CONCRETE" style={style} onClick={() => setSelection(style)} />
        </div>
      ))}

      {/* <div className={`${styles['palette-block']} ${styles['unselected']}`}>
        <Block type="ASPHALT-CONCRETE" style="blank" onClick={() => 0}/>
    </div>

    <div className={`${styles['palette-block']} ${styles['selected']}`}>
        <Block type="ASPHALT-CONCRETE" style="blankWhite" onClick={() => 0}/>
    </div>

    <div className={`${styles['palette-block']} ${styles['unselected']}`}>
        <Block type="ASPHALT-CONCRETE" style="middleLine" onClick={() => 0}/>
    </div> */}
    </div>
  );
};
