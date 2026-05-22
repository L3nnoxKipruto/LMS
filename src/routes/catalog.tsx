import React, { useState } from 'react';
import { Link as RouterLink } from '@tanstack/react-router';
const Link = RouterLink as any;
import { PublicLayout } from '../components/layout/PublicLayout';
import { useCourses } from '../hooks/useCourses';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Star, WifiOff, Search, Sparkles, BookOpen } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { COURSE_DEPARTMENTS } from '../mock-db/courses';

export const Route = {
  options: {
    component: CourseCatalogPage,
  },
};

function CourseCatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const { data: courses = [], isLoading } = useCourses();

  const categories = ['All', ...COURSE_DEPARTMENTS];

  const getDepartmentCourses = (dept: string, list: any[]) => {
    if (dept === 'All') return list;
    return list.filter(course => course.department === dept);
  };

  const getCategoryCount = (cat: string) => {
    return getDepartmentCourses(cat, courses).length;
  };

  const departmentFiltered = getDepartmentCourses(selectedCategory, courses);

  const filteredCourses = departmentFiltered.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase()) ||
                          course.category.toLowerCase().includes(search.toLowerCase()) ||
                          course.department?.toLowerCase().includes(search.toLowerCase()) ||
                          course.tags?.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            <span>Official TVET Course Catalog</span>
          </h1>
          <p className="text-sm font-semibold text-zinc-400">
            Search all 50 live TVET and professional courses by department, specialization, or skill tags.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-2xl">
          <div className="w-full md:w-1/3 relative">
            <Input
              placeholder="Search courses or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-400" />
          </div>

          <div className="w-full md:w-2/3 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    isActive
                      ? 'bg-indigo-650 text-white shadow-sm'
                      : 'bg-white dark:bg-zinc-850 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <CircularProgress size={36} className="text-indigo-650" />
            <span className="text-sm font-semibold text-zinc-400">Syncing latest syllabus nodes...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Sparkles className="h-10 w-10 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">No courses match your criteria</h3>
            <p className="text-zinc-500 text-sm mt-1">Try resetting your search query or choosing another department category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow animate-fade-in group">
                <div>
                  <div className="relative h-48 bg-zinc-800 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge variant="success" className="absolute top-3 right-3 flex items-center gap-1">
                      <WifiOff className="h-3 w-3" /> Offline Enabled
                    </Badge>
                    <Badge variant="info" className="absolute top-3 left-3">{course.department}</Badge>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block">{course.category}</span>
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 line-clamp-1 hover:text-indigo-650 transition-colors">
                      <Link to={`/course/${course.id}`}>{course.title}</Link>
                    </h3>
                    <p className="text-xs text-zinc-550 dark:text-zinc-450 line-clamp-3 leading-relaxed font-semibold">{course.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(course.tags || []).slice(0, 3).map((tag: string) => (
                        <span key={tag} className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-[9px] font-bold text-zinc-500 dark:text-zinc-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  <div className="border-t border-zinc-150 dark:border-zinc-850 pt-4 flex justify-between items-center text-[10px] font-bold text-zinc-450">
                    <span>Instructor: {course.lecturerName.split(' ').pop()}</span>
                    <span>{course.duration}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold">
                      <Star className="h-3.5 w-3.5 fill-amber-500 stroke-none" />
                      <span>{course.rating || '4.8'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{course.enrollmentCount || course.enrolledStudentsCount} enrolled</span>
                    </div>
                    <Link to={`/course/${course.id}`}>
                      <Button size="sm" className="font-bold text-xs py-1.5 px-4 rounded-xl">View Syllabus</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
