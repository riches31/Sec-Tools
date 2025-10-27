import React, { useState } from 'react';
import { Shield, Search, Loader, CheckCircle, XCircle, AlertTriangle, Calendar, Lock, ExternalLink, Download, Clock } from 'lucide-react';
import { addToHistory } from './history-manager';
import { exportAsJSON, exportAsPDF } from './export-utils';
import HistoryPanel from './history-panel';

interface CertificateInfo {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  serialNumber: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  keySize: number;
  subjectAltNames: string[];
  isValid: boolean;
  isSelfSigned: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  trustScore: number;
  vulnerabilities: string[];
  recommendations: string[];
}

export default function SSLCertificateAnalyzer() {
  const [domain, setDomain] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [certInfo, setCertInfo] = useState<CertificateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const analyzeCertificate = async () => {
    if (!domain.trim()) return;

    setAnalyzing(true);
    setError(null);
    setCertInfo(null);

    try {
      let cleanDomain = domain.trim().toLowerCase();
      // Remove protocol if present
      cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
      // Remove path if present
      cleanDomain = cleanDomain.split('/')[0];

      // Simulate certificate analysis (in real implementation, this would call an API)
      const mockCertInfo = await mockCertificateAnalysis(cleanDomain);

      setCertInfo(mockCertInfo);

      // Add to history
      addToHistory({
        tool: 'ssl',
        input: cleanDomain,
        summary: `Trust Score: ${mockCertInfo.trustScore}/100, Expires in ${mockCertInfo.daysRemaining} days`,
        result: mockCertInfo
      });

    } catch (e) {
      setError('Unable to analyze certificate. Please ensure the domain is valid and accessible via HTTPS.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Mock function - in production, this would call a backend API or use browser APIs
  const mockCertificateAnalysis = async (domain: string): Promise<CertificateInfo> => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const validFrom = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const validTo = new Date(Date.now() + 185 * 24 * 60 * 60 * 1000);
    const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    const isExpired = daysRemaining < 0;
    const isExpiringSoon = daysRemaining < 30 && daysRemaining > 0;
    const isSelfSigned = domain.includes('localhost') || domain.includes('127.0.0.1');

    let trustScore = 100;
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    // Calculate trust score
    if (isSelfSigned) {
      trustScore -= 50;
      vulnerabilities.push('Self-signed certificate detected');
      recommendations.push('Use a certificate from a trusted Certificate Authority (CA)');
    }

    if (isExpired) {
      trustScore -= 30;
      vulnerabilities.push('Certificate has expired');
      recommendations.push('Renew your SSL certificate immediately');
    } else if (isExpiringSoon) {
      trustScore -= 10;
      vulnerabilities.push('Certificate expiring soon');
      recommendations.push('Renew certificate before expiration');
    }

    // Check for weak algorithms (mock)
    const signatureAlgo = 'SHA256withRSA';
    if (signatureAlgo.includes('SHA1') || signatureAlgo.includes('MD5')) {
      trustScore -= 20;
      vulnerabilities.push('Weak signature algorithm detected');
      recommendations.push('Upgrade to SHA-256 or higher');
    }

    // Check key size
    const keySize = 2048;
    if (keySize < 2048) {
      trustScore -= 15;
      vulnerabilities.push('Weak key size (less than 2048 bits)');
      recommendations.push('Use at least 2048-bit RSA keys');
    }

    if (trustScore === 100 && !isSelfSigned) {
      recommendations.push('Certificate configuration is excellent! No action needed.');
    }

    return {
      domain,
      issuer: isSelfSigned ? 'Self-Signed' : "Let's Encrypt Authority X3",
      validFrom: validFrom.toISOString().split('T')[0],
      validTo: validTo.toISOString().split('T')[0],
      daysRemaining,
      serialNumber: '0x' + Math.random().toString(16).substr(2, 16).toUpperCase(),
      signatureAlgorithm: signatureAlgo,
      publicKeyAlgorithm: 'RSA',
      keySize,
      subjectAltNames: [domain, `www.${domain}`],
      isValid: !isExpired && !isSelfSigned,
      isSelfSigned,
      isExpired,
      isExpiringSoon,
      trustScore: Math.max(0, trustScore),
      vulnerabilities,
      recommendations
    };
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getTrustBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 border-emerald-400/50';
    if (score >= 60) return 'bg-amber-500/20 border-amber-400/50';
    return 'bg-rose-500/20 border-rose-400/50';
  };

  const getTrustGradient = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-600';
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-rose-500 to-red-600';
  };

  const handleExportJSON = () => {
    if (!certInfo) return;
    exportAsJSON({
      toolName: 'SSL Certificate Analyzer',
      timestamp: new Date().toISOString(),
      data: certInfo,
      summary: `SSL certificate analysis for ${certInfo.domain}`
    });
  };

  const handleExportPDF = () => {
    if (!certInfo) return;
    exportAsPDF({
      toolName: 'SSL Certificate Analyzer',
      timestamp: new Date().toISOString(),
      data: certInfo,
      summary: `Trust Score: ${certInfo.trustScore}/100, Valid until ${certInfo.validTo}, ${certInfo.daysRemaining} days remaining`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-12 h-12 text-teal-500" />
            <h1 className="text-4xl font-bold text-white">SSL/TLS Certificate Analyzer</h1>
          </div>
          <p className="text-slate-300">Analyze SSL certificates for security and validity</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 dark:border-slate-700/40 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Enter Domain</h2>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-4 py-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              History
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Enter a domain name to analyze its SSL/TLS certificate</p>

          <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-md rounded-xl p-4 border border-white/60 dark:border-slate-600/60 shadow-inner">
            <div className="flex gap-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && analyzeCertificate()}
                placeholder="example.com"
                className="flex-1 px-6 py-4 border-2 border-teal-300/50 dark:border-teal-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white backdrop-blur-sm transition-all duration-300"
              />
              <button
                onClick={analyzeCertificate}
                disabled={analyzing}
                className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-500 flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                {analyzing ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
                Analyze
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-500/20 border-2 border-rose-400/50 rounded-2xl p-5 mb-6 backdrop-blur-md shadow-lg">
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900 dark:text-rose-300 text-lg">Analysis Failed</p>
                <p className="text-sm text-rose-800 dark:text-rose-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Results */}
        {certInfo && (
          <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 mb-6 ${getTrustBg(certInfo.trustScore)}`}>
            {/* Trust Score Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Certificate Analysis</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors"
                  title="Export as JSON"
                >
                  JSON
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors flex items-center gap-2"
                  title="Export as PDF"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>

            {/* Trust Score */}
            <div className="mb-6 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl p-5 border border-white/60 dark:border-slate-600/60 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-semibold text-slate-800 dark:text-white">Trust Score</span>
                <span className={`text-3xl font-bold ${getTrustColor(certInfo.trustScore)} bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-xl`}>
                  {certInfo.trustScore}/100
                </span>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-full h-4 shadow-inner">
                <div
                  className={`h-4 rounded-full transition-all duration-500 shadow-lg ${getTrustGradient(certInfo.trustScore)}`}
                  style={{ width: `${certInfo.trustScore}%` }}
                />
              </div>
            </div>

            {/* Certificate Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <CertDetail icon={<Shield />} label="Issuer" value={certInfo.issuer} />
              <CertDetail icon={<Lock />} label="Serial Number" value={certInfo.serialNumber} mono />
              <CertDetail icon={<Calendar />} label="Valid From" value={certInfo.validFrom} />
              <CertDetail icon={<Calendar />} label="Valid Until" value={certInfo.validTo} />
              <CertDetail
                icon={<Clock />}
                label="Days Remaining"
                value={`${certInfo.daysRemaining} days`}
                highlight={certInfo.isExpiringSoon || certInfo.isExpired}
              />
              <CertDetail icon={<Lock />} label="Signature Algorithm" value={certInfo.signatureAlgorithm} />
              <CertDetail icon={<Lock />} label="Public Key" value={`${certInfo.publicKeyAlgorithm} (${certInfo.keySize} bits)`} />
              <CertDetail
                icon={certInfo.isValid ? <CheckCircle /> : <XCircle />}
                label="Status"
                value={certInfo.isExpired ? 'Expired' : certInfo.isSelfSigned ? 'Self-Signed' : 'Valid'}
                highlight={!certInfo.isValid}
              />
            </div>

            {/* Subject Alternative Names */}
            {certInfo.subjectAltNames.length > 0 && (
              <div className="mb-6 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl p-5 border border-white/60 dark:border-slate-600/60">
                <h3 className="font-bold text-slate-800 dark:text-white mb-3">Subject Alternative Names</h3>
                <div className="flex flex-wrap gap-2">
                  {certInfo.subjectAltNames.map((name, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-medium border border-teal-400/40"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vulnerabilities */}
            {certInfo.vulnerabilities.length > 0 && (
              <div className="mb-6 p-5 bg-rose-500/20 border-2 border-rose-400/50 rounded-xl backdrop-blur-md shadow-lg">
                <h3 className="font-bold text-rose-900 dark:text-rose-300 mb-3 flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-6 h-6" />
                  Vulnerabilities Detected
                </h3>
                <ul className="space-y-2">
                  {certInfo.vulnerabilities.map((vuln, idx) => (
                    <li key={idx} className="text-sm text-rose-800 dark:text-rose-400 flex items-start gap-2">
                      <span className="mt-1 text-base">⚠</span>
                      <span>{vuln}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-5 bg-teal-500/10 border-2 border-teal-400/40 rounded-xl backdrop-blur-md shadow-lg">
              <h3 className="font-bold text-teal-900 dark:text-teal-300 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {certInfo.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-teal-800 dark:text-teal-400 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-2 border-teal-400/40 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            SSL/TLS Certificate Information
          </h3>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>SSL certificates encrypt data between your browser and the server</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>Certificates should be renewed before expiration to avoid service interruption</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>Use certificates from trusted Certificate Authorities (CAs) like Let's Encrypt</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>Modern certificates should use SHA-256 or higher and at least 2048-bit keys</span>
            </li>
          </ul>
        </div>
      </div>

      {/* History Panel */}
      <HistoryPanel
        tool="ssl"
        onSelect={(input) => setDomain(input)}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}

interface CertDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}

function CertDetail({ icon, label, value, mono = false, highlight = false }: CertDetailProps) {
  return (
    <div className={`p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 ${
      highlight
        ? 'bg-amber-500/10 border-amber-400/40'
        : 'bg-white/40 dark:bg-slate-700/40 border-white/40 dark:border-slate-600/40 hover:bg-white/60 dark:hover:bg-slate-700/60'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="text-teal-600 dark:text-teal-400">{icon}</div>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <p className={`text-slate-800 dark:text-white ${mono ? 'font-mono text-sm' : ''}`}>{value}</p>
    </div>
  );
}
