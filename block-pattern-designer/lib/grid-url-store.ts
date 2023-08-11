import { DesignerGrid } from './grid-type';
import {
  useUrlData as useUrlDataGeneric,
  updateUrlData as updateUrlDataGeneric,
} from './url-store';

export const useUrlData = () => {
  const [isLoaded, urlData] = useUrlDataGeneric<DesignerGrid>();
  return [isLoaded, urlData || {}] as const;
};

// TODO EFF breaking change, string enums could be ints
export const updateUrlData = updateUrlDataGeneric<DesignerGrid>;
