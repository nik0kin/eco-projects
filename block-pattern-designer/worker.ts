import { DesignerGrid } from './lib/grid-types';
import { compressGridData } from './lib/grid-url-store';

addEventListener(
  'message',
  (event: MessageEvent<{ type: 'save'; payload: [DesignerGrid, [number, number]] }>) => {
    if (event.data.type === 'save') {
      const dataStr = compressGridData(event.data.payload[0], event.data.payload[1]);
      postMessage({ type: 'save', result: 'success', payload: dataStr });
    }
  },
);
