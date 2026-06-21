import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { AlertCircleIcon, UsersIcon } from 'lucide-react';
import { getUserFriends } from '../lib/api.js';
import FriendCard from '../components.jsx/FriendCard.jsx';
import NoFriendsFound from '../components.jsx/NoFriendsFound.jsx';

const FriendsPage = () => {
  const {
    data: friends = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <UsersIcon className="size-4" />
              Friends
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your friends</h1>
              <p className="mt-1 text-sm opacity-70">
                {friends.length > 0
                  ? `${friends.length} connection${friends.length === 1 ? '' : 's'} available to chat`
                  : 'A list of your current connections will appear here.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/groups" className="btn btn-outline gap-2">
              <UsersIcon className="size-4" />
              Group Chats
            </Link>
            <Link to="/notifications" className="btn btn-outline gap-2">
              <UsersIcon className="size-4" />
              Friend Requests
            </Link>
          </div>
        </section>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card h-40 rounded-2xl bg-base-200 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="Couldn't load your friends right now." />
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ErrorState = ({ message }) => (
  <div className="card rounded-2xl border border-error/20 bg-error/5 p-8 text-center">
    <AlertCircleIcon className="mx-auto mb-2 size-8 text-error" />
    <p className="font-medium text-error">{message}</p>
  </div>
);

export default FriendsPage;