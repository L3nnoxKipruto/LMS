import React, { useEffect, useState } from 'react';
import { ActivityFeedItem } from '../../types';
import { activityService } from '../../services/activityService';
import { liveSimulationService } from '../../services/liveSimulationService';
import { Award, BookOpen, GraduationCap, Code2, Heart, ShieldCheck, Zap } from 'lucide-react';

export const LiveActivityFeed: React.FC = () => {
  const [feed, setFeed] = useState<ActivityFeedItem[]>([]);

  useEffect(() => {
    // Initial load
    activityService.getGlobalFeed().then(setFeed);

    // Live subscription
    const unsubscribe = liveSimulationService.subscribe((type, item) => {
      if (type === 'feed_update') {
        setFeed(prev => [item, ...prev.slice(0, 19)]); // keep latest 20
      }
    });

    return () => unsubscribe();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'enrolled':
        return <BookOpen className="h-3.5 w-3.5 text-indigo-650" />;
      case 'completed_lesson':
        return <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500 stroke-none" />;
      case 'completed_course':
        return <GraduationCap className="h-3.5 w-3.5 text-emerald-500" />;
      case 'earned_achievement':
        return <Award className="h-3.5 w-3.5 text-purple-500" />;
      case 'earned_certificate':
        return <ShieldCheck className="h-3.5 w-3.5 text-emerald-650" />;
      case 'submitted_assignment':
        return <Code2 className="h-3.5 w-3.5 text-sky-500" />;
      default:
        return <Heart className="h-3.5 w-3.5 text-pink-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'enrolled': return 'bg-indigo-50 dark:bg-indigo-950/40';
      case 'completed_lesson': return 'bg-amber-50 dark:bg-amber-950/40';
      case 'completed_course': return 'bg-emerald-50 dark:bg-emerald-950/40';
      case 'earned_achievement': return 'bg-purple-50 dark:bg-purple-950/40';
      case 'earned_certificate': return 'bg-emerald-100/60 dark:bg-emerald-950/60';
      case 'submitted_assignment': return 'bg-sky-50 dark:bg-sky-950/40';
      default: return 'bg-zinc-50 dark:bg-zinc-900';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 max-h-[480px] overflow-y-auto">
      <div className="flex justify-between items-center border-b border-zinc-150/60 dark:border-zinc-850 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
            <span>Live Activity Feed</span>
          </h3>
          <p className="text-[10px] text-zinc-400 mt-0.5">Real-time status updates across JifunzeHub TVET labs.</p>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
        </span>
      </div>

      <div className="space-y-3.5">
        {feed.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-400">Listening for activity broadcasts...</div>
        ) : (
          feed.map((item) => (
            <div key={item.id} className="flex gap-3 items-start animate-fade-in">
              <img 
                src={item.userAvatar} 
                alt={item.userName} 
                className="h-8.5 w-8.5 rounded-full border border-zinc-200 dark:border-zinc-850 bg-zinc-50 shrink-0" 
              />
              <div className="flex-grow space-y-0.5 min-w-0">
                <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed">
                  <span className="font-extrabold text-zinc-950 dark:text-zinc-50">{item.userName}</span>{' '}
                  {item.message}
                </p>
                <div className="flex items-center gap-2 text-[9px] font-semibold text-zinc-400">
                  <div className={`p-1 rounded-md ${getBgColor(item.type)} shrink-0`}>
                    {getIcon(item.type)}
                  </div>
                  <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default LiveActivityFeed;
