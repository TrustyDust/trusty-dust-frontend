import { PenSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import GlowButton from "@/components/GlowButton";

const Feed = () => {
  const trendingChannels = ["CryptoArt", "LazyLions", "PeacefulApe", "DegenTraders"];

  const posts = [
    {
      username: "cryptoartist",
      verified: true,
      content: "Just minted my latest cyberpunk collection! The fusion of neon aesthetics and blockchain technology is incredible. Who wants to trade? 🎨✨",
      channel: "CryptoArt",
      likes: 342,
      replies: 45,
      reposts: 89,
    },
    {
      username: "nfttrader",
      verified: true,
      content: "ZK verification just changed the game for me. Now I can prove my trading history without revealing my wallet address. Privacy + transparency = 🚀",
      channel: "DegenTraders",
      likes: 567,
      replies: 78,
      reposts: 123,
    },
    {
      username: "metaverse_dev",
      verified: false,
      content: "Building the future of social networks, one block at a time. TrustyDust's decentralized approach is exactly what we need. No more centralized control! 💪",
      likes: 234,
      replies: 34,
      reposts: 56,
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Navbar />

      <div className="flex-1 ml-20">
        <div className="max-w-7xl mx-auto flex gap-8 py-8 px-6">
          {/* Main Feed */}
          <div className="flex-1 max-w-2xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-orbitron mb-2">Your Feed</h1>
              <p className="text-muted-foreground">Stay connected with the community</p>
            </div>

            <div className="space-y-6">
              {posts.map((post, index) => (
                <PostCard key={index} {...post} avatar="" />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 space-y-6">
            {/* Trending Channels */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-bold font-orbitron mb-4">Trending Channels</h3>
              <div className="space-y-3">
                {trendingChannels.map((channel) => (
                  <button
                    key={channel}
                    className="w-full text-left px-4 py-3 bg-muted rounded-xl hover:bg-neon-pink/10 hover:border-neon-pink border border-transparent transition-all"
                  >
                    <span className="text-neon-pink font-semibold">#{channel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Marketplace Spotlight */}
            <div className="bg-card rounded-2xl border border-border p-6 hover-glow-cyan transition-all">
              <h3 className="font-bold font-orbitron mb-4">Hot Drop</h3>
              <div className="aspect-square bg-gradient-to-br from-neon-pink to-neon-cyan rounded-xl mb-4"></div>
              <p className="font-semibold mb-2">Cyber Samurai #177</p>
              <div className="flex items-center justify-between">
                <span className="text-neon-cyan font-bold">2.5 ETH</span>
                <button className="px-4 py-2 bg-neon-cyan text-secondary-foreground rounded-lg text-sm font-semibold hover:scale-105 transition-transform">
                  Buy Now
                </button>
              </div>
            </div>

            {/* ZK Verification */}
            <div className="bg-gradient-to-br from-neon-purple/10 to-transparent rounded-2xl border border-neon-purple/30 p-6">
              <h3 className="font-bold font-orbitron mb-2">Verify with ZK</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Boost your credibility with zero-knowledge proofs
              </p>
              <GlowButton variant="outline-pink" className="w-full !py-2 !text-sm">
                Get Verified
              </GlowButton>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Create Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-neon-pink rounded-full flex items-center justify-center glow-pink hover:scale-110 transition-transform shadow-2xl">
        <PenSquare className="w-7 h-7 text-primary-foreground" />
      </button>
    </div>
  );
};

export default Feed;
