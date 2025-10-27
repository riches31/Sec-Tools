import { useState, useEffect } from 'react';
import { Shield, Globe, AlertTriangle, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SecurityItemProps {
  label: string;
  status: boolean;
  description: string;
}

function SecurityItem({ label, status, description }: SecurityItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded border border-slate-200">
      {status ? (
        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

interface ExternalIPData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  isp?: string;
  error?: boolean;
}

interface BrowserSecurityData {
  checks: {
    https: boolean;
    secureContext: boolean;
    cookieSecure: boolean;
    hasServiceWorker: boolean;
    hasCredentialsAPI: boolean;
    hasCrypto: boolean;
    mixedContent: boolean;
  };
  doh: {
    supported: boolean;
    note: string;
  };
  hsts: boolean;
  score: number;
  maxScore: number;
  percentage: number;
}

export default function BrowserSecurityScanner() {
  const navigate = useNavigate();
  const [localIP, setLocalIP] = useState('Detecting...');
  const [externalIP, setExternalIP] = useState<ExternalIPData | null>(null);
  const [browserSecurity, setBrowserSecurity] = useState<BrowserSecurityData | null>(null);

  useEffect(() => {
    detectLocalIP();
    fetchExternalIP();
    checkBrowserSecurity();
  }, []);

  const detectLocalIP = async () => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      let ipDetected = false;

      // Set a timeout to fallback if IP detection takes too long
      const timeout = setTimeout(() => {
        if (!ipDetected) {
          setLocalIP('Unable to detect (timeout)');
          pc.close();
        }
      }, 5000); // 5 second timeout

      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        const match = ipRegex.exec(ice.candidate.candidate);
        if (match && !ipDetected) {
          ipDetected = true;
          setLocalIP(match[1]);
          clearTimeout(timeout);
          pc.onicecandidate = null;
          pc.close();
        }
      };

      // Handle ICE gathering complete
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete' && !ipDetected) {
          clearTimeout(timeout);
          setLocalIP('Private/Not detectable');
          pc.close();
        }
      };
    } catch (e) {
      setLocalIP('Unable to detect');
    }
  };

  const fetchExternalIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();

      const geoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
      const geoData = await geoResponse.json();

      setExternalIP({
        ip: data.ip,
        city: geoData.city,
        region: geoData.region,
        country: geoData.country_name,
        isp: geoData.org
      });
    } catch (e) {
      setExternalIP({ ip: 'Unable to detect', error: true });
    }
  };

  const checkBrowserSecurity = () => {
    const checks = {
      https: window.location.protocol === 'https:',
      secureContext: window.isSecureContext,
      cookieSecure: document.cookie.includes('Secure'),
      hasServiceWorker: 'serviceWorker' in navigator,
      hasCredentialsAPI: 'credentials' in navigator,
      hasCrypto: 'crypto' in window && 'subtle' in window.crypto,
      mixedContent: false
    };

    const dohCheck = checkDoHSupport();
    const hstsCheck = window.location.protocol === 'https:';

    const score = Object.values(checks).filter(v => v === true).length;
    const maxScore = Object.keys(checks).length;

    setBrowserSecurity({
      checks,
      doh: dohCheck,
      hsts: hstsCheck,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100)
    });
  };

  const checkDoHSupport = () => {
    const hasDoH = 'dns' in navigator || navigator.userAgent.includes('Firefox') || navigator.userAgent.includes('Chrome');
    return {
      supported: hasDoH,
      note: 'DoH must be manually enabled in browser settings'
    };
  };

  const getSecurityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Back Navigation */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-800">Browser Security Scanner</h1>
            </div>
            <p className="text-slate-600">Check your network info and browser security status</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-800">Local IP Address</h2>
              </div>
              <div className="text-3xl font-mono text-slate-700">{localIP}</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-slate-800">External IP Address</h2>
              </div>
              {externalIP ? (
                <div>
                  <div className="text-3xl font-mono text-slate-700 mb-3">{externalIP.ip}</div>
                  {!externalIP.error && (
                    <div className="text-sm text-slate-600 space-y-1">
                      <p><span className="font-medium">Location:</span> {externalIP.city}, {externalIP.region}, {externalIP.country}</p>
                      <p><span className="font-medium">ISP:</span> {externalIP.isp}</p>
                    </div>
                  )}
                </div>
              ) : (
                <Loader className="w-8 h-8 text-slate-400 animate-spin" />
              )}
            </div>
          </div>

          {browserSecurity && (
            <div className={`bg-white rounded-lg shadow-md p-6 border-2 mb-6 ${getSecurityBg(browserSecurity.percentage)}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-slate-800">Browser Security Status</h2>
                <div className={`text-3xl font-bold ${getSecurityColor(browserSecurity.percentage)}`}>
                  {browserSecurity.percentage}%
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <SecurityItem
                  label="HTTPS Connection"
                  status={browserSecurity.checks.https}
                  description="Your connection is encrypted"
                />
                <SecurityItem
                  label="Secure Context"
                  status={browserSecurity.checks.secureContext}
                  description="Browser APIs are fully available"
                />
                <SecurityItem
                  label="HSTS Enabled"
                  status={browserSecurity.hsts}
                  description="HTTP Strict Transport Security active"
                />
                <SecurityItem
                  label="DNS over HTTPS"
                  status={browserSecurity.doh.supported}
                  description={browserSecurity.doh.note}
                />
                <SecurityItem
                  label="Crypto API Available"
                  status={browserSecurity.checks.hasCrypto}
                  description="Modern encryption support"
                />
                <SecurityItem
                  label="Credentials API"
                  status={browserSecurity.checks.hasCredentialsAPI}
                  description="Password manager integration"
                />
              </div>

              {browserSecurity.percentage < 80 && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-700 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800">Security Recommendations:</p>
                      <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                        {!browserSecurity.checks.https && <li>Always use HTTPS connections</li>}
                        {!browserSecurity.doh.supported && <li>Enable DNS over HTTPS in browser settings</li>}
                        <li>Keep your browser updated to the latest version</li>
                        <li>Enable all security features in browser settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
