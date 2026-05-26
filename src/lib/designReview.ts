import { Booking, Category, Conversation, Message, Notification, PaymentCard, Review, Service, User } from './apiTypes';

export const isDesignReviewMode =
  import.meta.env.MODE === 'design' || import.meta.env.VITE_DISABLE_BACKEND === 'true';

const now = new Date().toISOString();
const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

const designUser: User = {
  _id: 'design-user-1',
  id: 'design-user-1',
  name: 'Ada Connect',
  email: 'ada@example.com',
  phone: '+2348012345678',
  role: 'admin',
  isActive: true,
  createdAt: now,
  updatedAt: now,
  profile: {
    bio: 'Design review profile',
    location: {
      address: 'Lekki Phase 1, Lagos',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
    verification: { verified: true },
  },
  providerDetails: {
    category: 'Cleaning',
    hourlyRate: 15000,
    yearsOfExperience: 5,
    servicesOffered: ['Home cleaning', 'Office cleaning', 'Move-in cleaning'],
  },
  rating: { average: 4.8, count: 124 },
  completedJobsCount: 86,
  wallet: { balance: 245000, currency: 'NGN' },
};

const customerUser: User = {
  _id: 'design-customer-1',
  id: 'design-customer-1',
  name: 'Tomi Adebayo',
  email: 'tomi@example.com',
  phone: '+2348098765432',
  role: 'customer',
  isActive: true,
  profile: {
    location: {
      address: 'Victoria Island, Lagos',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
    },
  },
};

const providerUser: User = {
  ...designUser,
  _id: 'design-provider-1',
  id: 'design-provider-1',
  name: 'Musa Okafor',
  role: 'provider',
};

const categories: Category[] = [
  { _id: 'cat-cleaning', name: 'Cleaning', description: 'Home and office cleaning', isActive: true },
  { _id: 'cat-plumbing', name: 'Plumbing', description: 'Repairs and installations', isActive: true },
  { _id: 'cat-electrical', name: 'Electrical', description: 'Electrical repair services', isActive: true },
  { _id: 'cat-tutoring', name: 'Tutoring', description: 'Private lessons and coaching', isActive: true },
  { _id: 'cat-beauty', name: 'Beauty', description: 'Hair, nails, and beauty care', isActive: true },
  { _id: 'cat-repair', name: 'Repair', description: 'Appliance and home repairs', isActive: true },
];

const services: Service[] = [
  {
    _id: 'service-cleaning',
    id: 'service-cleaning',
    name: 'Premium Home Cleaning',
    category: 'Cleaning',
    description: 'A detailed cleaning service for apartments, family homes, and small offices.',
    price: 18000,
    priceType: 'fixed',
    duration: 180,
    averageRating: 4.9,
    reviewCount: 86,
    isActive: true,
    provider: providerUser,
    location: { address: 'Lekki Phase 1, Lagos', city: 'Lagos', state: 'Lagos', country: 'Nigeria' },
  },
  {
    _id: 'service-plumbing',
    id: 'service-plumbing',
    name: 'Emergency Plumbing Repair',
    category: 'Plumbing',
    description: 'Fast leak repairs, fixture replacement, and pressure checks.',
    price: 12000,
    priceType: 'hourly',
    duration: 90,
    averageRating: 4.7,
    reviewCount: 52,
    isActive: true,
    provider: { ...providerUser, name: 'Chinedu Repairs' },
    location: { address: 'Yaba, Lagos', city: 'Lagos', state: 'Lagos', country: 'Nigeria' },
  },
  {
    _id: 'service-tutoring',
    id: 'service-tutoring',
    name: 'Maths and Science Tutor',
    category: 'Tutoring',
    description: 'Personalized WAEC, JAMB, and junior secondary coaching.',
    price: 9000,
    priceType: 'hourly',
    duration: 60,
    averageRating: 4.8,
    reviewCount: 39,
    isActive: true,
    provider: { ...providerUser, name: 'Grace Tutors' },
    location: { address: 'Ikeja, Lagos', city: 'Lagos', state: 'Lagos', country: 'Nigeria' },
  },
];

const bookings: Booking[] = [
  {
    _id: 'booking-1',
    id: 'booking-1',
    customer: customerUser,
    provider: providerUser,
    service: services[0],
    date: tomorrow,
    time: '10:00',
    duration: 180,
    status: 'confirmed',
    totalAmount: 18000,
    currency: 'NGN',
    paymentStatus: 'paid',
    address: { street: '12 Admiralty Way', city: 'Lagos', state: 'Lagos' },
    createdAt: now,
  },
  {
    _id: 'booking-2',
    id: 'booking-2',
    customer: customerUser,
    provider: providerUser,
    service: services[1],
    date: nextWeek,
    time: '14:30',
    duration: 90,
    status: 'pending',
    totalAmount: 12000,
    currency: 'NGN',
    paymentStatus: 'pending',
    address: { street: '8 Herbert Macaulay Way', city: 'Lagos', state: 'Lagos' },
    createdAt: now,
  },
  {
    _id: 'booking-3',
    id: 'booking-3',
    customer: customerUser,
    provider: providerUser,
    service: services[2],
    date: now,
    time: '09:00',
    duration: 60,
    status: 'completed',
    totalAmount: 9000,
    currency: 'NGN',
    paymentStatus: 'paid',
    rating: { value: 5, comment: 'Great session.', date: now },
    createdAt: now,
  },
];

const reviews: Review[] = [
  {
    _id: 'review-1',
    id: 'review-1',
    customer: customerUser,
    provider: providerUser,
    service: services[0],
    booking: bookings[0],
    rating: 5,
    comment: 'Friendly, punctual, and thorough.',
    createdAt: now,
  },
  {
    _id: 'review-2',
    id: 'review-2',
    customer: { ...customerUser, name: 'Kemi Johnson' },
    provider: providerUser,
    service: services[1],
    booking: bookings[1],
    rating: 4,
    comment: 'Quick response and clean work.',
    createdAt: now,
  },
];

const notifications: Notification[] = [
  {
    _id: 'notification-1',
    id: 'notification-1',
    user: designUser,
    title: 'Booking confirmed',
    message: 'Premium Home Cleaning is confirmed for tomorrow.',
    type: 'booking',
    read: false,
    createdAt: now,
  },
  {
    _id: 'notification-2',
    id: 'notification-2',
    user: designUser,
    title: 'Wallet credited',
    message: 'Your wallet balance has been updated.',
    type: 'payment',
    read: true,
    createdAt: now,
  },
];

const conversations: Conversation[] = [
  {
    _id: 'conversation-1',
    id: 'conversation-1',
    participants: [designUser, customerUser],
    service: services[0],
    booking: bookings[0],
    unreadCount: 2,
    lastMessage: { content: 'I will arrive by 10am.', sender: providerUser, timestamp: now },
    lastMessageAt: now,
    createdAt: now,
  },
];

const messages: Message[] = [
  {
    _id: 'message-1',
    id: 'message-1',
    conversation: conversations[0],
    sender: customerUser,
    recipient: providerUser,
    content: 'Hi, please bring cleaning supplies.',
    status: 'read',
    createdAt: now,
  },
  {
    _id: 'message-2',
    id: 'message-2',
    conversation: conversations[0],
    sender: providerUser,
    recipient: customerUser,
    content: 'No problem. I will arrive by 10am.',
    status: 'delivered',
    createdAt: now,
  },
];

const paymentCards: PaymentCard[] = [
  {
    _id: 'card-1',
    id: 'card-1',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: '08',
    expiryYear: '29',
    cardHolderName: 'Ada Connect',
    provider: 'Paystack',
    isDefault: true,
    status: 'active',
  },
];

const ok = <T>(data: T, extra: Record<string, unknown> = {}) => ({
  success: true,
  data,
  message: 'Design review response',
  ...extra,
});

const pickById = <T extends { _id?: string; id?: string }>(items: T[], endpoint: string) => {
  const id = endpoint.split('/').filter(Boolean).pop();
  return items.find(item => item._id === id || item.id === id) || items[0];
};

export const getDesignReviewResponse = (endpoint: string, method = 'GET') => {
  const path = endpoint.split('?')[0];

  if (path.includes('/auth/profile') || path.includes('/admin/auth/session')) {
    return ok({ user: designUser }, { user: designUser });
  }

  if (path.includes('/auth/login') || path.includes('/admin/auth/login')) {
    return ok({ user: designUser, token: 'design-review-token' }, { token: 'design-review-token' });
  }

  if (path.includes('/auth/register')) {
    return ok({ user: customerUser, token: 'design-review-token' }, { token: 'design-review-token' });
  }

  if (path.includes('/auth/logout') || path.includes('/auth/refresh') || path.includes('/admin/auth/logout')) {
    return ok({ user: designUser });
  }

  if (path.includes('/auth/forgot-password') || path.includes('/auth/reset-password')) {
    return ok('Password flow previewed locally');
  }

  if (path.startsWith('/services/search') || path === '/services') {
    return ok(services, { services, count: services.length });
  }

  if (path.startsWith('/services/') && method === 'GET') {
    const service = pickById(services, path);
    return ok(service, { service });
  }

  if (path.startsWith('/services')) {
    return ok(services[0], { service: services[0] });
  }

  if (path.startsWith('/categories')) {
    return ok(categories, { count: categories.length });
  }

  if (path.startsWith('/bookings/') && method === 'GET') {
    const booking = pickById(bookings, path);
    return ok(booking, { booking });
  }

  if (path.startsWith('/bookings')) {
    return ok(bookings, { bookings, booking: bookings[0], count: bookings.length });
  }

  if (path.includes('/wallet/balance')) {
    return ok(
      { balance: 245000, availableBalance: 220000, pendingBalance: 25000, currency: 'NGN' },
      { balance: 245000, availableBalance: 220000, pendingBalance: 25000, currency: 'NGN' },
    );
  }

  if (path.includes('/wallet/transactions')) {
    return ok([
      { _id: 'txn-1', type: 'credit', amount: 18000, title: 'Booking payment', status: 'completed', createdAt: now },
      { _id: 'txn-2', type: 'debit', amount: 5000, title: 'Withdrawal', status: 'pending', createdAt: now },
    ]);
  }

  if (path.includes('/wallet/banks')) {
    return ok([
      { id: 1, name: 'Access Bank', code: '044', longcode: '044150149' },
      { id: 2, name: 'GTBank', code: '058', longcode: '058152052' },
    ]);
  }

  if (path.includes('/wallet/resolve-account')) {
    return ok({ accountName: 'Ada Connect', accountNumber: '0123456789', bankId: 1 });
  }

  if (path.includes('/wallet/initialize-payment')) {
    return ok({ authorizationUrl: '#design-payment', accessCode: 'design-access', reference: 'design-ref', amount: 10000 });
  }

  if (path.includes('/wallet/verify-payment') || path.includes('/wallet/add-funds')) {
    return ok({ balance: 255000, currency: 'NGN', amountAdded: 10000 });
  }

  if (path.includes('/wallet/withdraw')) {
    return ok({ reference: 'design-withdrawal', amount: 5000, newBalance: 240000, transferStatus: 'pending' });
  }

  if (path.startsWith('/cards')) {
    return ok(paymentCards);
  }

  if (path.startsWith('/notifications')) {
    return ok(notifications, { notifications, count: notifications.length });
  }

  if (path.includes('/messages/conversations')) {
    return ok(path.split('/').length > 3 ? messages : conversations);
  }

  if (path.includes('/messages/unread')) {
    return ok({ count: 2 });
  }

  if (path.startsWith('/messages')) {
    return ok(messages[0], { message: messages[0] });
  }

  if (path.startsWith('/availability')) {
    return ok({
      _id: 'availability-1',
      provider: providerUser,
      providerId: providerUser._id,
      date: now.split('T')[0],
      isAvailable: true,
      slots: [
        { startTime: '09:00', endTime: '10:00', isBooked: false },
        { startTime: '10:00', endTime: '11:00', isBooked: true, bookingId: bookings[0] },
        { startTime: '14:00', endTime: '15:00', isBooked: false },
      ],
    });
  }

  if (path.startsWith('/reviews')) {
    return ok(reviews, { reviews, review: reviews[0], count: reviews.length, averageRating: 4.7 });
  }

  if (path.startsWith('/verification')) {
    return ok([
      { _id: 'verification-1', user: providerUser, documentType: 'NIN', status: 'pending', createdAt: now },
      { _id: 'verification-2', user: customerUser, documentType: 'BVN', status: 'approved', createdAt: now },
    ]);
  }

  if (path.startsWith('/receipts')) {
    return ok({
      _id: 'receipt-1',
      booking: bookings[0],
      provider: providerUser,
      service: services[0],
      transactionId: 'txn-1',
      totalAmount: 18000,
      serviceFee: 18000,
      platformFee: 900,
      currency: 'NGN',
      createdAt: now,
    });
  }

  if (path.startsWith('/analytics/stats')) {
    return ok({
      users: { total: 1280, active: 1114, providers: 320, customers: 960 },
      bookings: { total: 4320, pending: 48, completed: 3890 },
      revenue: { total: 24800000, month: 1850000 },
      reviews: { average: 4.7, total: 1834 },
    });
  }

  if (path.startsWith('/audit')) {
    return ok([
      { _id: 'audit-1', actorName: 'Admin Preview', actorRole: 'admin', action: 'approved', entityType: 'verification', createdAt: now },
      { _id: 'audit-2', actorName: 'System', actorRole: 'system', action: 'created', entityType: 'booking', createdAt: now },
    ]);
  }

  if (path.startsWith('/users')) {
    const users = [designUser, customerUser, providerUser];
    if (path.split('/').filter(Boolean).length > 1) {
      return ok({ user: pickById(users, path), bookings, reviews });
    }
    return ok(users, { count: users.length });
  }

  if (path.startsWith('/location/reverse-geocode')) {
    return ok({ address: 'Lekki Phase 1, Lagos', city: 'Lagos', state: 'Lagos', country: 'Nigeria' });
  }

  if (path.startsWith('/location/calculate-distance')) {
    return ok({ distanceKm: 4.2, durationMinutes: 18 });
  }

  return ok({});
};
