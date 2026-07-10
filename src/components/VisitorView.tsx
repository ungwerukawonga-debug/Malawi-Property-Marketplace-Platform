import React, { useState } from 'react';
import { Property, PropertyCategory, ListingType, PropertyStatus, Booking, Enquiry, UserRole, SavedSearch, FraudReport } from '../types';
import { MALAWI_DISTRICTS } from '../data';
import { 
  Search, MapPin, Bed, Bath, Wifi, Droplet, Zap, Shield, Phone, 
  MessageSquare, Mail, Calendar, FileText, CheckCircle, Star, X, 
  Info, ChevronRight, Share2, Sparkles, AlertTriangle, UserCheck, 
  ShieldCheck, Bookmark, Compass, Eye, Activity, RefreshCw 
} from 'lucide-react';

interface VisitorViewProps {
  properties: Property[];
  onAddBooking: (booking: Booking) => void;
  onUpdatePropertyStatus: (propertyId: string, status: PropertyStatus) => void;
  onAddEnquiry: (enquiry: Enquiry) => void;
  role: UserRole;
  savedSearches: SavedSearch[];
  onAddSavedSearch: (search: SavedSearch) => void;
  onAddFraudReport: (report: FraudReport) => void;
  onTrackWhatsappClick: (propertyId: string) => void;
}

