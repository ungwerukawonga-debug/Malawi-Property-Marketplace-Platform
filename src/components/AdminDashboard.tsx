import React, { useState } from 'react';
import { Property, PropertyCategory, ListingType, PropertyStatus, Booking, Enquiry, Review, FraudReport } from '../types';
import { MALAWI_DISTRICTS } from '../data';
import { 
  ShieldAlert, CheckCircle, XCircle, Users, Image, MessageSquare, 
  Plus, Trash2, Folder, Landmark, Layers, DollarSign, Calendar, 
  TrendingUp, AlertOctagon, HelpCircle, Shield, Award 
} from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
  bookings: Booking[];
  onApproveProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  fraudReports: FraudReport[];
  onUpdateReportStatus: (reportId: string, status: 'Pending' | 'Reviewed' | 'Dismissed') => void;
  onUpdatePropertyVerification: (propertyId: string, verifications: string[], isApproved?: boolean) => void;
}

export default function AdminDashboard({
  properties,
  bookings,
  onApproveProperty,
  onRejectProperty,
  onDeleteProperty,
  fraudReports = [],
  onUpdateReportStatus,
  onUpdatePropertyVerification
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'reports' | 'reviews' | 'categories'>('approvals');

  // Local state for adding custom categories or locations
  const [categoriesList, setCategoriesList] = useState<string[]>(Object.values(PropertyCategory));
  const [newCategoryName, setNewCategoryName] = useState('');
  const [locationsList, setLocationsList] = useState<string[]>(MALAWI_DISTRICTS);
  const [newLocationName, setNewLocationName] = useState('');

  // Selected verification status items map for each pending property
  const [selectedVerifications, setSelectedVerifications] = useState<Record<string, string[]>>({});

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

  const handleToggleVerificationTag = (propertyId: string, tag: string) => {
    const current = selectedVerifications[propertyId] || [];
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    
    setSelectedVerifications({
      ...selectedVerifications,
      [propertyId]: updated
    });
  };

  const handlePublishWithVerification = (prop: Property) => {
    const tags = selectedVerifications[prop.id] || ['Verified Owner'];
    if (onUpdatePropertyVerification) {
      onUpdatePropertyVerification(prop.id, tags, true);
    } else {
      onApproveProperty(prop.id);
    }
    alert(`Property "${prop.name}" has been approved with verified tags [${tags.join(', ')}] and published live!`);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" id="admin-dashboard-root">
      {/* Top Welcome Title */}
      <div className="bg-slate-900 text-white py-10 px-6 sm:px-12 border-b border-slate-800" id="admin-header">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="bg-rose-600/30 text-rose-300 font-mono text-xs px-2.5 py-1 rounded-full border border-rose-500/30">
              System Operations Admin
            </span>
            <span className="bg-indigo-600/30 text-indigo-300 font-mono text-xs px-2.5 py-1 rounded-full border border-indigo-500/30">
              Root Console Active
            </span>
          </div>
          <h1 className="text-3xl font-sans font-bold text-white mt-3">
            Operations Control Panel
          </h1>
          <p className="text-slate-300 text-sm mt-1 font-sans">
            Oversee user-reported scam filings, verify property owner certificates, apply safety trust badges, and configure platform parameters.
          </p>
        </div>
      </div>

      {/* Tabs Selector Row */}
      <div className="border-b border-slate-200 bg-white shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-8 overflow-x-auto">
            {[
              { id: 'approvals', label: `Review & Badges (${pendingProperties.length})`, icon: <ShieldAlert className="w-4 h-4" /> },
              { id: 'reports', label: `Scams / Fraud Reports (${fraudReports.filter(r => r.status === 'Pending').length})`, icon: <AlertOctagon className="w-4 h-4" /> },
              { id: 'users', label: 'All Live Listings', icon: <Users className="w-4 h-4" /> },
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
        
        {/* TAB 1: PENDING LISTINGS WITH TRUST BADGE SELECTION */}
        {activeTab === 'approvals' && (
          <div className="space-y-6" id="admin-approvals-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                Property Verification & Trust Badging Queue
              </h3>

              <div className="divide-y divide-slate-100">
                {pendingProperties.map((prop) => {
                  const currentTags = selectedVerifications[prop.id] || ['Verified Owner'];
                  return (
                    <div key={prop.id} className="py-6 flex flex-col lg:flex-row items-start justify-between gap-6">
                      <div className="space-y-2 flex-1 font-sans">
                        <div className="flex items-center gap-3">
                          <span className="font-sans font-bold text-base text-slate-800">{prop.name}</span>
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm">Awaiting Badging</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Uploaded by Owner: <strong>{prop.ownerName}</strong> ({prop.ownerEmail} | Phone: {prop.ownerPhone}) <br />
                          Location: {prop.area}, {prop.city} • Price: {prop.currency} {prop.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 italic max-w-2xl bg-slate-50 p-3 rounded-lg border border-slate-100">
                          "{prop.description}"
                        </p>

                        {/* Interactive badging section */}
                        <div className="pt-2">
                          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wide block mb-2">Select Trust Verification Badges to Apply:</span>
                          <div className="flex flex-wrap gap-2">
                            {['Verified Owner', 'Identity Verified', 'Property Verified', 'Recently Inspected'].map((tag) => {
                              const isChecked = currentTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => handleToggleVerificationTag(prop.id, tag)}
                                  className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans flex items-center gap-1 border transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <Award className={`w-3.5 h-3.5 ${isChecked ? 'text-emerald-600' : 'text-slate-300'}`} />
                                  {tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Operations Buttons */}
                      <div className="flex sm:flex-col gap-2 justify-center lg:self-center">
                        <button
                          onClick={() => handlePublishWithVerification(prop)}
                          className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve & Publish Live
                        </button>
                        <button
                          onClick={() => {
                            onRejectProperty(prop.id);
                            alert(`Property "${prop.name}" rejected.`);
                          }}
                          className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject / Delete
                        </button>
                      </div>
                    </div>
                  );
                })}

                {pendingProperties.length === 0 && (
                  <div className="text-center py-12 text-slate-400 italic font-sans">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3 animate-bounce" />
                    All properties badged and published. Approvals queue is completely clean!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM SCAMS / FRAUD REPORTS SUBMISSIONS */}
        {activeTab === 'reports' && (
          <div className="space-y-6" id="admin-reports-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                User-Reported Scam Filings ({fraudReports.length})
              </h3>

              <div className="divide-y divide-slate-100">
                {fraudReports.map((report) => (
                  <div key={report.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm">
                          {report.reportType}
                        </span>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-sm ${
                          report.status === 'Pending' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono ml-auto md:ml-0">
                          Filed: {report.createdDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Property: {report.propertyName} (ID: {report.propertyId})
                      </h4>
                      <p className="text-xs text-slate-600">
                        Listed Owner: <strong>{report.ownerName}</strong> | Reported by: <strong>{report.reporterName}</strong>
                      </p>
                      <p className="text-xs text-slate-500 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100/40">
                        <strong>Reporter Feedback:</strong> "{report.details}"
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {report.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              onUpdateReportStatus(report.id, 'Reviewed');
                              alert('Scam filing marked as REVIEWED.');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => {
                              onUpdateReportStatus(report.id, 'Dismissed');
                              alert('Scam filing DISMISSED.');
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-sans text-xs font-bold py-1.5 px-3 rounded-lg cursor-pointer"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                      
                      {/* Immediate listing take-down capability */}
                      <button
                        onClick={() => {
                          onDeleteProperty(report.propertyId);
                          onUpdateReportStatus(report.id, 'Reviewed');
                          alert(`Listing ID ${report.propertyId} has been taken down completely!`);
                        }}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-sans text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Take Down Listing
                      </button>
                    </div>
                  </div>
                ))}

                {fraudReports.length === 0 && (
                  <p className="text-sm text-slate-400 italic text-center py-8">
                    No active scam filings received. Platform listings are clean!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM PLATFORM PROPERTIES */}
        {activeTab === 'users' && (
          <div className="space-y-6" id="admin-users-tab">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-sans font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Layers className="w-5 h-5 text-indigo-500" />
                Active Live Properties Directory
              </h3>

              <div className="divide-y divide-slate-100">
                {approvedProperties.map((prop) => (
                  <div key={prop.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={prop.images[0]} alt={prop.name} className="w-14 h-10 object-cover rounded-md" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-sm font-sans font-bold text-slate-800">{prop.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block">Owner: {prop.ownerName} | City: {prop.city}</span>
                        {prop.verificationStatus && (
                          <div className="flex gap-1 mt-1">
                            {prop.verificationStatus.map((v, i) => (
                              <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-mono font-bold uppercase px-1 py-0.5 rounded-xs">
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-700">MWK {prop.price.toLocaleString()}</span>
                      <button
                        onClick={() => {
                          onDeleteProperty(prop.id);
                          alert(`Property "${prop.name}" deleted from system registry.`);
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all cursor-pointer"
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

        {/* TAB 4: REVIEWS MODERATION */}
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
                        className="text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold py-1 px-3 rounded-lg cursor-pointer"
                      >
                        Flag Review
                      </button>
                      <button
                        onClick={() => alert("Review marked safe.")}
                        className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold py-1 px-3 rounded-lg cursor-pointer"
                      >
                        Mark Safe
                      </button>
                    </div>
                  </div>
                ))}

                {allReviews.length === 0 && (
                  <p className="text-sm text-slate-400 italic py-8 text-center font-sans">No reviews submitted on properties yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES AND LOCATIONS CONFIGURATOR */}
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
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">
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
                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">
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
