import { NavLink, useNavigate } from 'react-router-dom';
import {
  DashboardIcon,
  FileTextIcon,
  BarChartIcon,
  GearIcon,
  ExitIcon,
  CheckCircledIcon,
  HamburgerMenuIcon,
  Cross2Icon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import { useAuth } from '../context/AuthContext';
import { getUserDisplayName } from '../utils/authUserDisplay';
import { mockWorkspace } from '../data/mockData';

const navItems = [
  { to: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
  { to: '/documents', icon: FileTextIcon, label: 'Documents' },
  { to: '/analysis', icon: BarChartIcon, label: 'Analysis' },
  { to: '/settings', icon: GearIcon, label: 'Settings' },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-bone-15">
        <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center flex-shrink-0">
          <CheckCircledIcon width={16} height={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">DiligenceAI</p>
          <p className="text-bone-40 text-xs truncate">{mockWorkspace.name}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors group ${
                isActive
                  ? 'bg-accent/12 text-accent border border-accent/35'
                  : 'text-bone-70 hover:text-white hover:bg-bone-5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon width={17} height={17} className={isActive ? 'text-accent' : 'text-bone-40 group-hover:text-bone-70'} />
                <span>{label}</span>
                {isActive && <ChevronRightIcon width={14} height={14} className="ml-auto text-accent/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-bone-15">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-sm mb-1">
          <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/35 flex items-center justify-center flex-shrink-0">
            <span className="text-accent text-xs font-semibold">
              {(getUserDisplayName(user) || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-bone-70 text-xs font-medium truncate">
              {getUserDisplayName(user) || user?.email || 'User'}
            </p>
            <p className="text-bone-40 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-bone-70 hover:text-white hover:bg-bone-5 transition-colors"
        >
          <ExitIcon width={16} height={16} className="text-bone-40" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-black border-r border-bone-15 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-bone-15 z-50 lg:hidden transform transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-bone-70 hover:text-white hover:bg-bone-5 rounded-sm"
          >
            <Cross2Icon width={18} height={18} />
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-bone-70 hover:text-white hover:bg-bone-5 rounded-sm"
      aria-label="Open menu"
    >
      <HamburgerMenuIcon width={20} height={20} />
    </button>
  );
}
