import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { StreamChat } from 'stream-chat';
import { Channel, ChannelHeader, Chat, MessageComposer, MessageList, Thread, Window } from 'stream-chat-react';
import { AlertCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthUser from '../hooks/useAuthUser';
import { getStreamToken } from '../lib/api';
import ChatLoader from '../components.jsx/ChatLoader';
import CallButton from '../components.jsx/CallButton';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const GroupChatPage = () => {
  const { id: channelId } = useParams();
  const { authUser } = useAuthUser();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let isMounted = true;

    const initGroupChat = async () => {
      if (!tokenData?.token || !authUser || !channelId) return;

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

        const currChannel = client.channel('messaging', channelId);
        await currChannel.watch();

        if (isMounted) {
          setChatClient(client);
          setChannel(currChannel);
        }
      } catch (error) {
        console.error('Error initializing group chat:', error);
        if (isMounted) {
          setErrorMessage('Could not open the group chat');
        }
        toast.error('Could not open the group chat');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initGroupChat();

    return () => {
      isMounted = false;
    };
  }, [authUser, channelId, tokenData]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a group video call. Join me here: ${callUrl}`,
      });

      toast.success('Video call link sent successfully!');
    }
  };

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="relative w-full">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageComposer focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default GroupChatPage;

const ErrorState = ({ message }) => (
  <div className="flex min-h-[70vh] items-center justify-center p-4">
    <div className="card w-full max-w-md rounded-2xl border border-error/20 bg-error/5 p-8 text-center">
      <AlertCircleIcon className="mx-auto mb-3 size-8 text-error" />
      <p className="font-medium text-error">{message}</p>
    </div>
  </div>
);