import { CheckCircle, Users, FileText, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlowButton from "@/components/GlowButton";
import NFTCard from "@/components/NFTCard";

const Profile = () => {
  const ownedNfts = [
    { name: "Cyber Samurai #177", price: "2.5 ETH", owner: "you" },
    { name: "Neon Dreams #42", price: "1.8 ETH", owner: "you" },
    { name: "Digital Warrior #99", price: "3.2 ETH", owner: "you" },
  ];

  return (
    <div className="min-h-screen flex">
      <Navbar />

      <div className="flex-1 ml-20">
        <div className="max-w-5xl mx-auto py-8 px-6">
          {/* Banner */}
          <div className="relative h-48 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-2xl mb-20 overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-30"></div>
          </div>

          {/* Avatar & Info */}
          <div className="relative -mt-32 mb-8">
            <div className="flex items-end gap-8">
              <div className="w-40 h-40 rounded-full border-8 border-background bg-gradient-to-br from-neon-pink to-neon-cyan glow-pink"></div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold font-orbitron">@cryptoartist</h1>
                  <CheckCircle className="w-6 h-6 text-neon-cyan" fill="currentColor" />
                  <div className="px-4 py-1 bg-neon-cyan/10 text-neon-cyan text-sm rounded-full border border-neon-cyan/30 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Tier 3</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  Digital artist & NFT creator. Building the future of decentralized social networks. 
                  Passionate about cyberpunk aesthetics and blockchain technology. 🎨✨
                </p>

                <div className="flex gap-8 text-sm">
                  <div>
                    <span className="text-2xl font-bold text-gradient-neon">1.2K</span>
                    <span className="text-muted-foreground ml-2">Followers</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gradient-neon">342</span>
                    <span className="text-muted-foreground ml-2">Posts</span>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gradient-neon">45.3</span>
                    <span className="text-muted-foreground ml-2">ETH Volume</span>
                  </div>
                </div>
              </div>

              <GlowButton variant="neon-pink">
                Mint Social Token
              </GlowButton>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="bg-card rounded-2xl border border-border p-6 hover-glow-pink transition-all">
              <Users className="w-8 h-8 text-neon-pink mb-4" />
              <p className="text-2xl font-bold font-orbitron mb-1">1,234</p>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 hover-glow-cyan transition-all">
              <FileText className="w-8 h-8 text-neon-cyan mb-4" />
              <p className="text-2xl font-bold font-orbitron mb-1">342</p>
              <p className="text-sm text-muted-foreground">Total Posts</p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 hover-glow-purple transition-all">
              <TrendingUp className="w-8 h-8 text-neon-purple mb-4" />
              <p className="text-2xl font-bold font-orbitron mb-1">89%</p>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
            </div>
          </div>

          {/* Owned NFTs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-orbitron">Owned NFTs</h2>
              <button className="text-neon-cyan hover:text-neon-pink transition-colors">View All →</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ownedNfts.map((nft, index) => (
                <NFTCard key={index} {...nft} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
