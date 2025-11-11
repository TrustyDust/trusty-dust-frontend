import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="p-8 bg-card rounded-2xl border border-border hover-glow-pink transition-all duration-300 group">
      <div className="mb-6 inline-block p-4 bg-neon-pink/10 rounded-xl glow-pink">
        <Icon className="w-8 h-8 text-neon-pink" />
      </div>
      <h3 className="text-2xl font-bold font-orbitron mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
