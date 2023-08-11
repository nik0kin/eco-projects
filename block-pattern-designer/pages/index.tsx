import debounce from 'lodash/debounce';
import times from 'lodash/times';
import Head from 'next/head';
import React, { FC, ReactNode, useState } from 'react';
import { Block } from '../components/block';
import { Palette } from '../components/palette';
import { SelectionManager, useSelection } from '../components/selection-manager';
import styles from '../styles/Designer.module.css';
import { AsphaltBlockStyles, isDynamicStyle } from '../lib/eco-data/blocks';
import { DesignerGrid } from '../lib/grid-type';
import { useUrlData, updateUrlData } from '../lib/grid-url-store';

const DEFAULT_STYLE = 'blank';

const mapBlocks = (
  width: number,
  height: number,
  callback: (x: number, y: number, coordStr: string) => ReactNode,
) => {
  return times(width * height, (n) => n).map((n) => {
    const x = n % 5;
    const y = Math.floor(n / 5);
    return callback(x, y, `${x},${y}`);
  });
};

const saveUrlData = (grid: DesignerGrid) => {
  // dont block render thread to save data
  setTimeout(() => updateUrlData(grid), 0);
};
const debounceSaveUrlData = debounce(saveUrlData, 1000);

const Designer: FC<{ urlData: DesignerGrid }> = ({ urlData }) => {
  const [designerGrid, setDesignerGrid] = useState<DesignerGrid>(urlData);
  const selection = useSelection();

  const saveGridData = (grid: DesignerGrid) => {
    setDesignerGrid(grid);
    debounceSaveUrlData(grid);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Block Pattern Designer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Block Pattern Designer</h1>

        <p className={styles.description}>
          Get started by clicking a block in the palette, then clicking in the grid area
        </p>

        <div>
          Claim Size
          <select name="grid-size">
            <option value="1x1">1x1</option>
            <option value="1x2">1x2</option>
            <option value="1x3">1x3</option>
            <option value="2x1">2x1</option>
            <option value="2x2">2x2</option>
            <option value="2x3">2x3</option>
            <option value="3x1">3x1</option>
            <option value="3x2">3x2</option>
            <option value="3x3">3x3</option>
          </select>
          <button onClick={() => saveGridData({})}>reset</button>
        </div>

        <div className={styles['design-grid']}>
          <div className={styles['design-grid-inner']}>
            {mapBlocks(5, 5, (x, y, coordStr) => (
              <Block
                key={coordStr}
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
                  const newGridCell: [AsphaltBlockStyles, number] = [selection, 0];
                  const updatedGrid = { ...designerGrid, [coordStr]: newGridCell };
                  saveGridData(updatedGrid);
                }}
                onRightClick={() => {
                  const previousGridCell = designerGrid[coordStr];
                  if (isDynamicStyle(previousGridCell?.[0] || DEFAULT_STYLE)) return;

                  const updatedGridCell: [AsphaltBlockStyles, number] = [
                    previousGridCell?.[0] || DEFAULT_STYLE,
                    ((previousGridCell?.[1] || 0) + 90) % 360,
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
      </main>

      <footer>
        Developed by Nik0kin. Check out the source at&nbsp;
        <a
          href="https://github.com/nik0kin/eco-projects/tree/main/block-pattern-designer"
          target="_blank"
        >
          Github
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
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
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export const DesignerApp = () => {
  const [isLoaded, urlData] = useUrlData();

  if (!isLoaded) {
    return <h1> Loading </h1>;
  }

  return (
    <SelectionManager>
      <Designer urlData={urlData} />
    </SelectionManager>
  );
};

export default DesignerApp;

const getCoordStrNeighbor = (x: number, y: number, xOffset: number, yOffset: number) => {
  return `${x + xOffset},${y + yOffset}`;
};
