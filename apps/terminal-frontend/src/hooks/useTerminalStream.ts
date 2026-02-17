import { useEffect, useState } from 'react';
import type { DashboardSnapshot } from '../types/models';

export const useTerminalStream = () => {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [streamStatus, setStreamStatus] = useState('connecting');

  useEffect(() => {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${location.hostname}:4000`);

    ws.onopen = () => setStreamStatus('live');
    ws.onclose = () => setStreamStatus('degraded');
    ws.onerror = () => setStreamStatus('degraded');
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data) as DashboardSnapshot;
      setSnapshot(payload);
    };

    return () => ws.close();
  }, []);

  return { snapshot, streamStatus };
};
