import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, RefreshCw, Copy, Check, AlertTriangle, Lock, Unlock, Clock, Download, Dices, ArrowLeft, XCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToHistory } from './history-manager';
import { exportAsJSON, exportAsPDF } from './export-utils';
import HistoryPanel from './history-panel';

export default function PasswordStrengthChecker() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<any>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [breachChecking, setBreachChecking] = useState(false);
  const [breachResult, setBreachResult] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Generator settings
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  // Passphrase settings
  const [passphraseWords, setPassphraseWords] = useState(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState('-');
  const [passphraseCapitalize, setPassphraseCapitalize] = useState(true);

  useEffect(() => {
    if (password) {
      analyzePassword(password);
    } else {
      setStrength(null);
      setBreachResult(null);
    }
  }, [password]);

  const analyzePassword = (pwd) => {
    const analysis = {
      length: pwd.length,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumbers: /[0-9]/.test(pwd),
      hasSymbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      hasCommonPatterns: checkCommonPatterns(pwd),
      entropy: calculateEntropy(pwd),
    };

    const score = calculateScore(analysis);
    const timeTocrack = estimatecrackTime(analysis);

    const strengthData = {
      ...analysis,
      score,
      timeTocrack,
      feedback: generateFeedback(analysis, score)
    };

    setStrength(strengthData);

    // Add to history (masking the password for privacy)
    addToHistory({
      tool: 'password',
      input: '*'.repeat(pwd.length) + ` (${pwd.length} chars)`,
      summary: `Strength: ${getStrengthLabel(score)} (${score}/100)`,
      result: {
        score,
        strength: getStrengthLabel(score),
        length: pwd.length,
        entropy: Math.round(analysis.entropy)
      }
    });
  };

  const checkCommonPatterns = (pwd) => {
    const commonPatterns = [
      /^123456/i,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /letmein/i,
      /welcome/i,
      /admin/i,
      /^(.)\1+$/,  // Repeated characters
      /^(01|12|23|34|45|56|67|78|89|90)+/,  // Sequential numbers
    ];

    return commonPatterns.some(pattern => pattern.test(pwd));
  };

  const calculateEntropy = (pwd) => {
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) charsetSize += 32;

    return pwd.length * Math.log2(charsetSize);
  };

  const calculateScore = (analysis) => {
    let score = 0;

    // Length scoring
    if (analysis.length >= 8) score += 20;
    if (analysis.length >= 12) score += 10;
    if (analysis.length >= 16) score += 10;
    if (analysis.length >= 20) score += 10;

    // Character variety
    if (analysis.hasUppercase) score += 10;
    if (analysis.hasLowercase) score += 10;
    if (analysis.hasNumbers) score += 10;
    if (analysis.hasSymbols) score += 15;

    // Entropy bonus
    if (analysis.entropy > 50) score += 10;
    if (analysis.entropy > 70) score += 5;

    // Penalties
    if (analysis.hasCommonPatterns) score -= 30;
    if (analysis.length < 8) score -= 20;

    return Math.max(0, Math.min(100, score));
  };

  const estimatecrackTime = (analysis) => {
    const guessesPerSecond = 1000000000; // 1 billion guesses per second
    const totalCombinations = Math.pow(2, analysis.entropy);
    const seconds = totalCombinations / guessesPerSecond / 2; // Average time

    if (seconds < 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    return `${Math.round(seconds / 31536000000)} centuries`;
  };

  const generateFeedback = (analysis, score) => {
    const feedback = [];

    if (analysis.length < 8) feedback.push('Password is too short (minimum 8 characters)');
    if (analysis.length < 12) feedback.push('Consider using at least 12 characters for better security');
    if (!analysis.hasUppercase) feedback.push('Add uppercase letters (A-Z)');
    if (!analysis.hasLowercase) feedback.push('Add lowercase letters (a-z)');
    if (!analysis.hasNumbers) feedback.push('Add numbers (0-9)');
    if (!analysis.hasSymbols) feedback.push('Add special characters (!@#$%^&*)');
    if (analysis.hasCommonPatterns) feedback.push('Avoid common patterns and dictionary words');

    if (score >= 80) feedback.push('✓ Strong password! Well done.');
    
    return feedback;
  };

  const checkPasswordBreach = async () => {
    if (!password || password.length < 1) return;

    setBreachChecking(true);
    setBreachResult(null);

    try {
      // Hash the password using SHA-1
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      // Use k-Anonymity: only send first 5 characters
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const data = await response.text();

      // Check if our suffix appears in the results
      const hashes = data.split('\n');
      const found = hashes.find(line => line.startsWith(suffix));

      if (found) {
        const count = parseInt(found.split(':')[1]);
        setBreachResult({
          breached: true,
          count: count.toLocaleString()
        });
      } else {
        setBreachResult({
          breached: false
        });
      }
    } catch (error) {
      setBreachResult({
        error: true,
        message: 'Unable to check breach database'
      });
    } finally {
      setBreachChecking(false);
    }
  };

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      charset = 'abcdefghijklmnopqrstuvwxyz'; // Fallback
    }

    let newPassword = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      newPassword += charset[array[i] % charset.length];
    }

    setGeneratedPassword(newPassword);
    setPassword(newPassword);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Wordlist for passphrase generation (sample words)
  const wordList = [
    'correct', 'horse', 'battery', 'staple', 'dragon', 'mountain', 'river', 'ocean',
    'forest', 'sunset', 'thunder', 'crystal', 'phoenix', 'wizard', 'shadow', 'silver',
    'golden', 'ancient', 'mystic', 'cosmic', 'lunar', 'solar', 'meteor', 'comet',
    'galaxy', 'nebula', 'planet', 'stellar', 'quantum', 'photon', 'electron', 'neutron',
    'cipher', 'enigma', 'puzzle', 'riddle', 'secret', 'hidden', 'treasure', 'jewel',
    'crown', 'throne', 'castle', 'fortress', 'temple', 'palace', 'tower', 'bridge',
    'rainbow', 'aurora', 'eclipse', 'solstice', 'equinox', 'zenith', 'horizon', 'summit',
    'valley', 'canyon', 'desert', 'tundra', 'jungle', 'savanna', 'prairie', 'meadow'
  ];

  const generatePassphrase = () => {
    const selectedWords = [];
    const usedIndices = new Set();

    // Select random words without duplicates
    while (selectedWords.length < passphraseWords) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        let word = wordList[randomIndex];
        if (passphraseCapitalize) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        selectedWords.push(word);
      }
    }

    const passphrase = selectedWords.join(passphraseSeparator);
    setGeneratedPassword(passphrase);
    setPassword(passphrase);
  };

  const handleExportJSON = () => {
    if (!strength) return;
    exportAsJSON({
      toolName: 'Password Strength Checker',
      timestamp: new Date().toISOString(),
      data: {
        score: strength.score,
        strength: getStrengthLabel(strength.score),
        length: strength.length,
        entropy: Math.round(strength.entropy),
        timeTocrack: strength.timeTocrack,
        characterTypes: {
          uppercase: strength.hasUppercase,
          lowercase: strength.hasLowercase,
          numbers: strength.hasNumbers,
          symbols: strength.hasSymbols
        },
        breachStatus: breachResult
      },
      summary: `Password Strength: ${getStrengthLabel(strength.score)} (${strength.score}/100)`
    });
  };

  const handleExportPDF = () => {
    if (!strength) return;
    exportAsPDF({
      toolName: 'Password Strength Checker',
      timestamp: new Date().toISOString(),
      data: {
        score: strength.score,
        strength: getStrengthLabel(strength.score),
        length: strength.length,
        entropy: Math.round(strength.entropy),
        timeTocrack: strength.timeTocrack
      },
      summary: `Strength: ${getStrengthLabel(strength.score)}, Score: ${strength.score}/100, Time to Crack: ${strength.timeTocrack}`
    });
  };

  const getStrengthColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-600';
    if (score >= 60) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    if (score >= 40) return 'bg-gradient-to-r from-orange-500 to-rose-500';
    return 'bg-gradient-to-r from-rose-500 to-red-600';
  };

  const getStrengthLabel = (score) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Weak';
  };

  const getStrengthTextColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-rose-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Back Navigation */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3">
        <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-12 h-12 text-cyan-500" />
              <h1 className="text-4xl font-bold text-white">Password Strength Checker</h1>
            </div>
            <p className="text-slate-300">Test password strength and generate secure passwords</p>
          </div>

        {/* Password Input Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-slate-800">Check Password Strength</h2>
            <button
              onClick={() => setHistoryOpen(true)}
              className="px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              History
            </button>
          </div>
          <p className="text-slate-600 mb-6">Enter a password to analyze its strength and security</p>

          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-inner mb-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to test..."
                className="w-full px-6 py-4 pr-14 border-2 border-indigo-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white/90 backdrop-blur-sm transition-all duration-300"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-indigo-600 transition-colors duration-300"
              >
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {password && (
            <button
              onClick={checkPasswordBreach}
              disabled={breachChecking}
              className="mb-4 px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl hover:from-indigo-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              {breachChecking ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Check Data Breaches
                </>
              )}
            </button>
          )}

          {breachResult && (
            <div className={`p-5 rounded-xl mb-6 backdrop-blur-md border-2 shadow-lg ${breachResult.breached ? 'bg-rose-500/20 border-rose-400/50' : breachResult.error ? 'bg-amber-500/20 border-amber-400/50' : 'bg-emerald-500/20 border-emerald-400/50'}`}>
              <div className="flex items-start gap-3">
                {breachResult.breached ? (
                  <AlertTriangle className="w-6 h-6 text-rose-600 mt-0.5" />
                ) : breachResult.error ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
                ) : (
                  <Check className="w-6 h-6 text-emerald-600 mt-0.5" />
                )}
                <div className="flex-1">
                  {breachResult.breached ? (
                    <>
                      <p className="font-bold text-rose-900 text-lg">Password Found in Data Breach!</p>
                      <p className="text-sm text-rose-800 mt-1">
                        This password has been seen <span className="font-bold">{breachResult.count}</span> times in data breaches. Do not use it!
                      </p>
                    </>
                  ) : breachResult.error ? (
                    <>
                      <p className="font-bold text-amber-900 text-lg">Unable to Check</p>
                      <p className="text-sm text-amber-800 mt-1">{breachResult.message}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-emerald-900 text-lg">Good News!</p>
                      <p className="text-sm text-emerald-800 mt-1">This password has not been found in known data breaches.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {strength && (
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-white/60 shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-semibold text-slate-800">Strength: {getStrengthLabel(strength.score)}</span>
                  <span className={`text-lg font-bold ${getStrengthTextColor(strength.score)} bg-white/60 px-3 py-1 rounded-lg`}>
                    {strength.score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-200/50 backdrop-blur-sm rounded-full h-4 shadow-inner mb-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 shadow-lg ${getStrengthColor(strength.score)}`}
                    style={{ width: `${strength.score}%` }}
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-md p-5 rounded-xl border border-white/60 shadow-lg">
                  <h3 className="font-bold text-slate-800 mb-3">Password Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Length:</span>
                      <span className="font-semibold text-slate-800">{strength.length} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Entropy:</span>
                      <span className="font-semibold text-slate-800">{Math.round(strength.entropy)} bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time to crack:</span>
                      <span className="font-semibold text-slate-800">{strength.timeTocrack}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-5 rounded-xl border border-white/60 shadow-lg">
                  <h3 className="font-bold text-slate-800 mb-3">Character Types</h3>
                  <div className="space-y-3 text-sm">
                    <CharacterCheck label="Uppercase" status={strength.hasUppercase} />
                    <CharacterCheck label="Lowercase" status={strength.hasLowercase} />
                    <CharacterCheck label="Numbers" status={strength.hasNumbers} />
                    <CharacterCheck label="Symbols" status={strength.hasSymbols} />
                  </div>
                </div>
              </div>

              {strength.feedback.length > 0 && (
                <div className="bg-cyan-500/10 border-2 border-cyan-400/40 rounded-xl p-5 backdrop-blur-md shadow-lg">
                  <h3 className="font-bold text-cyan-900 mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {strength.feedback.map((item, index) => (
                      <li key={index} className="text-sm text-cyan-800 flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Password Generator Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Generate Secure Password</h2>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password Length: {length}
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700">Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700">Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700">Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700">Symbols (!@#$)</span>
              </label>
            </div>
          </div>

          <button
            onClick={generatePassword}
            className="w-full mb-6 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <RefreshCw className="w-6 h-6" />
            Generate Password
          </button>

          {generatedPassword && (
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/60 shadow-inner">
              <div className="relative">
                <input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  className="w-full px-6 py-4 pr-14 border-2 border-teal-300/50 rounded-xl bg-white/90 font-mono text-lg"
                />
                <button
                  onClick={() => copyToClipboard(generatedPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-teal-600 transition-colors duration-300"
                >
                  {copied ? <Check className="w-6 h-6 text-emerald-600" /> : <Copy className="w-6 h-6" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Passphrase Generator Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/40 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Dices className="w-7 h-7 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-slate-800">Generate Memorable Passphrase</h2>
          </div>
          <p className="text-slate-600 mb-6">Create easy-to-remember but secure passphrases using random words</p>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Words: {passphraseWords}
              </label>
              <input
                type="range"
                min="3"
                max="8"
                value={passphraseWords}
                onChange={(e) => setPassphraseWords(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Separator Character
              </label>
              <select
                value={passphraseSeparator}
                onChange={(e) => setPassphraseSeparator(e.target.value)}
                className="w-full px-4 py-2 border-2 border-indigo-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Period (.)</option>
                <option value=" ">Space</option>
                <option value="">None</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={passphraseCapitalize}
                onChange={(e) => setPassphraseCapitalize(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-700">Capitalize first letter of each word</span>
            </label>
          </div>

          <button
            onClick={generatePassphrase}
            className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <Dices className="w-6 h-6" />
            Generate Passphrase
          </button>

          <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-400/40 rounded-xl text-sm text-indigo-800 backdrop-blur-sm">
            <p className="font-medium mb-1">Why use passphrases?</p>
            <p>Passphrases like "Correct-Horse-Battery-Staple" are easier to remember than random passwords while still being highly secure. A 4-word passphrase with 64 possible words per position has over 16 million combinations!</p>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-2 border-cyan-400/40 rounded-2xl p-6 backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-600" />
            Password Security Tips
          </h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Use a unique password for every account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Consider using a password manager to store passwords securely</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Enable two-factor authentication (2FA) whenever possible</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Never share passwords via email or messaging apps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 font-bold">•</span>
              <span>Change passwords immediately if you suspect a breach</span>
            </li>
          </ul>
        </div>

        <HistoryPanel
          tool="password"
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelect={(input) => {
            // Don't populate password from history for privacy
            setHistoryOpen(false);
          }}
        />
        </div>
      </div>
    </div>
  );
}

function CharacterCheck({ label, status }) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg backdrop-blur-sm transition-all duration-300 ${
      status ? 'bg-emerald-500/10' : 'bg-rose-500/10'
    }`}>
      <span className="text-slate-700 font-medium">{label}:</span>
      {status ? (
        <Check className="w-5 h-5 text-emerald-600" />
      ) : (
        <XCircle className="w-5 h-5 text-rose-500" />
      )}
    </div>
  );
}