export default function VisitorView({
  properties,
  onAddBooking,
  onUpdatePropertyStatus,
  onAddEnquiry,
  role,
  savedSearches = [],
  onAddSavedSearch,
  onAddFraudReport,
  onTrackWhatsappClick
}: VisitorViewProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(10000000); // 10M MWK max
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [selectedListingType, setSelectedListingType] = useState<string>('All');
  const [requireInternet, setRequireInternet] = useState(false);
  const [requireWater, setRequireWater] = useState(false);
  const [requireElectricity, setRequireElectricity] = useState(false);

  // Selected Property Modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Booking process state
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PayChangu' | 'Airtel Money' | 'TNM Mpamba' | 'Visa' | 'MasterCard' | 'Bank Transfer'>('Airtel Money');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);

  // Enquiry/Questions state
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Map toggle or interactive simulation
  const [showMapSim, setShowMapSim] = useState(false);

  // AI search states
  const [isAiSearchMode, setIsAiSearchMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{
    matches: { propertyId: string; matchExplanation: string }[];
    message: string;
  } | null>(null);

  // Fraud Report Form States
  const [showFraudReportForm, setShowFraudReportForm] = useState(false);
  const [fraudReporterName, setFraudReporterName] = useState('');
  const [fraudReportType, setFraudReportType] = useState<'Report Listing' | 'Report Owner' | 'Incorrect Price' | 'Scam Alert'>('Scam Alert');
  const [fraudReportDetails, setFraudReportDetails] = useState('');
  const [fraudReportSuccess, setFraudReportSuccess] = useState(false);

  // Saved Search Input State
  const [savedSearchName, setSavedSearchName] = useState('');
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false);

  // Filter properties logic
  const filteredProperties = properties.filter((prop) => {
    // If AI Search has matching IDs, filter to those, or fallback to regular filter
    if (isAiSearchMode && aiResponse && aiResponse.matches && aiResponse.matches.length > 0) {
      return aiResponse.matches.some(m => m.propertyId === prop.id);
    }

    // 1. Approved check (Only Admin can see unapproved properties, otherwise visitors/customers only see approved)
    if (!prop.isApproved && role !== UserRole.ADMIN) return false;

    // 2. Query search
    const matchesQuery =
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.landmark.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Category match
    const matchesCategory = selectedCategory === 'All' || prop.category === selectedCategory;

    // 4. District match
    const matchesDistrict = selectedDistrict === 'All' || prop.district === selectedDistrict;

    // 5. Price range
    const matchesPrice = prop.price <= priceRange;

    // 6. Bedrooms
    const matchesBedrooms = prop.bedrooms >= minBedrooms;

    // 7. Listing type
    const matchesListingType = selectedListingType === 'All' || prop.listingType === selectedListingType;

    // 8. Amenities
    const matchesInternet = !requireInternet || prop.internet;
    const matchesWater = !requireWater || prop.water;
    const matchesElectricity = !requireElectricity || prop.electricity;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesDistrict &&
      matchesPrice &&
      matchesBedrooms &&
      matchesListingType &&
      matchesInternet &&
      matchesWater &&
      matchesElectricity
    );
  });

  // Calculate booking details
  const getBookingDuration = () => {
    if (!bookingStartDate || !bookingEndDate) return 0;
    const start = new Date(bookingStartDate);
    const end = new Date(bookingEndDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  const calculateBookingTotal = (pricePerUnit: number) => {
    const days = getBookingDuration();
    if (days <= 0) return 0;
    const subtotal = pricePerUnit * days;
    const cleaningFee = pricePerUnit * 0.1; // 10%
    const serviceFee = 5000; // flat 5k MWK service charge
    return subtotal + cleaningFee + serviceFee;
  };

  const handleOpenProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setActiveImageIdx(0);
    setIsBooking(false);
    setShowEnquiryForm(false);
    setEnquirySuccess(false);
    setCheckoutStep('form');
    setShowFraudReportForm(false);
    setFraudReportSuccess(false);
  };

  const handleShareListing = (prop: Property) => {
    navigator.clipboard.writeText(`https://kwanu.mw/listings/${prop.id}`);
    alert(`Share Link Copied to Clipboard!\nhttps://kwanu.mw/listings/${prop.id}`);
  };

  const handleInitiateWhatsApp = (prop: Property) => {
    // Track Direct WhatsApp Click on backend
    if (onTrackWhatsappClick) {
      onTrackWhatsappClick(prop.id);
    }
    const prefilledText = `Hi ${prop.ownerName}, I found your property listing "${prop.name}" (MWK ${prop.price.toLocaleString()}) on Malawi Property Marketplace. Is it still available?`;
    const encoded = encodeURIComponent(prefilledText);
    const waUrl = `https://wa.me/${prop.ownerWhatsApp || '265888123456'}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    if (selectedProperty.listingType === ListingType.RENT || selectedProperty.listingType === ListingType.SALE || selectedProperty.listingType === ListingType.COMMERCIAL_LEASE) {
      alert("This listing requires direct owner contact. Please use the WhatsApp or Call options directly.");
      return;
    }

    if (!bookingStartDate || !bookingEndDate) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    setCheckoutStep('processing');

    // Simulate Payment gateway delay (PayChangu Webhook integration)
    setTimeout(() => {
      const duration = getBookingDuration();
      const finalPrice = calculateBookingTotal(selectedProperty.price);
      const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const recNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newBooking: Booking = {
        id: `book-${Math.floor(Math.random() * 100000)}`,
        propertyId: selectedProperty.id,
        propertyName: selectedProperty.name,
        customerName: role === UserRole.CUSTOMER ? 'Registered Customer' : 'Walk-in Visitor',
        customerEmail: 'customer@marketplace.mw',
        customerPhone: checkoutPhone || '+265888000000',
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        totalPrice: finalPrice,
        status: 'Paid',
        paymentMethod: paymentMethod,
        createdDate: new Date().toISOString().split('T')[0],
        invoiceNumber: invNum,
        receiptNumber: recNum
      };

      onAddBooking(newBooking);
      setLastCreatedBooking(newBooking);

      // Auto change listing status to RESERVED
      onUpdatePropertyStatus(selectedProperty.id, PropertyStatus.RESERVED);

      setCheckoutStep('success');
    }, 2500);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    const newEnq: Enquiry = {
      id: `enq-${Math.floor(Math.random() * 100000)}`,
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      customerName: enquiryName,
      customerEmail: enquiryEmail,
      customerPhone: enquiryPhone,
      message: enquiryMsg,
      createdDate: new Date().toISOString(),
      replied: false
    };

    onAddEnquiry(newEnq);
    setEnquirySuccess(true);
    setEnquiryMsg('');
  };

  // Fraud Report handler
  const handleFraudReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;

    const report: FraudReport = {
      id: `rep-${Date.now()}`,
      propertyId: selectedProperty.id,
      propertyName: selectedProperty.name,
      ownerName: selectedProperty.ownerName,
      reporterName: fraudReporterName || 'Anonymous User',
      reportType: fraudReportType,
      details: fraudReportDetails,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    onAddFraudReport(report);
    setFraudReportSuccess(true);
    setFraudReporterName('');
    setFraudReportDetails('');
  };

  // Saved Search handler
  const handleSaveSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchName = savedSearchName.trim() || `Search in ${selectedDistrict === 'All' ? 'Malawi' : selectedDistrict}`;
    
    const newSearch: SavedSearch = {
      id: `ss-${Date.now()}`,
      searchName,
      searchQuery,
      selectedCategory,
      selectedDistrict,
      priceRange,
      minBedrooms,
      requireInternet,
      requireWater,
      requireElectricity,
      createdDate: new Date().toISOString().split('T')[0],
      notificationsCount: 0
    };

    onAddSavedSearch(newSearch);
    setShowSaveSearchModal(false);
    setSavedSearchName('');
    alert(`"${searchName}" has been successfully saved. You will receive active desktop and push alerts whenever matching owners publish properties directly!`);
  };

  // Run AI Search using Gemini
  const handleAiSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiIsLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data);
      } else {
        alert('Failed to connect to Kwanu AI. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Network issue contacting Gemini search engine.');
    } finally {
      setAiIsLoading(false);
    }
  };

  const clearAiSearch = () => {
    setAiResponse(null);
    setAiPrompt('');
    setIsAiSearchMode(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="visitor-view-root">
      
      {/* Dynamic Marketplace Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white py-12 px-6 relative overflow-hidden" id="visitor-hero">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Sparkles className="w-96 h-96 -mr-24" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="bg-indigo-500/20 text-indigo-300 text-xs font-mono px-3.5 py-1.5 rounded-full border border-indigo-400/20 uppercase tracking-widest font-semibold inline-block mb-3">
            0% Commission Guarantee Direct-From-Owners
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The Safe Way to Find Real Estate in Malawi
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mt-3 text-sm sm:text-base font-sans leading-relaxed">
            Direct owner-to-customer verification. Say goodbye to fake agents, predatory registration fees, and double deposits on Facebook Marketplace.
          </p>

          {/* Search Toggle Options */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => { setIsAiSearchMode(false); setAiResponse(null); }}
              className={`px-4 py-2 text-xs font-semibold rounded-full font-sans transition-all cursor-pointer ${
                !isAiSearchMode 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white/15 text-slate-200 hover:bg-white/20'
              }`}
            >
              🔍 Traditional Filter Search
            </button>
            <button
              onClick={() => setIsAiSearchMode(true)}
              className={`px-4 py-2 text-xs font-semibold rounded-full font-sans flex items-center gap-1.5 transition-all cursor-pointer ${
                isAiSearchMode 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'bg-white/15 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              🤖 Ask Kwanu AI Search (Powered by Gemini)
            </button>
          </div>

          {/* Quick Search Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-6 mt-4 text-slate-800 border border-slate-200/85">
            {!isAiSearchMode ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Keyword Search */}
                <div className="relative col-span-1 md:col-span-2">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search areas, landmarks, e.g. 'Area 12', 'Namiwawa Blantyre'..."
                    className="w-full text-sm pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="hero-search-query"
                  />
                </div>

                {/* District Select */}
                <div>
                  <select
                    className="w-full text-sm py-3 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans cursor-pointer"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    id="hero-search-district"
                  >
                    <option value="All">All Malawi Districts</option>
                    {MALAWI_DISTRICTS.map((dist, idx) => (
                      <option key={idx} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                {/* Price Filter Limit */}
                <div className="flex flex-col justify-center text-left px-2">
                  <label className="text-xs font-mono font-semibold text-slate-400 uppercase">Max: MWK {priceRange.toLocaleString()}</label>
                  <input
                    type="range"
                    min="50000"
                    max="15000000"
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-indigo-600 mt-1 cursor-pointer"
                    id="hero-search-price"
                  />
                </div>
              </div>
            ) : (
              /* AI Search Tab */
              <form onSubmit={handleAiSearchSubmit} className="space-y-4 text-left">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-100 pb-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div>
                    <h4 className="font-sans font-bold text-slate-900 text-sm">Natural Language AI Search Engine</h4>
                    <p className="text-xs text-slate-400">Describe exactly what you are looking for in plain language, e.g., "A modern flat with security guards in Blantyre under 1 million MWK"</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="e.g., I need a 3 bedroom house in Lilongwe with reserve water tanks and solar backup, my budget is 1.5 million..."
                    className="flex-1 text-sm px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={aiIsLoading}
                    className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-sans text-xs sm:text-sm font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {aiIsLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Scanning Listings...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Ask Kwanu AI
                      </>
                    )}
                  </button>
                </div>

                {aiResponse && (
                  <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-4 mt-4 space-y-3">
                    <p className="text-xs sm:text-sm text-amber-950 font-sans italic">
                      " {aiResponse.message} "
                    </p>
                    <div className="flex justify-between items-center pt-1 border-t border-amber-200/40">
                      <span className="text-[10px] text-amber-700 font-mono font-semibold uppercase">
                        AI Match Result: {aiResponse.matches.length} matching properties
                      </span>
                      <button
                        type="button"
                        onClick={clearAiSearch}
                        className="text-amber-800 hover:text-amber-950 text-xs font-sans font-bold flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Clear AI Filter
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8" id="visitor-workspace">
        
        {/* Left Hand Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6" id="visitor-filters">
          
          {/* Saved Searches list */}
          {savedSearches && savedSearches.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-3">
              <h4 className="font-sans font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Bookmark className="w-4 h-4 text-indigo-500" />
                My Saved Alerts ({savedSearches.length})
              </h4>
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => {
                      setSearchQuery(search.searchQuery);
                      setSelectedCategory(search.selectedCategory || 'All');
                      setSelectedDistrict(search.selectedDistrict || 'All');
                      setPriceRange(search.priceRange || 10000000);
                      setMinBedrooms(search.minBedrooms || 0);
                      setRequireInternet(search.requireInternet || false);
                      setRequireWater(search.requireWater || false);
                      setRequireElectricity(search.requireElectricity || false);
                      setIsAiSearchMode(false);
                      setAiResponse(null);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/70 transition-all text-xs font-sans flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{search.searchName}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Budget: {search.priceRange.toLocaleString()} MWK</span>
                    </div>
                    {search.notificationsCount > 0 ? (
                      <span className="bg-rose-500 text-white font-bold font-mono text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">
                        {search.notificationsCount} NEW
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-bold text-slate-900 text-base">Advanced Filters</h3>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDistrict('All');
                  setPriceRange(10000000);
                  setMinBedrooms(0);
                  setSelectedListingType('All');
                  setRequireInternet(false);
                  setRequireWater(false);
                  setRequireElectricity(false);
                  setIsAiSearchMode(false);
                  setAiResponse(null);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-sans hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Listing Category Select */}
            <div>
              <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">Property Category</label>
              <select
                className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {Object.values(PropertyCategory).map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Listing Type Select */}
            <div>
              <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">Listing Agreement</label>
              <select
                className="w-full text-sm p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                value={selectedListingType}
                onChange={(e) => setSelectedListingType(e.target.value)}
              >
                <option value="All">All listing agreements</option>
                {Object.values(ListingType).map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms Selection */}
            <div>
              <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">Minimum Bedrooms</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setMinBedrooms(num)}
                    className={`flex-1 py-1.5 text-xs rounded-md border font-sans transition-all duration-150 cursor-pointer ${
                      minBedrooms === num
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {num === 0 ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">Required Backups</label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-600 hover:text-slate-900 font-sans">
                <input
                  type="checkbox"
                  checked={requireElectricity}
                  onChange={(e) => setRequireElectricity(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Electricity / Solar Backup
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-600 hover:text-slate-900 font-sans">
                <input
                  type="checkbox"
                  checked={requireWater}
                  onChange={(e) => setRequireWater(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Water Storage / Reserve Tanks
              </label>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-600 hover:text-slate-900 font-sans">
                <input
                  type="checkbox"
                  checked={requireInternet}
                  onChange={(e) => setRequireInternet(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Internet Wi-Fi Connection
              </label>
            </div>

            {/* Save Search Button */}
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowSaveSearchModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                💾 Save Current Search Alert
              </button>
            </div>

            {/* Interactive Map Toggle */}
            <div>
              <button
                onClick={() => setShowMapSim(!showMapSim)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-xs sm:text-sm font-sans font-semibold transition-all cursor-pointer ${
                  showMapSim
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                {showMapSim ? 'Hide Property Map' : 'View Interactive Locator Map'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Hand Property Results Area */}
        <div className="lg:col-span-3 space-y-6" id="visitor-properties-listings">
          
          {/* Simulated Map Overlay */}
          {showMapSim && (
            <div className="bg-sky-50 rounded-2xl border border-sky-100 shadow-xs p-6 relative overflow-hidden" id="visitor-map-simulation">
              <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 relative z-10">
                <div>
                  <h4 className="font-sans font-bold text-sky-950 text-base flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    Malawi District Locator Map
                  </h4>
                  <p className="text-xs text-sky-800 mt-1">Simulated graphical spatial plotting for {filteredProperties.length} matching properties.</p>
                </div>
                <button onClick={() => setShowMapSim(false)} className="text-sky-600 hover:text-sky-800 text-xs font-sans font-bold cursor-pointer">Close Map</button>
              </div>

              {/* Graphical Plot of Malawi Districts and points */}
              <div className="bg-white/80 border border-sky-100 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                {['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba'].map((city, cIdx) => {
                  const cityProps = filteredProperties.filter(p => p.city === city || p.district === city);
                  return (
                    <div key={cIdx} className="bg-white rounded-lg p-3 border border-slate-100 shadow-2xs hover:shadow-xs transition-all text-center">
                      <span className="text-xs font-mono font-bold text-sky-700 uppercase block tracking-wider">{city}</span>
                      <span className="text-2xl font-bold text-slate-800 block mt-1">{cityProps.length}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">properties listed</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results Grid Header */}
          <div className="flex items-center justify-between bg-white px-5 py-4 rounded-xl shadow-2xs border border-slate-200/50">
            <p className="text-sm font-sans text-slate-500">
              Showing <span className="font-semibold text-slate-800">{filteredProperties.length}</span> matching listings in Malawi
            </p>
            <div className="flex gap-2">
              <span className="bg-indigo-50 text-indigo-700 font-mono text-xs px-2.5 py-1 rounded-full border border-indigo-100">
                Direct-Owner Verified
              </span>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" id="properties-cards-grid">
            {filteredProperties.map((prop) => {
              const isFeatured = prop.featuredType !== undefined;
              return (
                <div
                  key={prop.id}
                  onClick={() => handleOpenProperty(prop)}
                  className={`bg-white rounded-2xl shadow-2xs overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 group flex flex-col justify-between relative ${
                    isFeatured 
                      ? 'border-2 border-amber-400/80 shadow-amber-50' 
                      : 'border border-slate-200/80 hover:border-slate-300'
                  }`}
                  id={`property-card-${prop.id}`}
                >
                  {/* Premium Featured Badge */}
                  {isFeatured && (
                    <div className="absolute top-12 left-0 z-10 bg-amber-500 text-slate-950 text-[9px] font-mono font-extrabold uppercase py-1 px-2 rounded-r-md shadow-md flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                      {prop.featuredType}
                    </div>
                  )}

                  {/* Thumbnail Header */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={prop.images[0]}
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Indicator Badge */}
                    <span className="absolute left-3 top-3 bg-slate-900/80 text-white text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs z-10">
                      {prop.category}
                    </span>
                    
                    {/* Availability Badge */}
                    <span className={`absolute right-3 top-3 text-[10px] font-mono uppercase font-bold px-2.5 py-1 rounded-md shadow-xs z-10 ${
                      prop.status === PropertyStatus.AVAILABLE
                        ? 'bg-emerald-600 text-white'
                        : prop.status === PropertyStatus.BOOKED || prop.status === PropertyStatus.RENTED
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  {/* Listing Details Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-sans">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-medium text-slate-600">{prop.area}, {prop.city}</span>
                      </div>

                      {/* Display Badges */}
                      {prop.verificationStatus && prop.verificationStatus.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {prop.verificationStatus.map((statusItem, sIdx) => (
                            <span 
                              key={sIdx} 
                              className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm flex items-center gap-0.5"
                            >
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                              {statusItem}
                            </span>
                          ))}
                        </div>
                      )}

                      <h4 className="text-base font-sans font-bold text-slate-900 mt-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {prop.name}
                      </h4>

                      {/* AI Search Custom Explanation Hook */}
                      {isAiSearchMode && aiResponse && (
                        <div className="mt-2.5 bg-amber-50 text-amber-950 text-xs p-2.5 rounded-lg border border-amber-200/50 font-sans">
                          <p className="font-bold flex items-center gap-1 text-[10px] text-amber-800 uppercase tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Why Kwanu AI Selected This:
                          </p>
                          <p className="mt-1 leading-relaxed">
                            {aiResponse.matches.find(m => m.propertyId === prop.id)?.matchExplanation || 'Perfect match for district, layout, and localized backup requirements.'}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 font-sans mt-2 line-clamp-2 leading-relaxed">
                        {prop.description}
                      </p>
                    </div>

                    {/* Pricing / Amenities Block */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col justify-end">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">{prop.listingType}</span>
                          <span className="text-base font-sans font-extrabold text-slate-900">
                            {prop.currency} {prop.price.toLocaleString()}
                            {prop.listingType === ListingType.NIGHTLY && <span className="text-xs font-normal text-slate-400"> / night</span>}
                            {prop.listingType === ListingType.RENT && <span className="text-xs font-normal text-slate-400"> / month</span>}
                          </span>
                        </div>
                        {prop.negotiable && (
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold font-mono border border-amber-200/50 px-2 py-0.5 rounded-sm">
                            Negotiable
                          </span>
                        )}
                      </div>

                      {/* Simple Icons */}
                      <div className="flex items-center gap-3 text-slate-400 text-xs mt-3">
                        {prop.bedrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5" />
                            {prop.bedrooms} Bed
                          </span>
                        )}
                        {prop.bathrooms > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5" />
                            {prop.bathrooms} Bath
                          </span>
                        )}
                        {prop.internet && <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
                        {prop.electricity && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                        {prop.water && <Droplet className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProperties.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Info className="w-12 h-12 text-slate-400 mx-auto" />
                <h4 className="font-sans font-bold text-slate-800 text-lg mt-4">No matching properties listed</h4>
                <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                  Try clearing some criteria, widening your budget parameters, or checking other Malawi districts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-sans font-bold text-slate-900 text-base flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600" />
                Save Search Criteria Alert
              </h3>
              <button onClick={() => setShowSaveSearchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSearchSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-slate-400 uppercase block mb-1">Give this search alert a name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3-bedroom in Lilongwe Area 12"
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  value={savedSearchName}
                  onChange={(e) => setSavedSearchName(e.target.value)}
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 space-y-1">
                <span className="font-bold block text-slate-700">Current filters being saved:</span>
                <span>• District: {selectedDistrict === 'All' ? 'Anywhere in Malawi' : selectedDistrict}</span>
                {selectedCategory !== 'All' && <span>• Category: {selectedCategory}</span>}
                {minBedrooms > 0 && <span>• Min Bedrooms: {minBedrooms}</span>}
                <span>• Max Budget: MWK {priceRange.toLocaleString()}</span>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Create Saved Search Alert
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Property Details Modal Drawer */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-5xl w-full max-h-[90vh] overflow-y-auto" id="property-modal">
            
            {/* Modal Head Banner */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-mono px-2.5 py-1 rounded-md uppercase font-semibold">
                    {selectedProperty.category} • {selectedProperty.listingType}
                  </span>
                  
                  {/* Verification Status Badges */}
                  {selectedProperty.verificationStatus && selectedProperty.verificationStatus.map((badgeText, bIdx) => (
                    <span 
                      key={bIdx}
                      className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-sm flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {badgeText}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg sm:text-xl font-sans font-bold text-slate-900 mt-2">{selectedProperty.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
              {/* Left hand column: Pictures, description, amenities, rules, reviews */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Photo Slider */}
                <div className="space-y-3">
                  <div className="relative aspect-16/9 overflow-hidden bg-slate-100 rounded-xl">
                    <img
                      src={selectedProperty.images[activeImageIdx]}
                      alt={selectedProperty.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 right-3 bg-slate-900/70 text-white font-mono text-xs px-2.5 py-1 rounded-sm">
                      {activeImageIdx + 1} / {selectedProperty.images.length}
                    </span>
                  </div>
                  {selectedProperty.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProperty.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIdx(idx)}
                          className={`relative w-20 aspect-4/3 overflow-hidden rounded-md border-2 transition-all cursor-pointer ${
                            activeImageIdx === idx ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Features Indicators */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 border-y border-slate-100 py-4">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Bedrooms</span>
                    <span className="text-base font-bold text-slate-800">{selectedProperty.bedrooms || 'N/A'}</span>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Bathrooms</span>
                    <span className="text-base font-bold text-slate-800">{selectedProperty.bathrooms || 'N/A'}</span>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Negotiable</span>
                    <span className="text-base font-bold text-slate-800">{selectedProperty.negotiable ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">City</span>
                    <span className="text-sm font-bold text-slate-800 truncate block">{selectedProperty.city}</span>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">District</span>
                    <span className="text-sm font-bold text-slate-800 truncate block">{selectedProperty.district}</span>
                  </div>
                </div>

                {/* About Listing Description */}
                <div>
                  <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">{selectedProperty.description}</p>
                </div>

                {/* Landmarks, Area, Coordinates */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <h4 className="font-sans font-bold text-slate-900 text-xs uppercase tracking-wider">Location & Surroundings</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-600 font-sans">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span><strong>Area:</strong> {selectedProperty.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-emerald-500" />
                      <span><strong>Landmark:</strong> {selectedProperty.landmark}</span>
                    </div>
                  </div>
                </div>

                {/* Nearby Services Display */}
                {selectedProperty.nearbyServices && selectedProperty.nearbyServices.length > 0 && (
                  <div>
                    <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">Nearby Services & Amenities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProperty.nearbyServices.map((service, sIdx) => (
                        <div key={sIdx} className="bg-slate-50 rounded-xl p-3 border border-slate-100/50 flex items-center justify-between font-sans">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{service.name}</span>
                            <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block mt-0.5">{service.category}</span>
                          </div>
                          <span className="bg-white border border-slate-200/60 font-mono font-bold text-[10px] text-indigo-600 px-2.5 py-1 rounded-full">
                            {service.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Amenities Grid */}
                <div>
                  <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">Amenities & Infrastructure</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Wifi className={`w-4 h-4 ${selectedProperty.internet ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className={selectedProperty.internet ? 'text-slate-800 font-medium' : 'text-slate-400'}>Wi-Fi internet</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Droplet className={`w-4 h-4 ${selectedProperty.water ? 'text-blue-500' : 'text-slate-300'}`} />
                      <span className={selectedProperty.water ? 'text-slate-800 font-medium' : 'text-slate-400'}>Water Backups</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Zap className={`w-4 h-4 ${selectedProperty.electricity ? 'text-amber-500' : 'text-slate-300'}`} />
                      <span className={selectedProperty.electricity ? 'text-slate-800 font-medium' : 'text-slate-400'}>Electricity Backups</span>
                    </div>
                    {selectedProperty.amenities.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-indigo-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules of the listing */}
                {selectedProperty.rules && selectedProperty.rules.length > 0 && (
                  <div>
                    <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Property Guidelines</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                      {selectedProperty.rules.map((rule, idx) => (
                        <li key={idx}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reviews section */}
                <div>
                  <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">Reviews</h4>
                  <div className="space-y-4">
                    {selectedProperty.reviews && selectedProperty.reviews.map((rev) => (
                      <div key={rev.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-sans font-bold text-slate-800 text-sm">{rev.customerName}</span>
                          <span className="text-xs text-slate-400 font-sans">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-mono font-semibold text-slate-700">{rev.overall} / 5</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 italic font-sans">"{rev.comment}"</p>
                        {rev.reply && (
                          <div className="border-l-2 border-indigo-400 pl-3 mt-2">
                            <span className="text-[10px] font-mono text-indigo-600 uppercase block font-semibold">Owner Reply</span>
                            <p className="text-xs text-slate-500 font-sans mt-0.5">{rev.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!selectedProperty.reviews || selectedProperty.reviews.length === 0) && (
                      <p className="text-sm text-slate-400 italic font-sans">No completed stays reviews yet for this listing.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right hand column: Contact owner panel, booking scheduler & payments */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Contact Panel */}
                <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 border border-slate-800 space-y-6">
                  <div>
                    <span className="text-slate-400 text-xs font-mono uppercase block">Property Price</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {selectedProperty.currency} {selectedProperty.price.toLocaleString()}
                      {selectedProperty.listingType === ListingType.NIGHTLY && <span className="text-xs font-normal text-slate-400"> / night</span>}
                      {selectedProperty.listingType === ListingType.RENT && <span className="text-xs font-normal text-slate-400"> / month</span>}
                    </span>
                  </div>

                  {/* Immediate Direct WhatsApp API Connections */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleInitiateWhatsApp(selectedProperty)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-sm transition-all shadow-md cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Chat with Owner (WhatsApp)
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${selectedProperty.ownerPhone}`}
                        onClick={() => onTrackWhatsappClick && onTrackWhatsappClick(selectedProperty.id)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-sans text-xs sm:text-sm font-semibold transition-all text-center"
                      >
                        <Phone className="w-4 h-4 text-indigo-400" />
                        Call Owner
                      </a>
                      <a
                        href={`mailto:${selectedProperty.ownerEmail}?subject=Malawi Property Inquiry - ${selectedProperty.name}`}
                        onClick={() => onTrackWhatsappClick && onTrackWhatsappClick(selectedProperty.id)}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-sans text-xs sm:text-sm font-semibold transition-all text-center"
                      >
                        <Mail className="w-4 h-4 text-sky-400" />
                        Email Owner
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3 border border-slate-800 text-xs font-sans">
                    <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <p className="text-slate-300">
                      <strong>Malawi Property Direct:</strong> This marketplace charges 0% commission. You transact 100% directly with <strong>{selectedProperty.ownerName}</strong>.
                    </p>
                  </div>

                  {/* Fraud Reporting trigger */}
                  <div className="pt-2 border-t border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => setShowFraudReportForm(!showFraudReportForm)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-sans font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Report listing, pricing issue, or fake agent
                    </button>
                  </div>
                </div>

                {/* Fraud Reporting Form Panel */}
                {showFraudReportForm && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-4 font-sans">
                    <h5 className="font-sans font-bold text-rose-950 text-sm flex items-center gap-2 border-b border-rose-200/50 pb-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Report Fraud or Bad Listing
                    </h5>

                    {!fraudReportSuccess ? (
                      <form onSubmit={handleFraudReportSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono font-bold text-rose-700 uppercase block mb-1">Your Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Alinane"
                              className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white text-slate-800 focus:outline-hidden"
                              value={fraudReporterName}
                              onChange={(e) => setFraudReporterName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono font-bold text-rose-700 uppercase block mb-1">Report Reason</label>
                            <select
                              className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white text-slate-800 focus:outline-hidden"
                              value={fraudReportType}
                              onChange={(e: any) => setFraudReportType(e.target.value)}
                            >
                              <option value="Scam Alert">Scam Alert (Fake Listing)</option>
                              <option value="Report Listing">Report Listing Details</option>
                              <option value="Report Owner">Report Owner Behavior</option>
                              <option value="Incorrect Price">Incorrect Price Shown</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono font-bold text-rose-700 uppercase block mb-1">Describe what is incorrect or fraudulent</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Provide details for admins to take down or flag this owner..."
                            className="w-full text-xs p-2 rounded-lg border border-rose-200 bg-white text-slate-800 focus:outline-hidden resize-none"
                            value={fraudReportDetails}
                            onChange={(e) => setFraudReportDetails(e.target.value)}
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-sans font-bold text-xs transition-all cursor-pointer"
                        >
                          Submit Report to Admins
                        </button>
                      </form>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center space-y-2 text-xs">
                        <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                        <h6 className="font-bold text-emerald-950">Report Logged Successfully</h6>
                        <p className="text-emerald-800 leading-relaxed">
                          Admins have been notified immediately. We will investigate <strong>{selectedProperty.ownerName}</strong> and take swift corrective action if terms are violated. Thank you for keeping the marketplace safe!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Availability Calendar widget for Hospitality listings */}
                {(selectedProperty.listingType === ListingType.NIGHTLY || selectedProperty.listingType === ListingType.WEEKLY) && (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 font-sans">
                    <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Availability Calendar (July 2026)
                    </h4>
                    
                    {/* Simulated Month Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, idx) => (
                        <div key={idx} className="font-semibold font-mono text-slate-400 py-1 text-[10px]">{day}</div>
                      ))}
                      {Array.from({ length: 31 }).map((_, dIdx) => {
                        const dayNum = dIdx + 1;
                        const dateStr = `2026-07-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                        const status = selectedProperty.calendarEvents?.[dateStr] || 'Available';
                        
                        let bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100';
                        if (status === 'Reserved') bgClass = 'bg-amber-100 text-amber-800 border-amber-200';
                        if (status === 'Occupied') bgClass = 'bg-rose-100 text-rose-800 border-rose-200';
                        if (status === 'Maintenance') bgClass = 'bg-slate-100 text-slate-400 border-slate-200 line-through';

                        return (
                          <div 
                            key={dIdx}
                            title={`${dayNum} July: ${status}`}
                            className={`p-2 border rounded-md font-mono text-xs font-bold transition-all ${bgClass}`}
                          >
                            {dayNum}
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span> Available
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Reserved
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span> Occupied
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 bg-slate-400 rounded-full inline-block"></span> Maintenance
                      </span>
                    </div>
                  </div>
                )}

                {/* Booking Engine for Hospitality Listings */}
                {(selectedProperty.listingType === ListingType.NIGHTLY || selectedProperty.listingType === ListingType.WEEKLY) ? (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      Hospitality Booking Checkout
                    </h4>

                    {checkoutStep === 'form' && (
                      <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block mb-1">Check-In Date</label>
                            <input
                              type="date"
                              required
                              value={bookingStartDate}
                              onChange={(e) => setBookingStartDate(e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                              min={new Date().toISOString().split('T')[0]}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block mb-1">Check-Out Date</label>
                            <input
                              type="date"
                              required
                              value={bookingEndDate}
                              onChange={(e) => setBookingEndDate(e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                              min={bookingStartDate || new Date().toISOString().split('T')[0]}
                            />
                          </div>
                        </div>

                        {getBookingDuration() > 0 && (
                          <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-2 font-sans border border-slate-100">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Stay Duration:</span>
                              <span className="font-semibold text-slate-800">{getBookingDuration()} nights</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Base Rental:</span>
                              <span className="font-semibold text-slate-800">MWK {(selectedProperty.price * getBookingDuration()).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Cleaning (10%):</span>
                              <span className="font-semibold text-slate-800">MWK {(selectedProperty.price * 0.1 * getBookingDuration()).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-indigo-600 font-semibold pt-1.5 border-t border-slate-200/60">
                              <span>Total Quote:</span>
                              <span>MWK {calculateBookingTotal(selectedProperty.price).toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">Payment Channel</label>
                          <select
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden cursor-pointer"
                            value={paymentMethod}
                            onChange={(e: any) => setPaymentMethod(e.target.value)}
                          >
                            <option value="Airtel Money">Airtel Money (Instant PIN)</option>
                            <option value="TNM Mpamba">TNM Mpamba (Instant PIN)</option>
                            <option value="PayChangu">PayChangu Card Gateway</option>
                            <option value="Visa">Visa Credit/Debit Card</option>
                            <option value="Bank Transfer">Local Bank Transfer (Direct)</option>
                          </select>
                        </div>

                        {(paymentMethod === 'Airtel Money' || paymentMethod === 'TNM Mpamba') && (
                          <div>
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block mb-1">Mobile Money Number</label>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. +265999123456"
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden"
                              value={checkoutPhone}
                              onChange={(e) => setCheckoutPhone(e.target.value)}
                            />
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-sm transition-all cursor-pointer shadow-xs"
                        >
                          Confirm & Pay Online
                        </button>
                      </form>
                    )}

                    {checkoutStep === 'processing' && (
                      <div className="py-8 text-center space-y-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                        <h5 className="font-sans font-semibold text-slate-800 text-sm">Processing Payment Gateway...</h5>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          We are invoking PayChangu servers and issuing a push transaction prompt to handset. Please accept the prompt.
                        </p>
                      </div>
                    )}

                    {checkoutStep === 'success' && lastCreatedBooking && (
                      <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 text-center space-y-4">
                        <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                        <div>
                          <h5 className="font-sans font-bold text-emerald-950 text-sm">Booking Completed Successfully!</h5>
                          <p className="text-xs text-emerald-800 mt-1">
                            Your payment has been cleared. Check-out instructions sent directly to your handset.
                          </p>
                        </div>

                        {/* Interactive Invoices / Receipt View/Download Block */}
                        <div className="bg-white border border-slate-100 rounded-lg p-3 text-left space-y-1.5 text-xs font-sans">
                          <div className="flex justify-between text-[10px] font-mono font-semibold uppercase text-slate-400">
                            <span>Receipt Data</span>
                            <span>{lastCreatedBooking.receiptNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Property:</span>
                            <span className="font-semibold text-slate-800">{lastCreatedBooking.propertyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Method:</span>
                            <span className="font-semibold text-slate-800">{lastCreatedBooking.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between font-bold pt-1 border-t border-slate-100">
                            <span>Paid Total:</span>
                            <span>MWK {lastCreatedBooking.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => alert(`Generated Invoice ${lastCreatedBooking.invoiceNumber} downloaded as PDF successfully.`)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-sans text-xs hover:bg-slate-50 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            Invoice PDF
                          </button>
                          <button
                            onClick={() => alert(`Generated Receipt ${lastCreatedBooking.receiptNumber} downloaded as PDF successfully.`)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-sans text-xs hover:bg-slate-50 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Receipt PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Long term rentals / sales, request viewings or general enquiries
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                    <h4 className="font-sans font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      Request Viewing or Info
                    </h4>

                    {!enquirySuccess ? (
                      <form onSubmit={handleEnquirySubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Alinane"
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden"
                              value={enquiryName}
                              onChange={(e) => setEnquiryName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Your Phone</label>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. +265888..."
                              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden"
                              value={enquiryPhone}
                              onChange={(e) => setEnquiryPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Your Email</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. guest@kwanu.mw"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden"
                            value={enquiryEmail}
                            onChange={(e) => setEnquiryEmail(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Message Detail</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="What would you like to ask the owner or arrange?"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-hidden resize-none"
                            value={enquiryMsg}
                            onChange={(e) => setEnquiryMsg(e.target.value)}
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs sm:text-sm transition-all cursor-pointer"
                        >
                          Submit Direct Enquiry
                        </button>
                      </form>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center space-y-3">
                        <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                        <div>
                          <h5 className="font-sans font-bold text-emerald-950 text-sm">Enquiry Lodged Directly!</h5>
                          <p className="text-xs text-emerald-800 mt-1">
                            Your details have been submitted to <strong>{selectedProperty.ownerName}</strong>. They will reply to you on your email or phone shortly.
                          </p>
                        </div>
                        <button
                          onClick={() => setEnquirySuccess(false)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold font-sans hover:underline cursor-pointer"
                        >
                          Send another enquiry
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
