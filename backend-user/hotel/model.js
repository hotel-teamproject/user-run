const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomType: { 
    type: String, 
    required: true, 
    enum: ['Standard', 'Deluxe', 'Premium', 'Suite', 'Family', 'VIP']
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  originalPrice: { 
    type: Number, 
    default: 0 
  },
  capacity: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 8 
  },
  beds: {
    single: { type: Number, default: 0 },
    double: { type: Number, default: 0 },
    extra: { type: Number, default: 0 }
  },
  amenities: { 
    type: [String], 
    default: [] 
  },
  images: { 
    type: [String], 
    default: [] 
  },
  area: { 
    type: Number, 
    default: 0 
  },
  availableDates: { 
    type: [Date], 
    default: [] 
  },
  maxAvailable: { 
    type: Number, 
    default: 0 
  }
}, { _id: false });

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  description: { type: String }
}, { _id: false });

const LocationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  zipcode: { type: String },
  placeId: { type: String } // Google Places ID
}, { _id: false });

const ContactSchema = new mongoose.Schema({
  phone: { type: String },
  email: { type: String },
  website: { type: String }
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  images: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const HotelSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    maxlength: 200 
  },
  slug: { 
    type: String, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  description: { 
    type: String, 
    maxlength: 2000 
  },
  shortDescription: { 
    type: String, 
    maxlength: 200 
  },
  location: { 
    type: LocationSchema, 
    required: true 
  },
  images: { 
    type: [String], 
    default: [] 
  },
  thumbnail: { 
    type: String 
  },
  rooms: [RoomSchema],
  stars: { 
    type: Number, 
    min: 1, 
    max: 5,
    default: 3 
  },
  facilities: [FacilitySchema],
  contact: { type: ContactSchema },
  policies: {
    checkIn: { type: String },
    checkOut: { type: String },
    children: { type: String },
    pets: { type: String },
    payment: { type: String }
  },
  reviews: [ReviewSchema],
  reviewStats: {
    total: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    ratings: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  tags: [{ 
    type: String, 
    lowercase: true 
  }],
  meta: {
    views: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
HotelSchema.virtual('rating').get(function() {
  return this.reviewStats.average;
});

HotelSchema.virtual('totalReviews').get(function() {
  return this.reviewStats.total;
});

// Indexes
HotelSchema.index({ slug: 1 });
HotelSchema.index({ 'location.city': 1 });
HotelSchema.index({ stars: 1 });
HotelSchema.index({ 'location.lat': 1, 'location.lng': 1 });
HotelSchema.index({ tags: 1 });
HotelSchema.index({ isActive: 1, featured: 1 });

// Pre-save middleware
HotelSchema.pre('save', function(next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
  next();
});

module.exports = mongoose.model('Hotel', HotelSchema);
