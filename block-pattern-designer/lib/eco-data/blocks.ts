// id's optimizated for application, not related to real Eco data
export enum BlockType {
  AsphaltConcrete = 0,
  StoneRoad = 1,
  Grass = 2,
}

export enum AsphaltConcreteStyle {
  Blank = 0,
  BlankWhite = 1,
  MiddleLine = 2,
  DottedLine = 3,
  Border = 4,
  BorderCorner = 5,
  BorderSide = 6,
}

interface BlockStyleConfig {
  rotatable?: boolean;
  dynamic?: boolean;
}

export const asphaltBlockStyleConfigs: Record<AsphaltConcreteStyle, BlockStyleConfig> = {
  [AsphaltConcreteStyle.Blank]: {},
  [AsphaltConcreteStyle.BlankWhite]: {},
  [AsphaltConcreteStyle.MiddleLine]: {
    dynamic: true,
  },
  [AsphaltConcreteStyle.DottedLine]: {
    dynamic: true,
  },
  [AsphaltConcreteStyle.Border]: {},
  [AsphaltConcreteStyle.BorderCorner]: {
    rotatable: true,
  },
  [AsphaltConcreteStyle.BorderSide]: {
    rotatable: true,
  },
};

export const asphaltBlockStylePaletteOrder = Object.keys(asphaltBlockStyleConfigs).map(
  Number,
) as AsphaltConcreteStyle[];

export const isDynamicStyle = (style: AsphaltConcreteStyle) => {
  return !!asphaltBlockStyleConfigs[style].dynamic;
};
