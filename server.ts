import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Property, PropertyCategory, ListingType, PropertyStatus, Booking, Enquiry, FraudReport, SavedSearch, NearbyService, RentalHistoryRecord } from './src/types';

// We import mock data to seed our server state
import { INITIAL_PROPERTIES, INITIAL_BOOKINGS, INITIAL_ENQUIRIES } from './src/data';

const app = express();
const PORT = 3000;

app.use(express.json());

// Server in-memory state
let properties: Property[] = [...INITIAL_PROPERTIES];
let bookings: Booking[] = [...INITIAL_BOOKINGS];
let enquiries: Enquiry[] = [...INITIAL_ENQUIRIES];
let fraudReports: FraudReport[] = [
  {
    id: 'rep-1',
    propertyId: 'prop-3',
    propertyName: 'Soche Hillside Family Bed Sitter',
    ownerName: 'Limbani Chimwaza',
    reporterName: 'Mwayi Phiri',
    reportType: 'Incorrect Price',
    details: 'The owner requested double the listed deposit upon viewing.',
    createdDate: '2026-07-01',
    status: 'Pending'
  }
];
let savedSearches: SavedSearch[] = [
  {
    id: 'ss-1',
    searchName: 'Area 12 3-bed with electricity',
    searchQuery: '3 bedroom Area 12',
    selectedCategory: '',
    selectedDistrict: 'Lilongwe',
    priceRange: 1500000,
    minBedrooms: 3,
    requireInternet: false,
    requireWater: false,
    requireElectricity: true,
    createdDate: '2026-07-01',
    notificationsCount: 2
  }
];

// Enrich initial properties with new features if missing
properties = properties.map((prop, idx) => {
  const updated = { ...prop };
  if (!updated.verificationStatus) {
    if (idx % 3 === 0) {
      updated.verificationStatus = ['Verified Owner', 'Identity Verified', 'Property Verified', 'Recently Inspected'];
    } else if (idx % 3 === 1) {
      updated.verificationStatus = ['Verified Owner', 'Identity Verified'];
    } else {
      updated.verificationStatus = [];
    }
  }
  if (!updated.featuredType) {
    if (idx === 0) updated.featuredType = 'Featured Property';
    else if (idx === 3) updated.featuredType = 'Top Search Result';
  }
  if (!updated.whatsappClicksCount) {
    updated.whatsappClicksCount = Math.floor(10 + Math.random() * 45);
  }
  if (!updated.bookingRatePercent) {
    updated.bookingRatePercent = Math.floor(65 + Math.random() * 30);
  }
  if (!updated.calendarEvents) {
    updated.calendarEvents = {
      '2026-07-15': 'Reserved',
      '2026-07-16': 'Occupied',
      '2026-07-17': 'Occupied',
      '2026-07-25': 'Maintenance'
    };
  }
  if (!updated.nearbyServices) {
    updated.nearbyServices = [
      { name: 'Lilongwe Academy', category: 'School', distance: '1.2 km' },
      { name: 'City Center Hospital', category: 'Hospital', distance: '2.5 km' },
      { name: 'Puma Filling Station Area 10', category: 'Filling Station', distance: '0.8 km' },
      { name: 'Area 18 Market', category: 'Market', distance: '1.9 km' }
    ];
  }
  if (!updated.rentalHistory) {
    updated.rentalHistory = [
      { date: '2026-06-01', event: 'Listed', description: 'Listing created by Chisomo Phiri' },
      { date: '2026-06-15', event: 'Viewed', description: 'Listing viewed 100 times' },
      { date: '2026-06-20', event: 'Enquired', description: 'Enquiry received from Tiyamike Banda' },
      { date: '2026-07-01', event: 'Reserved', description: 'Property reserved for corporate viewing' }
    ];
  }
  return updated;
});

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', propertiesCount: properties.length });
});

// Properties
app.get('/api/properties', (req, res) => {
  res.json(properties);
});

app.post('/api/properties', (req, res) => {
  const newProp: Property = {
    ...req.body,
    id: `prop-${Date.now()}`,
    viewsCount: 0,
    whatsappClicksCount: 0,
    bookingRatePercent: 0,
    createdDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0],
    verificationStatus: [],
    rentalHistory: [{ date: new Date().toISOString().split('T')[0], event: 'Listed', description: 'Property listed on Kwanu Direct' }]
  };
  properties.unshift(newProp);
  res.status(201).json(newProp);
});

