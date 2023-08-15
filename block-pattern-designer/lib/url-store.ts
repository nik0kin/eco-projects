import LzString from 'lz-string';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

// based off https://stackoverflow.com/questions/68985511/how-do-we-get-window-location-hash-from-a-next-js-application
export const useUrlData = <T = unknown>(): [boolean, T | undefined] => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { asPath } = useRouter();

  // unnessary useMemo?
  const memoedData = useMemo(() => asPath.split('#')[1], [asPath]);

  useEffect(() => {
    setIsLoaded(true);
  }, [asPath]);

  return !memoedData
    ? [isLoaded, undefined]
    : [isLoaded, JSON.parse(LzString.decompressFromEncodedURIComponent(memoedData))];
};

export const updateUrlData = <T = unknown>(data: T) => {
  console.log('Saving', data);
  const stringifiedData = JSON.stringify(data);
  console.log('stringified=', stringifiedData.length);
  const compressedData = LzString.compressToEncodedURIComponent(stringifiedData);
  console.log('compressed=', compressedData.length);
  location.hash = '#' + compressedData;
};
