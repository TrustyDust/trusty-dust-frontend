interface NFTCardProps {
  name: string;
  price: string;
  owner: string;
  image?: string;
}

const NFTCard = ({ name, price, owner }: NFTCardProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover-glow-pink transition-all group">
      <div className="aspect-square bg-gradient-to-br from-neon-pink via-neon-purple to-neon-cyan"></div>
      
      <div className="p-6">
        <h3 className="font-bold font-orbitron mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">by @{owner}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="text-neon-cyan font-bold">{price}</p>
          </div>
          <button className="px-6 py-2 bg-neon-pink text-primary-foreground rounded-lg font-semibold hover:scale-105 transition-transform">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
