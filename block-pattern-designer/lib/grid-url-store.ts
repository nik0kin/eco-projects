import { DEFAULT_STYLE, DEFAULT_TYPE, DesignerGrid, OptimizedGrid } from './grid-types';
import {
  useUrlData as useUrlDataGeneric,
  updateUrlData as updateUrlDataGeneric,
} from './url-store';

export const useUrlData = () => {
  const [isLoaded, urlData] = useUrlDataGeneric<OptimizedGrid>();

  const explodedData = isLoaded
    ? Object.entries(urlData || {}).reduce<DesignerGrid>((acc, [coordStr, gridCell]) => {
        acc[coordStr] = Array.isArray(gridCell)
          ? [gridCell[0], gridCell[1] || 0, gridCell[2] || DEFAULT_TYPE]
          : [gridCell, 0, DEFAULT_TYPE];
        return acc;
      }, {})
    : {};

  return [isLoaded, explodedData] as const;
};

export const updateUrlData = (data: DesignerGrid) => {
  const slimmedData = Object.entries(data).reduce<OptimizedGrid>((acc, [coordStr, gridCell]) => {
    // dont include data that uses the default
    //  assumes the default cant be rotated
    if (gridCell[0] === DEFAULT_STYLE && gridCell[2] === DEFAULT_TYPE) {
      // [DEFAULT_STYLE, b, DEFAULT_TYPE] -> poof
    } else if (gridCell[2] === DEFAULT_TYPE) {
      // if its the default type but not style then try to minify data
      if (!gridCell[1]) {
        // [a, 0, DEFAULT_TYPE] -> a
        acc[coordStr] = gridCell[0];
      } else {
        // [a, b, DEFAULT_TYPE] -> [a, b]
        acc[coordStr] = [gridCell[0], gridCell[1]];
      }
    } else {
      // [a,b,c] -> [a, b, c]
      acc[coordStr] = gridCell;
    }
    return acc;
  }, {});

  if (Object.keys(slimmedData).length === 0) {
    location.hash = '';
    return;
  }

  updateUrlDataGeneric(slimmedData);
};
