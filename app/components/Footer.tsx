"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-white/5 to-white/10 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-lg font-bold text-white">SG</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gradient">Sasula Gateway</h3>
                <p className="text-white/60 text-sm">Decentralized Payments</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Empowering Africa through decentralized finance. Fast, secure, and social payments on Base blockchain.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <a href="/dashboard" className="block text-white/70 hover:text-white transition-colors text-sm">Dashboard</a>
              <a href="/send" className="block text-white/70 hover:text-white transition-colors text-sm">Send Money</a>
              <a href="/reputation" className="block text-white/70 hover:text-white transition-colors text-sm">Reputation</a>
              <a href="/savings" className="block text-white/70 hover:text-white transition-colors text-sm">Savings Circles</a>
              <a href="/emergency" className="block text-white/70 hover:text-white transition-colors text-sm">Emergency Relief</a>
            </div>
          </div>

          {/* Developer Credit */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Developer</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <FontAwesomeIcon icon={faGithub} className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-white font-medium">Cherubin Umuragwa</p>
                  <p className="text-white/60 text-sm">Full Stack Developer</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a 
                  href="https://github.com/cherubin-umuragwa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-white/70 hover:text-white text-sm" />
                </a>
                <a 
                  href="https://linkedin.com/in/cherubin-umuragwa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-white/70 hover:text-white text-sm" />
                </a>
                <a 
                  href="https://twitter.com/cherubin_umuragwa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faTwitter} className="text-white/70 hover:text-white text-sm" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © 2024 Sasula Gateway. Built with ❤️ for Africa.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>Powered by Base Sepolia</span>
            <span>•</span>
            <span>Built with Next.js & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
