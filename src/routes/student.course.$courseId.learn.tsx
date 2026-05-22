import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import { useCourse, useCourseModules } from '../hooks/useCourses';
import { lessonService, progressService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '@mui/material';
import { 
  ArrowLeft, WifiOff, CheckCircle2, ChevronRight, ChevronLeft, 
  BookOpen, ListCollapse, MessageCircle, FileText, ClipboardList, Play, Download
} from 'lucide-react';

export const Route = {
  options: {
    component: CoursePlayerPage,
  },
  useParams: () => {
    // Expected path is /student/course/:courseId/learn
    const parts = window.location.pathname.split('/');
    const idx = parts.indexOf('course');
    const courseId = idx !== -1 && parts[idx + 1] ? parts[idx + 1] : '1';
    return { courseId };
  }
};

type ContentTabType = 'notes' | 'resources' | 'discussions';

function CoursePlayerPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const [activeContentTab, setActiveContentTab] = useState<ContentTabType>('resources');
  
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: modules = [], isLoading: modulesLoading } = useCourseModules(courseId);

  // Lessons flattening to calculate active indices
  const allLessons = modules.flatMap(mod => mod.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [watchProgress, setWatchProgress] = useState<Record<string, number>>({});
  const [autoplay, setAutoplay] = useState(false);

  // Sync initial completed status from backend payload and set first lesson active
  useEffect(() => {
    if (allLessons.length > 0 && !activeLessonId) {
      setActiveLessonId(allLessons[0].id);
      
      const completed = allLessons.filter(l => l.isCompleted).map(l => l.id);
      setCompletedLessonIds(completed);
    }
  }, [allLessons, activeLessonId]);

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);

  const getYoutubeId = (url?: string) => {
    if (!url) return '';
    if (url.length === 11) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const youtubeId = getYoutubeId(activeLesson?.videoUrl);

  useEffect(() => {
    if (!activeLesson?.id) return;

    lessonService.getLessonNotes(activeLesson.id).then((saved) => {
      setSavedNotes(saved ? [saved] : []);
    });

    lessonService.getWatchProgress(activeLesson.id).then((savedProgress) => {
      setWatchProgress((current) => ({ ...current, [activeLesson.id]: savedProgress }));
    });
  }, [activeLesson?.id]);

  useEffect(() => {
    if (!activeLesson?.id || activeLesson.type !== 'video') return;

    const timer = window.setInterval(() => {
      setWatchProgress((current) => {
        const nextValue = Math.min(100, (current[activeLesson.id] || 0) + 5);
        progressService.setLessonWatchProgress(activeLesson.id, nextValue);
        if (nextValue >= 95 && !completedLessonIds.includes(activeLesson.id)) {
          handleToggleCompletion(activeLesson.id, true);
        }
        return { ...current, [activeLesson.id]: nextValue };
      });
    }, 8000);

    return () => window.clearInterval(timer);
  }, [activeLesson?.id, activeLesson?.type, completedLessonIds]);

  const handleNextLesson = () => {
    if (activeLessonIndex < allLessons.length - 1) {
      setAutoplay(true);
      setActiveLessonId(allLessons[activeLessonIndex + 1].id);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setAutoplay(false);
      setActiveLessonId(allLessons[activeLessonIndex - 1].id);
    }
  };

  const handleToggleCompletion = async (lessonId: string, forceComplete?: boolean) => {
    const shouldComplete = typeof forceComplete === 'boolean' ? forceComplete : !completedLessonIds.includes(lessonId);
    // Optimistic offline update
    setCompletedLessonIds(prev => 
      shouldComplete ? [...new Set([...prev, lessonId])] : prev.filter(id => id !== lessonId)
    );

    try {
      await progressService.completeLesson(lessonId, shouldComplete ? (watchProgress[lessonId] || 100) : 0);
    } catch (err) {
      console.warn('Lesson completion saved to offline queue', err);
    }
  }

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !activeLesson?.id) return;
    await lessonService.saveLessonNotes(activeLesson.id, notes);
    setSavedNotes([notes]);
    setNotes('');
  };

  if (courseLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
         <CircularProgress size={44} className="text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Course Load Failed</h2>
        <Button onClick={() => navigate({ to: '/student/dashboard' })}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      
      {/* Header Player controls */}
      <header className="bg-white border-b border-zinc-200 px-4 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate({ to: '/student/dashboard' })}
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="truncate">
            <h3 className="font-extrabold text-xs sm:text-sm text-zinc-800 truncate">{course.title}</h3>
            <span className="text-[10px] text-zinc-400 font-medium">Instructor: {course.lecturerName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" className="text-[10px] bg-emerald-50 text-emerald-750 border border-emerald-100 flex items-center gap-1">
            <WifiOff className="h-3 w-3" /> Offline Playback OK
          </Badge>
          <div className="text-[11px] font-bold text-zinc-500">
            Progress: {completedLessonIds.length} / {allLessons.length} Completed
          </div>
        </div>
      </header>

      {/* Main player layout body */}
      <div className="flex-grow flex flex-col lg:flex-row min-h-0">
        
        {/* Left Side: Video & details tab panel */}
        <div className="flex-grow flex flex-col min-w-0 bg-white overflow-y-auto">
          {/* Custom high fidelity Video Area */}
          <div className="relative aspect-video w-full bg-zinc-950 border-b border-zinc-200 flex items-center justify-center overflow-hidden">
            {youtubeId ? (
              <iframe
                className="absolute inset-0 w-full h-full z-10"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&rel=0`}
                title={activeLesson?.title || 'Video Player'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <>
                <div className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-md" style={{ backgroundImage: `url(${course.thumbnailUrl})` }} />
                
                {/* Custom Video Control elements */}
                <div className="relative z-10 text-center space-y-4 max-w-md px-6">
                  <div className="h-16 w-16 bg-blue-600/90 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform mx-auto cursor-pointer">
                    <Play className="h-7 w-7 fill-white ml-1" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-base sm:text-lg text-white drop-shadow">{activeLesson?.title || 'Local Cache Asset'}</p>
                    <p className="text-xs text-zinc-300">Lesson Type: {(activeLesson?.type || 'video').toUpperCase()} | Format: Compressed 720p (Local Storage Cache)</p>
                  </div>
                </div>
              </>
            )}

            {/* Next/Prev Navigation inside player bottom */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between z-20">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handlePrevLesson}
                disabled={activeLessonIndex <= 0}
                className="bg-black/60 text-white hover:bg-black/80 border border-zinc-800"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span>Prev Lesson</span>
              </Button>

              <Button 
                variant="secondary"
                size="sm"
                onClick={handleNextLesson}
                disabled={activeLessonIndex === allLessons.length - 1}
                className="bg-black/60 text-white hover:bg-black/80 border border-zinc-800"
              >
                <span>Next Lesson</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Details & Interactive Tabs */}
          <div className="p-6 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-zinc-500">
                <span>Watch Progress</span>
                <span>{watchProgress[activeLesson?.id || ''] || 0}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${watchProgress[activeLesson?.id || ''] || 0}%` }} />
              </div>
            </div>

            <div className="flex gap-4 border-b border-zinc-200">
              {(['resources', 'notes', 'discussions'] as ContentTabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveContentTab(tab)}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeContentTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-zinc-400 hover:text-zinc-650'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            {activeContentTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-zinc-850">Accompanying Blueprints & PDFs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(activeLesson?.resources || course.resources || []).slice(0, 4).map((resource) => (
                    <div key={resource.title} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-semibold text-zinc-900">{resource.title}</p>
                          <p className="text-[10px] text-zinc-400">{resource.type.toUpperCase()} • Offline ready</p>
                        </div>
                      </div>
                      <a href={resource.url} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="ghost" className="p-2 text-zinc-500 hover:text-zinc-900">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeContentTab === 'notes' && (
              <div className="space-y-6">
                <form onSubmit={handleSaveNotes} className="space-y-3">
                  <h4 className="font-bold text-sm text-zinc-850">Take Study Notes</h4>
                  <textarea
                    placeholder="Jot down formulas or measurements from the video lesson..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[80px] p-3 rounded-lg border border-zinc-200 bg-zinc-50 text-xs focus:outline-none text-zinc-900 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm">Save Note</Button>
                  </div>
                </form>

                <div className="space-y-3">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Saved Study Notes</h5>
                  {(savedNotes.length > 0 ? savedNotes : [activeLesson?.notes || '']).filter(Boolean).map((note, idx) => (
                    <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs leading-relaxed text-zinc-700 animate-fade-in">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeContentTab === 'discussions' && (
              <div className="space-y-4 text-xs text-zinc-500">
                <h4 className="font-bold text-sm text-zinc-850">Student Discussion Board</h4>
                <p>Discuss topics locally with fellow learners on this classroom server node.</p>
                
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-zinc-850">Dennis Kiprop</span>
                    <span>3 hours ago</span>
                  </div>
                  <p className="text-zinc-650 leading-relaxed text-xs">"Does anybody know if we can utilize Lead Acid battery estimations for the Module 3 assignment, or is Lithium preferred?"</p>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Accordion Course Navigation */}
        <aside className="w-full lg:w-80 bg-zinc-50 border-l border-zinc-200 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-zinc-200 shrink-0 bg-white">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">Curriculum Syllabus</h4>
          </div>

          <div className="divide-y divide-zinc-200">
            {modules.map((mod) => (
              <div key={mod.id}>
                <div className="p-3 bg-zinc-100 font-bold text-xs text-zinc-750">
                  {mod.title}
                </div>
                <div className="divide-y divide-zinc-150">
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`w-full p-3 text-left text-xs transition-colors flex gap-2.5 items-start cursor-pointer hover:bg-zinc-100/65 ${
                        activeLessonId === lesson.id 
                          ? 'bg-blue-50 text-blue-600 font-semibold border-l-2 border-l-blue-600' 
                          : 'text-zinc-600'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={completedLessonIds.includes(lesson.id)}
                        onChange={() => handleToggleCompletion(lesson.id)}
                        className="mt-0.5 rounded accent-blue-600 cursor-pointer z-10"
                        onClick={(e) => e.stopPropagation()} // prevent double trigger
                      />
                      <div className="min-w-0 flex-grow">
                        <p className="truncate">{lesson.title}</p>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">{lesson.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
