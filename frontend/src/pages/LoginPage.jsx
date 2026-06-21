
import { useState } from 'react';
import { Link } from 'react-router';
import { Earth } from 'lucide-react';
import image from '../assets/Video call-pana.png';
import { useLogin } from '../hooks/useLogin';

export const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // const queryClient = useQueryClient();
  const {isPending, error, loginMutation} = useLogin()



  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };
  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
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
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <Earth className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
              Next Meet
            </span>
          </div>

          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your account to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="hello@example.com"
                      className="input input-bordered w-full"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{' '}
                      <Link
                        to="/signup"
                        className="text-primary hover:underline"
                      >
                        Create one
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div
          className="hidden lg:flex w-full lg:w-1/2 items-center justify-center p-8 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(155deg, #0F2D22 0%, #1F4D3A 70%, #234F3C 100%)',
          }}
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
            <circle
              cx="220"
              cy="220"
              r="128"
              fill="none"
              stroke="#D9A64E"
              strokeOpacity="0.09"
              strokeWidth="1"
            />
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
                alt="Illustration of two people on a video call, practicing a language together"
                className="w-full h-full drop-shadow-2xl"
              />

              {/* Passport-stamp accent */}
              <div
                className="absolute -bottom-2 -right-2 stamp-sway"
                style={{ transformOrigin: 'center' }}
              >
                <svg
                  viewBox="0 0 110 110"
                  className="w-20 h-20 sm:w-24 sm:h-24"
                >
                  <path
                    id="stampRing"
                    d="M 55,55 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                    fill="none"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r="40"
                    fill="none"
                    stroke="#F7F3E8"
                    strokeOpacity="0.75"
                    strokeWidth="1.5"
                    strokeDasharray="3 5"
                  />
                  <text
                    fontSize="7.2"
                    className="font-mono-label"
                    fill="#F7F3E8"
                    letterSpacing="1.5"
                  >
                    <textPath href="#stampRing" startOffset="0%">
                      GLOBAL COMMUNITY • GLOBAL COMMUNITY •
                    </textPath>
                  </text>
                  <text
                    x="55"
                    y="51"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="700"
                    className="font-display"
                    fill="#F7F3E8"
                  >
                    50K+
                  </text>
                  <text
                    x="55"
                    y="65"
                    textAnchor="middle"
                    fontSize="6.5"
                    letterSpacing="1"
                    className="font-mono-label"
                    fill="#F7F3E8"
                    fillOpacity="0.85"
                  >
                    LEARNERS
                  </text>
                </svg>
              </div>
            </div>

            <div className="text-center space-y-2 mt-6">
              <h2
                className="font-display text-xl font-semibold"
                style={{ color: '#F7F3E8' }}
              >
                Connect with language partners worldwide
              </h2>
              <p
                className="text-sm"
                style={{ color: '#F7F3E8', opacity: 0.78 }}
              >
                Practice conversations, make friends, and improve your language
                skills together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
