import React, { useState, useEffect } from 'react';
import { Shield, Link as LinkIcon, AlertTriangle, CheckCircle, XCircle, Copy, Check, Eye, EyeOff, Lock, Unlock, ExternalLink, Clock, Download, List } from 'lucide-react';
import { addToHistory } from './history-manager';
import { exportAsJSON, exportAsPDF } from './export-utils';
import HistoryPanel from './history-panel';

export default function URLSafetyChecker() {
  const [inputUrl, setInputUrl] = useState('');
  const [encodedUrl, setEncodedUrl] = useState('');
  const [decodedUrl, setDecodedUrl] = useState('');
  const [safetyAnalysis, setSafetyAnalysis] = useState(null);
  const [urlParts, setUrlParts] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showFullUrl, setShowFullUrl] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkResults, setBulkResults] = useState(null);

  useEffect(() => {
    if (inputUrl) {
      analyzeURL(inputUrl);
      encodeURL(inputUrl);
      decodeURL(inputUrl);
      parseURL(inputUrl);
    } else {
      setSafetyAnalysis(null);
      setEncodedUrl('');
      setDecodedUrl('');
      setUrlParts(null);
    }
  }, [inputUrl]);

  const encodeURL = (url) => {
    try {
      setEncodedUrl(encodeURIComponent(url));
    } catch (e) {
      setEncodedUrl('Error encoding URL');
    }
  };

  const decodeURL = (url) => {
    try {
      let decoded = url;
      let lastDecoded = '';
      let iterations = 0;
      const maxIterations = 10;

      // Decode multiple times if needed (for double/triple encoded URLs)
      while (decoded !== lastDecoded && iterations < maxIterations) {
        lastDecoded = decoded;
        try {
          decoded = decodeURIComponent(decoded);
        } catch {
          break;
        }
        iterations++;
      }

      setDecodedUrl(decoded);
    } catch (e) {
      setDecodedUrl('Error decoding URL');
    }
  };

  const parseURL = (url) => {
    try {
      // Try to add protocol if missing
      let fullUrl = url;
      if (!url.match(/^https?:\/\//i)) {
        fullUrl = 'https://' + url;
      }

      const urlObj = new URL(fullUrl);
      
      setUrlParts({
        protocol: urlObj.protocol,
        hostname: urlObj.hostname,
        port: urlObj.port || '(default)',
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin,
        fullUrl: fullUrl
      });
    } catch (e) {
      setUrlParts({
        error: true,
        message: 'Invalid URL format'
      });
    }
  };

  const analyzeURL = (url) => {
    const checks = {
      hasHttps: checkHTTPS(url),
      suspiciousChars: checkSuspiciousCharacters(url),
      ipAddress: checkIPAddress(url),
      suspiciousTLD: checkSuspiciousTLD(url),
      shortener: checkURLShortener(url),
      phishingPatterns: checkPhishingPatterns(url),
      excessiveSubdomains: checkExcessiveSubdomains(url),
      suspiciousPort: checkSuspiciousPort(url),
      homoglyphAttack: checkHomoglyphAttack(url),
      dataURI: checkDataURI(url),
      lengthCheck: checkURLLength(url),
      redirects: checkRedirectPatterns(url)
    };

    const riskScore = calculateRiskScore(checks);
    const recommendations = generateRecommendations(checks);

    const analysis = {
      checks,
      riskScore,
      recommendations,
      riskLevel: getRiskLevel(riskScore)
    };

    setSafetyAnalysis(analysis);

    // Add to history
    addToHistory({
      tool: 'url',
      input: url.substring(0, 100) + (url.length > 100 ? '...' : ''),
      summary: `Risk: ${getRiskLevel(riskScore)} (${riskScore}/100)`,
      result: {
        riskScore,
        riskLevel: getRiskLevel(riskScore),
        url: url
      }
    });
  };

  const checkHTTPS = (url) => {
    const hasHttps = url.toLowerCase().startsWith('https://');
    return {
      safe: hasHttps,
      message: hasHttps ? 'URL uses secure HTTPS protocol' : 'URL does not use HTTPS (insecure)'
    };
  };

  const checkSuspiciousCharacters = (url) => {
    const suspiciousPatterns = [
      { pattern: /@/, description: 'Contains @ symbol (may hide real domain)' },
      { pattern: /\.\.|\.{3,}/, description: 'Contains multiple consecutive dots' },
      { pattern: /%[0-9a-f]{2}/gi, description: 'Contains encoded characters' },
      { pattern: /[^\x00-\x7F]/, description: 'Contains non-ASCII characters' },
      { pattern: /javascript:/i, description: 'Contains JavaScript protocol (XSS risk)' },
      { pattern: /data:/i, description: 'Contains data URI scheme' },
    ];

    const found = suspiciousPatterns.filter(p => p.pattern.test(url));
    
    return {
      safe: found.length === 0,
      findings: found.map(f => f.description),
      count: found.length
    };
  };

  const checkIPAddress = (url) => {
    const ipPattern = /(?:https?:\/\/)?(?:\d{1,3}\.){3}\d{1,3}/;
    const hasIP = ipPattern.test(url);
    
    return {
      safe: !hasIP,
      message: hasIP ? 'Uses IP address instead of domain name (suspicious)' : 'Uses domain name (normal)'
    };
  };

  const checkSuspiciousTLD = (url) => {
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.zip', '.cn', '.ru', '.cc'];
    const hasSuspiciousTLD = suspiciousTLDs.some(tld => url.toLowerCase().includes(tld));
    
    return {
      safe: !hasSuspiciousTLD,
      message: hasSuspiciousTLD ? 'Uses commonly abused top-level domain' : 'Uses common TLD'
    };
  };

  const checkURLShortener = (url) => {
    const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly'];
    const isShortener = shorteners.some(s => url.toLowerCase().includes(s));
    
    return {
      safe: !isShortener,
      message: isShortener ? 'URL shortener detected (destination hidden)' : 'Not a URL shortener',
      isShortener
    };
  };

  const checkPhishingPatterns = (url) => {
    const phishingPatterns = [
      { pattern: /paypal.*verify/i, type: 'PayPal phishing' },
      { pattern: /account.*suspend/i, type: 'Account suspension scam' },
      { pattern: /secure.*update/i, type: 'Security update scam' },
      { pattern: /verify.*identity/i, type: 'Identity verification scam' },
      { pattern: /claim.*prize/i, type: 'Prize claim scam' },
      { pattern: /urgent.*action/i, type: 'Urgency scam' },
      { pattern: /confirm.*password/i, type: 'Password confirmation scam' },
      { pattern: /-\w+\.(com|net|org)/i, type: 'Suspicious subdomain pattern' }
    ];

    const found = phishingPatterns.filter(p => p.pattern.test(url));
    
    return {
      safe: found.length === 0,
      findings: found.map(f => f.type),
      count: found.length
    };
  };

  const checkExcessiveSubdomains = (url) => {
    try {
      const hostname = new URL(url.includes('://') ? url : 'https://' + url).hostname;
      const subdomainCount = hostname.split('.').length - 2;
      const excessive = subdomainCount > 3;
      
      return {
        safe: !excessive,
        message: excessive ? `Has ${subdomainCount} subdomains (may be suspicious)` : 'Normal subdomain structure',
        count: subdomainCount
      };
    } catch {
      return { safe: true, message: 'Unable to parse', count: 0 };
    }
  };

  const checkSuspiciousPort = (url) => {
    const portMatch = url.match(/:(\d+)/);
    if (!portMatch) return { safe: true, message: 'Uses standard port' };
    
    const port = parseInt(portMatch[1]);
    const commonPorts = [80, 443, 8080, 8443];
    const isSuspicious = !commonPorts.includes(port);
    
    return {
      safe: !isSuspicious,
      message: isSuspicious ? `Uses uncommon port ${port}` : `Uses common port ${port}`,
      port
    };
  };

  const checkHomoglyphAttack = (url) => {
    // Check for common homoglyph characters that look like legitimate ones
    const homoglyphs = {
      'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x', // Cyrillic
      'ο': 'o', 'а': 'a', // Greek
      '0': 'O', '1': 'l', // Numbers that look like letters
    };

    const hasHomoglyph = Object.keys(homoglyphs).some(char => url.includes(char));
    
    return {
      safe: !hasHomoglyph,
      message: hasHomoglyph ? 'May contain lookalike characters (homoglyph attack)' : 'No lookalike characters detected'
    };
  };

  const checkDataURI = (url) => {
    const isDataURI = url.toLowerCase().startsWith('data:');
    
    return {
      safe: !isDataURI,
      message: isDataURI ? 'Data URI detected (can contain malicious code)' : 'Not a data URI'
    };
  };

  const checkURLLength = (url) => {
    const length = url.length;
    const suspicious = length > 200;
    
    return {
      safe: !suspicious,
      message: suspicious ? `URL is very long (${length} chars) - may be obfuscated` : `URL length is normal (${length} chars)`,
      length
    };
  };

  const checkRedirectPatterns = (url) => {
    const redirectPatterns = ['redirect', 'redir', 'goto', 'out', 'away', 'link', 'url=', 'site=', 'to='];
    const hasRedirect = redirectPatterns.some(p => url.toLowerCase().includes(p));
    
    return {
      safe: !hasRedirect,
      message: hasRedirect ? 'Contains redirect indicators (may hide destination)' : 'No redirect patterns detected'
    };
  };

  const calculateRiskScore = (checks) => {
    let risk = 0;

    if (!checks.hasHttps.safe) risk += 20;
    if (!checks.ipAddress.safe) risk += 15;
    if (!checks.suspiciousTLD.safe) risk += 10;
    if (!checks.dataURI.safe) risk += 25;
    if (checks.suspiciousChars.count > 0) risk += checks.suspiciousChars.count * 5;
    if (checks.phishingPatterns.count > 0) risk += checks.phishingPatterns.count * 10;
    if (!checks.excessiveSubdomains.safe) risk += 15;
    if (!checks.suspiciousPort.safe) risk += 10;
    if (!checks.homoglyphAttack.safe) risk += 20;
    if (checks.shortener.isShortener) risk += 5;
    if (!checks.lengthCheck.safe) risk += 10;
    if (!checks.redirects.safe) risk += 10;

    return Math.min(100, risk);
  };

  const getRiskLevel = (score) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    if (score >= 15) return 'Low Risk';
    return 'Safe';
  };

  const getRiskColor = (score) => {
    if (score >= 70) return 'bg-gradient-to-r from-rose-500 to-red-600';
    if (score >= 40) return 'bg-gradient-to-r from-orange-500 to-amber-500';
    if (score >= 15) return 'bg-gradient-to-r from-amber-500 to-yellow-500';
    return 'bg-gradient-to-r from-emerald-500 to-teal-600';
  };

  const getRiskBgColor = (score) => {
    if (score >= 70) return 'bg-rose-500/20 border-rose-400/50 backdrop-blur-md';
    if (score >= 40) return 'bg-orange-500/20 border-orange-400/50 backdrop-blur-md';
    if (score >= 15) return 'bg-amber-500/20 border-amber-400/50 backdrop-blur-md';
    return 'bg-emerald-500/20 border-emerald-400/50 backdrop-blur-md';
  };

  const getRiskTextColor = (score) => {
    if (score >= 70) return 'text-rose-600';
    if (score >= 40) return 'text-orange-600';
    if (score >= 15) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const generateRecommendations = (checks) => {
    const recommendations = [];

    if (!checks.hasHttps.safe) recommendations.push('Only visit HTTPS websites for secure connections');
    if (!checks.ipAddress.safe) recommendations.push('Be cautious of URLs using IP addresses instead of domains');
    if (!checks.suspiciousTLD.safe) recommendations.push('This TLD is commonly used for phishing - verify the sender');
    if (checks.suspiciousChars.count > 0) recommendations.push('URL contains suspicious characters - decode and verify');
    if (checks.phishingPatterns.count > 0) recommendations.push('URL matches common phishing patterns - do not enter credentials');
    if (checks.shortener.isShortener) recommendations.push('URL shortener hides destination - expand before visiting');
    if (!checks.dataURI.safe) recommendations.push('Data URIs can contain malicious code - do not trust');
    if (!checks.homoglyphAttack.safe) recommendations.push('URL may use lookalike characters to impersonate legitimate sites');
    if (!checks.lengthCheck.safe) recommendations.push('Extremely long URLs are often used to hide malicious content');

    if (recommendations.length === 0) {
      recommendations.push('URL appears relatively safe, but always verify the source');
    }

    return recommendations;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const truncateUrl = (url, maxLength = 60) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const analyzeBulkUrls = () => {
    if (!bulkUrls.trim()) return;

    const urls = bulkUrls.split('\n').filter(url => url.trim() !== '');
    const results = urls.map(url => {
      const trimmedUrl = url.trim();
      const checks = {
        hasHttps: checkHTTPS(trimmedUrl),
        suspiciousChars: checkSuspiciousCharacters(trimmedUrl),
        ipAddress: checkIPAddress(trimmedUrl),
        suspiciousTLD: checkSuspiciousTLD(trimmedUrl),
        shortener: checkURLShortener(trimmedUrl),
        phishingPatterns: checkPhishingPatterns(trimmedUrl),
        excessiveSubdomains: checkExcessiveSubdomains(trimmedUrl),
        suspiciousPort: checkSuspiciousPort(trimmedUrl),
        homoglyphAttack: checkHomoglyphAttack(trimmedUrl),
        dataURI: checkDataURI(trimmedUrl),
        lengthCheck: checkURLLength(trimmedUrl),
        redirects: checkRedirectPatterns(trimmedUrl)
      };

      const riskScore = calculateRiskScore(checks);

      return {
        url: trimmedUrl,
        riskScore,
        riskLevel: getRiskLevel(riskScore),
        checks
      };
    });

    setBulkResults(results);

    // Add summary to history
    const highRiskCount = results.filter(r => r.riskScore >= 70).length;
    const mediumRiskCount = results.filter(r => r.riskScore >= 40 && r.riskScore < 70).length;
    addToHistory({
      tool: 'url',
      input: `Bulk check: ${results.length} URLs`,
      summary: `High Risk: ${highRiskCount}, Medium: ${mediumRiskCount}, Low/Safe: ${results.length - highRiskCount - mediumRiskCount}`,
      result: { bulkResults: results }
    });
  };

  const handleExportJSON = () => {
    if (bulkMode && bulkResults) {
      exportAsJSON({
        toolName: 'URL Safety Checker (Bulk)',
        timestamp: new Date().toISOString(),
        data: bulkResults,
        summary: `Analyzed ${bulkResults.length} URLs`
      });
    } else if (safetyAnalysis) {
      exportAsJSON({
        toolName: 'URL Safety Checker',
        timestamp: new Date().toISOString(),
        data: {
          url: inputUrl,
          riskScore: safetyAnalysis.riskScore,
          riskLevel: safetyAnalysis.riskLevel,
          checks: safetyAnalysis.checks,
          recommendations: safetyAnalysis.recommendations
        },
        summary: `Risk Level: ${safetyAnalysis.riskLevel} (${safetyAnalysis.riskScore}/100)`
      });
    }
  };

  const handleExportPDF = () => {
    if (bulkMode && bulkResults) {
      exportAsPDF({
        toolName: 'URL Safety Checker (Bulk)',
        timestamp: new Date().toISOString(),
        data: bulkResults.map(r => ({
          url: r.url.substring(0, 80),
          riskLevel: r.riskLevel,
          riskScore: r.riskScore
        })),
        summary: `Bulk URL Analysis: ${bulkResults.length} URLs checked`
      });
    } else if (safetyAnalysis) {
      exportAsPDF({
        toolName: 'URL Safety Checker',
        timestamp: new Date().toISOString(),
        data: {
          url: inputUrl,
          riskLevel: safetyAnalysis.riskLevel,
          riskScore: safetyAnalysis.riskScore
        },
        summary: `URL: ${inputUrl.substring(0, 60)}, Risk: ${safetyAnalysis.riskLevel}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-500" />
            <h1 className="text-4xl font-bold text-white">URL Safety Checker</h1>
          </div>
          <p className="text-slate-300">Decode, encode, and analyze URLs for security threats</p>
        </div>

        {/* URL Input Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-slate-800">Enter URL to Analyze</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setBulkMode(!bulkMode);
                  setInputUrl('');
                  setBulkUrls('');
                  setSafetyAnalysis(null);
                  setBulkResults(null);
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                  bulkMode
                    ? 'bg-indigo-500/20 text-indigo-700 hover:bg-indigo-500/30'
                    : 'text-slate-600 hover:bg-slate-500/10'
                }`}
              >
                <List className="w-4 h-4" />
                Bulk Mode
              </button>
              <button
                onClick={() => setHistoryOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                History
              </button>
            </div>
          </div>
          <p className="text-slate-600 mb-6">
            {bulkMode
              ? 'Enter multiple URLs (one per line) to check them all at once'
              : 'Paste any URL to check for security threats and decode obfuscated links'
            }
          </p>

          {!bulkMode ? (
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-inner">
              <textarea
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Paste URL here... (e.g., https://example.com or encoded URL)"
                rows={4}
                className="w-full px-6 py-4 border-2 border-teal-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-base resize-none bg-white/90 backdrop-blur-sm transition-all duration-300"
              />
            </div>
          ) : (
            <>
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-inner mb-4">
                <textarea
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder="Enter URLs (one per line)&#10;https://example1.com&#10;https://example2.com&#10;https://example3.com"
                  rows={8}
                  className="w-full px-6 py-4 border-2 border-indigo-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-base resize-none bg-white/90 backdrop-blur-sm transition-all duration-300"
                />
              </div>
              <button
                onClick={analyzeBulkUrls}
                disabled={!bulkUrls.trim()}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <List className="w-6 h-6" />
                Analyze {bulkUrls.split('\n').filter(u => u.trim()).length} URLs
              </button>
            </>
          )}

          {(inputUrl || bulkUrls) && (
            <button
              onClick={() => {
                setInputUrl('');
                setBulkUrls('');
                setSafetyAnalysis(null);
                setBulkResults(null);
              }}
              className="mt-4 px-4 py-2 text-sm text-rose-600 hover:text-rose-700 font-semibold bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all duration-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* URL Parts Breakdown */}
        {urlParts && !urlParts.error && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 mb-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">URL Structure</h2>

            <div className="space-y-3">
              <URLPart label="Protocol" value={urlParts.protocol} />
              <URLPart label="Hostname/Domain" value={urlParts.hostname} highlight />
              <URLPart label="Port" value={urlParts.port} />
              <URLPart label="Path" value={urlParts.pathname || '/'} />
              {urlParts.search && <URLPart label="Query Parameters" value={urlParts.search} />}
              {urlParts.hash && <URLPart label="Fragment/Hash" value={urlParts.hash} />}
              <URLPart label="Origin" value={urlParts.origin} />
            </div>
          </div>
        )}

        {/* Encoding/Decoding Section */}
        {(encodedUrl || decodedUrl) && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-cyan-600" />
                  Encoded URL
                </h3>
                <button
                  onClick={() => copyToClipboard(encodedUrl, 'encoded')}
                  className="text-slate-500 hover:text-cyan-600 transition-colors duration-300"
                  title="Copy to clipboard"
                >
                  {copied === 'encoded' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border-2 border-cyan-300/50 break-all font-mono text-sm shadow-inner">
                {encodedUrl}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Unlock className="w-6 h-6 text-emerald-600" />
                  Decoded URL
                </h3>
                <button
                  onClick={() => copyToClipboard(decodedUrl, 'decoded')}
                  className="text-slate-500 hover:text-emerald-600 transition-colors duration-300"
                  title="Copy to clipboard"
                >
                  {copied === 'decoded' ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border-2 border-emerald-300/50 break-all font-mono text-sm shadow-inner">
                {decodedUrl}
              </div>
              {decodedUrl !== inputUrl && (
                <p className="mt-3 text-sm text-cyan-700 bg-cyan-500/10 p-2 rounded-lg backdrop-blur-sm">
                  ℹ️ URL was encoded {decodedUrl.split('%').length > inputUrl.split('%').length ? 'multiple times' : 'once'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Safety Analysis */}
        {safetyAnalysis && !bulkMode && (
          <div className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 mb-6 ${getRiskBgColor(safetyAnalysis.riskScore)}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Safety Analysis</h2>
              <div className={`text-3xl font-bold ${getRiskTextColor(safetyAnalysis.riskScore)} bg-white/60 px-4 py-2 rounded-xl`}>
                {safetyAnalysis.riskLevel}
              </div>
            </div>

            <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/60 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-semibold text-slate-800">Risk Score</span>
                <span className={`text-lg font-bold ${getRiskTextColor(safetyAnalysis.riskScore)} bg-white/60 px-3 py-1 rounded-lg`}>
                  {safetyAnalysis.riskScore}/100
                </span>
              </div>
              <div className="w-full bg-slate-200/50 backdrop-blur-sm rounded-full h-4 shadow-inner mb-4">
                <div
                  className={`h-4 rounded-full transition-all duration-500 shadow-lg ${getRiskColor(safetyAnalysis.riskScore)}`}
                  style={{ width: `${safetyAnalysis.riskScore}%` }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportJSON}
                  className="flex-1 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium backdrop-blur-sm"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex-1 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-400/40 text-teal-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium backdrop-blur-sm"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <SecurityCheck 
                label="HTTPS Protocol" 
                status={safetyAnalysis.checks.hasHttps.safe}
                message={safetyAnalysis.checks.hasHttps.message}
              />
              <SecurityCheck 
                label="IP Address Check" 
                status={safetyAnalysis.checks.ipAddress.safe}
                message={safetyAnalysis.checks.ipAddress.message}
              />
              <SecurityCheck 
                label="Suspicious TLD" 
                status={safetyAnalysis.checks.suspiciousTLD.safe}
                message={safetyAnalysis.checks.suspiciousTLD.message}
              />
              <SecurityCheck 
                label="URL Shortener" 
                status={safetyAnalysis.checks.shortener.safe}
                message={safetyAnalysis.checks.shortener.message}
              />
              <SecurityCheck 
                label="Subdomain Structure" 
                status={safetyAnalysis.checks.excessiveSubdomains.safe}
                message={safetyAnalysis.checks.excessiveSubdomains.message}
              />
              <SecurityCheck 
                label="Port Check" 
                status={safetyAnalysis.checks.suspiciousPort.safe}
                message={safetyAnalysis.checks.suspiciousPort.message}
              />
              <SecurityCheck 
                label="Homoglyph Attack" 
                status={safetyAnalysis.checks.homoglyphAttack.safe}
                message={safetyAnalysis.checks.homoglyphAttack.message}
              />
              <SecurityCheck 
                label="Data URI" 
                status={safetyAnalysis.checks.dataURI.safe}
                message={safetyAnalysis.checks.dataURI.message}
              />
              <SecurityCheck 
                label="URL Length" 
                status={safetyAnalysis.checks.lengthCheck.safe}
                message={safetyAnalysis.checks.lengthCheck.message}
              />
              <SecurityCheck 
                label="Redirect Patterns" 
                status={safetyAnalysis.checks.redirects.safe}
                message={safetyAnalysis.checks.redirects.message}
              />
            </div>

            {safetyAnalysis.checks.suspiciousChars.findings.length > 0 && (
              <div className="mb-6 p-5 bg-orange-500/20 border-2 border-orange-400/50 rounded-xl backdrop-blur-md shadow-lg">
                <h3 className="font-bold text-orange-900 mb-3 text-lg">Suspicious Characters Detected</h3>
                <ul className="space-y-2">
                  {safetyAnalysis.checks.suspiciousChars.findings.map((finding, index) => (
                    <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                      <span className="mt-1 text-base">⚠</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {safetyAnalysis.checks.phishingPatterns.findings.length > 0 && (
              <div className="mb-6 p-5 bg-rose-500/20 border-2 border-rose-400/50 rounded-xl backdrop-blur-md shadow-lg">
                <h3 className="font-bold text-rose-900 mb-3 flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-6 h-6" />
                  Phishing Patterns Detected
                </h3>
                <ul className="space-y-2">
                  {safetyAnalysis.checks.phishingPatterns.findings.map((finding, index) => (
                    <li key={index} className="text-sm text-rose-800 flex items-start gap-2">
                      <span className="mt-1 text-base">🚨</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-5 bg-cyan-500/10 border-2 border-cyan-400/40 rounded-xl backdrop-blur-md shadow-lg">
              <h3 className="font-bold text-cyan-900 mb-3">Security Recommendations</h3>
              <ul className="space-y-2">
                {safetyAnalysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-cyan-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bulk Results */}
        {bulkResults && bulkMode && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Bulk Analysis Results</h2>
              <span className="text-lg font-semibold text-slate-700 bg-white/60 px-4 py-2 rounded-xl">
                {bulkResults.length} URLs Checked
              </span>
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
              {bulkResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border-2 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${getRiskBgColor(result.riskScore)}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-slate-700 break-all">{result.url}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xl font-bold ${getRiskTextColor(result.riskScore)} bg-white/60 px-3 py-1 rounded-lg`}>
                        {result.riskScore}
                      </span>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${getRiskTextColor(result.riskScore)} bg-white/40`}>
                        {result.riskLevel}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200/50 backdrop-blur-sm rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getRiskColor(result.riskScore)}`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {!result.checks.hasHttps.safe && (
                      <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-700 rounded-md font-medium">No HTTPS</span>
                    )}
                    {!result.checks.ipAddress.safe && (
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-700 rounded-md font-medium">IP Address</span>
                    )}
                    {result.checks.phishingPatterns.count > 0 && (
                      <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-700 rounded-md font-medium">Phishing Pattern</span>
                    )}
                    {result.checks.shortener.isShortener && (
                      <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-700 rounded-md font-medium">URL Shortener</span>
                    )}
                    {!result.checks.suspiciousTLD.safe && (
                      <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-700 rounded-md font-medium">Suspicious TLD</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 bg-indigo-500/10 border-2 border-indigo-400/40 rounded-xl backdrop-blur-md">
              <h3 className="font-bold text-indigo-900 mb-2">Summary Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/40 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    {bulkResults.filter(r => r.riskScore < 15).length}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Safe</div>
                </div>
                <div className="bg-white/40 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">
                    {bulkResults.filter(r => r.riskScore >= 15 && r.riskScore < 40).length}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Low Risk</div>
                </div>
                <div className="bg-white/40 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {bulkResults.filter(r => r.riskScore >= 40 && r.riskScore < 70).length}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Medium Risk</div>
                </div>
                <div className="bg-white/40 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-rose-600">
                    {bulkResults.filter(r => r.riskScore >= 70).length}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">High Risk</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-2 border-cyan-400/40 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-600" />
            URL Safety Tips
          </h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Always verify the domain name matches the expected website</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Look for HTTPS and a valid SSL certificate before entering sensitive data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Be wary of shortened URLs - expand them before clicking</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Check for typos or unusual characters in domain names (typosquatting)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Never enter passwords or payment info on suspicious websites</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Hover over links to preview the destination before clicking</span>
            </li>
          </ul>
        </div>

        <HistoryPanel
          tool="url"
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectEntry={(entry) => {
            if (!entry.result.bulkResults) {
              setInputUrl(entry.result.url || entry.input);
              setBulkMode(false);
            }
            setHistoryOpen(false);
          }}
        />
      </div>
    </div>
  );
}

function URLPart({ label, value, highlight = false }) {
  return (
    <div className="flex items-start gap-4 py-3 px-4 rounded-lg bg-white/40 backdrop-blur-sm border border-white/40 hover:bg-white/60 transition-all duration-300">
      <span className="text-sm font-semibold text-slate-700 min-w-[140px]">{label}:</span>
      <span className={`text-sm font-mono break-all flex-1 ${highlight ? 'font-bold text-cyan-700' : 'text-slate-700'}`}>
        {value}
      </span>
    </div>
  );
}

function SecurityCheck({ label, status, message }) {
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
        <p className="font-medium text-slate-800 text-sm">{label}</p>
        <p className="text-xs text-slate-600 mt-1">{message}</p>
      </div>
    </div>
  );
}