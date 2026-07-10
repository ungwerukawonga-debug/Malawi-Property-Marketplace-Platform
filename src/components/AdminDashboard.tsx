/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, PropertyCategory, ListingType, PropertyStatus, Booking, Enquiry, Review } from '../types';
import { MALAWI_DISTRICTS } from '../data';
import { ShieldAlert, CheckCircle, XCircle, Users, Image, MessageSquare, Plus, Trash2, Folder, Landmark, Layers, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
  bookings: Booking[];
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
}

export default function AdminDashboard({
  properties,
  bookings,
  onApproveProperty,
  onRejectProperty,
  onDeleteProperty
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'reviews' | 'categories'>('approvals');

  // Local state for adding custom categories or locations
  const [categoriesList, setCategoriesList] = useState<string[]>(Object.values(PropertyCategory));
  const [newCategoryName, setNewCategoryName] = useState('');
  const [locationsList, setLocationsList] = useState<string[]>(MALAWI_DISTRICTS);
  const [newLocationName, setNewLocationName] = useState('');

  // Filtering properties awaiting approval
  const pendingProperties = properties.filter(p => !p.isApproved);
  const approvedProperties = properties.filter(p => p.isApproved);

  // Flat reviews collection from all properties for moderation
  const allReviews: { propId: string; propName: string; review: Review }[] = [];
  properties.forEach(p => {
    if (p.reviews) {
      p.reviews.forEach(r => {
        allReviews.push({ propId: p.id, propName: p.name, review: r });
      });
    }
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    if (categoriesList.includes(newCategoryName)) {
      alert("Category already exists!");
      return;
    }
    setCategoriesList([...categoriesList, newCategoryName]);
    setNewCategoryName('');
    alert(`Category "${newCategoryName}" appended to sitemaps!`);
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationName) return;
    if (locationsList.includes(newLocationName)) {
      alert("Location already exists!");
      return;
    }
    setLocationsList([...locationsList, newLocationName]);
    setNewLocationName('');
    alert(`Location "${newLocationName}" appended successfully!`);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="admin-dashboard-root">
      {/* Top Welcome Title */}
      <div className="bg-slate-900 text-white py-10 px-6 sm:px-12 border-b border-slate-800" id="admin-header">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="bg-rose-600/30 text-rose-300 font-mono text-xs px-2.5 py-1 rounded-full border border-rose-500/30">
              System Administrator Access
            </span>
            <span className="bg-indigo-600/30 text-indigo-300 font-mono text-xs px-2.5 py-1 rounded-full border border-indigo-500/30">
              Root Console
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white mt-3">
            Platform Operations Panel
          </h1>
          <p className="text-slate-300 text-sm mt-1 font-sans">
            Oversee system verification logs, approve pending owner property certificates, configure dynamic locations, and moderate customer reviews.
          </p>
        </div>
      </div>

      {/* Tabs Selector Row */}
      <div className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-8 overflow-x-auto">
            {[
              { id: 'approvals', label: `Pending Approvals (${pendingProperties.length})`, icon: <ShieldAlert className="w-4 h-4" /> },
              { id: 'users', label: 'All Platform Listings', icon: <Users className="w-4 h-4" /> },
              { id: 'reviews', label: 'Moderate Reviews', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'categories', label: 'Categories & Locations', icon: <Layers className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-sans text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                id={`admin-tab-${tab.id}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" id="admin-workspace">
        {/* TAB 1: PENDING LISTINGS MODERATION APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6" id="admin-approvals-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Property Verification Queue</h3>

              <div className="divide-y divide-slate-100">
                {pendingProperties.map((prop) => (
                  <div key={prop.id} className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-sans font-bold text-sm text-slate-800">{prop.name}</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm">Awaiting Review</span>
                      </div>
                      <p className="text-xs text-slate-500 font-sans leading-relaxed">
                        Uploaded by Owner: <strong>{prop.ownerName}</strong> ({prop.ownerEmail}) <br />
                        Location: {prop.area}, {prop.city} • Price: {prop.currency} {prop.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-400 font-sans italic max-w-2xl">
                        "{prop.description}"
                      </p>
                    </div>

                    {/* Operational Approvals buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onApproveProperty(prop.id);
                          alert(`Property "${prop.name}" approved and is now LIVE for visitors!`);
                        }}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve & Publish
                      </button>
                      <button
                        onClick={() => {
                          onRejectProperty(prop.id);
                          alert(`Property "${prop.name}" rejected.`);
                        }}
                        className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {pendingProperties.length === 0 && (
                  <div className="text-center py-12 text-slate-400 italic">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    All properties verified. Approvals queue is completely clean!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM PLATFORM PROPERTIES */}
        {activeTab === 'users' && (
          <div className="space-y-6" id="admin-users-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Active Live Properties Directory</h3>

              <div className="divide-y divide-slate-100">
                {approvedProperties.map((prop) => (
                  <div key={prop.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={prop.images[0]} alt={prop.name} className="w-14 h-10 object-cover rounded-md" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-sm font-sans font-bold text-slate-800">{prop.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">Owner: {prop.ownerName} | City: {prop.city}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-700">MWK {prop.price.toLocaleString()}</span>
                      <button
                        onClick={() => {
                          onDeleteProperty(prop.id);
                          alert(`Property "${prop.name}" deleted from system registry.`);
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all"
                        title="Delete listing permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {approvedProperties.length === 0 && (
                  <p className="text-sm text-slate-400 italic text-center py-8">No live approved listings in directory.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6" id="admin-reviews-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Review Moderation Log</h3>

              <div className="divide-y divide-slate-100">
                {allReviews.map((item, idx) => (
                  <div key={idx} className="py-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-sm text-slate-800">{item.review.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Date: {item.review.date}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-sans">
                      Regarding Property: <strong>{item.propName}</strong>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg font-sans">
                      "{item.review.comment}"
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => alert("Comment flag saved. Escalated to operations.")}
                        className="text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold py-1 px-3 rounded-lg"
                      >
                        Flag Review
                      </button>
                      <button
                        onClick={() => alert("Review marked safe.")}
                        className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold py-1 px-3 rounded-lg"
                      >
                        Mark Safe
                      </button>
                    </div>
                  </div>
                ))}

                {allReviews.length === 0 && (
                  <p className="text-sm text-slate-400 italic py-8 text-center">No reviews submitted on properties yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES AND LOCATIONS CONFIGURATOR */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="admin-categories-tab">
            {/* Dynamic Categories Editor */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Folder className="w-5 h-5 text-indigo-500" />
                Property Categories
              </h3>

              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Warehouses, Industrial spaces..."
                  className="flex-1 text-xs p-2 rounded-lg border border-slate-200 text-slate-800"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {categoriesList.map((cat, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-800 text-xs font-sans px-3 py-1 rounded-md border border-indigo-100 flex items-center gap-1.5">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic Locations Editor */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-rose-500" />
                Malawi Districts Location Directory
              </h3>

              <form onSubmit={handleAddLocation} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Machinga, Balaka..."
                  className="flex-1 text-xs p-2 rounded-lg border border-slate-200 text-slate-800"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                />
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {locationsList.map((loc, idx) => (
                  <span key={idx} className="bg-rose-50 text-rose-800 text-xs font-sans px-3 py-1 rounded-md border border-rose-100 flex items-center gap-1.5">
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