// Update Property Status
app.put('/api/properties/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let updatedProp: Property | null = null;
  properties = properties.map(p => {
    if (p.id === id) {
      const history = p.rentalHistory || [];
      const eventName = status === 'Rented' || status === 'Sold' ? 'Rented' : 'Reserved';
      updatedProp = {
        ...p,
        status,
        updatedDate: new Date().toISOString().split('T')[0],
        rentalHistory: [
          ...history,
          { date: new Date().toISOString().split('T')[0], event: eventName as any, description: `Status changed to ${status}` }
        ]
      };
      return updatedProp;
    }
    return p;
  });
  if (updatedProp) {
    res.json(updatedProp);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// Delete Property
app.delete('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  properties = properties.filter(p => p.id !== id);
  res.json({ success: true });
});

// WhatsApp Clicks Counter
app.post('/api/properties/:id/whatsapp-click', (req, res) => {
  const { id } = req.params;
  let clicks = 0;
  properties = properties.map(p => {
    if (p.id === id) {
      const clickCount = (p.whatsappClicksCount || 0) + 1;
      clicks = clickCount;
      const history = p.rentalHistory || [];
      return {
        ...p,
        whatsappClicksCount: clickCount,
        rentalHistory: [
          ...history,
          { date: new Date().toISOString().split('T')[0], event: 'Enquired', description: 'User clicked WhatsApp Direct link' }
        ]
      };
    }
    return p;
  });
  res.json({ success: true, whatsappClicksCount: clicks });
});

// Update Calendar Event Status
app.post('/api/properties/:id/calendar', (req, res) => {
  const { id } = req.params;
  const { date, status } = req.body; // status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance'
  let updatedProp: Property | null = null;
  properties = properties.map(p => {
    if (p.id === id) {
      const calendarEvents = { ...(p.calendarEvents || {}) };
      if (status === 'Available') {
        delete calendarEvents[date];
      } else {
        calendarEvents[date] = status;
      }
      updatedProp = {
        ...p,
        calendarEvents
      };
      return updatedProp;
    }
    return p;
  });
  if (updatedProp) {
    res.json(updatedProp);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// Admin Verify Property status badges
app.post('/api/properties/:id/verify', (req, res) => {
  const { id } = req.params;
  const { verificationStatus, isApproved } = req.body;
  let updatedProp: Property | null = null;
  properties = properties.map(p => {
    if (p.id === id) {
      updatedProp = {
        ...p,
        verificationStatus: verificationStatus || p.verificationStatus,
        isApproved: isApproved !== undefined ? isApproved : p.isApproved
      };
      return updatedProp;
    }
    return p;
  });
  if (updatedProp) {
    res.json(updatedProp);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// Bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const newBooking: Booking = {
    ...req.body,
    id: `book-${Date.now()}`,
    createdDate: new Date().toISOString().split('T')[0],
    invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
  };
  bookings.unshift(newBooking);
  res.status(201).json(newBooking);
});

// Update Booking Status
app.put('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let updatedBooking: Booking | null = null;
  bookings = bookings.map(b => {
    if (b.id === id) {
      updatedBooking = { ...b, status };
      if (status === 'Confirmed') {
        updatedBooking.receiptNumber = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      return updatedBooking;
    }
    return b;
  });
  if (updatedBooking) {
    res.json(updatedBooking);
  } else {
    res.status(404).json({ error: 'Booking not found' });
  }
});

// Enquiries
app.get('/api/enquiries', (req, res) => {
  res.json(enquiries);
});

app.post('/api/enquiries', (req, res) => {
  const newEnq: Enquiry = {
    ...req.body,
    id: `enq-${Date.now()}`,
    createdDate: new Date().toISOString().split('T')[0],
    replied: false
  };
  enquiries.unshift(newEnq);
  res.status(201).json(newEnq);
});

// Reply to Enquiry
app.post('/api/enquiries/:id/reply', (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;
  let updatedEnq: Enquiry | null = null;
  enquiries = enquiries.map(e => {
    if (e.id === id) {
      updatedEnq = { ...e, replied: true, replyMessage };
      return updatedEnq;
    }
    return e;
  });
  if (updatedEnq) {
    res.json(updatedEnq);
  } else {
    res.status(404).json({ error: 'Enquiry not found' });
  }
});

// Fraud Reports
app.get('/api/reports', (req, res) => {
  res.json(fraudReports);
});

app.post('/api/reports', (req, res) => {
  const newReport: FraudReport = {
    ...req.body,
    id: `rep-${Date.now()}`,
    createdDate: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };
  fraudReports.unshift(newReport);
  res.status(201).json(newReport);
});

app.put('/api/reports/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  let updatedRep: FraudReport | null = null;
  fraudReports = fraudReports.map(r => {
    if (r.id === id) {
      updatedRep = { ...r, status };
      return updatedRep;
    }
    return r;
  });
  if (updatedRep) {
    res.json(updatedRep);
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

// Saved Searches
app.get('/api/saved-searches', (req, res) => {
  res.json(savedSearches);
});

app.post('/api/saved-searches', (req, res) => {
  const newSearch: SavedSearch = {
    ...req.body,
    id: `ss-${Date.now()}`,
    createdDate: new Date().toISOString().split('T')[0],
    notificationsCount: Math.floor(Math.random() * 3)
  };
  savedSearches.unshift(newSearch);
  res.status(201).json(newSearch);
});

// AI Natural Language Search with Gemini API
app.post('/api/ai-search', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // If API key is missing or not configured, execute keyword-based backup smart search
    console.warn("GEMINI_API_KEY not set. Performing fallback smart search.");
    const tokens = prompt.toLowerCase().split(/\s+/);
    
    // Simple relevance scorer
    const scoredProperties = properties
      .filter(p => p.isApproved)
      .map(p => {
        let score = 0;
        const text = `${p.name} ${p.description} ${p.district} ${p.city} ${p.area} ${p.category} ${p.amenities.join(' ')}`.toLowerCase();
        
        tokens.forEach(tok => {
          if (tok.length > 2 && text.includes(tok)) {
            score += 1;
            // Boost exact matches
            if (p.name.toLowerCase().includes(tok)) score += 2;
            if (p.area.toLowerCase().includes(tok) || p.district.toLowerCase().includes(tok)) score += 3;
          }
        });
        
        // Extract bedrooms
        const bedMatch = prompt.match(/(\d+)\s*(?:bed|bedroom)/i);
        if (bedMatch) {
          const reqBeds = parseInt(bedMatch[1]);
          if (p.bedrooms === reqBeds) score += 5;
        }

        // Extract price constraints (e.g. 1M or 1,000,000 or 800k)
        let maxPrice = Infinity;
        if (prompt.includes('million') || prompt.includes('m ')) {
          const mMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:million|m)/i);
          if (mMatch) maxPrice = parseFloat(mMatch[1]) * 1000000;
        } else {
          const kMatch = prompt.match(/(\d+)\s*k/i);
          if (kMatch) maxPrice = parseInt(kMatch[1]) * 1000;
        }
        
        if (p.price <= maxPrice && maxPrice !== Infinity) {
          score += 3;
        }

        return { property: p, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score);

    const matches = scoredProperties.slice(0, 3).map(item => ({
      propertyId: item.property.id,
      matchExplanation: `Matches your interest in ${item.property.bedrooms} bedrooms, in ${item.property.area} (${item.property.price.toLocaleString()} MWK). This match was found using our responsive localized search algorithm.`
    }));

    return res.json({
      matches,
      message: matches.length > 0 
        ? `I found ${matches.length} matching properties based on keywords: "${tokens.slice(0, 4).join(', ')}". (Setup your GEMINI_API_KEY in Settings > Secrets for full AI understanding!)`
        : `No direct property matched your specific criteria. Try searching with broader keywords like 'Lilongwe', 'Area 12', or 'Apartment'.`
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // We pass light versions of the properties to avoid exceeding limits
    const propertiesContext = properties
      .filter(p => p.isApproved)
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        bedrooms: p.bedrooms,
        district: p.district,
        area: p.area,
        amenities: p.amenities,
        description: p.description.substring(0, 120) + '...'
      }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `User search query: "${prompt}"\n\nAvailable Properties in Malawi:\n${JSON.stringify(propertiesContext)}`,
      config: {
        systemInstruction: `You are Kwanu AI, the intelligent property search companion for the Malawi Property Marketplace.
Your job is to read the user's natural language request (usually containing preferred district, area, budget, bedrooms, or amenities) and compare it against the available properties.

You must return a JSON response matching this schema:
{
  "matches": [
    {
      "propertyId": "string (the exact ID of the matching property)",
      "matchExplanation": "string (1-2 sentences explaining why this property is a perfect fit for their request, mentioning specific matches like budget, location, or bedrooms)"
    }
  ],
  "message": "string (a warm, professional greeting and summarizing what you found, or explaining what to adjust if nothing matches)"
}

Rules:
1. Only recommend properties that exist in the provided list.
2. If nothing fits exactly, return a small list of closest alternatives (e.g., similar price or nearby location) and explain why you suggested them.
3. Keep the tone helpful, authentic, and direct. Refer to local Malawian conditions (e.g., power backup is highly valued in Area 12 Lilongwe or Soche Blantyre).`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  propertyId: { type: Type.STRING },
                  matchExplanation: { type: Type.STRING }
                },
                required: ['propertyId', 'matchExplanation']
              }
            },
            message: { type: Type.STRING }
          },
          required: ['matches', 'message']
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonStr);
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to process AI search', details: error.message });
  }
});

// Vite Middleware & SPA serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
