import * as React from 'react';
import { type FC, useState } from 'react';

import { calcTotalAllowableInStorage } from './calc';
import { cargoItems } from './data/cargo-items';
import { storages } from './data/storages';

import './App.css';

const storageOptions = [
  'Wood Cart',
  'Steam Truck',
  // 'Truck',
  'Stockpile',
  // 'Large Lumber Stockpile',
];

export const App: FC = () => {
  const [selectedStorage, setSelectedStorage] = useState('Stockpile');
  const selectedStorageInfo = storages.find((s) => s.name === selectedStorage)!;

  const [selectedCargo, setSelectedCargo] = useState('Dirt');
  const selectedCargoInfo = cargoItems.find((c) => c.name === selectedCargo)!;

  const [calcedTotalItems, calcedSlotsLeft, calcedWeightCapacityLeft] =
    calcTotalAllowableInStorage(selectedStorageInfo, selectedCargoInfo);

  return (
    <>
      <h1>
        How much can I hold in my{' '}
        <select
          style={{ fontSize: '24px' }}
          value={selectedStorage}
          onChange={(e) => {
            setSelectedStorage(e.target.value);
          }}
        >
          {storageOptions.map((storage) => (
            <option key={storage}>{storage}</option>
          ))}
        </select>{' '}
        ?
      </h1>

      <label>
        Cargo item:{' '}
        <select
          value={selectedCargo}
          onChange={(e) => {
            setSelectedCargo(e.target.value);
          }}
        >
          {cargoItems.map((item) => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
      </label>

      <p>
        You can hold <strong>{calcedTotalItems}</strong> {selectedCargo} in your{' '}
        {selectedStorage}
      </p>

      <hr />
      <label>
        Slots left: <input disabled value={calcedSlotsLeft} /> out of{' '}
        {selectedStorageInfo.slots}
      </label>
      <br />
      {selectedStorageInfo.vehicle && (
        <label>
          Weight capacity left:{' '}
          <input disabled value={calcedWeightCapacityLeft} /> out of{' '}
          {selectedStorageInfo.vehicle.weightCapacity}
        </label>
      )}
    </>
  );
};
