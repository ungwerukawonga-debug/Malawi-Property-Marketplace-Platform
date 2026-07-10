/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  VISITOR = 'VISITOR',
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export enum PropertyCategory {
  HOUSE_RENT = 'Houses for Rent',
  HOUSE_SALE = 'Houses for Sale',
  APARTMENT = 'Apartments',
  BED_SITTER = 'Bed Sitters',
  FLAT = 'Flats',
  LODGE = 'Lodges',
  GUEST_HOUSE = 'Guest Houses',
  HOTEL = 'Hotels',
  AIRBNB = 'Airbnb / Short Stay',
  STUDENT_HOUSING = 'Student Accommodation',
  COMMERCIAL = 'Commercial Property',
  OFFICE = 'Office Space',
  LAND = 'Land for Sale'
}

export enum ListingType {
  RENT = 'Rent',
  SALE = 'Sale',
  NIGHTLY = 'Nightly Stay',
  WEEKLY = 'Weekly Stay',
  MONTHLY = 'Monthly Stay',
  HOLIDAY_HOME = 'Holiday Home',
  COMMERCIAL_LEASE = 'Commercial Lease'
}

export enum PropertyStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  OCCUPIED = 'Occupied',
  RESERVED = 'Reserved',
  SOLD = 'Sold',
  RENTED = 'Rented',
  UNAVAILABLE = 'Unavailable',
  MAINTENANCE = 'Maintenance',
  COMING_SOON = 'Coming Soon',
  ARCHIVED = 'Archived'
}

export interface Review {
  id: string;
  customerName: string;
  cleanliness: number;
  communication: number;
  value: number;
  location: number;
  overall: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface Property {
  id: string;
  name: string;
  category: PropertyCategory;
  listingType: ListingType;
  status: PropertyStatus;
  description: string;
  price: number;
  currency: string;
  negotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  kitchen: boolean;
  internet: boolean;
  water: boolean;
  electricity: boolean;
  security: string; // e.g. "24/7 Guards", "Fenced", "None"
  amenities: string[];
  rules: string[];
  images: string[];
  district: string;
  city: string;
  area: string;
  landmark: string;
  latitude: number;
  longitude: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerWhatsApp: string;
  isApproved: boolean;
  viewsCount: number;
  createdDate: string;
  updatedDate: string;
  reviews?: Review[];
  liveRoomAvailability?: string; // e.g. "Available Today", "Few Rooms Left", "Fully Booked", "Closed"
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Paid' | 'Cancelled' | 'Completed';
  paymentMethod?: 'PayChangu' | 'Airtel Money' | 'TNM Mpamba' | 'Visa' | 'MasterCard' | 'Bank Transfer';
  createdDate: string;
  invoiceNumber: string;
  receiptNumber?: string;
}

export interface SubscriptionPlan {
  name: string;
  price: number; // MWK
  listingsLimit: number;
  features: string[];
  color: string;
}

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsApp: string;
  bankName: string;
  accountNumber: string;
  mobileMoneyProvider: string;
  mobileMoneyNumber: string;
  subscriptionPlan: string;
  subscriptionExpires: string;
  autoRenew: boolean;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  createdDate: string;
  replied: boolean;
  replyMessage?: string;
}
