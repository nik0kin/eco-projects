import { AsphaltConcreteStyle, BlockType } from './eco-data/blocks';

export const DEFAULT_TYPE = BlockType.AsphaltConcrete;
export const DEFAULT_STYLE = AsphaltConcreteStyle.Blank;

// Optimized for Default (Asphalt)
export type GridCell = [AsphaltConcreteStyle, number, BlockType]; // [style, rotation, type]
export type OptimizedGridCell = AsphaltConcreteStyle | GridCell | [GridCell['0'], GridCell['1']];

export type DesignerGrid = Record<string, GridCell>; // key = comma separated coord string
export type OptimizedGrid = Record<string, OptimizedGridCell>;
