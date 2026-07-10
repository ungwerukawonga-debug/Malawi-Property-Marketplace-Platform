/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Property, PropertyCategory, ListingType, PropertyStatus, Booking, Enquiry, OwnerProfile, SubscriptionPlan } from '../types';
import { MALAWI_DISTRICTS, SUBSCRIPTION_PLANS } from '../data';
import { PlusCircle, List, Calendar, BarChart3, Settings, HelpCircle, MessageSquare, CheckCircle, Trash2, Edit, Play, Pause, ChevronRight, Sparkles, MessageCircle, DollarSign, Eye, ToggleLeft, ToggleRight, FileText, UploadCloud, X } from 'lucide-react';

interface OwnerDashboardProps {
  properties: Property[];
  bookings: Booking[];
  enquiries: Enquiry[];
  ownerProfile: OwnerProfile;
  onAddProperty: (newProp: Property) => void;
  onUpdatePropertyStatus: (propertyId: string, status: PropertyStatus) => void;
  onDeleteProperty: (propertyId: string) => void;
  onUpdateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  onUpdateOwnerProfile: (profile: OwnerProfile) => void;
  onAddReplyToEnquiry: (enquiryId: string, reply: string) => void;
}

export default function OwnerDashboard({
  properties,
  bookings,
  enquiries,
  ownerProfile,
  onAddProperty,
  onUpdatePropertyStatus,
  onDeleteProperty,
  onUpdateBookingStatus,
  onUpdateOwnerProfile,
  onAddReplyToEnquiry
}: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'enquiries' | 'settings'>('overview');

  // New property form state
  const [newPropName, setNewPropName] = useState('');
  const [newPropCategory, setNewPropCategory] = useState<PropertyCategory>(PropertyCategory.HOUSE_RENT);
  const [newPropListingType, setNewPropListingType] = useState<ListingType>(ListingType.RENT);
  const [newPropPrice, setNewPropPrice] = useState<number>(350000);
  const [newPropDescription, setNewPropDescription] = useState('');
  const [newPropNegotiable, setNewPropNegotiable] = useState(true);
  const [newPropBedrooms, setNewPropBedrooms] = useState(3);
  const [newPropBathrooms, setNewPropBathrooms] = useState(2);
  const [newPropDistrict, setNewPropDistrict] = useState('Lilongwe');
  const [newPropCity, setNewPropCity] = useState('Lilongwe');
  const [newPropArea, setNewPropArea] = useState('Area 18');
  const [newPropLandmark, setNewPropLandmark] = useState('Near Shopping Complex');
  const [newPropInternet, setNewPropInternet] = useState(true);
  const [newPropWater, setNewPropWater] = useState(true);
  const [newPropElectricity, setNewPropElectricity] = useState(true);
  const [newPropSecurity, setNewPropSecurity] = useState('Secure gate with guards');
  const [newPropAmenities, setNewPropAmenities] = useState<string>('Prepaid Escom, reserve tank');
  const [newPropRules, setNewPropRules] = useState<string>('No subletting');
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>('https://picsum.photos/seed/house_owner1/800/600');

  // Reply message text state map
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Local owner properties filter
  const ownerProperties = properties.filter(p => p.ownerName === ownerProfile.name);
  const ownerBookings = bookings.filter(b => ownerProperties.some(p => p.id === b.propertyId));
  const ownerEnquiries = enquiries.filter(e => ownerProperties.some(p => p.id === e.propertyId));

  // Calculated metrics
  const totalListings = ownerProperties.length;
  const activeListingsCount = ownerProperties.filter(p => p.status === PropertyStatus.AVAILABLE).length;
  const totalRevenueEarned = ownerBookings
    .filter(b => b.status === 'Paid' || b.status === 'Completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const totalViewsCount = ownerProperties.reduce((sum, p) => sum + p.viewsCount, 0);

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();

    // Check active subscription limits
    const currentPlan = SUBSCRIPTION_PLANS.find(p => p.name === ownerProfile.subscriptionPlan);
    const limit = currentPlan ? currentPlan.listingsLimit : 1;
    if (ownerProperties.length >= limit) {
      alert(`Subscription Limit Reached!\nYour current "${ownerProfile.subscriptionPlan}" plan permits up to ${limit} active listings. Please upgrade your subscription plan in settings.`);
      return;
    }

    const newProp: Property = {
      id: `prop-${Math.floor(Math.random() * 100000)}`,
      name: newPropName,
      category: newPropCategory,
      listingType: newPropListingType,
      status: PropertyStatus.AVAILABLE,
      description: newPropDescription,
      price: newPropPrice,
      currency: 'MWK',
      negotiable: newPropNegotiable,
      bedrooms: newPropBedrooms,
      bathrooms: newPropBathrooms,
      parking: true,
      kitchen: true,
      internet: newPropInternet,
      water: newPropWater,
      electricity: newPropElectricity,
      security: newPropSecurity,
      amenities: newPropAmenities.split(',').map(s => s.trim()).filter(Boolean),
      rules: newPropRules.split(',').map(s => s.trim()).filter(Boolean),
      images: [selectedImagePreset],
      district: newPropDistrict,
      city: newPropCity,
      area: newPropArea,
      landmark: newPropLandmark,
      latitude: -13.96,
      longitude: 33.78,
      ownerName: ownerProfile.name,
      ownerEmail: ownerProfile.email,
      ownerPhone: ownerProfile.phone,
      ownerWhatsApp: ownerProfile.whatsApp.replace('+', ''),
      isApproved: true, // Auto-approved in demo for instant gratification
      viewsCount: 0,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      reviews: []
    };

    onAddProperty(newProp);
    alert(`Property listing "${newPropName}" created successfully!`);
    setActiveTab('listings');

    // Reset Form
    setNewPropName('');
    setNewPropDescription('');
    setNewPropPrice(350000);
  };

  const handleReplySubmit = (enqId: string) => {
    const text = replyTextMap[enqId];
    if (!text) return;
    onAddReplyToEnquiry(enqId, text);
    setReplyTextMap(prev => ({ ...prev, [enqId]: '' }));
    alert("Reply sent to customer directly!");
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="owner-dashboard-root">
      {/* Top Welcome Panel */}
      <div className="bg-slate-900 text-white py-10 px-6 sm:px-12 border-b border-slate-800" id="owner-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600/30 text-indigo-300 font-mono text-xs px-2.5 py-1 rounded-full border border-indigo-500/30">
                Active Owner Account
              </span>
              <span className="bg-emerald-600/20 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                Subscription: {ownerProfile.subscriptionPlan} Plan
              </span>
            </div>
            <h1 className="text-3xl font-sans font-bold text-white mt-3">
              Moni, {ownerProfile.name}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 font-sans">
              Welcome to your personal properties command desk. Oversee your Malawian rentals, track payments, and review direct WhatsApp enquiries.
            </p>
          </div>

          <button
            onClick={() => {
              // Trigger a preset filled property for fast uploader testing
              setNewPropName('Fully Furnished Bed Sitter - Area 18');
              setNewPropPrice(200000);
              setNewPropDescription('Cozy and fully furnished private bed sitter flat in safe Area 18. Includes single-phase ESCOM meter, prepaid, 2500L reserve water tank, and safe car park.');
              setActiveTab('listings');
              setTimeout(() => {
                const el = document.getElementById('new-listing-form-container');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 200);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-4 rounded-xl text-sm font-sans font-bold transition-all shadow-md cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            Quick Listing Setup
          </button>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'listings', label: 'My Listings', icon: <List className="w-4 h-4" /> },
              { id: 'bookings', label: 'Bookings & Receipts', icon: <Calendar className="w-4 h-4" /> },
              { id: 'enquiries', label: 'Customer Enquiries', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'settings', label: 'Payout & Wallet Details', icon: <Settings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-sans text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                id={`owner-tab-${tab.id}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8" id="owner-workspace">
        {/* TAB 1: OVERVIEW & PERFORMANCE ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8" id="owner-overview-tab">
            {/* Stats Row Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'My Total Properties', val: totalListings, desc: `${activeListingsCount} Available Today`, color: 'border-slate-100', icon: <List className="w-5 h-5 text-indigo-600" /> },
                { title: 'Consolidated Revenue', val: `MWK ${totalRevenueEarned.toLocaleString()}`, desc: 'From mobile checkout stays', color: 'border-slate-100', icon: <DollarSign className="w-5 h-5 text-emerald-600" /> },
                { title: 'Aggregate Profile Views', val: totalViewsCount, desc: 'Across active properties', color: 'border-slate-100', icon: <Eye className="w-5 h-5 text-sky-600" /> },
                { title: 'Pending Enquiries', val: ownerEnquiries.filter(e => !e.replied).length, desc: 'Requires immediate attention', color: 'border-slate-100', icon: <MessageSquare className="w-5 h-5 text-amber-600" /> }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase">{item.title}</span>
                    <span className="p-1.5 bg-slate-50 rounded-lg">{item.icon}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">{item.val}</h3>
                  <span className="text-xs text-slate-400 mt-1 block">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* Custom Responsive SVG Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="owner-charts-container">
              {/* Chart 1: Monthly Bookings Overviews */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Stays Reservation Ledger (Monthly)</h4>
                {/* SVG Graph */}
                <div className="aspect-16/9 w-full bg-slate-50 rounded-xl p-4 flex flex-col justify-between border border-slate-100">
                  <div className="flex-1 flex items-end justify-between gap-2 px-4 pt-4 relative">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      {[1, 2, 3].map(g => <div key={g} className="border-t border-slate-200 w-full h-0"></div>)}
                    </div>
                    {[
                      { m: 'Jan', val: 12 }, { m: 'Feb', val: 15 }, { m: 'Mar', val: 8 },
                      { m: 'Apr', val: 18 }, { m: 'May', val: 24 }, { m: 'Jun', val: 32 }, { m: 'Jul', val: 19 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10">
                        <div
                          className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t-xs transition-all duration-300"
                          style={{ height: `${item.val * 3}px` }}
                          title={`${item.val} stays`}
                        ></div>
                        <span className="text-[10px] font-mono text-slate-500">{item.m}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-2 text-xs text-slate-400">Total stays reservation requests compiled across Mangochi & Lilongwe.</div>
                </div>
              </div>

              {/* Chart 2: Rental Performance views comparison */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-4">Aggregate Property Views comparison</h4>
                <div className="aspect-16/9 w-full bg-slate-50 rounded-xl p-4 flex flex-col justify-between border border-slate-100">
                  <div className="flex-1 flex flex-col justify-around px-4">
                    {ownerProperties.map((prop, pIdx) => (
                      <div key={pIdx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 font-medium truncate max-w-[200px]">{prop.name}</span>
                          <span className="font-mono font-semibold text-slate-800">{prop.viewsCount} views</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, (prop.viewsCount / 650) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {ownerProperties.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-8">Create properties to start tracking view statistics.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY LISTINGS & NEW PROPERTY WIZARD */}
        {activeTab === 'listings' && (
          <div className="space-y-8" id="owner-listings-tab">
            {/* Listing List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Listed Properties</h3>

              <div className="space-y-4">
                {ownerProperties.map((prop) => (
                  <div key={prop.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={prop.images[0]} alt={prop.name} className="w-16 h-12 object-cover rounded-md" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-sm font-sans font-bold text-slate-800">{prop.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1 items-center">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-sm">{prop.category}</span>
                          <span className="text-xs font-semibold text-indigo-600">MWK {prop.price.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400">• Created: {prop.createdDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Change Property Availability & Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex flex-col">
                        <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Interactive Status</label>
                        <select
                          className="text-xs py-1 px-2.5 rounded-md border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-hidden"
                          value={prop.status}
                          onChange={(e) => onUpdatePropertyStatus(prop.id, e.target.value as PropertyStatus)}
                        >
                          {Object.values(PropertyStatus).map((status, sIdx) => (
                            <option key={sIdx} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => onDeleteProperty(prop.id)}
                        className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {ownerProperties.length === 0 && (
                  <p className="text-sm text-slate-400 italic py-8 text-center">No properties uploaded yet. Use the creation wizard below.</p>
                )}
              </div>
            </div>

            {/* Listing Creator Wizard Form */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-6" id="new-listing-form-container">
              <div>
                <span className="bg-indigo-50 text-indigo-600 text-xs font-mono px-2.5 py-1 rounded-md uppercase font-semibold">Listing Creator Wizard</span>
                <h3 className="text-lg font-sans font-bold text-slate-900 mt-2">Publish New Property Listing</h3>
                <p className="text-xs text-slate-500 mt-1">Provide precise property information. Free plans support up to 1 property, premium supports 20.</p>
              </div>

              <form onSubmit={handleCreateProperty} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Property Name */}
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide block mb-1">Property Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spacious 2-Bedroom Apartment Area 18"
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      value={newPropName}
                      onChange={(e) => setNewPropName(e.target.value)}
                    />
                  </div>

                  {/* Pricing */}
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide block mb-1">Asking Price (MWK)</label>
                    <input
                      type="number"
                      required
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      value={newPropPrice}
                      onChange={(e) => setNewPropPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide block mb-1">Property Category</label>
                    <select
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden cursor-pointer"
                      value={newPropCategory}
                      onChange={(e) => setNewPropCategory(e.target.value as PropertyCategory)}
                    >
                      {Object.values(PropertyCategory).map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Listing Type */}
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide block mb-1">Agreement Type</label>
                    <select
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden cursor-pointer"
                      value={newPropListingType}
                      onChange={(e) => setNewPropListingType(e.target.value as ListingType)}
                    >
                      {Object.values(ListingType).map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Negotiable Option */}
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={newPropNegotiable}
                        onChange={(e) => setNewPropNegotiable(e.target.checked)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Is Price Negotiable?
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Location Area & City */}
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">District Location</label>
                    <select
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden cursor-pointer"
                      value={newPropDistrict}
                      onChange={(e) => setNewPropDistrict(e.target.value)}
                    >
                      {MALAWI_DISTRICTS.map((dist, idx) => (
                        <option key={idx} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">City / Town</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lilongwe"
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      value={newPropCity}
                      onChange={(e) => setNewPropCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">Area / Suburb Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Area 18, Soche, Chinamwali"
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      value={newPropArea}
                      onChange={(e) => setNewPropArea(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">Local Notable Landmark</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Near Area 18 filling station"
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      value={newPropLandmark}
                      onChange={(e) => setNewPropLandmark(e.target.value)}
                    />
                  </div>
                </div>

                {/* Description and specifications */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">Property Description Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide a convincing overview of features, backup facilities, garden, environment..."
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden resize-none"
                    value={newPropDescription}
                    onChange={(e) => setNewPropDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      value={newPropBedrooms}
                      onChange={(e) => setNewPropBedrooms(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      value={newPropBathrooms}
                      onChange={(e) => setNewPropBathrooms(Number(e.target.value))}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">Physical Security Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Gated compound, electric wire, CCTV"
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                      value={newPropSecurity}
                      onChange={(e) => setNewPropSecurity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Backups & Infrastructure */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block">Infrastructure & Backups</label>
                  <div className="flex flex-wrap gap-6 text-sm text-slate-600 font-sans">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPropInternet}
                        onChange={(e) => setNewPropInternet(e.target.checked)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Active Fibre Internet / Wi-Fi
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPropWater}
                        onChange={(e) => setNewPropWater(e.target.checked)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Water Reservoirs (Tank Fitted)
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPropElectricity}
                        onChange={(e) => setNewPropElectricity(e.target.checked)}
                        className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Generator or Solar Electricity Backups
                    </label>
                  </div>
                </div>

                {/* Simulated Image Preset selection */}
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-2">Simulated Image Preset Gallery</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { id: 'house_owner1', url: 'https://picsum.photos/seed/house_owner1/800/600', label: 'Contemporary Suburban' },
                      { id: 'house_owner2', url: 'https://picsum.photos/seed/house_owner2/800/600', label: 'Apartment Exterior' },
                      { id: 'house_owner3', url: 'https://picsum.photos/seed/house_owner3/800/600', label: 'Lakeside Cabin' },
                      { id: 'house_owner4', url: 'https://picsum.photos/seed/house_owner4/800/600', label: 'Modern Office Block' }
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setSelectedImagePreset(preset.url)}
                        className={`relative rounded-lg overflow-hidden border-2 text-left group transition-all duration-200 ${
                          selectedImagePreset === preset.url ? 'border-indigo-600 scale-95 shadow-md' : 'border-slate-200'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="aspect-4/3 w-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-white font-sans text-[10px] px-2 py-1 truncate">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Additional Amenities (separated by comma)</label>
                    <input
                      type="text"
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 text-slate-800"
                      placeholder="e.g. Air Conditioning, Borehole, Fitted wardrobe"
                      value={newPropAmenities}
                      onChange={(e) => setNewPropAmenities(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Listing Rules / T&C (separated by comma)</label>
                    <input
                      type="text"
                      className="w-full text-sm p-2.5 rounded-lg border border-slate-200 text-slate-800"
                      placeholder="e.g. Deposit required, Pets allowed"
                      value={newPropRules}
                      onChange={(e) => setNewPropRules(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-sm sm:text-base transition-all cursor-pointer shadow-md"
                >
                  Publish Property Directly
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS LEDGER */}
        {activeTab === 'bookings' && (
          <div className="space-y-6" id="owner-bookings-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Hospitality Reservations</h3>

              <div className="divide-y divide-slate-100">
                {ownerBookings.map((book) => (
                  <div key={book.id} className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-sans font-bold text-sm text-slate-800">{book.customerName}</span>
                        <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-md ${
                          book.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {book.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-sans">
                        Property: <strong>{book.propertyName}</strong>
                      </p>
                      <p className="text-xs text-slate-400 font-sans">
                        Stay: <strong>{book.startDate}</strong> to <strong>{book.endDate}</strong> • Cost: MWK {book.totalPrice.toLocaleString()}
                      </p>
                    </div>

                    {/* Receipt Downloads and Reservation State Change */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => alert(`Generated Invoice ${book.invoiceNumber} as PDF successfully.`)}
                        className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-sans"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        Invoice
                      </button>
                      {book.status === 'Paid' && (
                        <button
                          onClick={() => alert(`Generated Receipt ${book.receiptNumber} as PDF successfully.`)}
                          className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-sans"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Receipt
                        </button>
                      )}

                      {/* State changing actions for owner */}
                      {book.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdateBookingStatus(book.id, 'Confirmed')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(book.id, 'Cancelled')}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold py-1.5 px-3 rounded-lg"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {ownerBookings.length === 0 && (
                  <p className="text-sm text-slate-400 italic py-8 text-center">No active bookings registered for your properties.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER ENQUIRIES & DIRECT REPLIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6" id="owner-enquiries-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Direct Property Enquiries</h3>

              <div className="divide-y divide-slate-100">
                {ownerEnquiries.map((enq) => (
                  <div key={enq.id} className="py-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-sans font-bold text-sm text-slate-800">{enq.customerName}</span>
                        <span className="text-xs text-slate-400 block sm:inline sm:ml-2">• {enq.customerEmail} | {enq.customerPhone}</span>
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-bold self-start px-2 py-0.5 rounded-sm ${
                        enq.replied ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {enq.replied ? 'Replied' : 'Pending Response'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg font-sans">
                      Regarding Property: <strong>{enq.propertyName}</strong> <br />
                      "{enq.message}"
                    </p>

                    {enq.replyMessage && (
                      <div className="bg-indigo-50/50 border-l-2 border-indigo-500 p-3 text-xs sm:text-sm text-slate-700 rounded-r-lg font-sans">
                        <strong>My Reply:</strong> "{enq.replyMessage}"
                      </div>
                    )}

                    {!enq.replied && (
                      <div className="space-y-2">
                        <textarea
                          placeholder="Type your response to the customer..."
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-hidden resize-none"
                          rows={2}
                          value={replyTextMap[enq.id] || ''}
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [enq.id]: e.target.value })}
                        />
                        <button
                          onClick={() => handleReplySubmit(enq.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-1.5 px-4 rounded-lg"
                        >
                          Send Response
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {ownerEnquiries.length === 0 && (
                  <p className="text-sm text-slate-400 italic py-8 text-center">No customer questions or viewing inquiries received.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS (PAYMENTS, SUBSCRIPTION) */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="owner-settings-tab">
            {/* Payout Channels Setup */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Direct Payout Wallet Configuration</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Bank Name</label>
                  <select
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-200 text-slate-800 cursor-pointer"
                    value={ownerProfile.bankName}
                    onChange={(e) => onUpdateOwnerProfile({ ...ownerProfile, bankName: e.target.value })}
                  >
                    <option value="National Bank of Malawi">National Bank of Malawi</option>
                    <option value="Standard Bank">Standard Bank Malawi</option>
                    <option value="FDH Bank">FDH Bank Limited</option>
                    <option value="NBS Bank">NBS Bank Plc</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-200 text-slate-800"
                    value={ownerProfile.accountNumber}
                    onChange={(e) => onUpdateOwnerProfile({ ...ownerProfile, accountNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Mobile Money Service Provider</label>
                  <select
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-200 text-slate-800 cursor-pointer"
                    value={ownerProfile.mobileMoneyProvider}
                    onChange={(e) => onUpdateOwnerProfile({ ...ownerProfile, mobileMoneyProvider: e.target.value })}
                  >
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="TNM Mpamba">TNM Mpamba</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Mobile Money Payout Number</label>
                  <input
                    type="text"
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-200 text-slate-800"
                    value={ownerProfile.mobileMoneyNumber}
                    onChange={(e) => onUpdateOwnerProfile({ ...ownerProfile, mobileMoneyNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-mono font-bold text-slate-400 block mb-1">Registered WhatsApp Contact (with country code)</label>
                <input
                  type="text"
                  className="w-full text-sm p-2.5 rounded-lg border border-slate-200 text-slate-800"
                  value={ownerProfile.whatsApp}
                  onChange={(e) => onUpdateOwnerProfile({ ...ownerProfile, whatsApp: e.target.value })}
                />
              </div>

              <button
                onClick={() => alert("Payout configuration successfully updated!")}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold font-sans"
              >
                Save Payout Account Details
              </button>
            </div>

            {/* Subscription Tier Info Card */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3">Subscription Tier</h3>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-[9px] font-mono font-bold text-indigo-600 block uppercase">Current Active Plan</span>
                <span className="text-xl font-bold text-indigo-950 block mt-1">{ownerProfile.subscriptionPlan} Tier</span>
                <span className="text-xs text-slate-500 block mt-1">Expires: {ownerProfile.subscriptionExpires}</span>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase">Change Subscription Plan</label>
                <div className="space-y-2">
                  {SUBSCRIPTION_PLANS.map((plan, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        onUpdateOwnerProfile({ ...ownerProfile, subscriptionPlan: plan.name });
                        alert(`Subscribed to "${plan.name}" plan successfully!`);
                      }}
                      className={`w-full text-left p-3 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-all ${
                        ownerProfile.subscriptionPlan === plan.name ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block text-slate-800">{plan.name}</span>
                        <span className="text-[10px] text-slate-400 font-sans">Limit: {plan.listingsLimit} properties</span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-600">MWK {plan.price.toLocaleString()}/mo</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
