import { FC } from 'react';
import React from 'react';
import styles from '../styles/Block.module.css';
import { AsphaltBlockStyles, asphaltBlockStyleConfigs } from '../lib/eco-data/blocks';

interface NeighborBlocks {
  north?: AsphaltBlockStyles;
  south?: AsphaltBlockStyles;
  west?: AsphaltBlockStyles;
  east?: AsphaltBlockStyles;
}

const asphaltConcreteImages: Record<AsphaltBlockStyles, string> = {
  blank: 'blank-asphalt',
  blankWhite: 'blank-white',
  middleLine: 'middle-line',
  dottedLine: 'middle-line-dotted',
  border: 'border',
  borderCorner: 'border-corner',
  borderLine: 'border-line',
};

const getBlockImage = (style: AsphaltBlockStyles, neighbors: NeighborBlocks) => {
  let imageName: string = '';
  let rotation: number = 0;

  if (asphaltBlockStyleConfigs[style]?.dynamic) {
    let { substyle, rotation: rot } = getBlockSubstyle(style, neighbors);
    imageName = asphaltConcreteImages[style] + substyle;
    rotation = rot;
  } else {
    imageName = asphaltConcreteImages[style];
  }

  if (!imageName) throw new Error('Missing style image ' + style);
  return { src: `/images/roads/asphalt-concrete/${imageName}.png`, rotation };
};

// TODO make this code simpler or easier to understand
const getBlockSubstyle = (style: AsphaltBlockStyles, neighbors: NeighborBlocks) => {
  let substyle: string = '';
  let rotation: number = 0;
  const neighborsMatch = {
    north: neighbors.north === style ? 1 : 0,
    south: neighbors.south === style ? 1 : 0,
    west: neighbors.west === style ? 1 : 0,
    east: neighbors.east === style ? 1 : 0,
  };
  const neighborsCount = (neighborsMatch.north +
    neighborsMatch.south +
    neighborsMatch.east +
    neighborsMatch.west) as any as number;
  if (neighborsCount === 4 || neighborsCount === 0) {
    substyle = '-cross';
  } else if (
    neighborsMatch.north + neighborsMatch.south + neighborsMatch.east + neighborsMatch.west ===
    3
  ) {
    substyle = '-fork';
    rotation = !neighborsMatch.north
      ? 180
      : !neighborsMatch.west
      ? 90
      : !neighborsMatch.east
      ? 270
      : 0;
  } else if (
    neighborsMatch.north &&
    neighborsMatch.south &&
    !neighborsMatch.west &&
    !neighborsMatch.east
  ) {
    substyle = '';
  } else if (
    !neighborsMatch.north &&
    !neighborsMatch.south &&
    neighborsMatch.west &&
    neighborsMatch.east
  ) {
    substyle = '';
    rotation = 90;
  } else if (neighborsCount === 2) {
    substyle = '-corner';
    rotation =
      neighborsMatch.north + neighborsMatch.west === 2
        ? 0
        : neighborsMatch.north + neighborsMatch.east === 2
        ? 90
        : neighborsMatch.south + neighborsMatch.east === 2
        ? 180
        : 270;
  } else if (neighborsMatch.north + neighborsMatch.south === 1) {
    substyle = '';
  } else if (neighborsMatch.east + neighborsMatch.west === 1) {
    substyle = '';
    rotation = 90;
  }

  return {
    substyle,
    rotation,
  };
};

// Visual only
export const Block: FC<{
  type?: string;
  style: AsphaltBlockStyles;
  rotation?: number;
  neighbors?: NeighborBlocks;
  onClick: () => void;
  onRightClick?: () => void;
}> = ({ onClick, onRightClick, neighbors, style, rotation }) => {
  const { src, rotation: dynamicRotation } = getBlockImage(style, neighbors || {});
  return (
    <button
      className={styles['borderless-button']}
      onClick={onClick}
      onContextMenu={
        onRightClick &&
        ((event) => {
          event.preventDefault();
          onRightClick();
        })
      }
    >
      <img
        className={styles.block}
        src={src}
        style={{ transform: `rotate(${rotation || dynamicRotation || 0}deg)` }}
      />
    </button>
  );
};
