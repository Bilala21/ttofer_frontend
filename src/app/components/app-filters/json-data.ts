export const filter_fields: any = {
  locations: [
    'Dubai',
    'Abu Dhabi',
    'Ras Al-Khaimah',
    'Ajman',
    'New York, USA',
    'Sharjah',
  ],
  mobiles: {
    seller_types: ['Verified', 'Unverified'],
    conditions: ['All', 'New', 'Used', 'Refurbished'],
  },
  'property-for-sale': {
    seller_types: ['Landlord', 'Agent'],
    conditions: ['All', 'Ready', 'Off plan'],
    bedrooms: [1, 2, 3, 4, 5, 6, 7, 8],
    bathrooms: [1, 2, 3, 4, 5],
    area_size: [1, 2, 3, 4, 5],
  },
  vehicles: {
    seller_types: ['Owner', 'Dealer'],
    conditions: ['All', 'New', 'Used'],
  },
  'property-for-rent': {
    seller_types: ['Landlord', 'Agent'],
    conditions: ['All', 'Furnished', 'Unfurnished'],
    rent_is_paid: ['Yearly', 'Monthly', 'Quarterly', 'Bi-Yearly'],
    bedrooms: [1, 2, 3, 4, 5, 6, 7, 8],
    bathrooms: [1, 2, 3, 4, 5],
    area_size: [1, 2, 3, 4, 5],
  },

  'electronics-appliance': {
    seller_types: ['Landlord', 'Agent'],
    conditions: ['Any', 'Refurbished', 'New', 'Used'],
  },
  bikes: {
    seller_types: ['Owner', 'Dealer'],
    conditions: ['All', 'New', 'Used'],
  },
  jobs: {
    seller_types: ['Hiring', 'Looking'],
    typeofwork: [
      'Remote',
      'Offline',
      'Remote Full time',
      'Remote Part time',
      `Part
        time`,
      `Full time`,
    ],
  },
  services: {
    seller_types: ['Landlord', 'Agent'],
    conditions: ['Refurbished', 'Dealer'],
  },
  animals: {
    seller_types: ['Landlord', 'Agent'],
  },
  'furniture-home-decor': {
    seller_types: ['Owner', 'Agent'],
    conditions: ['All', 'New', 'Used'],
  },

  'fashion-beauty': {
    seller_types: ['Landlord', 'Agent'],
    conditions: ['All', 'New', 'Used'],
  },
  kids: {
    seller_types: ['Landlord', 'Agent'],
    conditions: ['All', 'new', 'Used'],
  },
  delivery: ['Local Delivery', 'Pick Up', 'Shipping'],
};
