import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { StreamChat } from 'stream-chat';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2Icon,
  MessageSquarePlusIcon,
  UsersRoundIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import { getStreamToken, getUserFriends } from '../lib/api.js';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupsPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [clientReady, setClientReady] = useState(false);
  const [clientError, setClientError] = useState('');
  const [groupName, setGroupName] = useState('');
  const [selectedFriendIds, setSelectedFriendIds] = useState([]);

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  const { data: friends = [], isLoading: loadingFriends, isError: friendsError } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  useEffect(() => {
    let isMounted = true;

    const connectClient = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePic,
            },
            tokenData.token,
          );
        }

        if (isMounted) {
          setChatClient(client);
          setClientReady(true);
        }
      } catch (error) {
        console.error('Error initializing group chats:', error);
        if (isMounted) {
          setClientError('Could not initialize group chats');
          setClientReady(true);
        }
      }
    };

    connectClient();

    return () => {
      isMounted = false;
    };
  }, [authUser, tokenData]);

  const { data: groupChannels = [], isLoading: loadingGroups, isError: groupsError } = useQuery({
    queryKey: ['groupChannels', authUser?._id],
    enabled: !!chatClient && clientReady && !!authUser,
    queryFn: async () => {
      const channels = await chatClient.queryChannels(
        {
          type: 'messaging',
          member_count: { $gt: 2 },
          members: { $in: [authUser._id] },
        },
        [{ last_message_at: -1 }],
        { limit: 20, state: true, watch: true, presence: true },
      );

      return channels;
    },
  });

  const selectedFriends = useMemo(
    () => friends.filter((friend) => selectedFriendIds.includes(friend._id)),
    [friends, selectedFriendIds],
  );

  const handleToggleFriend = (friendId) => {
    setSelectedFriendIds((current) =>
      current.includes(friendId)
        ? current.filter((id) => id !== friendId)
        : [...current, friendId],
    );
  };

  const { mutate: createGroupMutation, isPending } = useMutation({
    mutationFn: async () => {
      if (!chatClient || !authUser) {
        throw new Error('Chat client is not ready');
      }

      const trimmedName = groupName.trim();

      if (!trimmedName) {
        throw new Error('Group name is required');
      }

      if (selectedFriendIds.length < 2) {
        throw new Error('Select at least two friends to create a group');
      }

      const memberIds = [...new Set([authUser._id, ...selectedFriendIds])];
      const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const channelId = `group-${slug || 'chat'}-${Date.now()}`;

      const channel = chatClient.channel('messaging', channelId, {
        name: trimmedName,
        members: memberIds,
        created_by_id: authUser._id,
      });

      await channel.watch();
      return channel;
    },
    onSuccess: async (channel) => {
      toast.success('Group created successfully');
      setGroupName('');
      setSelectedFriendIds([]);
      await queryClient.invalidateQueries({ queryKey: ['groupChannels', authUser?._id] });
      navigate(`/groups/${channel.id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Could not create the group');
    },
  });

  if (clientError) {
    return <ErrorState message={clientError} />;
  }

  if (!clientReady || !chatClient) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <UsersRoundIcon className="size-4" />
            Group Chats
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your group conversations</h1>
              <p className="mt-1 text-sm opacity-70">
                Create study groups, open existing rooms, and keep the whole conversation in one place.
              </p>
            </div>
            <Link to="/friends" className="btn btn-outline gap-2 self-start sm:self-auto">
              Back to friends
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="card bg-base-200 shadow-lg">
            <div className="card-body space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
                  <MessageSquarePlusIcon className="size-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Create a group</h2>
                  <p className="text-sm opacity-70">Choose a name and invite at least two friends.</p>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Group name</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Spanish practice circle"
                />
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-medium">Select friends</span>
                  <span className="text-xs opacity-60">{selectedFriends.length} selected</span>
                </div>

                {loadingFriends ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-16 rounded-2xl bg-base-100 animate-pulse" />
                    ))}
                  </div>
                ) : friendsError ? (
                  <ErrorState message="Couldn't load your friends right now." />
                ) : friends.length === 0 ? (
                  <div className="rounded-2xl border border-base-300 bg-base-100 p-4 text-sm opacity-70">
                    You need friends before you can create a group chat.
                  </div>
                ) : (
                  <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {friends.map((friend) => {
                      const isSelected = selectedFriendIds.includes(friend._id);

                      return (
                        <label
                          key={friend._id}
                          className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-base-300 bg-base-100 hover:border-primary/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={isSelected}
                            onChange={() => handleToggleFriend(friend._id)}
                          />

                          <div className="avatar">
                            <div className="w-11 rounded-full">
                              <img src={friend.profilePic} alt={friend.fullName} />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{friend.fullName}</p>
                            <p className="truncate text-xs opacity-60">
                              {friend.nativeLanguage} → {friend.learningLanguage}
                            </p>
                          </div>

                          {isSelected && <CheckCircle2Icon className="size-5 text-primary" />}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isPending || loadingFriends || friends.length < 2}
                  onClick={() => createGroupMutation()}
                >
                  {isPending ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <MessageSquarePlusIcon className="size-4" />
                      Create group
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Existing groups</h2>
              <span className="badge badge-primary">{groupChannels.length}</span>
            </div>

            {loadingGroups ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="card h-24 rounded-2xl bg-base-200 animate-pulse" />
                ))}
              </div>
            ) : groupsError ? (
              <ErrorState message="Couldn't load your group chats right now." />
            ) : groupChannels.length === 0 ? (
              <div className="card bg-base-200 shadow-lg">
                <div className="card-body p-6 text-center">
                  <h3 className="text-lg font-semibold">No group chats yet</h3>
                  <p className="mt-2 text-sm opacity-70">
                    Create your first group from the panel on the left.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {groupChannels.map((channel) => {
                  const members = Object.values(channel.state.members || {})
                    .map((member) => member.user)
                    .filter(Boolean)
                    .filter((member) => member.id !== authUser?._id);

                  const displayMembers = members.slice(0, 3);

                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => navigate(`/groups/${channel.id}`)}
                      className="card w-full bg-base-200 text-left shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="card-body flex-row items-center gap-4 p-4">
                        <div className="avatar-group -space-x-3">
                          {displayMembers.length > 0 ? (
                            displayMembers.map((member) => (
                              <div key={member.id} className="avatar">
                                <div className="w-10 rounded-full ring-2 ring-base-200">
                                  <img src={member.image || member.profilePic} alt={member.name} />
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="avatar placeholder">
                              <div className="w-10 rounded-full bg-primary/15 text-primary">
                                <span>{(channel.data?.name || 'G').slice(0, 1).toUpperCase()}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold">
                            {channel.data?.name || 'Group chat'}
                          </h3>
                          <p className="truncate text-sm opacity-70">
                            {members.length + 1} participants
                          </p>
                        </div>

                        <ArrowRightIcon className="size-5 shrink-0 opacity-60" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
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

export default GroupsPage;