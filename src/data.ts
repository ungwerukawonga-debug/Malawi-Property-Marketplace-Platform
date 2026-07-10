/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, PropertyCategory, ListingType, PropertyStatus, SubscriptionPlan, OwnerProfile, Booking, Enquiry, UserRole } from './types';

export const MALAWI_DISTRICTS = [
  'Lilongwe',
  'Blantyre',
  'Mzuzu',
  'Zomba',
  'Mangochi',
  'Salima',
  'Nkhata Bay',
  'Karonga',
  'Kasungu',
  'Dedza',
  'Zomba',
  'Mulanje',
  'Thyolo',
  'Chikwawa'
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: 'Free',
    price: 0,
    listingsLimit: 1,
    features: ['1 active listing', 'Standard search visibility', 'Basic support'],
    color: 'border-slate-200 text-slate-800'
  },
  {
    name: 'Basic',
    price: 15000, // MWK 15,000 / month
    listingsLimit: 5,
    features: ['Up to 5 active listings', 'WhatsApp button enabled', 'Basic visitor analytics', 'Email reminders'],
    color: 'border-blue-200 bg-blue-50/50 text-blue-900'
  },
  {
    name: 'Premium',
    price: 35000, // MWK 35,000 / month
    listingsLimit: 20,
    features: ['Up to 20 active listings', 'Featured listing tags', 'WhatsApp direct API calls', 'Complete analytics dashboard', 'Invoice auto-generation', '24/7 Priority support'],
    color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900'
  },
  {
    name: 'Enterprise',
    price: 85000, // MWK 85,000 / month
    listingsLimit: 100,
    features: ['Unlimited listings', 'Premium placement & banner display', 'Dedicated account manager', 'API access for automated sync', 'Custom localized landing pages'],
    color: 'border-amber-200 bg-amber-50/50 text-amber-900'
  }
];

