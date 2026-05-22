import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from '@tanstack/react-router';
const Link = RouterLink as any;
import { PublicLayout } from '../components/layout/PublicLayout';
import splashUrl from '../assets/splash.png';
import { useCourses } from '../hooks/useCourses';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Play, Download, WifiOff, HardDrive, Share2, Award, ArrowRight, Star, CheckCircle, Flame, Users, BookOpen, ShieldCheck } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import LiveBadge from '../components/ui/LiveBadge';
import { liveSimulationService } from '../services/liveSimulationService';
import { ActivityFeedItem } from '../types';
import { COURSE_DEPARTMENTS } from '../mock-db/courses';

export const Route = {
  options: {
    component: LandingPage,
  },
};

function LandingPage() {
  const { data: courses = [], isLoading } = useCourses();
  const [liveTicker, setLiveTicker] = useState<string>('Dennis Kiprop completed Module 3: Battery Autonomy Calculation');

  // Listen to live simulation logs for public activity ticker
  useEffect(() => {
    liveSimulationService.startSimulation();
    const unsubscribe = liveSimulationService.subscribe((type, item) => {
      if (type === 'feed_update') {
        setLiveTicker(`${item.userName} ${item.message}`);
      }
    });
    return () => {
      unsubscribe();
      liveSimulationService.stopSimulation();
    };
  }, []);

  // Take first 6 courses across diverse categories
  const featuredCourses = courses.slice(0, 6);
  const departmentCards = COURSE_DEPARTMENTS.slice(0, 4).map((department, index) => ({
    title: department,
    desc: `Browse active ${department.toLowerCase()} pathways with lesson playback, progress tracking, and practical assessments.`,
    icon: [Flame, BookOpen, HardDrive, ShieldCheck][index],
    count: `${courses.filter((course) => course.department === department).length} Courses`
  }));

  return (
    <PublicLayout>
      {/* Real-time Global Ticker Bar */}
      <div className="bg-indigo-650 text-white py-2 px-4 text-xs font-semibold overflow-hidden shadow-inner flex justify-center items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="uppercase tracking-wider text-[10px] font-black text-indigo-200">LIVE LEARNER UPDATES:</span>
        <span className="animate-fade-in truncate max-w-lg md:max-w-none text-indigo-50 font-bold">{liveTicker}</span>
      </div>

      {/* Resilient Status Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-950/20 border-b border-amber-500/20 text-amber-800 dark:text-amber-300 py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0 text-amber-600" />
        <span>JifunzeHub is running in Offline-Mesh Synchronizer Mode. Offline activities will auto-sync to campus servers.</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/20 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Badge variant="info" className="px-3 py-1 text-xs font-black uppercase tracking-wider">
                🇰🇪 Resilient TVET Mesh Node
              </Badge>
              <LiveBadge />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-50 leading-none tracking-tight">
              Syllabus-Aligned Learning for <span className="text-indigo-650 dark:text-indigo-400">TVET Excellence</span>
            </h1>
            
            <p className="text-sm md:text-base text-zinc-550 dark:text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-semibold">
              Premium classroom-optimized system designed for offline campuses. Download entire high-definition courses to local browser sandbox, practice using interactive sandboxes, and export verified TVETA certificates.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2 group font-bold">
                  <span>Start Learning Now</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/catalog">
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold border-zinc-200 dark:border-zinc-800">
                  Explore {courses.length > 0 ? `${courses.length}+ ` : ''}Curricula
                </Button>
              </Link>
            </div>

            {/* Offline Micro-Badges */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap justify-center lg:justify-start gap-6 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4.5 w-4.5 text-indigo-600" />
                <span>Offline IndexedDB Caching</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="h-4.5 w-4.5 text-indigo-600" />
                <span>Institutional Node Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-indigo-600" />
                <span>Verified TVET Standards</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
            <div className="relative border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
              <img
                src={splashUrl}
                alt="JifunzeHub Platform Preview"
                className="w-full h-auto rounded-2xl object-cover border border-zinc-150 dark:border-zinc-850"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TVET Categories Section */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-850 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Official TVET Departments
            </h2>
            <p className="text-sm font-semibold text-zinc-400">
              National syllabus-compliant practical training for technical, vocational, and industrial qualifications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {departmentCards.map((cat, idx) => (
              <div key={idx} className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all group bg-slate-50/20 dark:bg-zinc-900/40">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50">{cat.title}</h3>
                <p className="text-xs text-zinc-450 mt-2 leading-relaxed font-semibold">{cat.desc}</p>
                <div className="mt-4 pt-4 border-t border-zinc-150 dark:border-zinc-800 flex justify-between items-center text-[10px] font-bold text-indigo-650 dark:text-indigo-400">
                  <span>{cat.count}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-slate-50 dark:bg-zinc-950 border-t border-zinc-150 dark:border-zinc-850 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Popular Curricula For Download</h2>
              <p className="text-sm font-semibold text-zinc-400 mt-2">Explore curriculum tracks certified by NITA, TVETA and industry partners.</p>
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="font-bold text-xs border-zinc-200 dark:border-zinc-800">Explore Catalog</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <CircularProgress size={30} className="text-indigo-650" />
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="text-zinc-500 text-xs border border-zinc-200 p-6 rounded-xl text-center">
              Curriculum catalog is syncing. Please connect to campus server nodes.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <div key={course.id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                  <div className="relative h-48 bg-zinc-800 overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge variant="success" className="absolute top-3 right-3 flex items-center gap-1">
                      <WifiOff className="h-3 w-3" /> Offline Enabled
                    </Badge>
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block">{course.category}</span>
                      <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 line-clamp-1 hover:text-indigo-650 transition-colors">
                        <Link to={`/course/${course.id}`}>{course.title}</Link>
                      </h3>
                      <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed font-semibold">{course.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-zinc-150 dark:border-zinc-800">
                      <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                        <span>Instructor: {course.lecturerName.split(' ').pop()}</span>
                        <span>{course.duration}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold">
                          <Star className="h-3.5 w-3.5 fill-amber-500 stroke-none" />
                          <span>{course.rating || '4.8'}</span>
                        </div>
                        <Link to={`/course/${course.id}`}>
                          <Button size="sm" variant="ghost" className="flex items-center gap-1 text-[10px] font-bold">
                            <span>Syllabus</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Institution Partners Section */}
      <section className="py-12 bg-zinc-50 dark:bg-zinc-900 border-t border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">Supporting On-Campus Networks at Kenyan TVET Polytechs</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 dark:opacity-40 grayscale">
            <span className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-zinc-50">Nairobi Technical Training Institute</span>
            <span className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-zinc-50">Kabete National Polytechnic</span>
            <span className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-zinc-50">Naserian Vocational Center</span>
            <span className="font-extrabold text-sm md:text-base text-zinc-900 dark:text-zinc-50">Machakos Institute of Tech</span>
          </div>
        </div>
      </section>

      {/* Statistics Section with Dynamic Counts */}
      <section className="py-16 bg-white dark:bg-zinc-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Curricula', value: courses.length > 0 ? `${courses.length}+ Courses` : '55+ Courses' },
            { label: 'Syllabus Quiz Materials', value: '450+ Units' },
            { label: 'Simulated Online Students', value: '240+ Active' },
            { label: 'NITA Compliance Rate', value: '100%' }
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-2xl md:text-3xl font-black text-indigo-650 dark:text-indigo-400">{stat.value}</p>
              <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
