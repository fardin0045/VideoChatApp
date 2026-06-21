import { Link, useLocation } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { BellIcon, Earth, HomeIcon, UsersIcon, UsersRoundIcon } from 'lucide-react';

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/friends', label: 'Friends', icon: UsersIcon },
    { to: '/groups', label: 'Groups', icon: UsersRoundIcon },
    { to: '/notifications', label: 'Notifications', icon: BellIcon },
  ];

  return (
    <aside className="w-64 bg-base-200/80 backdrop-blur-md border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm">

      {/* Logo */}
      <div className="p-3.5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Earth className="size-9 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -inset-1 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary tracking-wider">
            Next Meet
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive = currentPath === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content/70 hover:bg-base-300/60 hover:text-base-content'
                }`}
            >
              {/* active indicator bar */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-primary to-secondary transition-all duration-200
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`}
              />
              <Icon
                className={`size-5 transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-base-content/60 group-hover:text-base-content'
                }`}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300/50 transition-colors duration-200 cursor-pointer">
          <div className="avatar">
            <div className="w-10 rounded-full ring-2 ring-primary/40 ring-offset-base-200 ring-offset-1">
              <img src={authUser?.profilePic} alt={authUser?.fullName || 'User Avatar'} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-success inline-block animate-pulse" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;