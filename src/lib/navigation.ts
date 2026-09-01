export interface NavItem {
  label: string;
  href: string;
}

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/rent' },
  { label: 'Sell Your Property', href: '/sell-your-property' },
  { label: 'Property Management', href: '/property-management' },
  { label: 'Diaspora Buyers', href: '/diaspora-buyers' },
  { label: 'Property Insights', href: '/property-insights' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export const quickLinks: NavItem[] = [
  { label: 'Search Properties', href: '/properties' },
  { label: 'Find Me a Property', href: '/find-a-property' },
  { label: 'Find a Rental', href: '/find-a-rental' },
  { label: 'Rental Applications', href: '/rent' },
  { label: 'Property Insights', href: '/property-insights' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];
