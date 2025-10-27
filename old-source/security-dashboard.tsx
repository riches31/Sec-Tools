import React, { useState } from 'react';
import { Shield, Globe, Lock, Menu, X, Home, ChevronRight, Mail, Hash as HashIcon } from 'lucide-react';
import ThemeToggle from './theme-toggle';

const LinkIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

export default function SecurityToolsDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tools = [
    {
      id: 'domain',
      name: 'Domain Checker',
      icon: Shield,
      description: 'Analyze domain security before visiting websites',
      color: 'green',
      features: ['HTTPS Verification', 'HSTS Status', 'Security Headers', 'WHOIS Data'],
      url: './tools/domain-checker.html'
    },
    {
      id: 'ssl',
      name: 'SSL Certificate',
      icon: Lock,
      description: 'Analyze SSL/TLS certificates for security and validity',
      color: 'teal',
      features: ['Certificate Details', 'Expiry Check', 'Trust Score', 'Vulnerability Scan'],
      url: './tools/ssl-analyzer.html'
    },
    {
      id: 'password',
      name: 'Password Checker',
      icon: Lock,
      description: 'Test password strength and generate secure passwords',
      color: 'purple',
      features: ['Strength Analysis', 'Breach Check', 'Passphrase Generator', 'Security Tips'],
      url: './tools/password-checker.html'
    },
    {
      id: 'url',
      name: 'URL Safety',
      icon: LinkIcon,
      description: 'Decode URLs and check for phishing and malicious patterns',
      color: 'orange',
      features: ['URL Decoder', 'Phishing Detection', 'Bulk Checking', 'Risk Scoring'],
      url: './tools/url-checker.html'
    },
    {
      id: 'email',
      name: 'Email Headers',
      icon: Mail,
      description: 'Parse and analyze email headers for authentication',
      color: 'indigo',
      features: ['SPF/DKIM/DMARC', 'Routing Path', 'Spoofing Detection', 'Spam Score'],
      url: './tools/email-analyzer.html'
    },
    {
      id: 'hash',
      name: 'Hash Validator',
      icon: HashIcon,
      description: 'Generate and verify cryptographic hashes',
      color: 'violet',
      features: ['Multi-Algorithm', 'File Hashing', 'Hash Comparison', 'Security Rating'],
      url: './tools/hash-validator.html'
    },
    {
      id: 'browser',
      name: 'Browser Security',
      icon: Globe,
      description: 'Check your browser security, IP addresses, and connection safety',
      color: 'blue',
      features: ['Local & External IP', 'HTTPS Status', 'DNS over HTTPS', 'Security APIs'],
      url: './tools/browser-scanner.html'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-400/40',
        text: 'text-cyan-600',
        gradient: 'from-cyan-500 to-teal-600',
        glow: 'shadow-cyan-500/50'
      },
      green: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-400/40',
        text: 'text-emerald-600',
        gradient: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-500/50'
      },
      teal: {
        bg: 'bg-teal-500/10',
        border: 'border-teal-400/40',
        text: 'text-teal-600',
        gradient: 'from-teal-500 to-cyan-600',
        glow: 'shadow-teal-500/50'
      },
      purple: {
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-400/40',
        text: 'text-indigo-600',
        gradient: 'from-indigo-500 to-blue-600',
        glow: 'shadow-indigo-500/50'
      },
      indigo: {
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-400/40',
        text: 'text-indigo-600',
        gradient: 'from-indigo-500 to-blue-600',
        glow: 'shadow-indigo-500/50'
      },
      violet: {
        bg: 'bg-violet-500/10',
        border: 'border-violet-400/40',
        text: 'text-violet-600',
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/50'
      },
      orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-400/40',
        text: 'text-orange-600',
        gradient: 'from-orange-500 to-amber-600',
        glow: 'shadow-orange-500/50'
      }
    };
    return colors[color];
  };

  const openTool = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-white/70 backdrop-blur-md shadow-lg shadow-slate-900/10 border-b border-white/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <Shield className="w-8 h-8 text-cyan-500" />
              <div>
                <h1 className="text-xl font-bold text-slate-800">Security Tools Suite</h1>
                <p className="text-xs text-slate-600 hidden sm:block">Comprehensive security analysis tools</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'home'
                    ? 'bg-cyan-500/20 text-cyan-600 font-medium backdrop-blur-sm'
                    : 'text-slate-600 hover:bg-white/50 hover:backdrop-blur-sm'
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            </nav>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/40 bg-white/70 backdrop-blur-md">
            <nav className="px-4 py-3 space-y-1">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'home'
                    ? 'bg-cyan-500/20 text-cyan-600 font-medium backdrop-blur-sm'
                    : 'text-slate-600 hover:bg-white/50 hover:backdrop-blur-sm'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 rounded-2xl shadow-xl shadow-cyan-900/30 p-8 mb-8 text-white backdrop-blur-md relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3">Welcome to Security Tools Suite</h2>
            <p className="text-cyan-50 text-lg mb-6">
              Your comprehensive toolkit for online security and privacy analysis
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <div className="text-3xl font-bold mb-1">7</div>
                <div className="text-sm text-cyan-50">Security Tools</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm text-cyan-50">Client-Side</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <div className="text-3xl font-bold mb-1">Free</div>
                <div className="text-sm text-cyan-50">Always Free</div>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                <div className="text-3xl font-bold mb-1">Private</div>
                <div className="text-sm text-cyan-50">No Data Stored</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {tools.map(tool => {
            const colors = getColorClasses(tool.color);
            const Icon = tool.icon;
            
            return (
              <div
                key={tool.id}
                className={`bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border-2 ${colors.border} hover:shadow-2xl hover:scale-[1.02] hover:${colors.glow} transition-all duration-300 overflow-hidden cursor-pointer`}
                onClick={() => openTool(tool.url)}
              >
                <div className={`h-3 bg-gradient-to-r ${colors.gradient}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-xl ${colors.bg} backdrop-blur-sm border ${colors.border}`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-400" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{tool.description}</p>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} backdrop-blur-sm border ${colors.border} font-medium`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/40">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              Why Use These Tools?
            </h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span><strong>Privacy First:</strong> All analysis happens in your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span><strong>No Registration:</strong> Use all tools instantly without signing up</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span><strong>Real-time Analysis:</strong> Get instant security feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-1">✓</span>
                <span><strong>Educational:</strong> Learn about security best practices</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/40">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-cyan-600" />
              Security Best Practices
            </h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold mt-1">•</span>
                <span>Always verify URLs before clicking links</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold mt-1">•</span>
                <span>Use unique, strong passwords for each account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold mt-1">•</span>
                <span>Check domain security before entering credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold mt-1">•</span>
                <span>Keep your browser and security settings updated</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-white/60 backdrop-blur-lg border-t border-white/40 mt-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-700">
            <p className="mb-2">
              <strong>Security Tools Suite</strong> - Comprehensive online security analysis
            </p>
            <p className="text-xs text-slate-600">
              All tools run locally in your browser. No data is sent to external servers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}