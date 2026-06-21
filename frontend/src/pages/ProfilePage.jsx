import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, Star } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import { completeOnboarding } from '../lib/api';
import { LANGUAGES } from '../constants';

const ProfilePage = () => {
  const { authUser, isLoading } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: '',
    bio: '',
    nativeLanguage: '',
    learningLanguage: '',
    location: '',
    profilePic: '',
  });

  useEffect(() => {
    if (!authUser) return;

    setFormState({
      fullName: authUser.fullName || '',
      bio: authUser.bio || '',
      nativeLanguage: authUser.nativeLanguage || '',
      learningLanguage: authUser.learningLanguage || '',
      location: authUser.location || '',
      profilePic: authUser.profilePic || '',
    });
  }, [authUser]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async () => {
      toast.success('Profile updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: () => {
      toast.error('Could not update your profile');
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatarapi.runflare.run/public/${idx}.png`;
    setFormState((current) => ({ ...current, profilePic: randomAvatar }));
    toast.success('Avatar updated');
  };

  if (isLoading || !authUser) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Profile</h1>
          <p className="text-sm opacity-70">Edit the details other people see when they connect with you.</p>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="size-32 overflow-hidden rounded-full bg-base-300">
                  {formState.profilePic ? (
                    <img
                      src={formState.profilePic}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <CameraIcon className="size-12 text-base-content/40" />
                    </div>
                  )}
                </div>

                <button type="button" onClick={handleRandomAvatar} className="btn btn-outline">
                  <Star className="mr-2 size-4" />
                  Generate Avatar
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={formState.fullName}
                    onChange={(event) => setFormState({ ...formState, fullName: event.target.value })}
                    className="input input-bordered w-full"
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    value={formState.bio}
                    onChange={(event) => setFormState({ ...formState, bio: event.target.value })}
                    className="textarea textarea-bordered h-28 w-full"
                    placeholder="Tell others about yourself and what you want to learn"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    value={formState.nativeLanguage}
                    onChange={(event) =>
                      setFormState({ ...formState, nativeLanguage: event.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((language) => (
                      <option key={`profile-native-${language}`} value={language.toLowerCase()}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    value={formState.learningLanguage}
                    onChange={(event) =>
                      setFormState({ ...formState, learningLanguage: event.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="">Select language you're learning</option>
                    {LANGUAGES.map((language) => (
                      <option key={`profile-learning-${language}`} value={language.toLowerCase()}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-base-content/70" />
                    <input
                      type="text"
                      value={formState.location}
                      onChange={(event) =>
                        setFormState({ ...formState, location: event.target.value })
                      }
                      className="input input-bordered w-full pl-10"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={isPending} type="submit">
                  {!isPending ? (
                    <>
                      <ShipWheelIcon className="mr-2 size-5" />
                      Save Profile
                    </>
                  ) : (
                    <>
                      <LoaderIcon className="mr-2 size-5 animate-spin" />
                      Saving...
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;