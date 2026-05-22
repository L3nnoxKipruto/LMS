import React, { useState } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useCourse, useCourseModules } from '../hooks/useCourses';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/api';
import { WifiOff, Star, BookOpen, Clock, Download, Play, CheckCircle, ChevronDown, ChevronUp, AlertCircle, Award } from 'lucide-react';
import { CircularProgress } from '@mui/material';

// Import Custom Enterprise UI Components
import InstructorCard from '../components/ui/InstructorCard';
import CourseReviewCard from '../components/ui/CourseReviewCard';

export const Route = {
  options: {
    component: CoursePreviewPage,
  },
  useParams: () => {
    const parts = window.location.pathname.split('/');
    const idx = parts.indexOf('course');
    const courseId = idx !== -1 && parts[idx + 1] ? parts[idx + 1] : '1';
    return { courseId };
  }
};

function CoursePreviewPage() {
  const { courseId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const { data: course, isLoading: courseLoading, error: courseError } = useCourse(courseId);
  const { data: modules = [], isLoading: modulesLoading } = useCourseModules(courseId);

  // Fetch real reviews from DB
  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['course-reviews', courseId],
    queryFn: () => courseService.getCourseReviews(courseId),
  });

  const handleEnroll = async () => {
    if (!user) {
      navigate({ to: '/login' });
      return;
    }
    setEnrolling(true);
    try {
      if (course) {
        await courseService.enrollInCourse(course.id);
      }
      navigate({ to: '/student/dashboard' });
    } catch (err) {
      console.error('Enrollment failed:', err);
      navigate({ to: '/student/dashboard' });
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    try {
      await courseService.addCourseReview(courseId, {
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      refetchReviews();
      queryClient.invalidateQueries({ queryKey: ['course-reviews', courseId] });
      alert('Review posted successfully!');
    } catch (err) {
      console.error('Failed to post review', err);
    }
  };

  if (courseLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <CircularProgress size={44} thickness={4} className="text-indigo-650" />
          <span className="text-sm font-bold text-zinc-550">Loading course prospectus...</span>
        </div>
      </PublicLayout>
    );
  }

  if (courseError || !course) {
    return (
      <PublicLayout>
        <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-zinc-405 mx-auto" />
          <h2 className="text-xl font-bold text-zinc-900">Prospectus Unavailable</h2>
          <p className="text-sm text-zinc-500">
            This syllabus course cannot be retrieved from the server at this time. Please check your offline status.
          </p>
          <Link to="/"><Button>Browse Course Catalog</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  // Construct Instructor profile for InstructorCard widget
  const instructor = {
    id: 'inst-1',
    name: course.lecturerName || 'Eng. Kennedy Omondi',
    email: 'lecturer@jifunzehub.org',
    role: 'lecturer' as const,
    avatarUrl: course.lecturerAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${course.lecturerName || 'Omondi'}`,
    department: course.category,
    bio: 'Professional TVET curriculum specialist and industry field engineer. Focused on deploying renewable energy configurations and local mesh nodes.',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    }
  };

  return (
    <PublicLayout>
      {/* Course Banner */}
      <section className="bg-slate-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 py-12 md:py-16 border-b border-zinc-150 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge variant="info" className="px-3 py-0.5 text-[9px] font-black uppercase tracking-wider">{course.category}</Badge>
              {course.isOfflineAvailable && (
                <Badge variant="success" className="flex items-center gap-1 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider">
                  <WifiOff className="h-3 w-3" /> Offline Enabled
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight">{course.title}</h1>
            <p className="text-zinc-550 dark:text-zinc-400 text-sm sm:text-base max-w-3xl leading-relaxed font-semibold">{course.subtitle || course.description}</p>
            
            <div className="flex flex-wrap gap-6 items-center text-xs font-semibold pt-2">
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold">
                <Star className="h-4 w-4 fill-amber-500 stroke-none" />
                <span>{course.rating || '4.8'}</span>
                <span className="text-zinc-400 font-bold">({reviews.length} learner reviews)</span>
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">Lecturer: <span className="text-zinc-900 dark:text-zinc-50 font-bold">{course.lecturerName}</span></div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5 shrink-0">
            <div className="relative h-44 rounded-2xl overflow-hidden bg-zinc-800">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white/90 text-indigo-650 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                  <Play className="h-5 w-5 fill-indigo-600 pl-0.5" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400">
                <span>Offline Storage Size</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-black">{course.downloadSize || '180 MB'}</span>
              </div>

              <Button onClick={handleEnroll} size="lg" isLoading={enrolling} className="w-full justify-center text-xs py-2.5 font-bold rounded-xl shadow-md">
                {user ? 'Go to Student Dashboard' : 'Enroll in Curriculum Track'}
              </Button>

              <div className="text-center">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                  TVETA syllabus accredited course
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Syllabus Info & Sidebars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column (8 cols): Syllabus outline & Reviews */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-650" />
                <span>Learning Objectives</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-semibold">
                <div className="flex gap-2 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Comprehensive safety standards and setup protocols.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Accurate measurement and sizing calculations.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Real practical workshops and design projects.</span>
                </div>
                <div className="flex gap-2 items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Standard certification guidelines for Kenyan trade codes.</span>
                </div>
              </div>
            </div>

            {/* Modules Accordion */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">Syllabus Outline</h2>
              
              {modulesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <CircularProgress size={24} className="text-zinc-400" />
                </div>
              ) : modules.length === 0 ? (
                <div className="text-zinc-500 text-sm border border-zinc-200 p-6 rounded-xl text-center">
                  Curriculum preview files are currently being finalized on the campus server. Check back shortly!
                </div>
              ) : (
                <div className="space-y-3">
                  {modules.map((mod) => (
                    <div key={mod.id} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
                      <button
                        onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                        className="w-full p-4 flex justify-between items-center font-bold text-left text-zinc-850 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer animate-fade-in"
                      >
                        <span className="text-xs sm:text-sm">{mod.title}</span>
                        {expandedModule === mod.id ? <ChevronUp className="h-4.5 w-4.5" /> : <ChevronDown className="h-4.5 w-4.5" />}
                      </button>

                      {expandedModule === mod.id && (
                        <div className="p-4 pt-0 border-t border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                          {mod.lessons.map((lesson) => (
                            <div key={lesson.id} className="py-3 flex justify-between items-center text-xs text-zinc-650 dark:text-zinc-405 hover:bg-zinc-50/20 px-2 rounded-lg transition-colors">
                              <div className="flex items-center gap-2">
                                <Play className="h-3.5 w-3.5 text-indigo-650 fill-indigo-650/10 shrink-0" />
                                <span className="font-semibold">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 text-[10px] font-bold text-zinc-400">
                                <span>{lesson.duration}</span>
                                {lesson.isDownloaded && (
                                  <Badge variant="success" className="text-[9px] py-0">Offline Cache OK</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learner Reviews section */}
            <div className="space-y-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">Student Reviews ({reviews.length})</h3>
              
              {user && (
                <form onSubmit={handleAddReview} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl space-y-4">
                  <h4 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-50">Write a Review</h4>
                  <div className="flex gap-4 items-center text-xs">
                    <span className="font-bold text-zinc-400">Rating:</span>
                    <select 
                      value={newRating} 
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="px-2 py-1 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-850 rounded-lg focus:outline-none"
                    >
                      <option value={5}>5 Stars (Excellent)</option>
                      <option value={4}>4 Stars (Very Good)</option>
                      <option value={3}>3 Stars (Average)</option>
                      <option value={2}>2 Stars (Poor)</option>
                      <option value={1}>1 Star (Unsatisfactory)</option>
                    </select>
                  </div>
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Provide your feedback on the curriculum contents, slides, and quizzes..." 
                    rows={3}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-205 dark:border-zinc-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" type="submit">Submit Review</Button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-400">No student feedback recorded yet. Be the first!</div>
                ) : (
                  reviews.map((rev) => (
                    <CourseReviewCard key={rev.id} review={rev} />
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Specifications & Instructor */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Instructor Card Widget */}
            <InstructorCard instructor={instructor} />

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 space-y-4">
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55">Specifications</h4>
              
              <div className="space-y-3 text-xs sm:text-sm font-semibold text-zinc-650 dark:text-zinc-405">
                <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Modules</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-50">{course.modulesCount || modules.length || '3'} chapters</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Total Lessons</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-50">{course.lessonsCount || '15'} units</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-500">Accreditation</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-50">TVET Trade Test I & II</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-500">Network Resiliency</span>
                  <span className="font-extrabold text-emerald-650 flex items-center gap-1">
                    <WifiOff className="h-3.5 w-3.5" /> Offline Sandbox Active
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </PublicLayout>
  );
}
