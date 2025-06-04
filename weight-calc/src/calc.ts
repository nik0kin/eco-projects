import { Item, Storage } from './types';

export const calcTotalAllowableInStorage = (storage: Storage, item: Item) => {
  const diggableInVehicle = storage.vehicle && item.diggable;
  const stackSize = item.diggable ? (diggableInVehicle ? 10 : 5) : 20;

  const totalItems = storage.slots * stackSize;
  const slotsLeft = 0;
  const weightCapacityLeft = storage.vehicle
    ? storage.vehicle.weightCapacity - totalItems * item.weight
    : 0;

  return [totalItems, slotsLeft, weightCapacityLeft];
};
