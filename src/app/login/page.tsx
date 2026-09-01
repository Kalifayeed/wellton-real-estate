import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Staff Login',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-stone-100 px-4 py-16">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
