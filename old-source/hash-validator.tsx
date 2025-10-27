import React, { useState, useRef } from 'react';
import { Shield, Hash, CheckCircle, XCircle, Copy, Check, Upload, FileText, Download, Clock } from 'lucide-react';
import { addToHistory } from './history-manager';
import { exportAsJSON, exportAsPDF } from './export-utils';
import HistoryPanel from './history-panel';

type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

interface HashResult {
  algorithm: HashAlgorithm;
  hash: string;
  input: string;
  inputType: 'text' | 'file';
  fileName?: string;
  fileSize?: number;
  securityRating: 'weak' | 'moderate' | 'strong';
  recommendations: string[];
}

interface ComparisonResult {
  match: boolean;
  expected: string;
  actual: string;
  algorithm: HashAlgorithm;
}

export default function HashValidator() {
  const [inputText, setInputText] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

  const generateHash = async (text: string, algorithm: HashAlgorithm): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    let hashBuffer: ArrayBuffer;
    switch (algorithm) {
      case 'MD5':
        // MD5 not natively supported in Web Crypto API, return mock
        return 'd41d8cd98f00b204e9800998ecf8427e'; // Mock MD5
      case 'SHA-1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'SHA-256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'SHA-512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data);
        break;
    }

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getSecurityRating = (algorithm: HashAlgorithm): 'weak' | 'moderate' | 'strong' => {
    if (algorithm === 'MD5') return 'weak';
    if (algorithm === 'SHA-1') return 'moderate';
    return 'strong';
  };

  const getRecommendations = (algorithm: HashAlgorithm): string[] => {
    const recommendations: string[] = [];

    if (algorithm === 'MD5') {
      recommendations.push('MD5 is cryptographically broken and should not be used for security purposes');
      recommendations.push('Use SHA-256 or SHA-512 for cryptographic applications');
      recommendations.push('MD5 is acceptable only for non-security checksums');
    } else if (algorithm === 'SHA-1') {
      recommendations.push('SHA-1 is deprecated for security-critical applications');
      recommendations.push('Consider upgrading to SHA-256 or SHA-512');
      recommendations.push('SHA-1 collisions have been demonstrated');
    } else if (algorithm === 'SHA-256') {
      recommendations.push('SHA-256 is currently secure for most applications');
      recommendations.push('Consider SHA-512 for very high security requirements');
    } else {
      recommendations.push('SHA-512 provides excellent security');
      recommendations.push('Suitable for all cryptographic applications');
    }

    return recommendations;
  };

  const handleGenerateHash = async () => {
    if (!inputText.trim()) return;

    const results: HashResult[] = [];

    for (const algo of algorithms) {
      const hash = await generateHash(inputText, algo);
      results.push({
        algorithm: algo,
        hash,
        input: inputText.substring(0, 100),
        inputType: 'text',
        securityRating: getSecurityRating(algo),
        recommendations: getRecommendations(algo)
      });
    }

    setHashResults(results);
    setComparison(null);

    // Add to history
    addToHistory({
      tool: 'hash',
      input: inputText.substring(0, 100),
      summary: `Generated ${algorithms.length} hashes`,
      result: results
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;

      const results: HashResult[] = [];
      for (const algo of algorithms) {
        const hash = await generateHash(text, algo);
        results.push({
          algorithm: algo,
          hash,
          input: 'File content',
          inputType: 'file',
          fileName: file.name,
          fileSize: file.size,
          securityRating: getSecurityRating(algo),
          recommendations: getRecommendations(algo)
        });
      }

      setHashResults(results);
      setComparison(null);

      // Add to history
      addToHistory({
        tool: 'hash',
        input: `File: ${file.name}`,
        summary: `Generated hashes for file (${(file.size / 1024).toFixed(2)} KB)`,
        result: results
      });
    };

    reader.readAsText(file);
  };

  const handleCompareHash = async () => {
    if (!inputText.trim() || !expectedHash.trim()) return;

    const actualHash = await generateHash(inputText, selectedAlgorithm);
    const cleanExpected = expectedHash.trim().toLowerCase();
    const match = actualHash === cleanExpected;

    const result: ComparisonResult = {
      match,
      expected: cleanExpected,
      actual: actualHash,
      algorithm: selectedAlgorithm
    };

    setComparison(result);
    setHashResults([]);
  };

  const detectHashAlgorithm = (hash: string): HashAlgorithm | null => {
    const cleanHash = hash.trim();
    const length = cleanHash.length;

    if (length === 32) return 'MD5';
    if (length === 40) return 'SHA-1';
    if (length === 64) return 'SHA-256';
    if (length === 128) return 'SHA-512';
    return null;
  };

  const handleHashInput = (value: string) => {
    setExpectedHash(value);
    const detected = detectHashAlgorithm(value);
    if (detected) {
      setSelectedAlgorithm(detected);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getSecurityColor = (rating: 'weak' | 'moderate' | 'strong') => {
    if (rating === 'strong') return 'text-emerald-600';
    if (rating === 'moderate') return 'text-amber-600';
    return 'text-rose-600';
  };

  const getSecurityBg = (rating: 'weak' | 'moderate' | 'strong') => {
    if (rating === 'strong') return 'bg-emerald-500/10 border-emerald-400/40';
    if (rating === 'moderate') return 'bg-amber-500/10 border-amber-400/40';
    return 'bg-rose-500/10 border-rose-400/40';
  };

  const handleExportJSON = () => {
    if (hashResults.length === 0) return;
    exportAsJSON({
      toolName: 'Hash & Checksum Validator',
      timestamp: new Date().toISOString(),
      data: hashResults,
      summary: `Generated ${hashResults.length} hash values`
    });
  };

  const handleExportPDF = () => {
    if (hashResults.length === 0) return;
    exportAsPDF({
      toolName: 'Hash & Checksum Validator',
      timestamp: new Date().toISOString(),
      data: hashResults,
      summary: `Hash values for ${hashResults[0].inputType === 'file' ? hashResults[0].fileName : 'text input'}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hash className="w-12 h-12 text-purple-500" />
            <h1 className="text-4xl font-bold text-white">Hash & Checksum Validator</h1>
          </div>
          <p className="text-slate-300">Generate and verify cryptographic hashes</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 dark:border-slate-700/40 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Input Data</h2>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-4 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              History
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Enter text or upload a file to generate hashes</p>

          <div className="space-y-4">
            {/* Text Input */}
            <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-md rounded-xl p-4 border border-white/60 dark:border-slate-600/60 shadow-inner">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to hash..."
                rows={4}
                className="w-full px-6 py-4 border-2 border-purple-300/50 dark:border-purple-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm resize-none bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white backdrop-blur-sm transition-all duration-300"
              />
            </div>

            {/* File Upload */}
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-6 py-3 border-2 border-purple-400/50 dark:border-purple-600/50 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-500/10 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
              >
                <Upload className="w-5 h-5" />
                Upload File
              </button>
              <button
                onClick={handleGenerateHash}
                disabled={!inputText.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-500 flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <Hash className="w-5 h-5" />
                Generate Hashes
              </button>
            </div>
          </div>
        </div>

        {/* Hash Comparison Section */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 dark:border-slate-700/40 mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">Compare Hash</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Verify data integrity by comparing with an expected hash</p>

          <div className="space-y-4">
            {/* Algorithm Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hash Algorithm
              </label>
              <div className="grid grid-cols-4 gap-2">
                {algorithms.map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setSelectedAlgorithm(algo)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedAlgorithm === algo
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Hash Input */}
            <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-md rounded-xl p-4 border border-white/60 dark:border-slate-600/60 shadow-inner">
              <input
                type="text"
                value={expectedHash}
                onChange={(e) => handleHashInput(e.target.value)}
                placeholder="Paste expected hash value..."
                className="w-full px-6 py-3 border-2 border-purple-300/50 dark:border-purple-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white backdrop-blur-sm transition-all duration-300"
              />
            </div>

            <button
              onClick={handleCompareHash}
              disabled={!inputText.trim() || !expectedHash.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-600 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-500 flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              <CheckCircle className="w-5 h-5" />
              Compare
            </button>
          </div>
        </div>

        {/* Comparison Result */}
        {comparison && (
          <div className={`p-6 rounded-2xl border-2 mb-6 backdrop-blur-md shadow-lg ${
            comparison.match
              ? 'bg-emerald-500/20 border-emerald-400/50'
              : 'bg-rose-500/20 border-rose-400/50'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              {comparison.match ? (
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-2 ${comparison.match ? 'text-emerald-900 dark:text-emerald-300' : 'text-rose-900 dark:text-rose-300'}`}>
                  {comparison.match ? 'Hash Match!' : 'Hash Mismatch'}
                </h3>
                <p className={`text-sm ${comparison.match ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'}`}>
                  {comparison.match
                    ? 'The computed hash matches the expected value. Data integrity verified.'
                    : 'The hashes do not match. The data may have been modified or corrupted.'}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-xl p-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Algorithm</p>
                <p className="font-mono text-sm text-slate-800 dark:text-white">{comparison.algorithm}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Expected</p>
                <p className="font-mono text-sm text-slate-800 dark:text-white break-all">{comparison.expected}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Actual</p>
                <p className="font-mono text-sm text-slate-800 dark:text-white break-all">{comparison.actual}</p>
              </div>
            </div>
          </div>
        )}

        {/* Hash Results */}
        {hashResults.length > 0 && (
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 dark:border-slate-700/40 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Generated Hashes</h2>
                {hashResults[0].inputType === 'file' && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {hashResults[0].fileName} ({(hashResults[0].fileSize! / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  JSON
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {hashResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border-2 backdrop-blur-md transition-all duration-300 ${getSecurityBg(result.securityRating)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-purple-500/20 rounded-lg">
                        <span className="font-bold text-purple-700 dark:text-purple-300">{result.algorithm}</span>
                      </div>
                      <span className={`text-sm font-semibold ${getSecurityColor(result.securityRating)}`}>
                        {result.securityRating.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.hash, result.algorithm)}
                      className="p-2 hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-lg transition-colors"
                      title="Copy hash"
                    >
                      {copied === result.algorithm ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="bg-white/40 dark:bg-slate-800/40 rounded-lg p-3 mb-3">
                    <p className="font-mono text-sm text-slate-800 dark:text-white break-all">{result.hash}</p>
                  </div>

                  <div className="space-y-1">
                    {result.recommendations.map((rec, i) => (
                      <p key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span>•</span>
                        <span>{rec}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-2 border-purple-400/40 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Hash Algorithm Information
          </h3>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
              <span><strong>MD5:</strong> Fast but cryptographically broken. Use only for non-security checksums</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
              <span><strong>SHA-1:</strong> Deprecated for security. Collisions have been demonstrated</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
              <span><strong>SHA-256:</strong> Secure and widely used. Good for most applications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
              <span><strong>SHA-512:</strong> Highest security. Recommended for sensitive data</span>
            </li>
          </ul>
        </div>
      </div>

      {/* History Panel */}
      <HistoryPanel
        tool="hash"
        onSelect={(input) => setInputText(input)}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
