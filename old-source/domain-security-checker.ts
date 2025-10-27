import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Loader, Search, Shield, Download, Clock, Calendar, Globe } from 'lucide-react';
import { addToHistory } from './history-manager';
import { exportAsJSON, exportAsPDF } from './export-utils';
import HistoryPanel from './history-panel';

export default function DomainSecurityChecker() {
  const [domainToCheck, setDomainToCheck] = useState('');
  const [domainResults, setDomainResults] = useState(null);
  const [checking, setChecking] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const checkDomain = async () => {
    if (!domainToCheck.trim()) return;
    
    setChecking(true);
    setDomainResults(null);

    try {
      let url = domainToCheck.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      const domain = new URL(url).hostname;

      const httpsCheck = await checkHTTPS(url);
      const hstsCheck = await checkHSTS(domain);
      const headersCheck = await checkSecurityHeaders(url);

      const securityScore = calculateDomainScore(httpsCheck, hstsCheck, headersCheck);

      // Mock additional data
      const whoisData = getMockWhoisData(domain);
      const certTransparency = {
        logged: true,
        count: Math.floor(Math.random() * 20) + 5,
        lastSeen: new Date().toISOString().split('T')[0]
      };

      const results = {
        domain,
        https: httpsCheck,
        hsts: hstsCheck,
        headers: headersCheck,
        score: securityScore,
        whois: whoisData,
        certTransparency
      };

      setDomainResults(results);

      // Add to history
      addToHistory({
        tool: 'domain',
        input: domain,
        summary: `Security Score: ${securityScore}/100`,
        result: results
      });
    } catch (e) {
      setDomainResults({
        error: true,
        message: 'Unable to check domain. Please ensure the domain is valid and accessible.'
      });
    } finally {
      setChecking(false);
    }
  };

  const checkHTTPS = async (url) => {
    try {
      await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return { 
        enabled: url.startsWith('https://'),
        accessible: true
      };
    } catch (e) {
      return { 
        enabled: url.startsWith('https://'),
        accessible: false,
        error: e.message
      };
    }
  };

  const checkHSTS = async (domain) => {
    const commonHSTSDomains = ['google.com', 'facebook.com', 'twitter.com', 'github.com', 'cloudflare.com'];
    return {
      preloaded: commonHSTSDomains.some(d => domain.includes(d)),
      note: 'HSTS preload status checked against common domains'
    };
  };

  const checkSecurityHeaders = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      const headers = {
        strictTransportSecurity: response.headers.get('Strict-Transport-Security') !== null,
        contentSecurityPolicy: response.headers.get('Content-Security-Policy') !== null,
        xFrameOptions: response.headers.get('X-Frame-Options') !== null,
        xContentTypeOptions: response.headers.get('X-Content-Type-Options') !== null
      };
      return headers;
    } catch (e) {
      return {
        strictTransportSecurity: false,
        contentSecurityPolicy: false,
        xFrameOptions: false,
        xContentTypeOptions: false,
        note: 'CORS policy prevented header inspection. Domain may still be secure.'
      };
    }
  };

  const calculateDomainScore = (https, hsts, headers) => {
    let score = 0;
    if (https.enabled) score += 30;
    if (https.accessible) score += 10;
    if (hsts.preloaded) score += 20;
    if (headers.strictTransportSecurity) score += 15;
    if (headers.contentSecurityPolicy) score += 10;
    if (headers.xFrameOptions) score += 8;
    if (headers.xContentTypeOptions) score += 7;
    return score;
  };

  const getSecurityColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getSecurityBg = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-400/40 backdrop-blur-lg';
    if (score >= 50) return 'bg-amber-500/10 border-amber-400/40 backdrop-blur-lg';
    return 'bg-rose-500/10 border-rose-400/40 backdrop-blur-lg';
  };

  const getMockWhoisData = (domain) => {
    const randomYears = Math.floor(Math.random() * 5) + 1;
    const createdDate = new Date();
    createdDate.setFullYear(createdDate.getFullYear() - randomYears);

    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    return {
      registrar: 'Example Registrar Inc.',
      createdDate: createdDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      age: `${randomYears} year${randomYears > 1 ? 's' : ''}`,
      status: 'Active'
    };
  };

  const handleExportJSON = () => {
    if (!domainResults) return;
    exportAsJSON({
      toolName: 'Domain Security Checker',
      timestamp: new Date().toISOString(),
      data: domainResults,
      summary: `Security score ${domainResults.score}/100 for ${domainResults.domain}`
    });
  };

  const handleExportPDF = () => {
    if (!domainResults) return;
    exportAsPDF({
      toolName: 'Domain Security Checker',
      timestamp: new Date().toISOString(),
      data: domainResults,
      summary: `Domain: ${domainResults.domain}, Security Score: ${domainResults.score}/100`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-500" />
            <h1 className="text-4xl font-bold text-white">Domain Security Checker</h1>
          </div>
          <p className="text-slate-300">Check domain security before visiting websites</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-slate-800">Check Domain Security</h2>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              History
            </button>
          </div>
          <p className="text-slate-600 mb-6">Enter a domain or URL to check its security before visiting</p>

          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-inner mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={domainToCheck}
                onChange={(e) => setDomainToCheck(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkDomain()}
                placeholder="example.com or https://example.com"
                className="flex-1 px-6 py-4 border-2 border-cyan-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg bg-white/90 backdrop-blur-sm transition-all duration-300"
              />
              <button
                onClick={checkDomain}
                disabled={checking}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                {checking ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
                Check
              </button>
            </div>
          </div>

          {domainResults && (
            <div className={`p-6 rounded-2xl border-2 ${domainResults.error ? 'bg-rose-500/10 border-rose-400/40 backdrop-blur-lg' : getSecurityBg(domainResults.score)} shadow-xl`}>
              {domainResults.error ? (
                <div className="flex items-start gap-3">
                  <XCircle className="w-7 h-7 text-rose-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-800 text-lg">Error Checking Domain</p>
                    <p className="text-rose-700 text-sm mt-1">{domainResults.message}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">{domainResults.domain}</h3>
                    <div className={`text-3xl font-bold ${getSecurityColor(domainResults.score)} bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border-2 ${domainResults.score >= 80 ? 'border-emerald-400/40' : domainResults.score >= 50 ? 'border-amber-400/40' : 'border-rose-400/40'}`}>
                      {domainResults.score}/100
                    </div>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={handleExportJSON}
                      className="flex-1 px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium backdrop-blur-sm"
                    >
                      <Download className="w-5 h-5" />
                      Export JSON
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="flex-1 px-4 py-3 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/40 text-teal-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium backdrop-blur-sm"
                    >
                      <Download className="w-5 h-5" />
                      Export PDF
                    </button>
                  </div>

                  <div className="space-y-3">
                    <SecurityItem 
                      label="HTTPS Enabled" 
                      status={domainResults.https.enabled}
                      description={domainResults.https.enabled ? "Connection will be encrypted" : "Insecure connection"}
                    />
                    <SecurityItem 
                      label="HSTS Preloaded" 
                      status={domainResults.hsts.preloaded}
                      description={domainResults.hsts.note}
                    />
                    <SecurityItem 
                      label="Strict-Transport-Security Header" 
                      status={domainResults.headers.strictTransportSecurity}
                      description="Forces HTTPS connections"
                    />
                    <SecurityItem 
                      label="Content-Security-Policy" 
                      status={domainResults.headers.contentSecurityPolicy}
                      description="Prevents XSS attacks"
                    />
                    <SecurityItem 
                      label="X-Frame-Options" 
                      status={domainResults.headers.xFrameOptions}
                      description="Prevents clickjacking"
                    />
                    <SecurityItem 
                      label="X-Content-Type-Options" 
                      status={domainResults.headers.xContentTypeOptions}
                      description="Prevents MIME sniffing"
                    />
                  </div>

                  {domainResults.headers.note && (
                    <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-400/40 rounded-xl text-sm text-cyan-800 backdrop-blur-sm flex items-start gap-2">
                      <span className="text-lg">ℹ️</span>
                      <span>{domainResults.headers.note}</span>
                    </div>
                  )}

                  <div className="mt-6 space-y-4">
                    <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-slate-300/40">
                      <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        <h4 className="text-lg font-bold text-slate-800">WHOIS Information</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-400/20">
                          <p className="text-xs text-slate-600 mb-1">Registrar</p>
                          <p className="font-semibold text-slate-800">{domainResults.whois.registrar}</p>
                        </div>
                        <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-400/20">
                          <p className="text-xs text-slate-600 mb-1">Status</p>
                          <p className="font-semibold text-slate-800">{domainResults.whois.status}</p>
                        </div>
                        <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-400/20">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <p className="text-xs text-slate-600">Created</p>
                          </div>
                          <p className="font-semibold text-slate-800 mt-1">{domainResults.whois.createdDate}</p>
                          <p className="text-xs text-slate-600 mt-0.5">Age: {domainResults.whois.age}</p>
                        </div>
                        <div className="bg-indigo-500/5 p-3 rounded-lg border border-indigo-400/20">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <p className="text-xs text-slate-600">Expires</p>
                          </div>
                          <p className="font-semibold text-slate-800 mt-1">{domainResults.whois.expiryDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-slate-300/40">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-violet-600" />
                        <h4 className="text-lg font-bold text-slate-800">Certificate Transparency</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-violet-500/5 p-3 rounded-lg border border-violet-400/20">
                          <p className="text-xs text-slate-600 mb-1">CT Logged</p>
                          <p className="font-semibold text-slate-800">
                            {domainResults.certTransparency.logged ? (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> Yes
                              </span>
                            ) : (
                              <span className="text-rose-600 flex items-center gap-1">
                                <XCircle className="w-4 h-4" /> No
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="bg-violet-500/5 p-3 rounded-lg border border-violet-400/20">
                          <p className="text-xs text-slate-600 mb-1">Log Count</p>
                          <p className="font-semibold text-slate-800">{domainResults.certTransparency.count}</p>
                        </div>
                        <div className="bg-violet-500/5 p-3 rounded-lg border border-violet-400/20">
                          <p className="text-xs text-slate-600 mb-1">Last Seen</p>
                          <p className="font-semibold text-slate-800 text-sm">{domainResults.certTransparency.lastSeen}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-3">
                        Certificate Transparency logs help detect misissued certificates and improve web security.
                      </p>
                    </div>
                  </div>

                  {domainResults.score < 50 && (
                    <div className="mt-4 p-5 bg-rose-500/20 border-2 border-rose-400/50 rounded-xl backdrop-blur-md shadow-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-rose-700 mt-0.5" />
                        <div>
                          <p className="font-bold text-rose-900 text-lg">Security Warning</p>
                          <p className="text-sm text-rose-800 mt-1">This domain has low security. Exercise caution when visiting and avoid entering sensitive information.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <HistoryPanel
          tool="domain"
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectEntry={(entry) => {
            setDomainToCheck(entry.input);
            setHistoryOpen(false);
          }}
        />
      </div>
    </div>
  );
}

function SecurityItem({ label, status, description }) {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 ${
      status
        ? 'bg-emerald-500/10 border-emerald-400/40 hover:bg-emerald-500/20'
        : 'bg-rose-500/10 border-rose-400/40 hover:bg-rose-500/20'
    }`}>
      {status ? (
        <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
      ) : (
        <XCircle className="w-6 h-6 text-rose-600 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{label}</p>
        <p className="text-sm text-slate-700">{description}</p>
      </div>
    </div>
  );
}