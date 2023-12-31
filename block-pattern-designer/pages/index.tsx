import { Link } from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import times from 'lodash/times';
import Head from 'next/head';
import React, { ChangeEvent, FC, Fragment, ReactNode, useMemo, useState } from 'react';
import { Block } from '../components/block';
import { Options } from '../components/options';
import { Palette } from '../components/palette';
import { ShareLink } from '../components/share-link';
import { SelectionManager, useSelection } from '../components/selection-manager';
import styles from '../styles/Designer.module.css';
import blockStyles from '../styles/Block.module.css';
import { isDynamicStyle } from '../lib/eco-data/blocks';
import {
  LENGTH_OF_CLAIM,
  DEFAULT_STYLE,
  DEFAULT_TYPE,
  DesignerGrid,
  GridCell,
} from '../lib/grid-types';
import { useUrlData } from '../lib/grid-url-store';
import { useSaveGridViaWorker } from '../lib/use-save-grid-via-worker';

const PAGE_TITLE = 'Road Pattern Designer';

const mapBlocks = (
  width: number,
  height: number,
  callback: (x: number, y: number, coordStr: string) => ReactNode,
) => {
  return times(width * height, (n) => n).map((n) => {
    const x = n % width;
    const y = Math.floor(n / width);
    return callback(x, y, `${x},${y}`);
  });
};

const Designer: FC<{ preloadedGrid: DesignerGrid; preloadedGridSize: [number, number] }> = ({
  preloadedGrid,
  preloadedGridSize,
}) => {
  const [width, setWidth] = useState(preloadedGridSize[0]);
  const [height, setHeight] = useState(preloadedGridSize[1]);
  const [designerGrid, setDesignerGrid] = useState<DesignerGrid>(preloadedGrid);
  const { type: selectedType, style: selectedStyle } = useSelection();

  const [saveGridViaWorker, pageUrl] = useSaveGridViaWorker();
  const debounceSaveUrlData = useMemo(() => debounce(saveGridViaWorker, 1250), [saveGridViaWorker]);

  const saveGridData = (grid: DesignerGrid) => {
    setDesignerGrid(grid);
    debounceSaveUrlData(grid, [width, height]);
  };

  const onClaimSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = event.target.value.split('x');
    const newWidth = Number(selectedSize[0]);
    const newHeight = Number(selectedSize[1]);
    setWidth(newWidth);
    setHeight(newHeight);
    debounceSaveUrlData(designerGrid, [newWidth, newHeight]);
  };

  return (
    <div
      className={styles.container}
      style={{ '--block-size': getBlockSize(width, height) } as any}
    >
      <main style={{ maxWidth: '100vw', padding: '.75rem' }}>
        <h1 className={styles.title}>{PAGE_TITLE}</h1>

        <p className={styles.description}>
          Get started by clicking a block in the palette, then clicking in the grid area. Right
          click or long press to rotate
        </p>

        <Options
          preloadedGridSize={preloadedGridSize}
          saveGridData={saveGridData}
          onClaimSizeChange={onClaimSizeChange}
        />

        <div className={styles['design-grid'] + ' ' + blockStyles['design-grid']}>
          <div
            className={styles['design-grid-inner']}
            style={{ gridTemplateColumns: `repeat(${width * LENGTH_OF_CLAIM}, max-content)` }}
          >
            {mapBlocks(width * LENGTH_OF_CLAIM, height * LENGTH_OF_CLAIM, (x, y, coordStr) => (
              <Block
                key={coordStr}
                type={designerGrid[coordStr]?.[2] || DEFAULT_TYPE}
                style={designerGrid[coordStr]?.[0] || DEFAULT_STYLE}
                rotation={designerGrid[coordStr]?.[1]}
                neighbors={{
                  north: designerGrid[getCoordStrNeighbor(x, y, 0, -1)]?.[0],
                  south: designerGrid[getCoordStrNeighbor(x, y, 0, 1)]?.[0],
                  west: designerGrid[getCoordStrNeighbor(x, y, -1, 0)]?.[0],
                  east: designerGrid[getCoordStrNeighbor(x, y, 1, 0)]?.[0],
                }}
                onClick={() => {
                  // console.log(`clicked on ${coordStr}`);
                  const newGridCell: GridCell = [selectedStyle, 0, selectedType];
                  const updatedGrid = { ...designerGrid, [coordStr]: newGridCell };
                  saveGridData(updatedGrid);
                }}
                onRightClick={() => {
                  const previousGridCell = designerGrid[coordStr];
                  if (isDynamicStyle(previousGridCell?.[0] || DEFAULT_STYLE)) return;

                  const updatedGridCell: GridCell = [
                    previousGridCell?.[0] || DEFAULT_STYLE,
                    ((previousGridCell?.[1] || 0) + 90) % 360,
                    previousGridCell?.[2] || DEFAULT_TYPE,
                  ];
                  const updatedGrid = { ...designerGrid, [coordStr]: updatedGridCell };
                  // console.log(updatedGridCell);
                  saveGridData(updatedGrid);
                }}
              />
            ))}
          </div>
        </div>

        <Palette />

        <ShareLink pageUrl={pageUrl} />
      </main>

      <footer>
        Developed by Nik0kin. Check out the source at&nbsp;
        <Link
          href="https://github.com/nik0kin/eco-projects/tree/main/block-pattern-designer"
          target="_blank"
          style={{ textDecoration: 'underline' }}
          isExternal
        >
          Github
        </Link>
      </footer>

      <style jsx>{`
        main {
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
        }
        html {
          /* Dont refresh on scrolling down */
          overscroll-behavior: none;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

const DesignerHead: FC = () => (
  <Head>
    <title>{PAGE_TITLE}</title>
    <link rel="icon" href="/favicon.ico" />
    <meta
      name="description"
      content="Use a palette of road blocks to design a road pattern that's easily shared via page url."
    />
  </Head>
);

export const DesignerApp = () => {
  const [isLoaded, urlGrid, urlGridSize] = useUrlData();

  if (!isLoaded) {
    return (
      <Fragment>
        <DesignerHead />
        <h1> Loading </h1>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <DesignerHead />
      <SelectionManager>
        <Designer preloadedGrid={urlGrid} preloadedGridSize={urlGridSize} />
      </SelectionManager>
    </Fragment>
  );
};

export default DesignerApp;

const getCoordStrNeighbor = (x: number, y: number, xOffset: number, yOffset: number) => {
  return `${x + xOffset},${y + yOffset}`;
};

const getBlockSize = (gridWidth: number, gridHeight: number) => {
  if (window.innerWidth > 600) {
    if (gridWidth === 1 && gridHeight === 1) return '50px';
    if (gridWidth === 3 || gridHeight === 3) return '32px';
    else return '44px';
  }

  // default/mobile
  if (gridWidth === 1 && gridHeight === 1) return '40px';
  if (gridWidth === 3 || gridHeight === 3) return '25px';
  else return '32px';
};
