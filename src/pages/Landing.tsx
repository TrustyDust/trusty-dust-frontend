import { Link } from "react-router-dom";
import { Network, ShoppingBag, Shield } from "lucide-react";
import GlowButton from "@/components/GlowButton";
import StatsCard from "@/components/StatsCard";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-cyber.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen cyber-grid">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative mb-12 inline-block">
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-neon-pink glow-pink">
              <img src={heroImage} alt="Cyber Hero" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-neon-cyan rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-neon-pink rounded-full blur-3xl opacity-50 animate-pulse"></div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold font-orbitron mb-6 leading-tight">
            Own Your Voice.<br />
            <span className="text-gradient-neon">Trade Your Influence.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Decentralized social network with ZK-verified accounts and integrated NFT marketplace.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link to="/feed">
              <GlowButton variant="neon-pink">
                Explore Feed
              </GlowButton>
            </Link>
            <Link to="/marketplace">
              <GlowButton variant="outline-cyan">
                Launch App
              </GlowButton>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StatsCard label="Total Posts" value="30,000+" />
            <StatsCard label="Active Creators" value="17,000+" />
            <StatsCard label="Live Channels" value="22,000+" />
            <StatsCard label="Verified Users" value="50,000+" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-center mb-16">
            Built for the <span className="text-gradient-neon">Future</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Network}
              title="SocialFi Network"
              description="Post, reply, repost, and create channels. Build your community with decentralized social features."
            />
            <FeatureCard
              icon={ShoppingBag}
              title="Built-in Marketplace"
              description="Trade NFTs and social tokens seamlessly within the app. No third-party platforms needed."
            />
            <FeatureCard
              icon={Shield}
              title="ZK Scoring"
              description="Prove your reputation without revealing personal data. Privacy-first verification system."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
