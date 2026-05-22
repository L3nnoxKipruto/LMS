import React from 'react';
import { User } from '../../types';
import { BookOpen, Globe } from 'lucide-react';
import { Button } from './Button';
import { Link as RouterLink } from '@tanstack/react-router';
const Link = RouterLink as any;

interface InstructorCardProps {
  instructor: User;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4 items-start">
        <img 
          src={instructor.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${instructor.name}`} 
          alt={instructor.name} 
          className="h-14 w-14 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 shrink-0 object-cover"
        />
        <div className="space-y-1 min-w-0">
          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 truncate">{instructor.name}</h4>
          <p className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase tracking-wider">{instructor.department || 'Technical Faculty'}</p>
          <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>TVET Certified</span>
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed min-h-[48px]">
        {instructor.bio || 'Professional TVET lecturer and technical curriculum specialist with extensive industry field engineering experience.'}
      </p>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex gap-2">
          {instructor.socialLinks?.linkedin && (
            <a href={instructor.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span className="text-[10px] font-black">in</span>
            </a>
          )}
          {instructor.socialLinks?.github && (
            <a href={instructor.socialLinks.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              <span className="text-[10px] font-black">gh</span>
            </a>
          )}
          <Link to="/contact" className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Globe className="h-3.5 w-3.5" />
          </Link>
        </div>
        <Link to="/contact">
          <Button size="sm" variant="outline" className="text-[10px] font-bold py-1 px-3">
            Contact
          </Button>
        </Link>
      </div>

    </div>
  );
};
export default InstructorCard;
