interface StatsCardProps {
  label: string;
  value: string;
}

const StatsCard = ({ label, value }: StatsCardProps) => {
  return (
    <div className="flex flex-col items-center gap-2 p-6 bg-card rounded-xl border border-border hover-glow-purple">
      <div className="text-4xl font-bold font-orbitron text-gradient-neon">{value}</div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  );
};

export default StatsCard;
