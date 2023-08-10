interface BlockStyleConfig {
  rotatable?: boolean;
  dynamic?: boolean;
}

export type AsphaltBlockStyles =
  | 'blank'
  | 'blankWhite'
  | 'middleLine'
  | 'dottedLine'
  | 'border'
  | 'borderCorner'
  | 'borderLine';

export const asphaltBlockStyleConfigs: Record<AsphaltBlockStyles, BlockStyleConfig> = {
  blank: {},
  blankWhite: {},
  middleLine: {
    dynamic: true,
  },
  dottedLine: {
    dynamic: true,
  },
  border: {},
  borderCorner: {
    rotatable: true,
  },
  borderLine: {
    rotatable: true,
  },
};

export const asphaltBlockStylePaletteOrder = Object.keys(
  asphaltBlockStyleConfigs,
) as AsphaltBlockStyles[];
