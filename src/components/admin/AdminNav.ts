export interface AdminNavItem {
  label: string;
  href: string;
  icon: 'dashboard' | 'property' | 'lead' | 'viewing' | 'application' | 'submission' | 'insight' | 'users';
}

export const adminNav: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Properties', href: '/admin/properties', icon: 'property' },
  { label: 'Leads', href: '/admin/leads', icon: 'lead' },
  { label: 'Viewings', href: '/admin/viewings', icon: 'viewing' },
  { label: 'Applications', href: '/admin/applications', icon: 'application' },
  { label: 'Owner Submissions', href: '/admin/submissions', icon: 'submission' },
  { label: 'Insights', href: '/admin/insights', icon: 'insight' },
  { label: 'Users', href: '/admin/users', icon: 'users' },
];

export const agentNav: AdminNavItem[] = [
  { label: 'My Leads', href: '/agent', icon: 'lead' },
  { label: 'My Viewings', href: '/agent/viewings', icon: 'viewing' },
  { label: 'Applications', href: '/agent/applications', icon: 'application' },
];
