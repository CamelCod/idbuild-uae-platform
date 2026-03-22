export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
  status: number;
}

export interface User {
  id: string;
  email: string;
  role: 'contractor' | 'client' | 'admin';
  name: string;
  company?: string;
  location?: string;
  phone?: string;
  avatar?: string;
  verified?: boolean;
  rating?: number;
  totalProjects?: number;
  completedProjects?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  location: string;
  status: 'open' | 'bidding' | 'awarded' | 'completed' | 'cancelled';
  deadline: string;
  requirements?: string[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
  client?: User;
  bidsCount?: number;
  lowestBid?: number;
  averageBid?: number;
}

export interface Bid {
  id: string;
  projectId: string;
  contractorId: string;
  amount: number;
  currency: string;
  timeline: number;
  description: string;
  documents?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  contractor?: {
    name: string;
    rating: number;
    avatar?: string;
    completedProjects: number;
  };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Auction {
  id: string;
  title: string;
  currentLowestBid: number;
  startingBudget: number;
  currency: string;
  endsAt: string;
  bidsCount: number;
  category: string;
  location: string;
  status: 'live' | 'upcoming' | 'ended';
}
