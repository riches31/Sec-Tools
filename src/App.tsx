import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-context'
import SecurityDashboard from './components/security-dashboard'
import LoadingSpinner from './components/loading-spinner'

// Lazy load all tool components for better performance
const DomainSecurityChecker = lazy(() => import('./components/domain-security-checker'))
const PasswordStrengthChecker = lazy(() => import('./components/password-strength-checker'))
const URLSafetyChecker = lazy(() => import('./components/url-safety-checker'))
const SSLCertificateAnalyzer = lazy(() => import('./components/ssl-certificate-analyzer'))
const EmailHeaderAnalyzer = lazy(() => import('./components/email-header-analyzer'))
const HashValidator = lazy(() => import('./components/hash-validator'))
const BrowserSecurityScanner = lazy(() => import('./components/browser-security-scanner'))

function App() {
  return (
    <BrowserRouter basename="/Sec-Tools">
      <ThemeProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<SecurityDashboard />} />
            <Route path="/tools/domain-checker" element={<DomainSecurityChecker />} />
            <Route path="/tools/ssl-analyzer" element={<SSLCertificateAnalyzer />} />
            <Route path="/tools/password-checker" element={<PasswordStrengthChecker />} />
            <Route path="/tools/url-checker" element={<URLSafetyChecker />} />
            <Route path="/tools/email-analyzer" element={<EmailHeaderAnalyzer />} />
            <Route path="/tools/hash-validator" element={<HashValidator />} />
            <Route path="/tools/browser-scanner" element={<BrowserSecurityScanner />} />
          </Routes>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
