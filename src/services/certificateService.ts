import { Certificate } from '../types';
import { dbGetCertificates } from '../mock-db/db';

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const getCurrentUserId = (): string => {
  const userJson = localStorage.getItem('jh_user');
  if (!userJson) return '';
  try {
    return JSON.parse(userJson).id;
  } catch {
    return '';
  }
};

export const certificateService = {
  getCertificates: async (): Promise<Certificate[]> => {
    await delay();
    const userId = getCurrentUserId();
    if (!userId) return [];
    return dbGetCertificates(userId);
  },
  getCertificateByCourse: async (courseId: string): Promise<Certificate | null> => {
    await delay(120);
    const certificates = await certificateService.getCertificates();
    return certificates.find((certificate) => certificate.courseId === courseId) || null;
  }
};
