/**
 * Shared site contact and SEO-related constants (single source of truth).
 */
export const SITE_PHONE_LABEL = 'Budget Limousine';
export const SITE_PHONE_DISPLAY = '(973) 737-7000';
/** E.164-style value for tel: href */
export const SITE_PHONE_HREF = 'tel:+19737377000';
export const SITE_EMAIL = 'Info@budgetlimonj.com';
export const SITE_EMAIL_HREF = 'mailto:Info@budgetlimonj.com';

export const SITE_ORIGIN = 'https://www.limoservice-nj.com';

/** Footer services: label -> query param slug for dynamic About on home */
export const FOOTER_SERVICE_LINKS = [
  { label: 'Airport Transfer', slug: 'airport-transfer' },
  { label: 'City Tours', slug: 'city-tours' },
  { label: 'Corporate Travel', slug: 'corporate-travel' },
  { label: 'Special Events', slug: 'special-events' },
  { label: 'Hourly Hire', slug: 'hourly-hire' },
] as const;
