import React, { useState } from 'react';
import { CourseReview } from '../../types';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from './Button';

interface CourseReviewCardProps {
  review: CourseReview;
  onHelpfulClick?: (reviewId: string) => void;
}

export const CourseReviewCard: React.FC<CourseReviewCardProps> = ({ review, onHelpfulClick }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (hasVoted) return;
    setHelpfulCount(prev => prev + 1);
    setHasVoted(true);
    if (onHelpfulClick) {
      onHelpfulClick(review.id);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2.5 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img 
            src={review.studentAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${review.studentName}`} 
            alt={review.studentName} 
            className="h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50"
          />
          <div>
            <h5 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-50">{review.studentName}</h5>
            <p className="text-[9px] text-zinc-400">{new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${
                i < review.rating 
                  ? 'text-amber-500 fill-amber-500' 
                  : 'text-zinc-200 dark:text-zinc-800 fill-zinc-250 dark:fill-zinc-800'
              }`} 
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed pl-12">
        {review.comment}
      </p>

      <div className="pl-12 flex justify-between items-center text-[10px] text-zinc-400">
        <span className="font-semibold">{helpfulCount} people found this helpful</span>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleHelpful}
          disabled={hasVoted}
          className={`flex items-center gap-1 py-1 px-2 text-[9px] rounded-lg ${
            hasVoted 
              ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' 
              : 'text-zinc-400 hover:text-indigo-650 dark:hover:text-indigo-400'
          }`}
        >
          <ThumbsUp className={`h-3 w-3 ${hasVoted ? 'fill-indigo-600 dark:fill-indigo-400 stroke-none' : ''}`} />
          <span>{hasVoted ? 'Helpful!' : 'Helpful'}</span>
        </Button>
      </div>
    </div>
  );
};
export default CourseReviewCard;
