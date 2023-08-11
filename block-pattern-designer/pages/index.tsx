import Head from 'next/head';
import { Block } from '../components/block';
import { Palette } from '../components/palette';
import styles from '../styles/Designer.module.css';
import { AsphaltBlockStyles, isDynamicStyle } from '../lib/eco-data/blocks';
import { DesignerGrid } from '../lib/grid-type';
import { useUrlData, updateUrlData } from '../lib/grid-url-store';
import times from '../lib/times';
import { SelectionManager, useSelection } from '../components/selection-manager';
import React, { FC, ReactNode, useState } from 'react';

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

const Designer: FC<{urlData: DesignerGrid}> = ({ urlData }) => {
  const [designerGrid, setDesignerGrid] = useState<DesignerGrid>(urlData);
  const selection = useSelection();

  const saveData = () => updateUrlData(designerGrid);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Block Pattern Designer</h1>

        <p className={styles.description}>
          Get started by clicking a block in the palette, then clicking in the grid area
        </p>

        <div>
          Claim Size
          <select name="cars" id="cars">
            <option value="volvo">1x1</option>
            <option value="saab">1x2</option>
            <option value="mercedes">1x3</option>
            <option value="audi">2x2</option>
            <option value="audi">3x3</option>
          </select>
          <button>reset</button>
        </div>

        <div className={styles['design-grid']}>
          <div className={styles['design-grid-inner']}>
            {mapBlocks(5, 5, (x, y, coordStr) => (
              <Block
                key={coordStr}
                style={designerGrid[coordStr]?.[0] || 'blank'}
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
                  setDesignerGrid(updatedGrid);
                  saveData();
                }}
                onRightClick={() => {
                  const previousGridCell = designerGrid[coordStr];
                  if (isDynamicStyle(previousGridCell?.[0] || 'blank')) return;

                  const updatedGridCell: [AsphaltBlockStyles, number] = [previousGridCell?.[0] || 'blank', ((previousGridCell?.[1] || 0) + 90) % 360];
                  const updatedGrid = { ...designerGrid, [coordStr]: updatedGridCell };
                  // console.log(updatedGridCell);
                  setDesignerGrid(updatedGrid);
                  saveData();
                }}
              />
            ))}
          </div>
        </div>

        <Palette />
      </main>

      <footer>Developed by Nik0kin. Check out the source at Github</footer>

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
