import { Twitter, Github, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-pink to-neon-cyan rounded-lg glow-pink"></div>
              <span className="text-xl font-bold font-orbitron">TrustyDust</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Decentralized SocialFi platform for privacy-first creators and traders.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-neon-pink transition-colors">Home</a></li>
              <li><a href="/feed" className="hover:text-neon-pink transition-colors">Feed</a></li>
              <li><a href="/marketplace" className="hover:text-neon-pink transition-colors">Marketplace</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">API</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover-glow-pink transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover-glow-cyan transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover-glow-purple transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 TrustyDust. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <span className="text-xs">Powered by:</span>
            <span className="px-3 py-1 bg-muted rounded-full text-xs">ZK Proofs</span>
            <span className="px-3 py-1 bg-muted rounded-full text-xs">IPFS</span>
            <span className="px-3 py-1 bg-muted rounded-full text-xs">WalletConnect</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
