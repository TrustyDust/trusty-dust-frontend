import Image from "next/image";
import { Heart, MessageCircle, Repeat2, DollarSign, CheckCircle } from "lucide-react";

interface PostCardProps {
  avatar: string;
  username: string;
  verified?: boolean;
  content: string;
  channel?: string;
  likes: number;
  replies: number;
  reposts: number;
  image?: string;
}

const PostCard = ({ 
  avatar, 
  username, 
  verified, 
  content, 
  channel, 
  likes, 
  replies, 
  reposts,
  image 
}: PostCardProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover-glow-pink transition-all">
      <div className="flex items-start gap-4 mb-4">
        
        {/* AVATAR */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-neon-purple">
          <Image 
            src={avatar} 
            alt={username} 
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          
          {/* USERNAME + VERIFIED + CHANNEL */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">@{username}</span>

            {verified && (
              <CheckCircle className="w-4 h-4 text-neon-cyan" fill="currentColor" />
            )}

            {channel && (
              <span className="ml-auto px-3 py-1 bg-neon-pink/10 text-neon-pink text-xs rounded-full border border-neon-pink/30">
                #{channel}
              </span>
            )}
          </div>

          {/* CONTENT */}
          <p className="text-foreground mb-4 leading-relaxed">
            {content}
          </p>

          {/* POST IMAGE */}
          {image && (
            <div className="relative mb-4 h-64 rounded-xl overflow-hidden border border-border">
              <Image
                src={image}
                alt="Post content"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-6 text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-neon-pink transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">{likes}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-neon-cyan transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{replies}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-neon-purple transition-colors">
              <Repeat2 className="w-5 h-5" />
              <span className="text-sm">{reposts}</span>
            </button>

            <button className="flex items-center gap-2 hover:text-neon-cyan transition-colors ml-auto">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm">Tip</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PostCard;
