import React, { useState } from 'react';
import { Shield, Mail, AlertTriangle, CheckCircle, XCircle, MapPin, Clock, Server, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToHistory } from './history-manager';
import { exportAsJSON, exportAsPDF } from './export-utils';
import HistoryPanel from './history-panel';

interface EmailAnalysis {
  from: string;
  to: string;
  subject: string;
  date: string;
  messageId: string;
  returnPath: string;
  authentication: {
    spf: { status: 'pass' | 'fail' | 'none'; details: string };
    dkim: { status: 'pass' | 'fail' | 'none'; details: string };
    dmarc: { status: 'pass' | 'fail' | 'none'; details: string };
  };
  receivedChain: Array<{
    from: string;
    by: string;
    timestamp: string;
    ip?: string;
  }>;
  spamScore: number;
  spoofingIndicators: string[];
  securityScore: number;
  recommendations: string[];
}

export default function EmailHeaderAnalyzer() {
  const navigate = useNavigate();
  const [headers, setHeaders] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const analyzeHeaders = async () => {
    if (!headers.trim()) return;

    setAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = parseEmailHeaders(headers);
      setAnalysis(result);

      // Add to history
      addToHistory({
        tool: 'email',
        input: headers.substring(0, 100) + '...',
        summary: `From: ${result.from}, Security Score: ${result.securityScore}/100`,
        result
      });

    } catch (e) {
      setError('Unable to parse email headers. Please ensure you have pasted complete email headers.');
    } finally {
      setAnalyzing(false);
    }
  };

  const parseEmailHeaders = (headerText: string): EmailAnalysis => {
    const lines = headerText.split('\n');
    const headers: Record<string, string> = {};

    // Parse headers
    let currentHeader = '';
    lines.forEach(line => {
      if (line.match(/^[A-Za-z-]+:/)) {
        const [key, ...valueParts] = line.split(':');
        currentHeader = key.trim().toLowerCase();
        headers[currentHeader] = valueParts.join(':').trim();
      } else if (currentHeader && line.trim()) {
        headers[currentHeader] += ' ' + line.trim();
      }
    });

    // Extract key information
    const from = headers['from'] || 'Unknown';
    const to = headers['to'] || 'Unknown';
    const subject = headers['subject'] || 'No Subject';
    const date = headers['date'] || 'Unknown';
    const messageId = headers['message-id'] || 'Unknown';
    const returnPath = headers['return-path'] || 'Unknown';

    // Parse authentication results
    const authResults = headers['authentication-results'] || '';
    const spfMatch = authResults.match(/spf=(pass|fail|none)/i);
    const dkimMatch = authResults.match(/dkim=(pass|fail|none)/i);
    const dmarcMatch = authResults.match(/dmarc=(pass|fail|none)/i);

    const authentication = {
      spf: {
        status: (spfMatch?.[1]?.toLowerCase() || 'none') as 'pass' | 'fail' | 'none',
        details: spfMatch ? 'SPF check completed' : 'No SPF record found'
      },
      dkim: {
        status: (dkimMatch?.[1]?.toLowerCase() || 'none') as 'pass' | 'fail' | 'none',
        details: dkimMatch ? 'DKIM signature verified' : 'No DKIM signature found'
      },
      dmarc: {
        status: (dmarcMatch?.[1]?.toLowerCase() || 'none') as 'pass' | 'fail' | 'none',
        details: dmarcMatch ? 'DMARC policy checked' : 'No DMARC policy found'
      }
    };

    // Parse received chain
    const receivedHeaders = headerText.match(/^Received:.*$/gim) || [];
    const receivedChain = receivedHeaders.map(received => {
      const fromMatch = received.match(/from\s+([\w.-]+)/i);
      const byMatch = received.match(/by\s+([\w.-]+)/i);
      const ipMatch = received.match(/\[([\d.]+)\]/);
      const timeMatch = received.match(/;\s*(.+)$/);

      return {
        from: fromMatch?.[1] || 'Unknown',
        by: byMatch?.[1] || 'Unknown',
        timestamp: timeMatch?.[1] || 'Unknown',
        ip: ipMatch?.[1]
      };
    });

    // Calculate spam score
    let spamScore = 0;
    const spoofingIndicators: string[] = [];

    if (authentication.spf.status === 'fail') {
      spamScore += 3;
      spoofingIndicators.push('SPF check failed - sender may be forged');
    }
    if (authentication.dkim.status === 'fail') {
      spamScore += 2;
      spoofingIndicators.push('DKIM signature invalid - message may be tampered');
    }
    if (authentication.dmarc.status === 'fail') {
      spamScore += 2;
      spoofingIndicators.push('DMARC policy violation detected');
    }

    // Check From vs Return-Path mismatch
    const fromDomain = from.match(/@([\w.-]+)/)?.[1];
    const returnPathDomain = returnPath.match(/@([\w.-]+)/)?.[1];
    if (fromDomain && returnPathDomain && fromDomain !== returnPathDomain) {
      spamScore += 2;
      spoofingIndicators.push('From address domain differs from Return-Path domain');
    }

    // Calculate security score
    let securityScore = 100;
    if (authentication.spf.status === 'none') securityScore -= 15;
    if (authentication.spf.status === 'fail') securityScore -= 30;
    if (authentication.dkim.status === 'none') securityScore -= 15;
    if (authentication.dkim.status === 'fail') securityScore -= 30;
    if (authentication.dmarc.status === 'none') securityScore -= 10;
    if (authentication.dmarc.status === 'fail') securityScore -= 20;
    if (spoofingIndicators.length > 0) securityScore -= 10 * spoofingIndicators.length;

    // Generate recommendations
    const recommendations: string[] = [];
    if (authentication.spf.status !== 'pass') {
      recommendations.push('Implement SPF records for sender domain');
    }
    if (authentication.dkim.status !== 'pass') {
      recommendations.push('Configure DKIM signing for outgoing emails');
    }
    if (authentication.dmarc.status !== 'pass') {
      recommendations.push('Set up DMARC policy to prevent email spoofing');
    }
    if (spoofingIndicators.length > 0) {
      recommendations.push('Exercise caution - this email shows signs of potential spoofing');
    }
    if (spamScore >= 5) {
      recommendations.push('High spam score - verify sender before taking action');
    }
    if (recommendations.length === 0) {
      recommendations.push('Email authentication is properly configured');
    }

    return {
      from,
      to,
      subject,
      date,
      messageId,
      returnPath,
      authentication,
      receivedChain,
      spamScore: Math.min(10, spamScore),
      spoofingIndicators,
      securityScore: Math.max(0, securityScore),
      recommendations
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/20 border-emerald-400/50';
    if (score >= 60) return 'bg-amber-500/20 border-amber-400/50';
    return 'bg-rose-500/20 border-rose-400/50';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-600';
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-rose-500 to-red-600';
  };

  const getAuthIcon = (status: string) => {
    if (status === 'pass') return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    if (status === 'fail') return <XCircle className="w-5 h-5 text-rose-600" />;
    return <AlertTriangle className="w-5 h-5 text-amber-600" />;
  };

  const handleExportJSON = () => {
    if (!analysis) return;
    exportAsJSON({
      toolName: 'Email Header Analyzer',
      timestamp: new Date().toISOString(),
      data: analysis,
      summary: `Email from ${analysis.from}, Security Score: ${analysis.securityScore}/100`
    });
  };

  const handleExportPDF = () => {
    if (!analysis) return;
    exportAsPDF({
      toolName: 'Email Header Analyzer',
      timestamp: new Date().toISOString(),
      data: analysis,
      summary: `Security Score: ${analysis.securityScore}/100, Spam Score: ${analysis.spamScore}/10`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Back Navigation */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="w-12 h-12 text-indigo-500" />
              <h1 className="text-4xl font-bold text-white">Email Header Analyzer</h1>
            </div>
            <p className="text-slate-300">Parse and analyze email headers for authentication and security</p>
          </div>

        {/* Input Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 dark:border-slate-700/40 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Paste Email Headers</h2>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              History
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Paste the full email headers to analyze authentication, routing, and potential security issues</p>

          <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-md rounded-xl p-4 border border-white/60 dark:border-slate-600/60 shadow-inner mb-4">
            <textarea
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder="Paste complete email headers here...&#10;&#10;Example:&#10;From: sender@example.com&#10;To: recipient@example.com&#10;Subject: Test Email&#10;Date: Mon, 01 Jan 2024 12:00:00 +0000&#10;Authentication-Results: spf=pass; dkim=pass; dmarc=pass&#10;..."
              rows={8}
              className="w-full px-6 py-4 border-2 border-indigo-300/50 dark:border-indigo-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white backdrop-blur-sm transition-all duration-300"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={analyzeHeaders}
              disabled={analyzing}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Headers'}
            </button>
            {headers && (
              <button
                onClick={() => setHeaders('')}
                className="px-6 py-4 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold"
              >
                Clear
              </button>
            )}
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

        {/* Analysis Results */}
        {analysis && (
          <div className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 mb-6 ${getScoreBg(analysis.securityScore)}`}>
            {/* Header with Export */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analysis Results</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                >
                  JSON
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>

            {/* Security Score */}
            <div className="mb-6 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl p-5 border border-white/60 dark:border-slate-600/60 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-semibold text-slate-800 dark:text-white">Security Score</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Spam Score: <span className="font-bold text-rose-600">{analysis.spamScore}/10</span>
                  </span>
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.securityScore)} bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-xl`}>
                    {analysis.securityScore}/100
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-full h-4 shadow-inner">
                <div
                  className={`h-4 rounded-full transition-all duration-500 shadow-lg ${getScoreGradient(analysis.securityScore)}`}
                  style={{ width: `${analysis.securityScore}%` }}
                />
              </div>
            </div>

            {/* Email Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <EmailDetail label="From" value={analysis.from} />
              <EmailDetail label="To" value={analysis.to} />
              <EmailDetail label="Subject" value={analysis.subject} />
              <EmailDetail label="Date" value={analysis.date} />
              <EmailDetail label="Message-ID" value={analysis.messageId} mono />
              <EmailDetail label="Return-Path" value={analysis.returnPath} />
            </div>

            {/* Authentication Results */}
            <div className="mb-6 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl p-5 border border-white/60 dark:border-slate-600/60">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Email Authentication</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <AuthStatus label="SPF" status={analysis.authentication.spf.status} details={analysis.authentication.spf.details} icon={getAuthIcon(analysis.authentication.spf.status)} />
                <AuthStatus label="DKIM" status={analysis.authentication.dkim.status} details={analysis.authentication.dkim.details} icon={getAuthIcon(analysis.authentication.dkim.status)} />
                <AuthStatus label="DMARC" status={analysis.authentication.dmarc.status} details={analysis.authentication.dmarc.details} icon={getAuthIcon(analysis.authentication.dmarc.status)} />
              </div>
            </div>

            {/* Received Chain */}
            {analysis.receivedChain.length > 0 && (
              <div className="mb-6 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl p-5 border border-white/60 dark:border-slate-600/60">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Email Routing Path ({analysis.receivedChain.length} hops)
                </h3>
                <div className="space-y-3">
                  {analysis.receivedChain.map((hop, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="text-slate-800 dark:text-white font-medium">
                          From: <span className="font-mono">{hop.from}</span> → By: <span className="font-mono">{hop.by}</span>
                        </p>
                        {hop.ip && (
                          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            IP: {hop.ip}
                          </p>
                        )}
                        <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">{hop.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Spoofing Indicators */}
            {analysis.spoofingIndicators.length > 0 && (
              <div className="mb-6 p-5 bg-rose-500/20 border-2 border-rose-400/50 rounded-xl backdrop-blur-md shadow-lg">
                <h3 className="font-bold text-rose-900 dark:text-rose-300 mb-3 flex items-center gap-2 text-lg">
                  <AlertTriangle className="w-6 h-6" />
                  Security Warnings
                </h3>
                <ul className="space-y-2">
                  {analysis.spoofingIndicators.map((indicator, idx) => (
                    <li key={idx} className="text-sm text-rose-800 dark:text-rose-400 flex items-start gap-2">
                      <span className="mt-1 text-base">⚠</span>
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-5 bg-indigo-500/10 border-2 border-indigo-400/40 rounded-xl backdrop-blur-md shadow-lg">
              <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-indigo-800 dark:text-indigo-400 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-2 border-indigo-400/40 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Email Authentication Information
          </h3>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span><strong>SPF</strong> verifies that the sending server is authorized to send email for the domain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span><strong>DKIM</strong> uses cryptographic signatures to verify the email hasn't been tampered with</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span><strong>DMARC</strong> tells receiving servers what to do if SPF or DKIM checks fail</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
              <span>Check the "Received" chain to trace the email's route from sender to recipient</span>
            </li>
          </ul>
        </div>
      </div>

      {/* History Panel */}
      <HistoryPanel
        tool="email"
        onSelect={(input) => setHeaders(input)}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
      </div>
    </div>
  );
}

function EmailDetail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-4 rounded-xl border-2 backdrop-blur-md transition-all duration-300 bg-white/40 dark:bg-slate-700/40 border-white/40 dark:border-slate-600/40 hover:bg-white/60 dark:hover:bg-slate-700/60">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{label}</span>
      <p className={`text-slate-800 dark:text-white ${mono ? 'font-mono text-xs' : 'text-sm'} break-all`}>{value}</p>
    </div>
  );
}

function AuthStatus({ label, status, details, icon }: { label: string; status: string; details: string; icon: React.ReactNode }) {
  const bgColor = status === 'pass' ? 'bg-emerald-500/10' : status === 'fail' ? 'bg-rose-500/10' : 'bg-amber-500/10';
  const borderColor = status === 'pass' ? 'border-emerald-400/40' : status === 'fail' ? 'border-rose-400/40' : 'border-amber-400/40';

  return (
    <div className={`p-4 rounded-xl border-2 ${bgColor} ${borderColor} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-slate-800 dark:text-white">{label}</span>
        {icon}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold mb-1">{status}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400">{details}</p>
    </div>
  );
}
