import { FC } from 'react';
import React from 'react';
import styles from '../styles/Block.module.css';
import { AsphaltBlockStyles } from '../lib/eco-data/blocks';

const asphaltConcreteImages: Record<AsphaltBlockStyles, string> = {
  blank: 'blank-asphalt',
  blankWhite: 'blank-white',
  middleLine: 'middle-line',
  dottedLine: 'middle-line-dotted',
  border: 'fart',
  borderCorner: 'fart',
  borderLine: 'fart'
};

const getBlockImage = (style: AsphaltBlockStyles) => {
  const imageName = asphaltConcreteImages[style];
  if (!imageName) throw new Error('Missing style image ' + style);
  return `/images/roads/asphalt-concrete/${imageName}.png`;
};

// Visual only
export const Block: FC<{ type: string; style: AsphaltBlockStyles; onClick: () => void }> = ({
  onClick,
  style,
}) => {
  return (
    <button className={styles['borderless-button']} onClick={onClick}>
      <img className={styles.block} src={getBlockImage(style)} />
    </button>
  );
};
