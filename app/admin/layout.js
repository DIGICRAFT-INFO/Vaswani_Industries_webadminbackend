import { AuthProvider } from '@/lib/AuthContext';

export const metadata = {
  title: 'Admin CMS | Vaswani Industries',
  description: 'Enterprise Management Portal for VIL',
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
