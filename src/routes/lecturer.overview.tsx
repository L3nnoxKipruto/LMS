import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import logoUrl from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { lecturerService, appShellService, authService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { SearchBar } from '../components/ui/SearchBar';
import { Table } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Toast } from '../components/ui/Toast';
import { 
  LayoutDashboard, BookOpen, Users, CheckSquare, RefreshCw, MessageSquare, 
  Settings, LogOut, ShieldCheck, ArrowRight, PlusCircle, Trash2, Edit3, 
  Database, LineChart, WifiOff, FileText, AlertCircle
} from 'lucide-react';

export const Route = {
  options: {
    component: LecturerDashboard,
  },
};

type TabType = 'overview' | 'courses' | 'builder' | 'learners' | 'assessments' | 'sync' | 'messages' | 'settings';

function LecturerDashboard() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stateful variables for local adjustments
  const { data: courses = [], refetch: refetchCourses } = useQuery({
    queryKey: ['lecturer-courses', user?.id],
    queryFn: () => lecturerService.getPublishedCourses(),
    enabled: !!user?.id
  });
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [builderModules, setBuilderModules] = useState<any[]>([
    { id: 'bm1', title: 'Module 1: Introduction to Solar PV', lessons: ['Intro Video', 'Kenyan Grid Standards PDF'] },
    { id: 'bm2', title: 'Module 2: PV Array Sizing Guidelines', lessons: ['PV Science Video', 'Sizing Workbook Excel'] }
  ]);
  const [newModuleName, setNewModuleName] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [learners, setLearners] = useState([
    { id: 's1', name: 'Dennis Kiprop', course: 'Solar PV Systems', progress: '75%', grade: 'A', status: 'Healthy' },
    { id: 's2', name: 'Naserian Wanjiku', course: 'Automotive Overhaul', progress: '40%', grade: 'B+', status: 'Healthy' },
    { id: 's3', name: 'Albert Mutua', course: 'Solar PV Systems', progress: '10%', grade: 'C', status: 'Sync Pending' }
  ]);
  const [quizzes, setQuizzes] = useState([
    { id: 'q1', title: 'Renewable Resources & Solar Insolation', questions: 15, passing: '70%', status: 'Published' },
    { id: 'q2', title: 'Battery Sizing & Inverter Calculations', questions: 10, passing: '75%', status: 'Published' }
  ]);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '' });

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (!selectedCourseId) return;
    lecturerService.getCourseModules(selectedCourseId).then(setBuilderModules as any);
  }, [selectedCourseId, courses.length]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Unauthorized</h1>
        <p className="text-sm text-zinc-500 mt-1 mb-6">You must be logged in to view the Instructor Portal.</p>
        <Link to="/login"><Button>Portal Login</Button></Link>
      </div>
    );
  }

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim() || !selectedCourseId) return;
    await lecturerService.addModule(selectedCourseId, newModuleName);
    const modules = await lecturerService.getCourseModules(selectedCourseId);
    setBuilderModules(modules as any);
    setNewModuleName('');
    showToast('Module created and attached to the selected course.');
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim() || builderModules.length === 0) return;
    const firstLesson = builderModules[0]?.lessons?.[0];
    if (!firstLesson?.id) {
      showToast('Add a lesson before publishing a quiz.', 'warning');
      return;
    }
    await lecturerService.publishQuiz(firstLesson.id, newQuizTitle);
    setQuizzes([...quizzes, { id: 'q' + (quizzes.length + 1), title: newQuizTitle, questions: 5, passing: '80%', status: 'Published' }]);
    setNewQuizTitle('');
    showToast('Quiz published to the active course.');
  };

  const handleCreateCourseDraft = async () => {
    if (!draftTitle.trim()) {
      showToast('Enter a course title first.', 'warning');
      return;
    }
    await lecturerService.createCourse({
      title: draftTitle,
      category: draftCategory || 'Custom Curriculum',
      description: draftDescription || 'Lecturer-authored draft course.'
    });
    await refetchCourses();
    setDraftTitle('');
    setDraftCategory('');
    setDraftDescription('');
    showToast('Course draft created successfully.');
  };

  const handleDeleteCourse = async (courseId: string) => {
    await lecturerService.deleteCourse(courseId);
    await refetchCourses();
    showToast('Course removed from the lecturer workspace.');
  };

  const handleRenameCourse = async (courseId: string, currentTitle: string) => {
    const nextTitle = window.prompt('Rename course', currentTitle);
    if (!nextTitle?.trim()) return;
    await lecturerService.updateCourse(courseId, { title: nextTitle.trim() });
    await refetchCourses();
    showToast('Course title updated.');
  };

  const handleAddLessonToModule = async (moduleId: string) => {
    if (!selectedCourseId || !newLessonTitle.trim()) {
      showToast('Enter a lesson title before adding.', 'warning');
      return;
    }
    await lecturerService.addLesson(selectedCourseId, moduleId, {
      title: newLessonTitle,
      duration: '15 mins',
      type: 'video',
      videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8'
    });
    const modules = await lecturerService.getCourseModules(selectedCourseId);
    setBuilderModules(modules as any);
    setNewLessonTitle('');
    showToast('Lesson added to the selected module.');
  };

  const handleBroadcastMessage = async () => {
    if (!broadcastMessage.trim()) return;
    const updatedMessages = [
      { id: `msg_${Date.now()}`, sender: user.name, text: broadcastMessage, time: 'Just now', unread: false }
    ];
    await appShellService.saveMessages(updatedMessages);
    setBroadcastMessage('');
    showToast('Broadcast advisory saved for learner inboxes.');
  };

  const handleSaveLecturerSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await authService.updateProfile({ name: user.name });
    showToast('Lecturer settings refreshed.');
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'builder', label: 'Course Builder', icon: PlusCircle },
    { id: 'learners', label: 'Learners', icon: Users },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'sync', label: 'Sync Reports', icon: RefreshCw },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row transition-colors">
      
      {/* Sidebar Nav */}
      <aside className={`w-full md:w-64 bg-white border-r border-zinc-200 flex flex-col justify-between p-4 shrink-0 transition-colors ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600">
              <img src={logoUrl} className="h-8 w-auto" alt="JifunzeHub Logo" />
            </Link>
            <button className="md:hidden text-zinc-500" onClick={() => setMobileMenuOpen(false)}>×</button>
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl flex items-center gap-2 border border-zinc-100">
            <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full bg-white" />
            <div className="truncate">
              <p className="text-xs font-bold text-zinc-900 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-500">Instructor Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-zinc-100">
          <div className="flex flex-col gap-1 text-[10px] font-bold text-zinc-400">
            <span>ROLE CONTROLS</span>
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <button onClick={() => switchRole('student')} className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded hover:bg-zinc-200 cursor-pointer">Student</button>
              <button onClick={() => switchRole('admin')} className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded hover:bg-zinc-200 cursor-pointer">Admin</button>
            </div>
          </div>

          <ThemeToggle variant="full" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logout();
              navigate({ to: '/' });
            }}
            className="w-full justify-start text-red-600 hover:bg-red-50 font-bold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Navbar */}
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between transition-colors shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-lg border text-zinc-500 cursor-pointer" onClick={() => setMobileMenuOpen(true)}>☰</button>
            <div>
              <h2 className="font-extrabold text-zinc-900 capitalize">{activeTab.replace('-', ' ')}</h2>
              <span className="text-[10px] font-semibold text-zinc-400">Lecturer Dashboard › {user.institution}</span>
            </div>
          </div>
          <Badge variant="info" className="text-[10px] flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> NITA Accredited Faculty
          </Badge>
        </header>

        {/* Tab view containers */}
        <div className="flex-grow p-6 overflow-y-auto">

          {/* OVERVIEW VIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="My Courses"
                  value="3 Active"
                  icon={<BookOpen className="h-5 w-5" />}
                  description="Curriculum modules"
                />
                <StatCard
                  title="Total Enrolled"
                  value="443 Learners"
                  icon={<Users className="h-5 w-5" />}
                  description="Active school students"
                />
                <StatCard
                  title="Pending Grades"
                  value="12 Submissions"
                  icon={<CheckSquare className="h-5 w-5" />}
                  description="Awaiting feedback reviews"
                />
                <StatCard
                  title="Local Node Status"
                  value="Synchronized"
                  icon={<Database className="h-5 w-5" />}
                  description="Offline mesh server sync"
                />
              </div>

              {/* Class Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-zinc-900">Monthly Assessment Activity</h3>
                    <Badge variant="info">Mesh network active</Badge>
                  </div>
                  <div className="h-44 bg-zinc-50 rounded-xl flex items-end justify-between p-6 pt-10 text-xs">
                    {[
                      { month: 'Jan', val: '40%' },
                      { month: 'Feb', val: '65%' },
                      { month: 'Mar', val: '50%' },
                      { month: 'Apr', val: '85%' },
                      { month: 'May', val: '95%' }
                    ].map((stat, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
                        <div className="w-8 bg-blue-600 rounded-t-md transition-all duration-300" style={{ height: stat.val }} />
                        <span className="text-[10px] text-zinc-400 font-bold">{stat.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-zinc-900">Recent Lab Submissions</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Dennis Kiprop', task: 'Solar load sizing plan', status: 'Graded' },
                      { name: 'Albert Mutua', task: 'Voltage drop sheets', status: 'Awaiting Grading' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-zinc-50 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-zinc-850">{item.name}</p>
                          <p className="text-[9px] text-zinc-400">{item.task}</p>
                        </div>
                        <Badge variant={item.status === 'Graded' ? 'success' : 'warning'}>{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COURSES VIEW */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-zinc-900">Active Curriculum Directory</h3>
                <Button size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Course Draft</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:grid-cols-3">
                <Input placeholder="Course title" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} />
                <Input placeholder="Category" value={draftCategory} onChange={(e) => setDraftCategory(e.target.value)} />
                <Input placeholder="Short description" value={draftDescription} onChange={(e) => setDraftDescription(e.target.value)} />
                <div className="sm:col-span-3 flex justify-end">
                  <Button size="sm" onClick={handleCreateCourseDraft}>Create Draft</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="relative h-36 bg-zinc-800">
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                      <Badge variant="info" className="absolute top-3 left-3">{course.category}</Badge>
                    </div>
                    <div className="p-5 space-y-3">
                      <h4 className="font-bold text-sm text-zinc-950 line-clamp-1">{course.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{course.description}</p>
                      
                      <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs">
                        <span>{course.enrolledStudentsCount} Learners</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleRenameCourse(course.id, course.title)} className="p-1 rounded hover:bg-zinc-100 text-zinc-500 cursor-pointer"><Edit3 className="h-4 w-4" /></button>
                          <button onClick={() => handleDeleteCourse(course.id)} className="p-1 rounded hover:bg-red-50 text-red-500 cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COURSE BUILDER VIEW */}
          {activeTab === 'builder' && (
            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-zinc-900">Active Curriculum Module Map</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Drag lessons, upload technical drawings, or structure quiz sequences below.</p>
                </div>

                <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm">
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>

                <form onSubmit={handleAddModule} className="flex gap-2">
                  <Input
                    placeholder="Enter new module title (e.g. Module 3: Sizing Inverters)"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                  />
                  <Button type="submit">Create Module</Button>
                </form>

                <div className="flex gap-2">
                  <Input
                    placeholder="Enter new lesson title"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  {builderModules.map((mod) => (
                    <div key={mod.id} className="border border-zinc-200 p-4 rounded-xl space-y-3 bg-zinc-50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs sm:text-sm text-zinc-850">{mod.title}</h4>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleAddLessonToModule(mod.id)} className="text-[10px]">Add Lesson</Button>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-zinc-200">
                        {mod.lessons.length === 0 ? (
                          <p className="text-xs text-zinc-400 italic py-2">No lessons configured. Add a video or PDF resource file.</p>
                        ) : (
                          mod.lessons.map((les: any, idx: number) => (
                            <div key={idx} className="py-2.5 text-xs text-zinc-500 flex justify-between items-center">
                              <span>{les}</span>
                              <Badge variant="info">Lesson</Badge>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEARNERS VIEW */}
          {activeTab === 'learners' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900">Active Class Roster</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-400 uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-3 px-2">Student Name</th>
                      <th className="py-3 px-2">Curriculum Track</th>
                      <th className="py-3 px-2">Progress</th>
                      <th className="py-3 px-2">Grade</th>
                      <th className="py-3 px-2 text-right">Node Sync Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150">
                    {learners.map((st) => (
                      <tr key={st.id} className="hover:bg-zinc-50">
                        <td className="py-3 px-2 font-bold text-zinc-900">{st.name}</td>
                        <td className="py-3 px-2 text-zinc-500">{st.course}</td>
                        <td className="py-3 px-2 text-zinc-700 font-semibold">{st.progress}</td>
                        <td className="py-3 px-2"><Badge variant="info">{st.grade}</Badge></td>
                        <td className="py-3 px-2 text-right">
                          <Badge variant={st.status === 'Healthy' ? 'success' : 'warning'}>{st.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ASSESSMENTS VIEW */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-zinc-900">Accredited Quiz Builder</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Setup timers, configure passing ratios, and publish quizzes directly to classroom terminals.</p>
                </div>

                <form onSubmit={handleCreateQuiz} className="flex gap-2">
                  <Input
                    placeholder="Enter Quiz Title (e.g. Chapter 3: AC/DC Transformers)"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                  />
                  <Button type="submit">Publish Quiz</Button>
                </form>

                <div className="space-y-4">
                  {quizzes.map((q) => (
                    <div key={q.id} className="p-4 border border-zinc-200 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-zinc-850">{q.title}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{q.questions} Questions | Passing Score: {q.passing}</p>
                      </div>
                      <Badge variant="success">{q.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SYNC REPORTS VIEW */}
          {activeTab === 'sync' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-zinc-900">Lecturer Sync Analytics</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Monitor client device updates, assignment sync queues, and node health.</p>
              </div>

              <div className="p-4 bg-zinc-50 border rounded-xl flex gap-3 items-center text-xs text-zinc-500">
                <WifiOff className="h-5 w-5 text-blue-500 shrink-0" />
                <span>Classroom server paired. 3 pending student uploads queued inside the campus node router.</span>
              </div>

              <div className="divide-y divide-zinc-150">
                {[
                  { device: 'Dennis Tablet B1', status: 'Synced', time: '10 mins ago', desc: 'Solar Sizing assignment uploaded successfully (12 MB)' },
                  { device: 'Wanjiku Laptop', status: 'Sync Pending', time: '1 hour ago', desc: 'Progress registry (2 lessons complete) awaiting classroom connection' }
                ].map((log, idx) => (
                  <div key={idx} className="py-4 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <p className="font-bold text-zinc-900">{log.device}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{log.desc}</p>
                      <span className="text-[10px] text-zinc-400 font-bold block mt-1">{log.time}</span>
                    </div>
                    <Badge variant={log.status === 'Synced' ? 'success' : 'warning'}>{log.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES VIEW */}
          {activeTab === 'messages' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900">Instructor Chat Feed</h3>
              <p className="text-xs text-zinc-500">Send advisories or broadcast notes locally to your classes.</p>

              <div className="space-y-3 rounded-xl border border-dashed p-6">
                <Input placeholder="Broadcast advisory to student inboxes" value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} />
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleBroadcastMessage}>Send Broadcast</Button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveLecturerSettings} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-zinc-900">Instructor Settings</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Adjust campus department assignments and alert priorities.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <Input label="Lecturer Name" value={user.name} disabled />
                <Input label="Department Designation" value="Electrical & Solar Systems" disabled />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Settings</Button>
              </div>
            </form>
          )}

        </div>
      </main>
      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ open: false, message: '' })} />
    </div>
  );
}
