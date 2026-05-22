import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate as useRouterNavigate } from '@tanstack/react-router';
const Link = RouterLink as any;
const useNavigate = useRouterNavigate as any;
import logoUrl from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../hooks/useCourses';
import { adminService } from '../services/api';
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
import { DataGrid } from '../components/ui/DataGrid';
import { Toast } from '../components/ui/Toast';
import { 
  LayoutDashboard, Server, ShieldCheck, Settings, Users, BookOpen, 
  Cpu, Database, Activity, RefreshCw, LogOut, PlusCircle, Trash2, Edit3, WifiOff, AlertCircle
} from 'lucide-react';

export const Route = {
  options: {
    component: AdminDashboard,
  },
};

type TabType = 'overview' | 'departments' | 'students' | 'lecturers' | 'courses' | 'devices' | 'server' | 'analytics' | 'settings';

function AdminDashboard() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States
  const [departments, setDepartments] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity?: 'success' | 'info' | 'warning' | 'error' }>({ open: false, message: '' });
  const [serverStatus, setServerStatus] = useState({
    cpu: '24%',
    ram: '4.8 GB / 8.0 GB',
    storage: '450 GB / 1.0 TB',
    temp: '42°C',
    network: 'Healthy (1 Gbps Broadcast Mesh)'
  });

  // CRUD states
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevName, setNewDevName] = useState('');
  const [newDevIp, setNewDevIp] = useState('');
  const [newDevType, setNewDevType] = useState<'tablet' | 'laptop' | 'classroom-server'>('tablet');
  const [schoolName, setSchoolName] = useState(user?.institution || 'Naserian TVET Institute');
  const [adminDesignation, setAdminDesignation] = useState(user?.department || 'Main Classroom Host 1');

  const fetchAdminData = async () => {
    try {
      const [depts, devs, platformUsers, platformCourses, platformLogs] = await Promise.all([
        adminService.getDepartments(),
        adminService.getDevices(),
        adminService.getUsers(),
        adminService.getCourses(),
        adminService.getPlatformLogs()
      ]);
      setDepartments(depts);
      setDevices(devs);
      setUsers(platformUsers);
      setCourses(platformCourses);
      setLogs(platformLogs);
    } catch (err) {
      console.error('Failed to load admin fleet status:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleRestartServer = async () => {
    await adminService.addPlatformEvent('SERVER_REBOOT', 'Local Classroom Server reboot signal sent successfully.', 'warning');
    setServerStatus((current) => ({ ...current, cpu: '31%', temp: '44°C' }));
    showToast('Local Classroom Server reboot signal sent successfully.');
    fetchAdminData();
  };

  const handleAddDeptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptName.trim() || !newDeptHead.trim()) {
      showToast('All department fields are required.', 'error');
      return;
    }
    try {
      await adminService.addDepartment(newDeptCode, newDeptName, newDeptHead);
      setNewDeptCode('');
      setNewDeptName('');
      setNewDeptHead('');
      setShowAddDept(false);
      await fetchAdminData();
      showToast('Department created and synced.');
    } catch (err) {
      console.error(err);
      showToast('Failed to save department.', 'error');
    }
  };

  const handleDeleteDept = async (id: string) => {
    try {
      await adminService.deleteDepartment(id);
      await fetchAdminData();
      showToast('Department removed.');
    } catch (err) {
      console.error(err);
      showToast('Department removal failed.', 'error');
    }
  };

  const handleAddDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName.trim() || !newDevIp.trim()) {
      showToast('Device name and IP address are required.', 'error');
      return;
    }
    try {
      await adminService.addDevice(newDevName, newDevIp, newDevType);
      setNewDevName('');
      setNewDevIp('');
      setNewDevType('tablet');
      setShowAddDevice(false);
      await fetchAdminData();
      showToast('Device registered successfully.');
    } catch (err) {
      console.error(err);
      showToast('Failed to register device.', 'error');
    }
  };

  const handleDeleteDevice = async (id: string) => {
    try {
      await adminService.deleteDevice(id);
      await fetchAdminData();
      showToast('Device de-registered.');
    } catch (err) {
      console.error(err);
      showToast('Device removal failed.', 'error');
    }
  };

  const handlePurgeLogs = async () => {
    await adminService.addPlatformEvent('LOG_PURGE', 'Admin requested a local platform log purge.', 'info');
    setLogs([]);
    showToast('Offline sync queue purge recorded.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.addPlatformEvent('SETTINGS_UPDATE', `Updated admin settings for ${schoolName}.`, 'success');
    showToast('System settings saved locally.');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Unauthorized</h1>
        <p className="text-sm text-zinc-500 mt-1 mb-6">You must be logged in to view the Admin Portal.</p>
        <Link to="/login"><Button>Portal Login</Button></Link>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
    { id: 'departments', label: 'Departments', icon: ShieldCheck },
    { id: 'students', label: 'Students Directory', icon: Users },
    { id: 'lecturers', label: 'Faculty Directory', icon: Users },
    { id: 'courses', label: 'TVET Registry', icon: BookOpen },
    { id: 'devices', label: 'Device Fleet', icon: Cpu },
    { id: 'server', label: 'Local Server Node', icon: Server },
    { id: 'analytics', label: 'Sync Analytics', icon: Activity },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 flex flex-col md:flex-row transition-colors">
      
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
              <p className="text-[10px] text-zinc-500">SysAdmin Portal</p>
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
              <button onClick={() => switchRole('student')} className="px-2 py-1 bg-zinc-100 text-zinc-650 rounded hover:bg-zinc-200 cursor-pointer">Student</button>
              <button onClick={() => switchRole('lecturer')} className="px-2 py-1 bg-zinc-100 text-zinc-655 rounded hover:bg-zinc-200 cursor-pointer">Lecturer</button>
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
            className="w-full justify-start text-red-650 hover:bg-red-50 font-bold"
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
              <span className="text-[10px] font-semibold text-zinc-400">System Admin Control › {user.institution}</span>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] flex items-center gap-1">
            <Server className="h-3.5 w-3.5" /> Local Server Node Online
          </Badge>
        </header>

        {/* Tab view containers */}
        <div className="flex-grow p-6 overflow-y-auto">

          {/* SYSTEM OVERVIEW VIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Local Nodes"
                  value="1 Active"
                  icon={<Server className="h-5 w-5" />}
                  description="School server mesh hubs"
                />
                <StatCard
                  title="Connected Fleet"
                  value={`${devices.length} Devices`}
                  icon={<Cpu className="h-5 w-5" />}
                  description="Active client connections"
                />
                <StatCard
                  title="Total Users"
                  value={`${users.length} Accounts`}
                  icon={<Users className="h-5 w-5" />}
                  description="Student, lecturer & admin roles"
                />
                <StatCard
                  title="Daily Sync Rate"
                  value="99.8%"
                  icon={<Activity className="h-5 w-5" />}
                  description="Successful database caches"
                />
              </div>

              {/* Hardware gauges */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-zinc-900">Server Network Broadcast Capacity</h3>
                  <div className="h-40 bg-zinc-50 rounded-xl flex items-end justify-between p-6 pt-10 text-xs">
                    {[
                      { time: '08:00', load: '10%' },
                      { time: '10:00', load: '85%' },
                      { time: '12:00', load: '95%' },
                      { time: '14:00', load: '60%' },
                      { time: '16:00', load: '40%' }
                    ].map((stat, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 flex-grow">
                        <div className="w-8 bg-emerald-500 rounded-t-md" style={{ height: stat.load }} />
                        <span className="text-[10px] text-zinc-400 font-bold">{stat.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-zinc-900">Fleet IP Allocations</h3>
                  <div className="space-y-3">
                    {devices.slice(0, 3).map((dev) => (
                      <div key={dev.id} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-zinc-850">{dev.name}</p>
                          <p className="text-[9px] text-zinc-400">IP: {dev.ipAddress} | {dev.type}</p>
                        </div>
                        <Badge variant={dev.status === 'online' ? 'success' : 'neutral'}>{dev.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEPARTMENTS VIEW */}
          {activeTab === 'departments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">TVET Academic Departments</h3>
                  <p className="text-xs text-zinc-400">Register new disciplines and heads of faculty.</p>
                </div>
                <Button size="sm" onClick={() => setShowAddDept(!showAddDept)} className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> {showAddDept ? 'Close Panel' : 'Add Department'}
                </Button>
              </div>

              {showAddDept && (
                <form onSubmit={handleAddDeptSubmit} className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm animate-fade-in">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">New Department Registry</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input label="Code (e.g., EE)" value={newDeptCode} onChange={e => setNewDeptCode(e.target.value)} />
                    <Input label="Department Name" value={newDeptName} onChange={e => setNewDeptName(e.target.value)} />
                    <Input label="Head of Faculty" value={newDeptHead} onChange={e => setNewDeptHead(e.target.value)} />
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <Button variant="outline" size="sm" onClick={() => setShowAddDept(false)}>Cancel</Button>
                    <Button type="submit" size="sm">Save Department</Button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {departments.map((dept) => (
                  <div key={dept.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between relative group">
                    <button 
                      onClick={() => handleDeleteDept(dept.id)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 cursor-pointer p-1.5 rounded hover:bg-zinc-50 transition-colors"
                      title="Delete Department"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div>
                      <Badge variant="info" className="mb-2">{dept.code}</Badge>
                      <h4 className="font-black text-sm text-zinc-900">{dept.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">Head of Faculty: {dept.headName}</p>
                    </div>

                    <div className="pt-4 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
                      <div>
                        <p className="font-bold text-zinc-800">{dept.coursesCount}</p>
                        <p className="text-[9px] text-zinc-400">Courses</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-800">{dept.studentsCount}</p>
                        <p className="text-[9px] text-zinc-400">Students</p>
                      </div>
                      <div>
                        <p className="font-bold text-zinc-800">{dept.lecturersCount}</p>
                        <p className="text-[9px] text-zinc-400">Lecturers</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STUDENTS VIEW */}
          {activeTab === 'students' && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-zinc-900">Active Student Registry</h3>
              <div className="space-y-3">
                {users.filter((account) => account.role === 'student').slice(0, 8).map((student) => (
                  <div key={student.id} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs">
                    <div>
                      <p className="font-bold text-zinc-900">{student.name}</p>
                      <p className="text-zinc-500">{student.email}</p>
                    </div>
                    <Badge variant="info">{student.department || 'Student'}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LECTURERS VIEW */}
          {activeTab === 'lecturers' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900">Faculty Directory & Credentials</h3>
              <div className="space-y-3">
                {users.filter((account) => account.role === 'lecturer').slice(0, 8).map((lecturer) => (
                  <div key={lecturer.id} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs">
                    <div>
                      <p className="font-bold text-zinc-900">{lecturer.name}</p>
                      <p className="text-zinc-500">{lecturer.email}</p>
                    </div>
                    <Badge variant="success">Verified</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COURSES VIEW */}
          {activeTab === 'courses' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900">Curriculum Registry</h3>
              <div className="space-y-3">
                {courses.slice(0, 8).map((course) => (
                  <div key={course.id} className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs">
                    <div>
                      <p className="font-bold text-zinc-900">{course.title}</p>
                      <p className="text-zinc-500">{course.department} • {course.category}</p>
                    </div>
                    <Badge variant="info">{course.enrolledStudentsCount} enrolled</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEVICES VIEW */}
          {activeTab === 'devices' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">Device Fleet Monitor</h3>
                  <p className="text-xs text-zinc-400">Track tablet, laptop, and server connectivity stats.</p>
                </div>
                <Button size="sm" onClick={() => setShowAddDevice(!showAddDevice)} className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> {showAddDevice ? 'Close Panel' : 'Register Device'}
                </Button>
              </div>

              {showAddDevice && (
                <form onSubmit={handleAddDeviceSubmit} className="bg-zinc-50 border rounded-2xl p-6 space-y-4 animate-fade-in">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">Add New Device Node</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input label="Device Name" value={newDevName} onChange={e => setNewDevName(e.target.value)} />
                    <Input label="IP Address (e.g. 192.168.1.50)" value={newDevIp} onChange={e => setNewDevIp(e.target.value)} />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Device Type</label>
                      <select 
                        value={newDevType} 
                        onChange={e => setNewDevType(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="tablet">Tablet</option>
                        <option value="laptop">Laptop</option>
                        <option value="classroom-server">Classroom Server</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <Button variant="outline" size="sm" onClick={() => setShowAddDevice(false)}>Cancel</Button>
                    <Button type="submit" size="sm">Save Device</Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {devices.map((dev) => (
                  <div key={dev.id} className="p-4 bg-zinc-50 border rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-zinc-900">{dev.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">IP: {dev.ipAddress} | Storage: {dev.storageUsed} used / {dev.storageTotal}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={dev.status === 'online' ? 'success' : 'neutral'}>{dev.status}</Badge>
                      <button 
                        onClick={() => handleDeleteDevice(dev.id)}
                        className="text-zinc-400 hover:text-red-500 cursor-pointer p-1.5 rounded hover:bg-white border transition-colors animate-fade-in"
                        title="Delete Device"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOCAL SERVER NODE VIEW */}
          {activeTab === 'server' && (
            <div className="space-y-6">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-zinc-900">Local Server Spec Sheet</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Manage offline-first broadcast parameters, SQLite caches, and node reboot sequences.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-zinc-50 border rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">CPU Load</span>
                    <p className="font-bold text-base text-zinc-850">{serverStatus.cpu}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 border rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Storage Capacity</span>
                    <p className="font-bold text-base text-zinc-850">{serverStatus.storage}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 border rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Broadcaster Network Mode</span>
                    <p className="font-bold text-zinc-850 text-xs">{serverStatus.network}</p>
                  </div>
                  <div className="p-4 bg-zinc-50 border rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Node Processor Heat</span>
                    <p className="font-bold text-base text-zinc-850">{serverStatus.temp}</p>
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-end gap-3 text-xs font-semibold">
                  <Button variant="outline" onClick={handlePurgeLogs}>Purge Database Logs</Button>
                  <Button onClick={handleRestartServer}>Reboot Classroom Server Node</Button>
                </div>
              </div>
            </div>
          )}

          {/* SYNC ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-zinc-900">Campus Node Synch logs</h3>
              <div className="space-y-3">
                {logs.slice(0, 10).map((log) => (
                  <div key={log.id} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-zinc-900">{log.action}</p>
                      <Badge variant={log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'success'}>{log.level}</Badge>
                    </div>
                    <p className="mt-1 text-zinc-500">{log.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SYSTEM SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-zinc-900">Admin System Parameters</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Toggle local school broadcasting IDs and offline packet allocations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
                <Input label="School Name Identification" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                <Input label="SysAdmin Designation" value={adminDesignation} onChange={(e) => setAdminDesignation(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save System Settings</Button>
              </div>
            </form>
          )}

        </div>
      </main>
      <Toast open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast({ open: false, message: '' })} />
    </div>
  );
}
