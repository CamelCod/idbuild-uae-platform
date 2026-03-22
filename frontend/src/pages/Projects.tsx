import { useState } from 'react';
import type { Project } from '../types';

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Luxury Villa Construction - Palm Jumeirah',
    description: 'Complete construction of 5-bedroom luxury villa with swimming pool and garden.',
    category: 'Residential',
    budget: 2500000,
    currency: 'AED',
    location: 'Palm Jumeirah, Dubai',
    status: 'open',
    deadline: '2025-03-15',
    bidsCount: 12,
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Commercial Office Building - DIFC',
    description: 'Modern 10-story office building with retail spaces and parking.',
    category: 'Commercial',
    budget: 8500000,
    currency: 'AED',
    location: 'DIFC, Dubai',
    status: 'bidding',
    deadline: '2025-02-28',
    bidsCount: 8,
    createdAt: '2024-10-28T14:30:00Z',
    updatedAt: '2024-11-02T09:15:00Z',
  },
  {
    id: '3',
    title: 'Residential Complex - Dubai Marina',
    description: '24-unit residential complex with gym, pool, and communal areas.',
    category: 'Residential',
    budget: 5200000,
    currency: 'AED',
    location: 'Dubai Marina, Dubai',
    status: 'open',
    deadline: '2025-04-10',
    bidsCount: 5,
    createdAt: '2024-11-03T08:00:00Z',
    updatedAt: '2024-11-03T08:00:00Z',
  },
  {
    id: '4',
    title: 'Retail Mall Fit-Out - Abu Dhabi',
    description: 'Complete interior fit-out for 2-floor retail mall covering 8,000 sq.m.',
    category: 'Retail',
    budget: 3800000,
    currency: 'AED',
    location: 'Abu Dhabi',
    status: 'open',
    deadline: '2025-05-01',
    bidsCount: 3,
    createdAt: '2024-11-04T10:00:00Z',
    updatedAt: '2024-11-04T10:00:00Z',
  },
];

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-800',
  bidding: 'bg-blue-100 text-blue-800',
  awarded: 'bg-purple-100 text-purple-800',
  completed: 'bg-gray-100 text-gray-800',
};

export default function Projects() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(MOCK_PROJECTS.map((p) => p.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          + Post Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filtered.map((project) => (
          <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{project.description}</p>
                </div>
                <span
                  className={`ml-4 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap ${statusColors[project.status] ?? 'bg-gray-100 text-gray-800'}`}
                >
                  {project.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Budget:</span> {project.currency} {project.budget.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {project.category}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {project.location}
                </div>
                <div>
                  <span className="font-medium">Deadline:</span> {project.deadline}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{project.bidsCount} bids submitted</span>
                <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No projects found matching your search.
        </div>
      )}
    </div>
  );
}
