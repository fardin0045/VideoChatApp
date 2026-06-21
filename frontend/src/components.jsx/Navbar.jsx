import { Link, useLocation } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';

import { BellIcon, EarthIcon, LogOutIcon, ChevronDownIcon, UserIcon, SettingsIcon, UsersRoundIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');

  const { mutate: logoutMutation, isPending } = useLogout();

  return (
    <nav className="bg-base-200/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between w-full">

          {/* LOGO - always on small/medium screens; only on the chat page at lg+ (Sidebar covers branding elsewhere on desktop) */}
          <div className="flex items-center">
            <Link
              to="/"
              className={`flex items-center gap-2 group ${isChatPage ? '' : 'lg:hidden'}`}
            >
              <div className="relative">
                <EarthIcon className="size-7 sm:size-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
                <span className="absolute -inset-1 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary tracking-wider">
                Next Meet
              </span>
            </Link>
          </div>

          {/* RIGHT SIDE CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notifications */}
            <Link to="/notifications" className="relative group">
              <button className="btn btn-ghost btn-circle hover:bg-primary/10 transition-colors duration-200">
                <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content/70 group-hover:text-primary" />
                {/* Notification dot - wire up to real unread state */}
                <span className="absolute top-2 right-2 size-2 rounded-full bg-error ring-2 ring-base-200" />
              </button>
            </Link>

            <Link to="/groups" className="relative group" aria-label="Group chats">
              <button className="btn btn-ghost btn-circle hover:bg-primary/10 transition-colors duration-200">
                <UsersRoundIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content/70 group-hover:text-primary" />
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Divider */}
            <div className="hidden sm:block h-8 w-px bg-base-300 mx-1" />

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 px-1.5 py-1 rounded-full hover:bg-base-300/60 transition-colors duration-200 cursor-pointer"
              >
                <div className="avatar">
                  <div className="w-9 rounded-full ring-2 ring-primary/40 ring-offset-base-200 ring-offset-1">
                    <img
                      src={authUser?.profilePic}
                      alt={authUser?.fullName || 'User Avatar'}
                    />
                  </div>
                </div>
                <ChevronDownIcon className="h-4 w-4 text-base-content/60 hidden sm:block" />
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content z-50 menu p-2 mt-3 w-56 rounded-xl bg-base-100 shadow-xl border border-base-300"
              >
                <li className="px-3 py-2 pointer-events-none">
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm truncate w-full">
                      {authUser?.fullName || 'User'}
                    </span>
                    <span className="text-xs text-base-content/50 truncate w-full">
                      {authUser?.email}
                    </span>
                  </div>
                </li>
                <div className="divider my-0" />
                <li>
                  <Link to="/profile" className="flex items-center gap-2 py-2">
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center gap-2 py-2">
                    <SettingsIcon className="h-4 w-4" />
                    Settings
                  </Link>
                </li>
                <div className="divider my-0" />
                <li>
                  <button
                    onClick={logoutMutation}
                    disabled={isPending}
                    className="flex items-center gap-2 py-2 text-error hover:bg-error/10"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    {isPending ? 'Logging out...' : 'Logout'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;