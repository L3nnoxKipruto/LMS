import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import logoUrl from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useCourses, useMyCourses } from '../hooks/useCourses';
import { useQuery } from '@tanstack/react-query';
import { 
  syncService, assignmentService, analyticsService, notificationService, courseService,
  bookmarkService, achievementService, leaderboardService, streakService, activityService,
  liveSimulationService, certificateService, appShellService, authService
} from '../services/api';
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

// Custom Enterprise UI Components
import AnimatedCounter from '../components/ui/AnimatedCounter';
import ProgressRing from '../components/ui/ProgressRing';
import LiveBadge from '../components/ui/LiveBadge';
import AchievementCard from '../components/ui/AchievementCard';
import CertificateCard from '../components/ui/CertificateCard';
import LeaderboardTable from '../components/ui/LeaderboardTable';
import LiveActivityFeed from '../components/ui/LiveActivityFeed';
import StudyStreakCalendar from '../components/ui/StudyStreakCalendar';
import InstructorCard from '../components/ui/InstructorCard';
import CourseReviewCard from '../components/ui/CourseReviewCard';
import { COURSE_DEPARTMENTS } from '../mock-db/courses';

import { 
  LayoutDashboard, BookOpen, WifiOff, FileText, CheckSquare, Award, 
  Download, MessageSquare, Bell, RefreshCw, Settings, LogOut, 
  Search, Play, AlertCircle, CheckCircle, Trash2, Send, Clock, User,
  Bookmark, LineChart, Compass, Tag, Star, Calendar, Flame, ShieldAlert
} from 'lucide-react';

export const Route = {
  options: {
    component: StudentDashboard,
  },
};

type TabType = 'dashboard' | 'courses' | 'explore' | 'categories' | 'bookmarks' | 'progress' | 'certificates' | 'achievements' | 'leaderboard' | 'discussions' | 'notifications' | 'messages' | 'downloads' | 'notes' | 'settings' | 'support' | 'offline' | 'assignments' | 'assessments' | 'sync';

