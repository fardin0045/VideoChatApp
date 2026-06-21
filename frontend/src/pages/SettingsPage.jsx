import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useThemeStore } from '../store/useThemeStore';
import { useUserSettingsStore } from '../store/useUserSettingsStore';
import useAuthUser from '../hooks/useAuthUser';
import useLogout from '../hooks/useLogout';
import { BellIcon, CheckCircle2Icon, LogOutIcon, PaletteIcon, ShieldIcon, SparklesIcon } from 'lucide-react';
import { THEMES } from '../constants';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { theme, setTheme } = useThemeStore();
  const { notificationsEnabled, showOnlineStatus, compactMode, updateSetting, resetSettings } =
    useUserSettingsStore();
  const { mutate: logoutMutation, isPending } = useLogout();

  const themePreview = useMemo(
    () => THEMES.find((themeOption) => themeOption.name === theme),
    [theme],
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl space-y-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Settings</h1>
          <p className="text-sm opacity-70">Control appearance and account preferences.</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <section className="card bg-base-200 shadow-lg">
              <div className="card-body space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <PaletteIcon className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Appearance</h2>
                    <p className="text-sm opacity-70">Choose how the app looks for you.</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {THEMES.map((themeOption) => {
                    const isActive = theme === themeOption.name;
                    return (
                      <button
                        key={themeOption.name}
                        type="button"
                        onClick={() => setTheme(themeOption.name)}
                        className={`rounded-2xl border p-4 text-left transition-all duration-200 ${
                          isActive
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-base-300 bg-base-100 hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{themeOption.label}</p>
                            <p className="text-xs opacity-60">Saved locally on this device</p>
                          </div>
                          {isActive && <CheckCircle2Icon className="size-5 text-primary" />}
                        </div>

                        <div className="mt-3 flex gap-1.5">
                          {themeOption.colors.map((color, index) => (
                            <span
                              key={index}
                              className="size-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl bg-base-100 p-4 text-sm">
                  <div className="mb-2 font-medium">Current theme</div>
                  <div className="opacity-70">{themePreview?.label || theme}</div>
                </div>
              </div>
            </section>

            <section className="card bg-base-200 shadow-lg">
              <div className="card-body space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
                    <BellIcon className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Preferences</h2>
                    <p className="text-sm opacity-70">Fine-tune how the app behaves.</p>
                  </div>
                </div>

                <PreferenceToggle
                  title="Enable notifications"
                  description="Receive in-app updates and friend activity alerts."
                  checked={notificationsEnabled}
                  onChange={(value) => updateSetting('notificationsEnabled', value)}
                />

                <PreferenceToggle
                  title="Show online status"
                  description="Let other users see when you're available."
                  checked={showOnlineStatus}
                  onChange={(value) => updateSetting('showOnlineStatus', value)}
                />

                <PreferenceToggle
                  title="Compact mode"
                  description="Use a denser layout for long browsing sessions."
                  checked={compactMode}
                  onChange={(value) => updateSetting('compactMode', value)}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button type="button" className="btn btn-ghost" onClick={resetSettings}>
                    Reset defaults
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => navigate('/profile')}>
                    Edit profile
                  </button>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="card bg-base-200 shadow-lg">
              <div className="card-body space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-16 rounded-full ring-2 ring-primary/30 ring-offset-base-200 ring-offset-2">
                      <img src={authUser?.profilePic} alt={authUser?.fullName || 'User'} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{authUser?.fullName || 'User'}</h2>
                    <p className="text-sm opacity-70">{authUser?.email}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-base-100 p-4 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <ShieldIcon className="size-4 text-success" />
                    Account status
                  </div>
                  <p className="mt-2 opacity-70">Your profile and preferences are stored securely and synced where the app supports it.</p>
                </div>

                <div className="rounded-2xl bg-base-100 p-4 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <SparklesIcon className="size-4 text-primary" />
                    Tip
                  </div>
                  <p className="mt-2 opacity-70">Update your profile first so your friends see the right name, photo, and languages.</p>
                </div>

                <button
                  type="button"
                  onClick={() => logoutMutation()}
                  disabled={isPending}
                  className="btn btn-error btn-outline w-full gap-2"
                >
                  <LogOutIcon className="size-4" />
                  {isPending ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

const PreferenceToggle = ({ title, description, checked, onChange }) => (
  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-base-300 bg-base-100 p-4">
    <div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm opacity-70">{description}</p>
    </div>
    <input
      type="checkbox"
      className="toggle toggle-primary mt-1"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
);

export default SettingsPage;