export const INITIAL_OWNER_PROFILE: OwnerProfile = {
  id: 'owner-1',
  name: 'Chisomo Phiri',
  email: 'chisomo.phiri@kwanuproperties.mw',
  phone: '+265888123456',
  whatsApp: '+265888123456',
  bankName: 'National Bank of Malawi',
  accountNumber: '1004567890',
  mobileMoneyProvider: 'Airtel Money',
  mobileMoneyNumber: '+265999123456',
  subscriptionPlan: 'Premium',
  subscriptionExpires: '2026-08-31',
  autoRenew: true
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    name: 'Elegant 3-Bedroom House in Area 12',
    category: PropertyCategory.HOUSE_RENT,
    listingType: ListingType.RENT,
    status: PropertyStatus.AVAILABLE,
    description: 'A spacious and secure modern house located in the prime residential Area 12 of Lilongwe. The property features high-ceiling rooms, a modern kitchen with a pantry, a manicured garden, and reliable backup electricity. Perfectly suited for families or professionals seeking comfort and security.',
    price: 1200000, // 1.2M MWK
    currency: 'MWK',
    negotiable: true,
    bedrooms: 3,
    bathrooms: 2,
    parking: true,
    kitchen: true,
    internet: true,
    water: true,
    electricity: true,
    security: '24/7 Security guards, Electric fence & Gate',
    amenities: ['Manicured lawn', 'Backup Inverter System', 'Air Conditioning', 'Water Tank Reserve'],
    rules: ['No loud parties after 10 PM', 'Pets allowed upon request'],
    images: [
      'https://picsum.photos/seed/house1/800/600',
      'https://picsum.photos/seed/house1-int/800/600',
    ],
    district: 'Lilongwe',
    city: 'Lilongwe',
    area: 'Area 12',
    landmark: 'Near Chinese Grand Business Park',
    latitude: -13.9632,
    longitude: 33.7821,
    ownerName: 'Chisomo Phiri',
    ownerEmail: 'chisomo.phiri@kwanuproperties.mw',
    ownerPhone: '+265888123456',
    ownerWhatsApp: '265888123456',
    isApproved: true,
    viewsCount: 342,
    createdDate: '2026-06-01',
    updatedDate: '2026-07-01',
    reviews: [
      {
        id: 'rev-1',
        customerName: 'Tiyamike Banda',
        cleanliness: 5,
        communication: 5,
        value: 4,
        location: 5,
        overall: 4.8,
        comment: 'Beautiful place, very quiet neighborhood. Chisomo is extremely responsive and professional.',
        date: '2026-06-15',
        reply: 'Thank you Tiyamike! It was a pleasure hosting you during your short stay.'
      }
    ]
  },
  {
    id: 'prop-2',
    name: 'Modern Executive Apartment in Namiwawa',
    category: PropertyCategory.APARTMENT,
    listingType: ListingType.RENT,
    status: PropertyStatus.AVAILABLE,
    description: 'Highly finished 2-bedroom executive apartment located in Namiwawa, Blantyre. This unit is part of a secure gated community, offering spectacular views of Soche Mountain. Rent includes water, internet, and top-tier security.',
    price: 850000, // 850k MWK
    currency: 'MWK',
    negotiable: false,
    bedrooms: 2,
    bathrooms: 2,
    parking: true,
    kitchen: true,
    internet: true,
    water: true,
    electricity: true,
    security: 'Perimeter wall, CCTV, 24-hr guards',
    amenities: ['Swimming Pool', 'Fitted Wardrobes', 'High Speed Fibre', 'Standby Generator'],
    rules: ['No smoking inside', 'Strictly maximum 4 occupants'],
    images: [
      'https://picsum.photos/seed/apt1/800/600',
      'https://picsum.photos/seed/apt1-int/800/600'
    ],
    district: 'Blantyre',
    city: 'Blantyre',
    area: 'Namiwawa',
    landmark: 'Near Ryalls Hotel Branch Office',
    latitude: -15.7861,
    longitude: 35.0058,
    ownerName: 'Tamara Gondwe',
    ownerEmail: 'tamara.gondwe@gmail.com',
    ownerPhone: '+265999876543',
    ownerWhatsApp: '265999876543',
    isApproved: true,
    viewsCount: 189,
    createdDate: '2026-06-10',
    updatedDate: '2026-06-25',
    reviews: []
  },
  {
    id: 'prop-3',
    name: 'Soche Hillside Family Bed Sitter',
    category: PropertyCategory.BED_SITTER,
    listingType: ListingType.MONTHLY,
    status: PropertyStatus.RENTED,
    description: 'Compact and cozy bed sitter with its own separate cooking area and shower. Ideally located near the foot of Soche Mountain in Blantyre, close to public transport. Water is included, electricity is prepaid (Escom single phase).',
    price: 150000, // 150k MWK
    currency: 'MWK',
    negotiable: true,
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    kitchen: true,
    internet: false,
    water: true,
    electricity: true,
    security: 'Fenced yard',
    amenities: ['Prepaid Escom Meter', 'Tiled Floor'],
    rules: ['Rent payable by the 1st of every month'],
    images: [
      'https://picsum.photos/seed/bedsitter/800/600'
    ],
    district: 'Blantyre',
    city: 'Blantyre',
    area: 'Soche',
    landmark: 'Soche Technical College',
    latitude: -15.8123,
    longitude: 35.0214,
    ownerName: 'Limbani Chimwaza',
    ownerEmail: 'l.chimwaza@hotmail.com',
    ownerPhone: '+265888234567',
    ownerWhatsApp: '265888234567',
    isApproved: true,
    viewsCount: 94,
    createdDate: '2026-05-15',
    updatedDate: '2026-05-15',
    reviews: []
  },
  {
    id: 'prop-4',
    name: 'Lakeside Holiday Villa in Cape Maclear',
    category: PropertyCategory.AIRBNB,
    listingType: ListingType.NIGHTLY,
    status: PropertyStatus.AVAILABLE,
    description: 'Paradise awaits at this magnificent beachfront villa located in the heart of Cape Maclear, Mangochi. Features a private deck overlooking Lake Malawi, direct beach access, fully functional kitchen, solar system backup, and a private chef upon request. Live the dream!',
    price: 120000, // 120k MWK / Night
    currency: 'MWK',
    negotiable: false,
    bedrooms: 4,
    bathrooms: 3,
    parking: true,
    kitchen: true,
    internet: true,
    water: true,
    electricity: true,
    security: 'Gated compound with dedicated beach watchman',
    amenities: ['Direct Beach Access', 'Private Kayaking Gear', 'Sun Loungers', 'Backup Solar Power'],
    rules: ['Keep the beach clean', 'Check-out by 11:00 AM'],
    images: [
      'https://picsum.photos/seed/beachhouse/800/600',
      'https://picsum.photos/seed/beachhouse-deck/800/600'
    ],
    district: 'Mangochi',
    city: 'Cape Maclear',
    area: 'Chembe Village',
    landmark: 'Next to Danforth Yachting',
    latitude: -14.0253,
    longitude: 34.8456,
    ownerName: 'Chisomo Phiri',
    ownerEmail: 'chisomo.phiri@kwanuproperties.mw',
    ownerPhone: '+265888123456',
    ownerWhatsApp: '265888123456',
    isApproved: true,
    viewsCount: 612,
    createdDate: '2026-05-01',
    updatedDate: '2026-07-09',
    liveRoomAvailability: 'Few Rooms Left',
    reviews: [
      {
        id: 'rev-2',
        customerName: 'Robert Henderson',
        cleanliness: 5,
        communication: 4,
        value: 5,
        location: 5,
        overall: 4.8,
        comment: 'Absolutely stunning views. Waking up to the calm waters of Lake Malawi is healing. Highly recommended!',
        date: '2026-07-05'
      }
    ]
  },
  {
    id: 'prop-5',
    name: 'Prime Agricultural Land in Kasungu',
    category: PropertyCategory.LAND,
    listingType: ListingType.SALE,
    status: PropertyStatus.AVAILABLE,
    description: '5 Hectares of highly fertile red loam soil, perfect for commercial tobacco, groundnuts, or maize farming. Located just 12km from Kasungu Boma, with direct gravel road access and proximity to a flowing river basin for irrigation purposes.',
    price: 8500000, // 8.5M MWK
    currency: 'MWK',
    negotiable: true,
    bedrooms: 0,
    bathrooms: 0,
    parking: false,
    kitchen: false,
    internet: false,
    water: true, // river nearby
    electricity: false,
    security: 'Natural boundary, demarcated with concrete pillars',
    amenities: ['River Water Rights', 'Access Road', 'Fertile Loam Soil'],
    rules: ['Title Deed available for prompt transfer', 'Customary land converted to leasehold'],
    images: [
      'https://picsum.photos/seed/land/800/600'
    ],
    district: 'Kasungu',
    city: 'Kasungu',
    area: 'Chulu East',
    landmark: 'Near Chulu ADMARC Depot',
    latitude: -13.0125,
    longitude: 33.4852,
    ownerName: 'Alick Phiri',
    ownerEmail: 'alick.phiri@outlook.com',
    ownerPhone: '+265999456789',
    ownerWhatsApp: '265999456789',
    isApproved: true,
    viewsCount: 220,
    createdDate: '2026-06-15',
    updatedDate: '2026-06-15',
    reviews: []
  },
  {
    id: 'prop-6',
    name: 'Zomba Student Accommodation Block',
    category: PropertyCategory.STUDENT_HOUSING,
    listingType: ListingType.MONTHLY,
    status: PropertyStatus.AVAILABLE,
    description: 'Excellent and highly secure student hostel units, located just 5 minutes walk from UNIMA (Chancellor College) main gate. High-speed Wi-Fi included. Shared kitchen with gas hobs and clean laundry facilities. Individual study desks provided in each room.',
    price: 75000, // 75k MWK per month per student
    currency: 'MWK',
    negotiable: false,
    bedrooms: 1,
    bathrooms: 1,
    parking: true,
    kitchen: true,
    internet: true,
    water: true,
    electricity: true,
    security: 'Walled fencing, lockable gates, student warden on site',
    amenities: ['Student Study Desks', 'Fibre Wi-Fi Network', 'Gas Stoves', 'Water Reservoirs'],
    rules: ['No visitors of opposite gender after 9 PM', 'Quiet study hours from 7 PM'],
    images: [
      'https://picsum.photos/seed/student/800/600',
      'https://picsum.photos/seed/student-room/800/600'
    ],
    district: 'Zomba',
    city: 'Zomba',
    area: 'Chinamwali',
    landmark: 'Opposite Chinamwali Primary School',
    latitude: -15.3856,
    longitude: 35.3341,
    ownerName: 'Mrs. Emily Chanza',
    ownerEmail: 'chanzaemily@unima-hostels.mw',
    ownerPhone: '+265888345678',
    ownerWhatsApp: '265888345678',
    isApproved: true,
    viewsCount: 412,
    createdDate: '2026-04-10',
    updatedDate: '2026-07-01',
    reviews: [
      {
        id: 'rev-3',
        customerName: 'Hope Mwalwanda',
        cleanliness: 4,
        communication: 5,
        value: 5,
        location: 5,
        overall: 4.6,
        comment: 'Best student housing in Chinamwali. Very safe for female students, study tables are super helpful!',
        date: '2026-06-20'
      }
    ]
  },
  {
    id: 'prop-7',
    name: 'Executive Commercial Office Space - Blantyre CBD',
    category: PropertyCategory.OFFICE,
    listingType: ListingType.COMMERCIAL_LEASE,
    status: PropertyStatus.COMING_SOON,
    description: 'Modern open-plan commercial office space measuring 150 sqm in a high-rise tower in the heart of Blantyre CBD. Features luxury central air conditioning, backup Escom power generation, reserved secure underground parking, and glass partitions.',
    price: 2500000, // 2.5M MWK / Month
    currency: 'MWK',
    negotiable: true,
    bedrooms: 0,
    bathrooms: 2,
    parking: true,
    kitchen: true,
    internet: true,
    water: true,
    electricity: true,
    security: 'Professional corporate security guards & biometric access',
    amenities: ['Central Aircon', 'Lift Access', 'Backup Generator', 'Fitted Server Room'],
    rules: ['Corporate lease only, minimum 2 years contract'],
    images: [
      'https://picsum.photos/seed/office/800/600'
    ],
    district: 'Blantyre',
    city: 'Blantyre',
    area: 'CBD',
    landmark: 'Opposite Reserve Bank of Malawi',
    latitude: -15.7821,
    longitude: 35.0084,
    ownerName: 'Corporate Holdings Ltd',
    ownerEmail: 'leases@corporateholdings.mw',
    ownerPhone: '+265111824356',
    ownerWhatsApp: '265111824356',
    isApproved: false, // Under admin review
    viewsCount: 42,
    createdDate: '2026-07-08',
    updatedDate: '2026-07-08',
    reviews: []
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    propertyId: 'prop-4',
    propertyName: 'Lakeside Holiday Villa in Cape Maclear',
    customerName: 'Robert Henderson',
    customerEmail: 'robert.henderson@expat-mw.org',
    customerPhone: '+265999555111',
    startDate: '2026-07-12',
    endDate: '2026-07-15',
    totalPrice: 360000, // 3 nights @ 120,000 MWK
    status: 'Confirmed',
    paymentMethod: 'Visa',
    createdDate: '2026-07-04',
    invoiceNumber: 'INV-2026-0091',
    receiptNumber: 'REC-2026-0091'
  },
  {
    id: 'book-2',
    propertyId: 'prop-1',
    propertyName: 'Elegant 3-Bedroom House in Area 12',
    customerName: 'Kondwani Mtambo',
    customerEmail: 'k.mtambo@un.org',
    customerPhone: '+265888555222',
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    totalPrice: 1200000,
    status: 'Pending',
    createdDate: '2026-07-09',
    invoiceNumber: 'INV-2026-0104'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    propertyId: 'prop-1',
    propertyName: 'Elegant 3-Bedroom House in Area 12',
    customerName: 'Jacqueline Mndala',
    customerEmail: 'jackie.mndala@gmail.com',
    customerPhone: '+265999222444',
    message: 'Hello, is this house negotiable to around MWK 1,000,000 per month for long-term lease? Also, does it have water reserve tanks fitted already?',
    createdDate: '2026-07-08T14:32:00Z',
    replied: true,
    replyMessage: 'Yes, Jacqueline. The price is negotiable for leases of 12 months or more. Water reserve tanks of 5000L with an electric pump are fully fitted on site.'
  },
  {
    id: 'enq-2',
    propertyId: 'prop-4',
    propertyName: 'Lakeside Holiday Villa in Cape Maclear',
    customerName: 'Lyson Phiri',
    customerEmail: 'lyson.p@gmail.com',
    customerPhone: '+265888777111',
    message: 'Do you offer catering services or a private chef? We are a group of six planning a weekend getaway.',
    createdDate: '2026-07-10T05:20:00Z',
    replied: false
  }
];

export const ADMIN_METRICS = {
  totalUsers: 1420,
  activeOwners: 214,
  pendingVerifications: 12,
  pendingPropertyApprovals: 8,
  totalBookings: 610,
  totalPlatformRevenue: 18450000, // MWK from owner subscriptions
  monthlyOwnerGrowth: 18.4,
  monthlyListingGrowth: 22.1
};
