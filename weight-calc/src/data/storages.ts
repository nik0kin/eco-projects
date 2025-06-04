import { Storage } from '../types';

const woodCart = {
  name: 'Wood Cart',
  slots: 12,
  vehicle: {
    weightCapacity: 2100,
  },
};

const steamTruck = {
  name: 'Steam Truck',
  slots: 24,
  vehicle: {
    weightCapacity: 5000,
  },
};

const stockpile = {
  name: 'Stockpile',
  slots: 25,
};

export const storages: Storage[] = [woodCart, steamTruck, stockpile];
