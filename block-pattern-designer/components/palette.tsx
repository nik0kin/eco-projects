import { Box, Card, CardBody, Heading, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
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
    /* TODO right side for desktop, below for mobile? */
    <Card variant="outline" mb={8}>
      <CardBody>
        <Box>
          <Heading size="s" textTransform="uppercase" mb={2}>
            Palette
          </Heading>
          <Wrap spacing={1}>
            <WrapItem>
              <BlockSelectionBorder type={BlockType.Grass}>
                <Block type={BlockType.Grass} onClick={() => setSelection([BlockType.Grass])} />
              </BlockSelectionBorder>
            </WrapItem>
            <WrapItem>
              <BlockSelectionBorder type={BlockType.StoneRoad}>
                <Block
                  type={BlockType.StoneRoad}
                  onClick={() => setSelection([BlockType.StoneRoad])}
                />
              </BlockSelectionBorder>
            </WrapItem>
            {asphaltBlockStylePaletteOrder.map((style) => (
              <WrapItem key={style}>
                <BlockSelectionBorder type={BlockType.AsphaltConcrete} style={style}>
                  <Block
                    type={BlockType.AsphaltConcrete}
                    style={style}
                    onClick={() => setSelection([BlockType.AsphaltConcrete, style])}
                    neighbors={{ north: style }}
                  />
                </BlockSelectionBorder>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </CardBody>
    </Card>
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
