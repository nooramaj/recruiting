import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  salary: string;
  age: number;
  category: string;
  postedAt: number;
  isUserPosted: boolean;
}

interface JobContextValue {
  jobs: Job[];
  userJobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'postedAt' | 'isUserPosted'>) => void;
  removeJob: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredJobs: Job[];
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  userName: string;
  setUserName: (n: string) => void;
}

const JobContext = createContext<JobContextValue | null>(null);

const STORAGE_KEY = '@freelance_jo_jobs';
const AUTH_KEY = '@freelance_jo_auth';

const DEFAULT_JOBS: Job[] = [
  { id: '1', title: 'Dentist', location: 'Amman', description: 'Looking for a skilled dentist for a private clinic. Must have 3+ years experience with cosmetic dentistry.', salary: '50', age: 25, category: 'Healthcare', postedAt: Date.now() - 86400000, isUserPosted: false },
  { id: '2', title: 'Waiter', location: 'Irbid', description: 'Full-time waiter needed for a busy restaurant in downtown Irbid. Evening shifts available.', salary: '10', age: 18, category: 'Hospitality', postedAt: Date.now() - 172800000, isUserPosted: false },
  { id: '3', title: 'Photographer', location: 'Amman', description: 'Freelance photographer for wedding events and corporate photoshoots. Must have own equipment.', salary: '15', age: 20, category: 'Creative', postedAt: Date.now() - 259200000, isUserPosted: false },
  { id: '4', title: 'Gardener', location: 'Ajloun', description: 'Part-time gardener for a large estate. Experience with landscape design is a plus.', salary: '8', age: 18, category: 'Services', postedAt: Date.now() - 345600000, isUserPosted: false },
  { id: '5', title: 'Electrician', location: 'AL-Zarqaa', description: 'Licensed electrician for residential and commercial projects. Must be certified.', salary: '11', age: 21, category: 'Technical', postedAt: Date.now() - 432000000, isUserPosted: false },
  { id: '6', title: 'Secretary', location: 'Amman', description: 'Office secretary for a law firm. Strong communication skills and MS Office proficiency required.', salary: '21', age: 22, category: 'Office', postedAt: Date.now() - 518400000, isUserPosted: false },
  { id: '7', title: 'Hairdresser', location: 'Irbid', description: 'Experienced hairdresser for a modern salon. Both male and female styling.', salary: '16', age: 19, category: 'Services', postedAt: Date.now() - 604800000, isUserPosted: false },
  { id: '8', title: 'Chef', location: 'Aqaba', description: 'Head chef for a seafood restaurant. Must specialize in Mediterranean cuisine.', salary: '14', age: 23, category: 'Hospitality', postedAt: Date.now() - 691200000, isUserPosted: false },
];

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setJobs(parsed);
          }
        }
        const auth = await AsyncStorage.getItem(AUTH_KEY);
        if (auth) {
          const authData = JSON.parse(auth);
          setIsLoggedIn(authData.isLoggedIn || false);
          setUserName(authData.userName || '');
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(jobs)).catch(() => {});
  }, [jobs]);

  useEffect(() => {
    AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ isLoggedIn, userName })).catch(() => {});
  }, [isLoggedIn, userName]);

  const addJob = useCallback((job: Omit<Job, 'id' | 'postedAt' | 'isUserPosted'>) => {
    const newJob: Job = {
      ...job,
      id: generateId(),
      postedAt: Date.now(),
      isUserPosted: true,
    };
    setJobs(prev => [newJob, ...prev]);
  }, []);

  const removeJob = useCallback((id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
  }, []);

  const userJobs = useMemo(() => jobs.filter(j => j.isUserPosted), [jobs]);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const q = searchQuery.toLowerCase();
    return jobs.filter(
      j => j.title.toLowerCase().includes(q) ||
           j.location.toLowerCase().includes(q) ||
           j.category.toLowerCase().includes(q)
    );
  }, [jobs, searchQuery]);

  const value = useMemo(() => ({
    jobs, userJobs, addJob, removeJob, searchQuery, setSearchQuery, filteredJobs, isLoggedIn, setIsLoggedIn, userName, setUserName,
  }), [jobs, userJobs, addJob, removeJob, searchQuery, filteredJobs, isLoggedIn, userName]);

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error('useJobs must be used within JobProvider');
  return ctx;
}
