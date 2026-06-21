import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api.js";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  UserStarIcon,
  AlertCircleIcon,
  Loader2Icon,
} from "lucide-react";
import FriendCard, { getLanguageFlag } from "../components.jsx/FriendCard.jsx";
import NoFriendsFound from "../components.jsx/NoFriendsFound.jsx";
import { capitalize } from "../lib/utils.js";


// const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : "");

const HomePage = () => {
  const queryClient = useQueryClient();
  const [pendingIds, setPendingIds] = useState(new Set());

  const {
    data: friends = [],
    isLoading: loadingFriends,
    isError: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const {
    data: recommendedUsers = [],
    isLoading: loadingUsers,
    isError: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  // Derived directly from query data instead of useEffect+useState —
  // always in sync, and correctly clears when a request is accepted/cancelled.
  const outgoingRequestsIds = useMemo(() => {
    const ids = new Set();
    outgoingFriendReqs?.forEach((req) => ids.add(req.recipient._id));
    return ids;
  }, [outgoingFriendReqs]);

  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const handleSendRequest = (userId) => {
    setPendingIds((prev) => new Set(prev).add(userId));
    sendRequestMutation(userId, {
      onSettled: () => {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-12">

        {/* ===== Friends Section ===== */}
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
              <p className="text-sm opacity-60 mt-1">
                {friends.length > 0
                  ? `${friends.length} connection${friends.length === 1 ? "" : "s"}`
                  : "Start building your network"}
              </p>
            </div>
            <Link
              to="/notifications"
              className="btn btn-outline btn-sm gap-2 hover:btn-primary transition-colors duration-200"
            >
              <UsersIcon className="size-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card bg-base-200 rounded-2xl h-40 animate-pulse" />
              ))}
            </div>
          ) : friendsError ? (
            <ErrorState message="Couldn't load your friends right now." />
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>

        {/* ===== Recommended Users Section ===== */}
        <section>
          <div className="flex items-start gap-3 mb-6 sm:mb-8">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15">
              <UserStarIcon className="size-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="opacity-60 text-sm mt-1">
                Discover perfect language exchange partners based on your profile
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card bg-base-200 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : usersError ? (
            <ErrorState message="Couldn't load recommendations right now." />
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 rounded-2xl p-8 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const isSendingThisOne = pendingIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 rounded-2xl border border-base-300/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full ring-2 ring-primary/30 ring-offset-base-200 ring-offset-2">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-60 mt-1">
                              <MapPinIcon className="size-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-1.5">
                        {user.nativeLanguage && (
                          <span className="badge badge-secondary gap-1">
                            {getLanguageFlag(user.nativeLanguage)}
                            Native: {capitalize(user.nativeLanguage)}
                          </span>
                        )}
                        {user.learningLanguage && (
                          <span className="badge badge-outline gap-1">
                            {getLanguageFlag(user.learningLanguage)}
                            Learning: {capitalize(user.learningLanguage)}
                          </span>
                        )}
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70 line-clamp-2">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 gap-2 transition-all duration-200 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => handleSendRequest(user._id)}
                        disabled={hasRequestBeenSent || isSendingThisOne}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            Request Sent
                          </>
                        ) : isSendingThisOne ? (
                          <>
                            <Loader2Icon className="size-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const ErrorState = ({ message }) => (
  <div className="card bg-error/5 border border-error/20 rounded-2xl p-8 text-center">
    <AlertCircleIcon className="size-8 text-error mx-auto mb-2" />
    <p className="text-error font-medium">{message}</p>
  </div>
);

export default HomePage;