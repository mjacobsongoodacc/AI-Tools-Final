import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginScreen from './LoginScreen';

export default function AuthGate() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-bone-40 text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <LoginScreen />;
  }

  return <Outlet />;
}
