import { FC } from 'react';
import React from 'react';
import styles from '../styles/Block.module.css';
import { AsphaltConcreteStyle, BlockType, asphaltBlockStyleConfigs } from '../lib/eco-data/blocks';

interface NeighborBlocks {
  north?: AsphaltConcreteStyle;
  south?: AsphaltConcreteStyle;
  west?: AsphaltConcreteStyle;
  east?: AsphaltConcreteStyle;
}

const asphaltConcreteImages: Record<AsphaltConcreteStyle, string> = {
  [AsphaltConcreteStyle.Blank]: 'blank-asphalt',
  [AsphaltConcreteStyle.BlankWhite]: 'blank-white',
  [AsphaltConcreteStyle.MiddleLine]: 'middle-line',
  [AsphaltConcreteStyle.DottedLine]: 'middle-line-dotted',
  [AsphaltConcreteStyle.Border]: 'border',
  [AsphaltConcreteStyle.BorderCorner]: 'border-corner',
  [AsphaltConcreteStyle.BorderSide]: 'border-line',
};

const getBlockImage = (
  type: BlockType,
  style: AsphaltConcreteStyle | undefined,
  neighbors: NeighborBlocks,
) => {
  let imageName: string = '';
  let src: string = '';
  let rotation: number = 0;

  if (type === BlockType.AsphaltConcrete && typeof style === 'number') {
    if (asphaltBlockStyleConfigs[style]?.dynamic) {
      let { substyle, rotation: rot } = getBlockSubstyle(style, neighbors);
      // dotted line uses same sprites as middle line except for straight line
      if (style === AsphaltConcreteStyle.DottedLine) {
        imageName =
          substyle === ''
            ? asphaltConcreteImages[style]
            : asphaltConcreteImages[AsphaltConcreteStyle.MiddleLine] + substyle;
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
      case BlockType.Grass:
        src = `/images/grass.png`;
        break;
      case BlockType.StoneRoad:
        src = `/images/roads/stone-road/stone-road-solo.png`;
        break;
    }
  }

  if (!src) throw new Error(`Missing image for type=${type} style=${style}`);
  return { src, rotation };
};

// TODO make this code simpler or easier to understand
const getBlockSubstyle = (style: AsphaltConcreteStyle, neighbors: NeighborBlocks) => {
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
  type: BlockType;
  style?: AsphaltConcreteStyle;
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
      onMouseMove={(event) => {
        if (event.buttons === 1) {
          onClick();
        }
      }}
      onTouchMove={onClick}
      onDragStart={(event) => event.preventDefault()}
    >
      <img
        className={styles.block}
        src={src}
        // TODO alt description, describe block & location (coordinate or palette)
        style={{ transform: `rotate(${rotation || dynamicRotation || 0}deg)` }}
      />
    </button>
  );
};
