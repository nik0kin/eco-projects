import { AsphaltConcreteStyle, BlockType } from './eco-data/blocks';

// Optimized for Asphalt
export type GridCell = [AsphaltConcreteStyle, number, BlockType]; // [style, rotation, type]
// Optimized version: AsphaltConcreteStyle | GridCell

export type DesignerGrid = Record<string, GridCell>; // key = comma separated coord string
