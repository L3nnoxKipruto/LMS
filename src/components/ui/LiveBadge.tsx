import React, { useEffect, useState } from 'react';
import { liveSimulationService } from '../../services/liveSimulationService';

export const LiveBadge: React.FC = () => {
  const [count, setCount] = useState(482);

  useEffect(() => {
    // Initial fetch
    setCount(liveSimulationService.getActiveOnlineCount());

    const timer = setInterval(() => {
      setCount(liveSimulationService.getActiveOnlineCount());
    }, 6000); // update every 6 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-250/30 rounded-full shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
        {count.toLocaleString()} Students Active Now
      </span>
    </div>
  );
};
export default LiveBadge;
