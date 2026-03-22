import { useState } from 'react';
import type { Auction } from '../types';

const MOCK_AUCTIONS: Auction[] = [
  {
    id: '1',
    title: 'Luxury Villa Construction - Palm Jumeirah',
    currentLowestBid: 2200000,
    startingBudget: 2500000,
    currency: 'AED',
    endsAt: '2025-03-15T18:00:00Z',
    bidsCount: 12,
    category: 'Residential',
    location: 'Palm Jumeirah, Dubai',
    status: 'live',
  },
  {
    id: '2',
    title: 'Commercial Office Building - DIFC',
    currentLowestBid: 7800000,
    startingBudget: 8500000,
    currency: 'AED',
    endsAt: '2025-02-28T12:00:00Z',
    bidsCount: 8,
    category: 'Commercial',
    location: 'DIFC, Dubai',
    status: 'live',
  },
  {
    id: '3',
    title: 'Hospital Wing Extension - Sharjah',
    currentLowestBid: 0,
    startingBudget: 12000000,
    currency: 'AED',
    endsAt: '2025-04-01T09:00:00Z',
    bidsCount: 0,
    category: 'Healthcare',
    location: 'Sharjah',
    status: 'upcoming',
  },
];

const statusBadge: Record<string, string> = {
  live: 'bg-red-100 text-red-700 animate-pulse',
  upcoming: 'bg-yellow-100 text-yellow-700',
  ended: 'bg-gray-100 text-gray-600',
};

function formatCurrency(amount: number, currency: string) {
  if (amount === 0) return 'No bids yet';
  return `${currency} ${amount.toLocaleString()}`;
}

export default function Auctions() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'ended'>('live');

  const filtered = MOCK_AUCTIONS.filter((a) => a.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Live Auctions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compete in real-time reverse auctions to win construction contracts.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {(['live', 'upcoming', 'ended'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Auction Cards */}
      <div className="space-y-4">
        {filtered.map((auction) => (
          <div key={auction.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">{auction.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadge[auction.status]}`}>
                    {auction.status === 'live' ? '● Live' : auction.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Starting Budget</p>
                    <p className="font-medium">{auction.currency} {auction.startingBudget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Lowest Bid</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(auction.currentLowestBid, auction.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Total Bids</p>
                    <p className="font-medium">{auction.bidsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {auction.status === 'upcoming' ? 'Starts' : 'Ends'}
                    </p>
                    <p className="font-medium">{new Date(auction.endsAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {auction.category} · {auction.location}
                </p>
              </div>
              {auction.status === 'live' && (
                <button className="ml-4 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors whitespace-nowrap">
                  Place Bid
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No {activeTab} auctions at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
