/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Property, PropertyCategory, ListingType, PropertyStatus, Booking, Enquiry, OwnerProfile, FraudReport, SavedSearch } from './types';
import { INITIAL_PROPERTIES, INITIAL_BOOKINGS, INITIAL_ENQUIRIES, INITIAL_OWNER_PROFILE } from './data';
import VisitorView from './components/VisitorView';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import DocHub from './components/DocHub';
import { LayoutDashboard, Users, UserCheck, ShieldAlert, BookOpen, Building, CheckCircle, HelpCircle } from 'lucide-react';

export default function App() {
  // Global States
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [fraudReports, setFraudReports] = useState<FraudReport[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(INITIAL_OWNER_PROFILE);
  
  // Navigation Role/View State (Extended with 'DOC_HUB' option)
  const [activeRole, setActiveRole] = useState<UserRole | 'DOC_HUB'>(UserRole.VISITOR);

  // Load from API on mount
  useEffect(() => {
    fetch('/api/properties')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API down');
      })
      .then((data) => setProperties(data))
      .catch((e) => console.warn('Backend server down/starting, using mock data:', e));

    fetch('/api/bookings')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBookings(data))
      .catch(() => {});

    fetch('/api/enquiries')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setEnquiries(data))
      .catch(() => {});

    fetch('/api/reports')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setFraudReports(data))
      .catch(() => {});

    fetch('/api/saved-searches')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSavedSearches(data))
      .catch(() => {});
  }, []);

  // Core State Modifiers
  const handleAddBooking = async (newBooking: Booking) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      });
      if (res.ok) {
        const saved = await res.json();
        setBookings((prev) => [saved, ...prev]);
      } else {
        setBookings((prev) => [newBooking, ...prev]);
      }
    } catch {
      setBookings((prev) => [newBooking, ...prev]);
    }
  };

  const handleUpdatePropertyStatus = async (propertyId: string, status: PropertyStatus) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setProperties((prev) => prev.map((p) => (p.id === propertyId ? updated : p)));
      } else {
        setProperties((prev) =>
          prev.map((prop) => (prop.id === propertyId ? { ...prop, status, updatedDate: new Date().toISOString().split('T')[0] } : prop))
        );
      }
    } catch {
      setProperties((prev) =>
        prev.map((prop) => (prop.id === propertyId ? { ...prop, status, updatedDate: new Date().toISOString().split('T')[0] } : prop))
      );
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}`, { method: 'DELETE' });
      if (res.ok) {
        setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
      }
    } catch {
      setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
    }
  };

  const handleApproveProperty = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true })
      });
      if (res.ok) {
        const updated = await res.json();
        setProperties((prev) => prev.map((p) => (p.id === propertyId ? updated : p)));
      } else {
        setProperties((prev) =>
          prev.map((prop) => (prop.id === propertyId ? { ...prop, isApproved: true } : prop))
        );
      }
    } catch {
      setProperties((prev) =>
        prev.map((prop) => (prop.id === propertyId ? { ...prop, isApproved: true } : prop))
      );
    }
  };

  const handleRejectProperty = async (propertyId: string) => {
    handleDeleteProperty(propertyId);
  };

  const handleAddProperty = async (newProp: Property) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProp)
      });
      if (res.ok) {
        const saved = await res.json();
        setProperties((prev) => [saved, ...prev]);
      } else {
        setProperties((prev) => [newProp, ...prev]);
      }
    } catch {
      setProperties((prev) => [newProp, ...prev]);
    }
  };

  const handleAddEnquiry = async (newEnq: Enquiry) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEnq)
      });
      if (res.ok) {
        const saved = await res.json();
        setEnquiries((prev) => [saved, ...prev]);
      } else {
        setEnquiries((prev) => [newEnq, ...prev]);
      }
    } catch {
      setEnquiries((prev) => [newEnq, ...prev]);
    }
  };

  const handleAddReplyToEnquiry = async (enquiryId: string, reply: string) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyMessage: reply })
      });
      if (res.ok) {
        const updated = await res.json();
        setEnquiries((prev) => prev.map((e) => (e.id === enquiryId ? updated : e)));
      } else {
        setEnquiries((prev) =>
          prev.map((enq) => (enq.id === enquiryId ? { ...enq, replied: true, replyMessage: reply } : enq))
        );
      }
    } catch {
      setEnquiries((prev) =>
        prev.map((enq) => (enq.id === enquiryId ? { ...enq, replied: true, replyMessage: reply } : enq))
      );
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));
      } else {
        setBookings((prev) =>
          prev.map((book) => {
            if (book.id === bookingId) {
              const updatedBook = { ...book, status };
              if (status === 'Confirmed') {
                updatedBook.receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
              }
              return updatedBook;
            }
            return book;
          })
        );
      }
    } catch {
      setBookings((prev) =>
        prev.map((book) => {
          if (book.id === bookingId) {
            const updatedBook = { ...book, status };
            if (status === 'Confirmed') {
              updatedBook.receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
            }
            return updatedBook;
          }
          return book;
        })
      );
    }
  };

  const handleUpdateOwnerProfile = (profile: OwnerProfile) => {
    setOwnerProfile(profile);
  };

  const handleAddFraudReport = async (report: FraudReport) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (res.ok) {
        const saved = await res.json();
        setFraudReports((prev) => [saved, ...prev]);
      }
    } catch {
      setFraudReports((prev) => [report, ...prev]);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: FraudReport['status']) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setFraudReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
      }
    } catch {
      setFraudReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
    }
  };

  const handleAddSavedSearch = async (search: SavedSearch) => {
    try {
      const res = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(search)
      });
      if (res.ok) {
        const saved = await res.json();
        setSavedSearches((prev) => [saved, ...prev]);
      }
    } catch {
      setSavedSearches((prev) => [search, ...prev]);
    }
  };

  const handleUpdatePropertyVerification = async (propertyId: string, verifications: string[], isApproved?: boolean) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: verifications, isApproved })
      });
      if (res.ok) {
        const updated = await res.json();
        setProperties((prev) => prev.map((p) => (p.id === propertyId ? updated : p)));
      }
    } catch {}
  };

  const handleUpdatePropertyCalendar = async (propertyId: string, date: string, status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance') => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, status })
      });
      if (res.ok) {
        const updated = await res.json();
        setProperties((prev) => prev.map((p) => (p.id === propertyId ? updated : p)));
      }
    } catch {}
  };

  const handleTrackWhatsAppClick = async (propertyId: string) => {
    try {
      const res = await fetch(`/api/properties/${propertyId}/whatsapp-click`, { method: 'POST' });
      if (res.ok) {
        const { whatsappClicksCount } = await res.json();
        setProperties((prev) => prev.map((p) => p.id === propertyId ? { ...p, whatsappClicksCount } : p));
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800" id="application-container">
      
      {/* Platform Navigation Header with Role Switchers */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4" id="main-navigation-bar">
        <div className="flex items-center gap-3">
          <Building className="w-6 h-6 text-indigo-600" />
          <div>
            <h1 className="text-lg font-sans font-extrabold tracking-tight text-slate-900 leading-none">
              Malawi Property Marketplace
            </h1>
            <span className="text-[10px] font-mono font-medium text-slate-400 block mt-1 uppercase tracking-wider">
              Direct Owner-To-Customer Platform
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Roles selectors */}
        <div className="flex flex-wrap items-center gap-2" id="nav-role-picker">
          <span className="text-xs font-mono text-slate-400 font-semibold mr-1 hidden md:inline">ROLE SWITCHER:</span>
          
          <button
            onClick={() => setActiveRole(UserRole.VISITOR)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeRole === UserRole.VISITOR
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
            id="role-visitor-btn"
          >
            <Users className="w-3.5 h-3.5" />
            Visitor
          </button>

          <button
            onClick={() => setActiveRole(UserRole.CUSTOMER)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeRole === UserRole.CUSTOMER
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
            id="role-customer-btn"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Customer
          </button>

          <button
            onClick={() => setActiveRole(UserRole.OWNER)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeRole === UserRole.OWNER
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
            id="role-owner-btn"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Owner Portal
          </button>

          <button
            onClick={() => setActiveRole(UserRole.ADMIN)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeRole === UserRole.ADMIN
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
            id="role-admin-btn"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin
          </button>

          <button
            onClick={() => setActiveRole('DOC_HUB')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all border cursor-pointer ${
              activeRole === 'DOC_HUB'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-amber-700 border-amber-200/50 hover:text-amber-800'
            }`}
            id="role-docs-btn"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Developer Specs
          </button>
        </div>
      </header>

      {/* Primary Workspace View Area */}
      <main className="flex-1" id="main-view-workspace">
        {activeRole === UserRole.VISITOR && (
          <VisitorView
            properties={properties}
            onAddBooking={handleAddBooking}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onAddEnquiry={handleAddEnquiry}
            role={UserRole.VISITOR}
            savedSearches={savedSearches}
            onAddSavedSearch={handleAddSavedSearch}
            onAddFraudReport={handleAddFraudReport}
            onTrackWhatsappClick={handleTrackWhatsAppClick}
          />
        )}

        {activeRole === UserRole.CUSTOMER && (
          <VisitorView
            properties={properties}
            onAddBooking={handleAddBooking}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onAddEnquiry={handleAddEnquiry}
            role={UserRole.CUSTOMER}
            savedSearches={savedSearches}
            onAddSavedSearch={handleAddSavedSearch}
            onAddFraudReport={handleAddFraudReport}
            onTrackWhatsappClick={handleTrackWhatsAppClick}
          />
        )}

        {activeRole === UserRole.OWNER && (
          <OwnerDashboard
            properties={properties}
            bookings={bookings}
            enquiries={enquiries}
            ownerProfile={ownerProfile}
            onAddProperty={handleAddProperty}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onDeleteProperty={handleDeleteProperty}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateOwnerProfile={handleUpdateOwnerProfile}
            onAddReplyToEnquiry={handleAddReplyToEnquiry}
            onUpdatePropertyCalendar={handleUpdatePropertyCalendar}
            onTrackWhatsappClick={handleTrackWhatsAppClick}
          />
        )}

        {activeRole === UserRole.ADMIN && (
          <AdminDashboard
            properties={properties}
            bookings={bookings}
            onApproveProperty={handleApproveProperty}
            onRejectProperty={handleRejectProperty}
            onDeleteProperty={handleDeleteProperty}
            fraudReports={fraudReports}
            onUpdateReportStatus={handleUpdateReportStatus}
            onUpdatePropertyVerification={handleUpdatePropertyVerification}
          />
        )}

        {activeRole === 'DOC_HUB' && (
          <DocHub />
        )}
      </main>

      {/* Footer Details */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 sm:px-12 border-t border-slate-800 text-center space-y-3" id="main-footer-container">
        <p className="text-xs sm:text-sm font-sans">
          © 2026 Malawi Property Marketplace. Proudly empowering direct real-estate solutions in Blantyre, Lilongwe, Mzuzu, and Mangochi.
        </p>
        <div className="flex justify-center gap-6 text-xs text-slate-500 font-sans">
          <span>0% Commission Guarantee</span>
          <span>•</span>
          <span>No Broker Viewing Fees</span>
          <span>•</span>
          <span>Direct Payout Settled Daily</span>
        </div>
      </footer>
    </div>
  );
}
