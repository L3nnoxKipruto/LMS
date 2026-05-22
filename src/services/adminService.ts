import { Course, Department, Device, PlatformLog, User } from '../types';
import { 
  dbGetDepartments, dbAddDepartment, dbDeleteDepartment, 
  dbGetDevices, dbAddDevice, dbDeleteDevice, dbGetUsers, dbGetCourses,
  dbGetPlatformLogs, dbAddPlatformLog
} from '../mock-db/db';

const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  getDepartments: async (): Promise<Department[]> => {
    await delay(150);
    return dbGetDepartments();
  },
  addDepartment: async (code: string, name: string, headName: string): Promise<Department> => {
    await delay(200);
    return dbAddDepartment(code, name, headName);
  },
  deleteDepartment: async (id: string): Promise<void> => {
    await delay(150);
    dbDeleteDepartment(id);
  },
  getDevices: async (): Promise<Device[]> => {
    await delay(150);
    return dbGetDevices();
  },
  addDevice: async (name: string, ipAddress: string, type: 'tablet' | 'laptop' | 'classroom-server'): Promise<Device> => {
    await delay(200);
    return dbAddDevice(name, ipAddress, type);
  },
  deleteDevice: async (id: string): Promise<void> => {
    await delay(150);
    dbDeleteDevice(id);
  },
  getUsers: async (): Promise<User[]> => {
    await delay(150);
    return dbGetUsers().map(({ password, ...user }) => user);
  },
  getCourses: async (): Promise<Course[]> => {
    await delay(150);
    return dbGetCourses();
  },
  getPlatformLogs: async (): Promise<PlatformLog[]> => {
    await delay(120);
    return dbGetPlatformLogs();
  },
  addPlatformEvent: async (action: string, description: string, level: PlatformLog['level'] = 'info') => {
    await delay(100);
    const log = {
      id: `admin_log_${Date.now()}`,
      action,
      description,
      level,
      timestamp: new Date().toISOString()
    };
    dbAddPlatformLog(log);
    return log;
  }
};
