import { AsphaltBlockStyles } from './eco-data/blocks';

// Optimized for Asphalt
export type GridCell = [AsphaltBlockStyles, number, string]; // [style, rotation, type]
// Optimized version: AsphaltBlockStyles | GridCell

export type DesignerGrid = Record<string, GridCell>; // key = comma separated coord string