function StudentDashboard() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useRouterNavigate() as any;
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [toastText, setToastText] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [supportTitle, setSupportTitle] = useState('');
  const [supportPriority, setSupportPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [supportDescription, setSupportDescription] = useState('');

  // Start live simulations
  useEffect(() => {
    liveSimulationService.startSimulation();
    return () => {
      liveSimulationService.stopSimulation();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    appShellService.getUserNotes().then(setNotesDraft);
    appShellService.getMessages().then((storedMessages) => {
      if (storedMessages.length > 0) setMessages(storedMessages);
    });
    appShellService.getUserSettings().then((settings) => {
      if (!settings) return;
      setProfileName(settings.name || user.name || '');
      setProfileEmail(settings.email || user.email || '');
    });
  }, [user?.id]);

  // API Queries via Tanstack Query
  const { data: courses = [] } = useCourses();
  const { data: myCourses = [], refetch: refetchMyCourses } = useMyCourses();
  
  const { data: quizzes = [] } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => courseService.getQuizzes(),
  });
  
  const { data: certificates = [], refetch: refetchCertificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => certificateService.getCertificates(),
  });
  
  const { data: assignments = [], refetch: refetchAssignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => assignmentService.getAssignments(),
  });
  
  const { data: syncQueue = [], refetch: refetchSyncQueue } = useQuery({
    queryKey: ['sync-queue'],
    queryFn: () => syncService.getSyncQueue(),
  });
  
  const { data: studentAnalytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['student-analytics', user?.id],
    queryFn: () => analyticsService.getStudentAnalytics(user?.id || 'u1'),
    enabled: !!user?.id
  });

  const { data: achievements = [], refetch: refetchAchievements } = useQuery({
    queryKey: ['student-achievements', user?.id],
    queryFn: () => achievementService.getAchievements(),
    enabled: !!user?.id
  });

  const { data: leaderboardEntries = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => leaderboardService.getLeaderboard()
  });

  const { data: userBookmarks = [], refetch: refetchBookmarks } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: () => bookmarkService.getBookmarks(),
    enabled: !!user?.id
  });

  const { data: userStreak, refetch: refetchStreak } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: () => streakService.getStreak(),
    enabled: !!user?.id
  });

  const { data: notificationsList = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationService.getNotifications(),
    enabled: !!user?.id
  });

  // Local state for interactive messaging, submissions, notes
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Dr. Sarah Mitchell', text: 'Please verify your solar battery configurations before next week\'s lab exam.', time: '10:45 AM', unread: true },
    { id: '2', sender: 'Prof. David Chen', text: 'Auto workshop tool kits are available starting Monday 8:00 AM.', time: 'Yesterday', unread: false }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [submissionFile, setSubmissionFile] = useState('');
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Access Unauthorized</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6 text-center">You must be logged in to view the Student Portal.</p>
        <Link to="/login"><Button>Portal Login</Button></Link>
      </div>
    );
  }

  const handleSyncAll = async () => {
    setSyncing(true);
    try {
      await syncService.triggerSync();
      await refetchSyncQueue();
      await refetchMyCourses();
      await refetchAssignments();
      await refetchAnalytics();
      await refetchAchievements();
      await refetchCertificates();
      setToastText('Offline sync successful!');
      setTimeout(() => setToastText(''), 3000);
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const updatedMessages = [...messages, { id: Date.now().toString(), sender: 'Me', text: newMessage, time: 'Just now', unread: false }];
    setMessages(updatedMessages);
    appShellService.saveMessages(updatedMessages);
    setNewMessage('');
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionFile) return;
    try {
      await assignmentService.submitAssignment(selectedAssignment.id, submissionFile);
      await refetchAssignments();
      await refetchSyncQueue();
      setSelectedAssignment(null);
      setSubmissionFile('');
      setToastText('Assignment submitted successfully!');
      setTimeout(() => setToastText(''), 3000);
    } catch (err) {
      console.error('Failed to submit assignment', err);
    }
  };

  const toggleBookmark = async (courseId: string) => {
    const isBookmarked = userBookmarks.some(b => b.courseId === courseId);
    if (isBookmarked) {
      await bookmarkService.removeBookmark(courseId);
    } else {
      await bookmarkService.addBookmark(courseId);
    }
    refetchBookmarks();
  };

  const handleMarkNotificationsRead = async () => {
    await notificationService.markAllRead();
    refetchNotifications();
  };

  const handleSaveStudentNotes = async () => {
    await appShellService.saveUserNotes(notesDraft);
    setToastText('Notes saved successfully inside your browser cache!');
    setTimeout(() => setToastText(''), 3000);
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser = await authService.updateProfile({ name: profileName });
    await appShellService.saveUserSettings({
      name: updatedUser.name,
      email: updatedUser.email,
      institution: updatedUser.institution,
      department: updatedUser.department
    });
    setToastText('Profile settings updated successfully!');
    setTimeout(() => setToastText(''), 3000);
  };

  const handleSubmitSupportTicket = async () => {
    if (!supportTitle.trim() || !supportDescription.trim()) {
      setToastText('Enter a support title and description first.');
      setTimeout(() => setToastText(''), 3000);
      return;
    }
    await appShellService.submitSupportTicket({
      userId: user.id,
      name: user.name,
      email: user.email,
      title: supportTitle,
      description: supportDescription,
      priority: supportPriority
    });
    setSupportTitle('');
    setSupportDescription('');
    setSupportPriority('medium');
    setToastText('Support ticket sent to institutional mesh server desk!');
    setTimeout(() => setToastText(''), 3000);
  };

  // Sidebar grouping configurations
  const sidebarGroups = [
    {
      title: 'LEARNING LAB',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'My Courses', icon: BookOpen, badge: myCourses.length },
        { id: 'explore', label: 'Explore Catalog', icon: Compass },
        { id: 'categories', label: 'Course Categories', icon: Tag },
        { id: 'bookmarks', label: 'Watchlist / Bookmarks', icon: Bookmark, badge: userBookmarks.length },
        { id: 'progress', label: 'Analytics & Progress', icon: LineChart },
        { id: 'certificates', label: 'Graduation Certs', icon: Award, badge: certificates.length },
        { id: 'achievements', label: 'Earned Badges', icon: CheckSquare },
        { id: 'leaderboard', label: 'Leaderboard Rankings', icon: Flame },
      ]
    },
    {
      title: 'COMMUNICATIONS',
      items: [
        { id: 'discussions', label: 'Discussions / Q&A', icon: MessageSquare },
        { id: 'notifications', label: 'Alert Feeds', icon: Bell, badge: notificationsList.filter(n => !n.read).length },
        { id: 'messages', label: 'Direct Messages', icon: MessageSquare, badge: messages.filter(m => m.unread).length },
      ]
    },
    {
      title: 'OFFLINE & SYNC',
      items: [
        { id: 'downloads', label: 'Offline Library', icon: Download },
        { id: 'notes', label: 'Saved Lecture Notes', icon: FileText },
        { id: 'sync', label: 'Mesh Server Synchronizer', icon: RefreshCw, badge: syncQueue.length },
      ]
    },
    {
      title: 'ACCOUNT CONFIG',
      items: [
        { id: 'settings', label: 'Portal Settings', icon: Settings },
        { id: 'support', label: 'Help Desk / Tickets', icon: User }
      ]
    }
  ];

  // Continue Learning selection
  const continueCourse = myCourses.length > 0 ? myCourses[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors">
      
      {/* Toast Alert Indicator */}
      {toastText && (
        <div className="fixed bottom-5 right-5 z-55 bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-indigo-400">
          <CheckCircle className="h-4 w-4" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-4 shrink-0 transition-colors ${mobileMenuOpen ? 'block' : 'hidden md:flex'}`}>
        <div className="space-y-6 overflow-y-auto max-h-[80vh] md:max-h-[calc(100vh-200px)] pr-1">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-indigo-650">
              <img src={logoUrl} className="h-8 w-auto dark:brightness-125" alt="JifunzeHub Logo" />
            </Link>
            <button className="md:hidden text-zinc-500 text-lg" onClick={() => setMobileMenuOpen(false)}>×</button>
          </div>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl flex items-center gap-2 border border-zinc-100 dark:border-zinc-800">
            <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full border bg-white" />
            <div className="truncate">
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-55 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-550 capitalize">{user.role} Portal</p>
            </div>
          </div>

          <nav className="space-y-4">
            {sidebarGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <p className="text-[9px] font-extrabold text-zinc-400 dark:text-zinc-500 tracking-wider px-2 py-0.5">{group.title}</p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as TabType);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 shadow-sm border border-indigo-150/20' 
                            : 'text-zinc-550 dark:text-zinc-400 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-650 dark:text-indigo-400' : 'text-zinc-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span className="bg-indigo-600 dark:bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex flex-col gap-1 text-[10px] font-bold text-zinc-400">
            <span>SWITCH PORTAL ROLE</span>
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <button onClick={() => switchRole('lecturer')} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded hover:bg-zinc-200 dark:hover:bg-zinc-750 text-[10px] font-bold cursor-pointer transition-colors">Lecturer</button>
              <button onClick={() => switchRole('admin')} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded hover:bg-zinc-200 dark:hover:bg-zinc-750 text-[10px] font-bold cursor-pointer transition-colors">Admin</button>
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
            className="w-full justify-start text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between transition-colors shrink-0">
          <div className="flex items-center gap-4 flex-grow max-w-xl">
            <button className="md:hidden p-1.5 rounded-lg border dark:border-zinc-800 text-zinc-550 cursor-pointer" onClick={() => setMobileMenuOpen(true)}>☰</button>
            
            {/* Live activity indicator badge */}
            <LiveBadge />
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('notifications')}
              className="relative p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {notificationsList.some(n => !n.read) && (
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-zinc-900" />
              )}
            </button>

            <button 
              onClick={() => setActiveTab('messages')}
              className="relative p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              {messages.some(m => m.unread) && (
                <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-zinc-900" />
              )}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-zinc-250 dark:border-zinc-850">
              <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full bg-white object-cover border border-zinc-200 dark:border-zinc-800" />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-55">{user.name}</p>
                <p className="text-[10px] text-zinc-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stateful Page Views wrapper */}
        <div className="flex-grow p-6 overflow-y-auto">

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent">
                <div>
                  <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-55 tracking-tight">
                    Welcome back, {user.name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Let's build your competencies and continue your learning track today.</p>
                </div>
                <Button 
                  onClick={() => setActiveTab('explore')}
                  className="bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Compass className="h-4 w-4" />
                  <span>Browse Catalog</span>
                </Button>
              </div>

              {/* StatCards Row with Rolling Counter Animation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Enrolled Courses</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-55">
                      <AnimatedCounter value={myCourses.length} />
                    </p>
                    <button onClick={() => setActiveTab('courses')} className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-1">View my lab →</button>
                  </div>
                  <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Completed Tracks</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-55">
                      <AnimatedCounter value={certificates.length} />
                    </p>
                    <button onClick={() => setActiveTab('certificates')} className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 hover:underline flex items-center gap-1">View certificates →</button>
                  </div>
                  <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Unlocked Badges</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-55">
                      <AnimatedCounter value={achievements.filter(a => a.isUnlocked).length} />
                    </p>
                    <button onClick={() => setActiveTab('achievements')} className="text-[10px] font-bold text-purple-650 dark:text-purple-400 hover:underline flex items-center gap-1">View achievements →</button>
                  </div>
                  <div className="h-10 w-10 bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-xl flex items-center justify-center">
                    <Award className="h-5 w-5 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total XP Earned</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-55">
                      <AnimatedCounter value={user.xp || 2450} />
                    </p>
                    <button onClick={() => setActiveTab('leaderboard')} className="text-[10px] font-bold text-amber-650 dark:text-amber-400 hover:underline">View rank table →</button>
                  </div>
                  <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                    <Flame className="h-5 w-5 text-amber-500 fill-amber-500 stroke-none" />
                  </div>
                </div>
              </div>

              {/* Main Grid: Left side Course resume, Right side Live activities and Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Resume learning track */}
                  {continueCourse ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55">Continue Learning</h3>
                        <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline">View all</button>
                      </div>

                      <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row gap-5 items-center bg-white dark:bg-zinc-900">
                        <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-zinc-800 flex items-center justify-center group shadow-sm">
                          <img 
                            src={continueCourse.thumbnailUrl} 
                            alt={continueCourse.title} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" 
                          />
                          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">ACTIVE</div>
                          <Link to={`/student/course/${continueCourse.id}/learn`} className="relative z-10 h-10 w-10 bg-white/95 text-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                            <Play className="h-4 w-4 fill-indigo-600 pl-0.5" />
                          </Link>
                        </div>

                        <div className="flex-grow space-y-3 w-full">
                          <div>
                            <span className="text-[9px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block mb-0.5">{continueCourse.category}</span>
                            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55">{continueCourse.title}</h4>
                            <p className="text-[11px] text-zinc-550 dark:text-zinc-450 mt-0.5 truncate">{continueCourse.subtitle}</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                              <span>Course Syllabus Progress</span>
                              <span className="text-indigo-650 dark:text-indigo-400">{continueCourse.progress}% complete</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${continueCourse.progress}%` }} />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                            <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Syllabus includes: {continueCourse.lessonsCount} lessons • {continueCourse.duration} total duration</span>
                            </span>
                            <Link to={`/student/course/${continueCourse.id}/learn`}>
                              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-750 text-white text-xs px-4 py-1.5 rounded-xl font-bold">Resume Track</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState 
                      title="No Active Enrollments" 
                      description="You are not enrolled in any course syllabus tracks yet. Browse our professional TVET catalogs to begin."
                      actionLabel="Explore Courses"
                      onAction={() => setActiveTab('explore')}
                    />
                  )}

                  {/* Recommendations */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55">Recommended For Your Department</h3>
                      <button onClick={() => setActiveTab('explore')} className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline">View all</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {courses.filter(c => !myCourses.some(mc => mc.id === c.id)).slice(0, 4).map((course) => (
                        <div 
                          key={course.id} 
                          onClick={() => { setActiveTab('explore'); }}
                          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-pointer"
                        >
                          <div className="relative h-32 bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                            <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {course.skillLevel}
                            </div>
                            <button 
                              onClick={(e) => { 
                                e.preventDefault(); 
                                e.stopPropagation(); 
                                toggleBookmark(course.id);
                              }} 
                              className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-white shadow transition-colors z-10"
                            >
                              <Bookmark className={`h-3.5 w-3.5 ${userBookmarks.some(b => b.courseId === course.id) ? 'fill-indigo-650 stroke-none' : ''}`} />
                            </button>
                          </div>
                          <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                            <div className="space-y-1">
                              <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">{course.category}</span>
                              <h4 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-55 group-hover:text-indigo-650 transition-colors line-clamp-2">{course.title}</h4>
                            </div>
                            <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] font-bold text-zinc-400">
                              <span className="text-amber-500">{course.rating} ★</span>
                              <span>{course.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Learning Progress Ring (Radial SVG widget) */}
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-55">Syllabus Completion</h3>
                    
                    <div className="flex flex-col items-center justify-center py-4 space-y-4">
                      {/* SVGRing Component call */}
                      <ProgressRing 
                        progress={myCourses.length > 0 ? (myCourses.reduce((acc, c) => acc + (c.progress ?? 0), 0) / myCourses.length) : 0} 
                        size={130}
                      />

                      <div className="w-full space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-400">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <span>Finished Modules</span>
                          </span>
                          <span className="text-zinc-900 dark:text-zinc-55">{certificates.length} courses</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                            <span>In Progress</span>
                          </span>
                          <span className="text-zinc-900 dark:text-zinc-55">{myCourses.filter(c => (c.progress ?? 0) < 100).length} courses</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Study Streak Calendar mini Heatmap widget */}
                  <StudyStreakCalendar streak={userStreak || null} />

                  {/* Live Activity Feed widget */}
                  <LiveActivityFeed />

                </div>

              </div>
            </div>
          )}

          {/* 2. MY COURSES VIEW */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">My Active Courses</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Resume your lectures, review notes, and complete assignments.</p>
              </div>

              {myCourses.length === 0 ? (
                <EmptyState 
                  title="No Enrolled Courses" 
                  description="Start learning now! Pick from our verified curriculum list."
                  actionLabel="Go to Catalog"
                  onAction={() => setActiveTab('explore')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => (
                    <div key={course.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="relative h-44 bg-zinc-850">
                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        <Badge variant="info" className="absolute top-3 left-3">{course.category}</Badge>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55 line-clamp-1">{course.title}</h3>
                          <p className="text-[10px] text-zinc-400">Instructor: {course.lecturerName}</p>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-zinc-500">Syllabus Progress</span>
                            <span className="text-zinc-900 dark:text-zinc-55">{course.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                        <Link to={`/student/course/${course.id}/learn`}>
                          <Button className="w-full justify-center text-xs py-2 flex items-center gap-1.5 font-bold">
                            <Play className="h-3.5 w-3.5 fill-white" />
                            <span>Resume Course Player</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. EXPLORE CATALOG VIEW */}
          {activeTab === 'explore' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Explore Course Catalog</h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-semibold">Verified curricula from Kenya TVETA, freeCodeCamp, MIT OCW, and industry academies.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const isEnrolled = myCourses.some(mc => mc.id === course.id);
                  return (
                    <div key={course.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                      <div className="h-36 bg-zinc-800 relative">
                        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <Badge variant="info" className="absolute top-3 left-3">{course.category}</Badge>
                        <button 
                          onClick={() => toggleBookmark(course.id)}
                          className="absolute top-3 right-3 p-1.5 bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-white shadow transition-colors z-10"
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${userBookmarks.some(b => b.courseId === course.id) ? 'fill-indigo-650 stroke-none' : ''}`} />
                        </button>
                      </div>
                      <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55 group-hover:text-indigo-650 transition-colors line-clamp-1">{course.title}</h4>
                          <p className="text-[10px] text-zinc-400 mt-0.5">By {course.lecturerName}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold pt-2 border-t border-zinc-150 dark:border-zinc-850 text-zinc-400">
                            <span className="text-amber-500">{course.rating} ★</span>
                            <span>{course.duration}</span>
                          </div>
                          
                          <Link to={`/course/${course.id}`} className="block">
                            <Button size="sm" variant={isEnrolled ? 'outline' : 'primary'} className="w-full justify-center text-[10px] font-bold">
                              {isEnrolled ? 'View Curriculum Detail' : 'Enroll / Learn More'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. CATEGORIES VIEW */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Browse Categories</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Filter curriculum tracks by departments and technical competencies.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {COURSE_DEPARTMENTS.map((title, idx) => {
                  const icons = ['💻', '⚡', '📊', '🍽️', '🌾', '🩺', '✂️', '🏗️', '🎬', '🛠️'];
                  const count = courses.filter((course) => course.department === title).length;
                  return (
                  <button 
                    key={idx}
                    onClick={() => { setActiveTab('explore'); }}
                    className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-500 hover:shadow-md transition-all text-center space-y-2 cursor-pointer"
                  >
                    <div className="text-3xl">{icons[idx] || '📚'}</div>
                    <p className="font-extrabold text-xs text-zinc-900 dark:text-zinc-55 leading-tight">{title}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold">{count} syllabus tracks</p>
                  </button>
                )})}
              </div>
            </div>
          )}

          {/* 5. BOOKMARKS WATCHLIST VIEW */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">My Bookmarks Watchlist</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Resume courses and lectures you saved for reference later.</p>
              </div>

              {userBookmarks.length === 0 ? (
                <EmptyState 
                  title="Watchlist is Empty" 
                  description="Click bookmark star buttons on any explore card to save courses here."
                  actionLabel="Browse Catalog"
                  onAction={() => setActiveTab('explore')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {userBookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                      <div className="h-32 bg-zinc-800 relative">
                        <img src={bookmark.courseThumbnail} alt={bookmark.courseTitle} className="w-full h-full object-cover" />
                        <Badge variant="info" className="absolute top-3 left-3">{bookmark.courseCategory}</Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55 line-clamp-1">{bookmark.courseTitle}</h4>
                        <p className="text-[10px] text-zinc-400 font-semibold">Saved: {new Date(bookmark.savedAt).toLocaleDateString()}</p>
                        <div className="flex gap-2 pt-2">
                          <Link to={`/course/${bookmark.courseId}`} className="flex-grow">
                            <Button size="sm" className="w-full justify-center text-[10px] font-bold">Go to Course Page</Button>
                          </Link>
                          <button 
                            onClick={() => toggleBookmark(bookmark.courseId)}
                            className="px-2 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 text-red-500 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. PROGRESS & ANALYTICS VIEW */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Analytics & Learning Progress</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Track your metrics, daily logs, and study intervals.</p>
              </div>

              {/* Metric stats row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Time Studied</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-55">
                    {studentAnalytics?.metrics?.total_time_spent_minutes 
                      ? Math.round(studentAnalytics.metrics.total_time_spent_minutes / 60) 
                      : 42} hrs
                  </p>
                  <p className="text-[9px] text-zinc-400 font-semibold">Sync state: Complete</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Completed Lectures</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-55">
                    {studentAnalytics?.metrics?.total_lessons_completed || 15} units
                  </p>
                  <p className="text-[9px] text-zinc-400 font-semibold">Curriculum compliance: 100%</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Average Test Score</p>
                  <p className="text-2xl font-black text-indigo-650 dark:text-indigo-400">
                    {studentAnalytics?.metrics?.avg_score || 92}%
                  </p>
                  <p className="text-[9px] text-zinc-400 font-semibold">Grade mark: Distinction</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-1">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Study Streak</p>
                  <p className="text-2xl font-black text-amber-500 flex items-center gap-1">
                    <span>{userStreak?.currentStreak || 0} Days</span>
                    <Flame className="h-5 w-5 fill-amber-500 stroke-none animate-pulse" />
                  </p>
                  <p className="text-[9px] text-zinc-400 font-semibold">Longest streak: {userStreak?.longestStreak || 0} days</p>
                </div>
              </div>

              {/* Grid: Study Calendar + Recent Activity logs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <StudyStreakCalendar streak={userStreak || null} />
                </div>
                
                <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-55">Recent Activity Log</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {studentAnalytics?.recent_activity?.length > 0 ? (
                      studentAnalytics.recent_activity.map((act: any) => (
                        <div key={act.id} className="flex gap-2 items-start text-xs">
                          <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <div className="space-y-0.5">
                            <p className="text-zinc-750 dark:text-zinc-350">
                              Completed action <span className="font-extrabold uppercase text-[9px] px-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">{act.activity_type}</span>
                            </p>
                            {act.metadata?.course_title && <p className="text-[10px] font-extrabold text-zinc-450">{act.metadata.course_title}</p>}
                            {act.metadata?.lesson_title && <p className="text-[10px] font-extrabold text-zinc-450">{act.metadata.lesson_title}</p>}
                            <p className="text-[8px] text-zinc-400">{new Date(act.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-zinc-400">No activity logs recorded.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. CERTIFICATES VIEW */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">My Earned Certificates</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Official TVET-aligned graduation documents. Validate and print your certifications.</p>
              </div>

              {certificates.length === 0 ? (
                <EmptyState 
                  title="No Certificates Earned Yet" 
                  description="Certificates are issued automatically upon scoring 100% completion on any course syllabus."
                  actionLabel="Go to Active Courses"
                  onAction={() => setActiveTab('courses')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <CertificateCard key={cert.id} certificate={cert} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 8. ACHIEVEMENTS VIEW */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Achievements & Badges</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Complete quizzes, lessons, and streaks to unlock badges and gain bonus XP.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((ach) => (
                  <AchievementCard key={ach.id} achievement={ach} />
                ))}
              </div>
            </div>
          )}

          {/* 9. LEADERBOARD VIEW */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Leaderboard Rankings</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Global standings of Naserian TVET Institute students by total study XP.</p>
              </div>

              <LeaderboardTable entries={leaderboardEntries} currentUserId={user.id} />
            </div>
          )}

          {/* 10. OFFLINE LIBRARY VIEW */}
          {activeTab === 'downloads' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 p-5 rounded-2xl space-y-2">
                <h4 className="font-extrabold text-indigo-900 dark:text-indigo-400 text-sm">Offline Caching Engine</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-semibold">
                  All lessons downloaded below are stored directly inside your browser database cache. You can watch these lecture videos, read worksheets, and complete practical reviews completely without cellular data networks.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-55">Active Cached Content</h3>
                <div className="divide-y divide-zinc-150 dark:divide-zinc-800">
                  {courses.slice(0, 3).map((course, idx) => (
                    <div key={idx} className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
                      <div className="flex gap-3 items-center">
                        <WifiOff className="h-5 w-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="font-extrabold text-zinc-850 dark:text-zinc-250">{course.title} (All Modules)</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Size on disk: {course.downloadSize || '180 MB'} | Status: Fully Cached</p>
                        </div>
                      </div>
                      <Badge variant="success">Offline Active</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 11. DISCUSSIONS VIEW */}
          {activeTab === 'discussions' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Q&A Discussions</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Post questions, reply to lecturers, and discuss assignments with peers.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex gap-4 border-b border-zinc-150 dark:border-zinc-800 pb-4">
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center shrink-0 font-bold">DK</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-55">Dennis Kiprop</span>
                      <span className="text-[10px] text-zinc-400">May 15</span>
                    </div>
                    <p className="text-xs font-extrabold text-zinc-900 dark:text-zinc-55">How should I calculate battery autonomy rate for off-grid clinics?</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">I am stuck on calculating the safety sizing margin multiplier for the solar battery bank.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <textarea placeholder="Write a reply..." className="w-full p-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600" rows={2} />
                  <div className="flex justify-end pt-2">
                    <Button size="sm" onClick={() => alert('Reply posted locally!')}>Post Reply</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 12. NOTIFICATIONS VIEW */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">My Alert Feed</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Review announcements and course triggers.</p>
                </div>
                <Button size="sm" onClick={handleMarkNotificationsRead} className="text-xs">Mark all read</Button>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm divide-y divide-zinc-150 dark:divide-zinc-850">
                {notificationsList.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-450">You have no new alerts.</div>
                ) : (
                  notificationsList.map((notif) => (
                    <div key={notif.id} className="py-3.5 flex justify-between items-start gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${notif.read ? 'bg-zinc-350' : 'bg-indigo-650'}`} />
                          <h5 className="font-extrabold text-zinc-900 dark:text-zinc-55">{notif.title}</h5>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 pl-4">{notif.message}</p>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400">{new Date(notif.created_at).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 13. DIRECT MESSAGES VIEW */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Direct Messaging</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Chat in real-time with instructors and lab coordinators.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm h-[450px]">
                {/* Conversations column */}
                <div className="md:col-span-4 border-r border-zinc-150 dark:border-zinc-800 overflow-y-auto">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-850 text-xs font-bold text-zinc-400 border-b border-zinc-150 dark:border-zinc-800">
                    RECENT INBOX
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
                    <button className="w-full text-left p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 bg-indigo-50/40 dark:bg-indigo-950/10 flex gap-2 items-center">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center font-extrabold text-xs">SM</div>
                      <div className="min-w-0 flex-grow">
                        <p className="font-extrabold text-xs text-zinc-900 dark:text-zinc-55 truncate">Dr. Sarah Mitchell</p>
                        <p className="text-[10px] text-zinc-450 truncate">Please verify your solar battery configurations...</p>
                      </div>
                    </button>
                    <button className="w-full text-left p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 flex gap-2 items-center">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center font-extrabold text-xs">DC</div>
                      <div className="min-w-0 flex-grow">
                        <p className="font-extrabold text-xs text-zinc-900 dark:text-zinc-55 truncate">Prof. David Chen</p>
                        <p className="text-[10px] text-zinc-450 truncate">Auto workshop tools are available...</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Chat content column */}
                <div className="md:col-span-8 flex flex-col justify-between h-full bg-zinc-50/50 dark:bg-zinc-900/20">
                  <div className="p-3 bg-white dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-55">Dr. Sarah Mitchell</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Lecturer</span>
                  </div>

                  <div className="flex-grow p-4 overflow-y-auto space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-xs text-xs space-y-1 shadow-sm border ${
                          m.sender === 'Me' 
                            ? 'bg-indigo-650 text-white border-indigo-600' 
                            : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-55 border-zinc-150 dark:border-zinc-850'
                        }`}>
                          <p>{m.text}</p>
                          <span className={`text-[8px] block text-right ${m.sender === 'Me' ? 'text-indigo-200' : 'text-zinc-400'}`}>
                            {m.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-150 dark:border-zinc-850 flex gap-2">
                    <input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type message..." 
                      className="flex-grow px-3.5 py-1.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600" 
                    />
                    <Button size="sm" type="submit" className="px-4"><Send className="h-3.5 w-3.5" /></Button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* 14. SYNC QUEUE VIEW */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-transparent">
                <div>
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Mesh Server Synchronizer</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Manage local offline queue items to align with institutional mesh server.</p>
                </div>
                <Button 
                  onClick={handleSyncAll} 
                  disabled={syncing}
                  className="bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <RefreshCw className={`h-4.5 w-4.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Synchronizing...' : 'Sync All Queue'}</span>
                </Button>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider">Unsaved Offline Queue ({syncQueue.length})</h4>
                {syncQueue.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-400">All local databases are completely synchronized.</div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {syncQueue.map((item: any) => (
                      <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-extrabold text-zinc-850 dark:text-zinc-250 capitalize">{item.action.replace('_', ' ')}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Payload ID: {item.itemId} | Created: {new Date(item.timestamp).toLocaleTimeString()}</p>
                        </div>
                        <Badge variant="warning">Offline Pending</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 15. NOTES VIEW */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">My Study Notes</h3>
                <p className="text-xs text-zinc-500 mt-0.5 font-semibold">Take notes as you watch lectures. These are stored locally on your device.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                <textarea 
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="w-full p-4 bg-zinc-50 dark:bg-zinc-855 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono" 
                  rows={10} 
                  placeholder={`React - Complete Guide Notes:\n- Components are reusable UI pieces\n- Use useState for simple state tracking\n- Use useEffect to execute async data fetches or local storage caching\n- Standard TVET solar calculation formula:\n  Autonomy Multiplier = Autonomy Days (2) / depth of discharge (0.8)\n`}
                />
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveStudentNotes}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 16. SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Portal Settings</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Update your student profile and credentials.</p>
              </div>

              <form onSubmit={handleSaveProfileSettings} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                  <Input label="Institutional Email Address" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} disabled />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Institute Name" value={user.institution || ''} disabled />
                  <Input label="Department Name" value={user.department || ''} disabled />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Settings Changes</Button>
                </div>
              </form>
            </div>
          )}

          {/* 17. HELP & SUPPORT VIEW */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-55">Help & Support Desk</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Submit support tickets to institutional mesh coordinators.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Query Title" placeholder="e.g. Local Server Sync Failed" value={supportTitle} onChange={(e) => setSupportTitle(e.target.value)} />
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400 block">Priority Grade</label>
                    <select value={supportPriority} onChange={(e) => setSupportPriority(e.target.value as 'low' | 'medium' | 'high')} className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 transition-colors">
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-400 block">Query Description</label>
                  <textarea value={supportDescription} onChange={(e) => setSupportDescription(e.target.value)} className="w-full p-3 bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-600" rows={4} placeholder="Provide details..." />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSubmitSupportTicket}>
                    Submit Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
