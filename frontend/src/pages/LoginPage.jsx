import { useState } from 'react';
import { Earth, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import image from '../assets/Video call-pana.png';
import { useLogin } from '../hooks/useLogin';

export const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { isPending, error, loginMutation } = useLogin();

  const updateField = (field) => (e) => {
    setLoginData((prev) => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(loginData.email)) next.email = 'Enter a valid email address.';
    if (!loginData.password) next.password = 'Enter your password.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;
    loginMutation(loginData);
  };

  // error.response may be undefined on network failures / timeouts —
  // fall back to a generic message instead of crashing on .data.message.
  const serverErrorMessage =
    error?.response?.data?.message || (error ? 'Something went wrong. Please try again.' : null);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-10 sm:p-6 md:p-8 relative overflow-hidden"
      data-theme="forest"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

        .font-display { font-family: 'Fraunces', serif; }
        .font-mono-label { font-family: 'IBM Plex Mono', monospace; }

        .page-backdrop {
          background-image:
            radial-gradient(circle at 12% 18%, rgba(217,166,78,0.10), transparent 40%),
            radial-gradient(circle at 88% 82%, rgba(217,166,78,0.08), transparent 45%),
            radial-gradient(circle, rgba(247,243,232,0.06) 1px, transparent 1px);
          background-size: auto, auto, 26px 26px;
        }

        @keyframes orbitSpin { to { transform: rotate(360deg); } }
        @keyframes driftDash { to { stroke-dashoffset: -24; } }
        @keyframes stampSway { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(0deg); } }
        @keyframes fieldFadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes alertSlide { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

        @media (prefers-reduced-motion: no-preference) {
          .orbit-ring { animation: orbitSpin 80s linear infinite; }
          .drift-path { animation: driftDash 2.2s linear infinite; }
          .stamp-sway { animation: stampSway 6s ease-in-out infinite; }
          .field-fade { animation: fieldFadeUp 0.45s ease-out backwards; }
          .alert-fade { animation: alertSlide 0.3s ease-out; }
        }
      `}</style>

      {/* Ambient backdrop behind the card */}
      <div className="page-backdrop absolute inset-0" aria-hidden="true" />

      <div className="relative border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
        {/* Login form: left side */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-2">
            <Earth className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Next Meet
            </span>
          </div>

          {serverErrorMessage && (
            <div role="alert" className="alert alert-error mb-4 alert-fade">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverErrorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            <div className="field-fade">
              <p className="font-mono-label text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Welcome back
              </p>
              <h2 className="font-display text-2xl font-bold mt-1">Sign in to your account</h2>
              <p className="text-sm opacity-70 mt-1">
                Pick up where your conversations left off.
              </p>
            </div>

            <div className="field-fade" style={{ animationDelay: '60ms' }}>
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full pl-10 ${fieldErrors.email ? 'input-error' : ''}`}
                  value={loginData.email}
                  onChange={updateField('email')}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                />
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="text-error text-xs mt-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="field-fade" style={{ animationDelay: '120ms' }}>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label">
                  <span className="label-text">Password</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline mb-2"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 pr-10 ${fieldErrors.password ? 'input-error' : ''}`}
                  value={loginData.password}
                  onChange={updateField('password')}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="text-error text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              className="btn btn-primary w-full group field-fade"
              style={{ animationDelay: '180ms' }}
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <div className="text-center pt-1 field-fade" style={{ animationDelay: '220ms' }}>
              <p className="text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Illustration: right side */}
        <div
          className="hidden lg:flex w-full lg:w-1/2 items-center justify-center p-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(155deg, #0F2D22 0%, #1F4D3A 70%, #234F3C 100%)' }}
        >
          {/* Ambient network behind the illustration */}
          <svg
            viewBox="0 0 440 440"
            className="absolute w-[120%] h-[120%] opacity-70"
            aria-hidden="true"
          >
            <circle
              cx="220"
              cy="220"
              r="178"
              fill="none"
              stroke="#D9A64E"
              strokeOpacity="0.16"
              strokeWidth="1"
              strokeDasharray="2 9"
              className="orbit-ring"
              style={{ transformOrigin: '220px 220px' }}
            />
            <circle cx="220" cy="220" r="128" fill="none" stroke="#D9A64E" strokeOpacity="0.09" strokeWidth="1" />
            {[
              [110, 90],
              [330, 80],
              [350, 250],
              [240, 350],
              [95, 300],
            ].map(([x, y], i) => (
              <path
                key={i}
                d={`M 220 220 Q ${(220 + x) / 2 + (y - 220) * 0.12} ${(220 + y) / 2 - (x - 220) * 0.12} ${x} ${y}`}
                fill="none"
                stroke="#D9A64E"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                className="drift-path"
                style={{ animationDelay: `${i * 220}ms` }}
              />
            ))}
          </svg>

          <div className="relative max-w-md">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src={image}
                alt="Illustration of two people on a video call"
                className="w-full h-full drop-shadow-2xl"
              />

              {/* Live-presence stamp accent */}
              <div className="absolute -bottom-2 -right-2 stamp-sway" style={{ transformOrigin: 'center' }}>
                <svg viewBox="0 0 110 110" className="w-20 h-20 sm:w-24 sm:h-24">
                  <path id="stampRingLogin" d="M 55,55 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                  <circle cx="55" cy="55" r="40" fill="none" stroke="#F7F3E8" strokeOpacity="0.75" strokeWidth="1.5" strokeDasharray="3 5" />
                  <text fontSize="7.2" className="font-mono-label" fill="#F7F3E8" letterSpacing="1.5">
                    <textPath href="#stampRingLogin" startOffset="0%">
                      LIVE COMMUNITY • LIVE COMMUNITY •
                    </textPath>
                  </text>
                  <text x="55" y="51" textAnchor="middle" fontSize="15" fontWeight="700" className="font-display" fill="#F7F3E8">
                    12K+
                  </text>
                  <text x="55" y="65" textAnchor="middle" fontSize="6.5" letterSpacing="1" className="font-mono-label" fill="#F7F3E8" fillOpacity="0.85">
                    ONLINE NOW
                  </text>
                </svg>
              </div>
            </div>

            <div className="text-center space-y-2 mt-6">
              <h2 className="font-display text-xl font-semibold" style={{ color: '#F7F3E8' }}>
                Every conversation, one tap away
              </h2>
              <p className="text-sm" style={{ color: '#F7F3E8', opacity: 0.78 }}>
                Message, call, and stay close to the people who matter — wherever they are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;