import { useState } from "react";
import Navbar from "@/components/Navbar";
import NFTCard from "@/components/NFTCard";
import { ShoppingBag, Image, Gamepad2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [filter, setFilter] = useState("all");

  const tabs = [
    { id: "marketplace", label: "Marketplace" },
    { id: "my-nfts", label: "My NFTs" },
    { id: "tokens", label: "Social Tokens" },
  ];

  const filters = [
    { id: "all", label: "All", icon: ShoppingBag },
    { id: "art", label: "Art", icon: Image },
    { id: "gaming", label: "Gaming", icon: Gamepad2 },
    { id: "memberships", label: "Memberships", icon: Users },
  ];

  const nfts = [
    { name: "Cyber Samurai #177", price: "2.5 ETH", owner: "cryptoartist" },
    { name: "Neon Dreams #42", price: "1.8 ETH", owner: "nfttrader" },
    { name: "Digital Warrior #99", price: "3.2 ETH", owner: "metaverse_dev" },
    { name: "Pixel Punk #256", price: "2.1 ETH", owner: "cryptoartist" },
    { name: "Cosmic Voyager #7", price: "4.5 ETH", owner: "nfttrader" },
    { name: "Tech Shaman #33", price: "1.9 ETH", owner: "metaverse_dev" },
  ];

  return (
    <div className="min-h-screen flex">
      <Navbar />

      <div className="flex-1 ml-20">
        <div className="max-w-7xl mx-auto py-8 px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-orbitron mb-2">Marketplace</h1>
            <p className="text-muted-foreground">Discover, collect, and trade digital assets</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-4 px-6 font-semibold transition-all relative",
                  activeTab === tab.id
                    ? "text-neon-pink"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-pink glow-pink"></div>
                )}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-8">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2",
                  filter === filterItem.id
                    ? "bg-neon-pink text-primary-foreground glow-pink"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-neon-pink/50"
                )}
              >
                <filterItem.icon className="w-5 h-5" />
                {filterItem.label}
              </button>
            ))}
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft, index) => (
              <NFTCard key={index} {...nft} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
