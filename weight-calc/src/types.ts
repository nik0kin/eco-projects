export interface Storage {
  name: string;
  slots: number;
  vehicle?: {
    weightCapacity: number;
  };
}

export interface Item {
  name: string;
  diggable?: boolean;
  weight: number;
}
