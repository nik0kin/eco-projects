import { useCallback, useEffect, useRef } from 'react';
import { DesignerGrid } from './grid-types';

// Based off https://github.com/vercel/next.js/tree/canary/examples/with-web-worker

export const useSaveGridViaWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL('../worker.ts', import.meta.url));
    workerRef.current.onmessage = (
      event: MessageEvent<{ type: 'save'; result: 'success'; payload: string }>,
    ) => {
      if (event.data.type === 'save' && event.data.result === 'success') {
        location.hash = '#' + event.data.payload;
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const saveGridViaWorker = useCallback((designerGrid: DesignerGrid, size: [number, number]) => {
    workerRef.current?.postMessage({ type: 'save', payload: [designerGrid, size] });
  }, []);

  return saveGridViaWorker;
};
