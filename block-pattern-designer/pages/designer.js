import Head from 'next/head';
import { Block } from '../components/block';
import { Palette } from '../components/palette';
import styles from '../styles/Designer.module.css';
// import { AsphaltBlockStyles } from '../lib/eco-data/blocks';
import times from '../lib/times';
import { SelectionManager, useSelection } from '../components/selection-manager';
import { useState } from 'react';

// type designerGrid = Record<string, AsphaltBlockStyles>;

const mapBlocks = (width, height, callback) => {
  return times(width * height, (n) => n).map((n) => {
    const x = n % 5;
    const y = Math.floor(n / 5);
    return callback(x, y, `${x},${y}`);
  });
};

const Designer = () => {
  // console.log(styles); // design-grid
  const [designerGrid, setDesignerGrid] = useState({});
  const selection = useSelection();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Block Pattern Designer</h1>

        <p className={styles.description}>
          Get started by editing <code>pages/index.js</code>
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
                style={designerGrid[coordStr] || 'blank'}
                onClick={() => {
                  console.log(`clicked on ${coordStr}`);
                  const updatedGrid = { ...designerGrid, [coordStr]: selection };
                  setDesignerGrid(updatedGrid);
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
  return (
    <SelectionManager>
      <Designer />
    </SelectionManager>
  );
};

export default DesignerApp;
