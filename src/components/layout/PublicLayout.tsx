import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import logoUrl from '../../assets/logo.png';
import { Menu, X, BookOpen, GraduationCap, Info, HelpCircle, PhoneCall, LogIn, LayoutDashboard, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (!user) return;
    if (user.role === 'student') navigate({ to: '/student/dashboard' });
    else if (user.role === 'lecturer') navigate({ to: '/lecturer/overview' });
    else if (user.role === 'admin') navigate({ to: '/admin/overview' });
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                <img src={logoUrl} className="h-9 w-auto hover:opacity-90 transition-opacity" alt="JifunzeHub Logo" />
              </Link>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                TVET Edition
              </span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/catalog" className="text-zinc-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm font-medium">
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </Link>
              <Link to="/about" className="text-zinc-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm font-medium">
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link to="/contact" className="text-zinc-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm font-medium">
                <PhoneCall className="h-4 w-4" />
                <span>Contact</span>
              </Link>
              <Link to="/help" className="text-zinc-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm font-medium">
                <HelpCircle className="h-4 w-4" />
                <span>Help Center</span>
              </Link>
            </nav>

            {/* Auth CTA / User Dropdown */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle variant="minimal" />
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors focus:outline-none cursor-pointer"
                  >
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.email}`}
                      alt="Avatar"
                      className="h-8 w-8 rounded-full border border-blue-200 bg-white"
                    />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-zinc-900 leading-tight">{user.name}</p>
                      <p className="text-[10px] text-zinc-500 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleDashboardRedirect();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Go to Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          navigate({ to: '/' });
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle variant="minimal" />
              {user && (
                <button
                  onClick={handleDashboardRedirect}
                  className="p-2 rounded-lg bg-blue-50 text-blue-600 cursor-pointer"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-2 pb-4 space-y-2">
              <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Courses
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Contact
            </Link>
            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Help Center
            </Link>

            <div className="pt-4 border-t border-zinc-200 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="h-10 w-10 rounded-full border border-blue-200"
                    />
                    <div>
                      <p className="font-semibold text-zinc-900">{user.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleDashboardRedirect();
                    }}
                    className="w-full text-center"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate({ to: '/' });
                    }}
                    className="w-full text-center text-red-600"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
              <img src={logoUrl} className="h-7 w-auto" alt="JifunzeHub Logo" />
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Empowering TVET institutions and low-connectivity campuses in Kenya and across Africa with resilient, offline-first learning architectures.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4">TVET Programs</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>Electrical & Solar Systems</li>
              <li>Mechanical & Automotive</li>
              <li>ICT & Software Dev</li>
              <li>Hospitality & Culinary Arts</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4">Institution</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="/about" className="hover:underline">About Our Vision</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Faculty</Link></li>
              <li><Link to="/help" className="hover:underline">Local Server Access</Link></li>
              <li><Link to="/catalog" className="hover:underline">Campus Catalog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-4">Resiliency Features</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>Offline-First Sync Engine</li>
              <li>Local Classroom Servers</li>
              <li>Progress Queue Store</li>
              <li>Device-to-Device Sharing</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} JifunzeHub Tech. Built for TVET Resilience.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/compliance" className="hover:underline">Kenya NITA/TVETA Compliance</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
