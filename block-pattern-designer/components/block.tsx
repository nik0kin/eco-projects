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

const getBlockImage = (type: string, style: AsphaltBlockStyles, neighbors: NeighborBlocks) => {
  let imageName: string = '';
  let src: string = '';
  let rotation: number = 0;

  if (type === 'ASPHALT-CONCRETE') {
    if (asphaltBlockStyleConfigs[style]?.dynamic) {
      let { substyle, rotation: rot } = getBlockSubstyle(style, neighbors);
      // dotted line uses same sprites as middle line except for straight line
      if (style === 'dottedLine') {
        imageName =
          substyle === ''
            ? asphaltConcreteImages[style]
            : asphaltConcreteImages['middleLine'] + substyle;
      } else {
        // ie middleLine branch
        imageName = asphaltConcreteImages[style] + substyle;
      }
      rotation = rot;
    } else {
      imageName = asphaltConcreteImages[style];
    }
    src = `/images/roads/asphalt-concrete/${imageName}.png`;
  } else {
    switch (type) {
      case 'GRASS':
        src = `/images/grass.png`;
        break;
      case 'STONE-ROAD':
        src = `/images/roads/stone-road/stone-road-solo.png`;
        break;
    }
  }

  if (!src) throw new Error(`Missing image for type=${type} style=${style}`);
  return { src, rotation };
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
  style?: AsphaltBlockStyles;
  rotation?: number;
  neighbors?: NeighborBlocks;
  onClick: () => void;
  onRightClick?: () => void;
}> = ({ onClick, onRightClick, neighbors, type, style, rotation }) => {
  const { src, rotation: dynamicRotation } = getBlockImage(type, style, neighbors || {});
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
