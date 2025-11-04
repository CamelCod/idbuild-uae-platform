// API Configuration for different environments

interface APIConfig {
  baseURL: string;
  socketURL: string;
  environment: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

// Environment detection
const getEnvironment = (): string => {
  return import.meta.env.VITE_APP_ENV || 
         (import.meta.env.PROD ? 'production' : 'development');
};

// API Configuration based on environment
const config: APIConfig = {
  baseURL: import.meta.env.VITE_API_URL || (
    import.meta.env.PROD 
      ? 'https://your-backend-domain.com/api' // Production backend URL
      : 'http://localhost:3004/api' // Development backend URL
  ),
  
  socketURL: import.meta.env.VITE_SOCKET_URL || (
    import.meta.env.PROD 
      ? 'https://your-backend-domain.com' // Production socket URL
      : 'http://localhost:3004' // Development socket URL
  ),
  
  environment: getEnvironment(),
  isProduction: import.meta.env.PROD,
  isDevelopment: !import.meta.env.PROD
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile'
  },
  
  // Projects
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    SEARCH: '/projects/search',
    CATEGORIES: '/projects/categories'
  },
  
  // Bids
  BIDS: {
    LIST: '/bids',
    CREATE: '/bids',
    DETAIL: (id: string) => `/bids/${id}`,
    UPDATE: (id: string) => `/bids/${id}`,
    ACCEPT: (id: string) => `/bids/${id}/accept`,
    REJECT: (id: string) => `/bids/${id}/reject`,
    PROJECT_BIDS: (projectId: string) => `/projects/${projectId}/bids`
  },
  
  // Users
  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    CONTRACTORS: '/users/contractors',
    CONTRACTORS_VERIFY: '/users/contractors/verify'
  },
  
  // Files
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all'
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    PROJECTS: '/analytics/projects',
    BIDS: '/analytics/bids',
    REVENUE: '/analytics/revenue'
  }
};

// Mock data for GitHub Pages testing
const MOCK_DATA = {
  auth: {
    user: {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'contractor',
      company: 'Demo Construction Co.',
      location: 'Dubai, UAE',
      phone: '+971501234567',
      avatar: 'https://via.placeholder.com/150',
      verified: true,
      rating: 4.8,
      totalProjects: 25,
      completedProjects: 22
    },
    token: 'mock-jwt-token-for-testing'
  },
  
  projects: [
    {
      id: '1',
      title: 'Luxury Villa Construction - Palm Jumeirah',
      description: 'Complete construction of 5-bedroom luxury villa with swimming pool and garden',
      category: 'residential',
      budget: 2500000,
      currency: 'AED',
      location: 'Palm Jumeirah, Dubai',
      status: 'open',
      deadline: '2025-03-15',
      requirements: ['Valid trade license', 'UAE residency', 'Minimum 5 years experience'],
      documents: ['architectural-plans.pdf', 'specifications.pdf'],
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-11-01T10:00:00Z',
      client: {
        id: 'c1',
        name: 'Ahmed Al-Mansouri',
        email: 'ahmed@example.com',
        company: 'Al-Mansouri Properties',
        avatar: 'https://via.placeholder.com/100'
      },
      bidsCount: 12,
      lowestBid: 2200000,
      averageBid: 2350000
    },
    {
      id: '2',
      title: 'Commercial Office Building - DIFC',
      description: 'Modern 10-story office building with retail spaces and parking',
      category: 'commercial',
      budget: 8500000,
      currency: 'AED',
      location: 'DIFC, Dubai',
      status: 'bidding',
      deadline: '2025-02-28',
      requirements: ['Class A contractor license', 'ISO certification', 'Insurance coverage'],
      documents: ['dIFC-building-plans.pdf', 'mep-specifications.pdf'],
      createdAt: '2024-10-28T14:30:00Z',
      updatedAt: '2024-11-02T09:15:00Z',
      client: {
        id: 'c2',
        name: 'Sarah Johnson',
        email: 'sarah@propertydev.ae',
        'company': 'Property Development LLC',
        avatar: 'https://via.placeholder.com/100'
      },
      bidsCount: 8,
      lowestBid: 7800000,
      averageBid: 8100000
    }
  ],
  
  bids: [
    {
      id: '1',
      projectId: '1',
      contractorId: '1',
      amount: 2200000,
      currency: 'AED',
      timeline: 180, // days
      description: 'Complete construction with premium materials and 2-year warranty',
      documents: ['technical-proposal.pdf', 'company-profile.pdf'],
      status: 'pending',
      createdAt: '2024-11-02T16:45:00Z',
      contractor: {
        name: 'Demo Construction Co.',
        rating: 4.8,
        avatar: 'https://via.placeholder.com/100',
        completedProjects: 22
      }
    }
  ],
  
  notifications: [
    {
      id: '1',
      type: 'bid_accepted',
      title: 'Bid Accepted!',
      message: 'Your bid for Luxury Villa Construction has been accepted',
      read: false,
      createdAt: '2024-11-03T11:30:00Z'
    },
    {
      id: '2',
      type: 'new_project',
      title: 'New Project Available',
      message: 'Commercial Office Building in DIFC matches your skills',
      read: true,
      createdAt: '2024-11-02T09:15:00Z'
    }
  ]
};

// Test mode configuration
const isTestMode = () => {
  return config.environment === 'github-pages' || 
         config.environment === 'test' ||
         (typeof window !== 'undefined' && window.location.hostname === 'localhost');
};

export const API_CONFIG = {
  ...config,
  MOCK_DATA,
  isTestMode: isTestMode(),
  
  // Helper methods
  getFullUrl: (endpoint: string): string => {
    if (isTestMode()) {
      // Return mock data for GitHub Pages testing
      return endpoint;
    }
    return `${config.baseURL}${endpoint}`;
  },
  
  getSocketUrl: (): string => {
    if (isTestMode()) {
      // Mock socket URL for testing
      return 'wss://mock-socket.com';
    }
    return config.socketURL;
  },
  
  // Validation
  isValidEnvironment: (env: string): boolean => {
    return ['development', 'staging', 'production', 'github-pages', 'test'].includes(env);
  }
};

export default API_CONFIG;