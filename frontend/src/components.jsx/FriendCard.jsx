import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className="group relative card bg-base-200 border border-base-300/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
      {/* Soft gradient glow that fades in on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-500 pointer-events-none" />

      <div className="card-body p-4 relative z-10">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            <div className="avatar">
              <div className="w-12 rounded-full ring-2 ring-base-300 group-hover:ring-primary/50 transition-all duration-300 group-hover:scale-105">
                <img src={friend.profilePic} alt={friend.fullName} />
              </div>
            </div>
            {/* Renders only if your data includes an online flag — safe no-op otherwise */}
            {friend.isOnline && (
              <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-200" />
            )}
          </div>
          <h3 className="font-semibold truncate flex-1">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="badge badge-secondary text-xs capitalize gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs capitalize gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline w-full gap-2 group-hover:btn-primary transition-all duration-300"
        >
          <MessageCircleIcon className="size-4" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block rounded-sm"
      />
    );
  }
  return null;
}