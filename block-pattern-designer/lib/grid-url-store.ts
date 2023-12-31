import { AsphaltConcreteStyle } from './eco-data/blocks';
import { getNumbersFromCoordStr } from './coord-str';
import {
  DEFAULT_SIZE,
  DEFAULT_STYLE,
  DEFAULT_TYPE,
  DesignerGrid,
  LENGTH_OF_CLAIM,
  OptimizedGrid,
} from './grid-types';
import { useUrlData as useUrlDataGeneric, compressUrlData } from './url-store';

export const useUrlData = () => {
  // const size = [0, 0];
  const [isLoaded, urlData] = useUrlDataGeneric<OptimizedGrid>();

  const explodedData = isLoaded
    ? Object.entries(urlData || {}).reduce<DesignerGrid>((acc, [coordStr, gridCell]) => {
        // remove _size property
        if (coordStr === '_size') return acc;

        acc[coordStr] = Array.isArray(gridCell)
          ? [gridCell[0], gridCell[1] || 0, gridCell[2] || DEFAULT_TYPE]
          : [gridCell, 0, DEFAULT_TYPE];
        return acc;
      }, {})
    : {};
  const size: [number, number] = isLoaded ? urlData?._size || [...DEFAULT_SIZE] : [-1, -1];

  return [isLoaded, explodedData, size] as const;
};

export const compressGridData = (data: DesignerGrid, size: [number, number]) => {
  const slimmedData = Object.entries(data).reduce<OptimizedGrid>(
    (acc, [coordStr, gridCell]) => {
      // dont include data outside of claim size
      const coord = getNumbersFromCoordStr(coordStr);
      if (coord[0] >= size[0] * LENGTH_OF_CLAIM || coord[1] >= size[1] * LENGTH_OF_CLAIM) {
        return acc;
      }

      // dont include data that uses the default
      //  assumes the default cant be rotated
      if (gridCell[0] === DEFAULT_STYLE && gridCell[2] === DEFAULT_TYPE) {
        // [DEFAULT_STYLE, b, DEFAULT_TYPE] -> poof
      } else if (gridCell[2] === DEFAULT_TYPE) {
        // if its the default type but not style then try to minify data
        if (!gridCell[1]) {
          // [a, 0, DEFAULT_TYPE] -> a
          acc[coordStr] = gridCell[0] as AsphaltConcreteStyle;
        } else {
          // [a, b, DEFAULT_TYPE] -> [a, b]
          acc[coordStr] = [gridCell[0], gridCell[1]];
        }
      } else {
        // [a,b,c] -> [a, b, c]
        acc[coordStr] = gridCell;
      }
      return acc;
    },
    { _size: size },
  );

  // if slimmedData only contains _size property, then clean the hash
  if (Object.keys(slimmedData).length === 1) {
    return '';
  }

  return compressUrlData(slimmedData);
};
