// frontend/app/page.tsx
import { Dashboard } from '@/components/dashboard/dashboard';

// This page is a Server Component — only the Dashboard subtree is client
export default function Home() {
  return <Dashboard />;
}
