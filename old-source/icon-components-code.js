// ============================================
// CUSTOM SECURITY TOOLS ICONS
// Ready to use in your React components or HTML
// ============================================

// Icon 1: Browser Security Scanner
export const BrowserSecurityIcon = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Globe */}
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="3"/>
    <ellipse cx="50" cy="50" rx="15" ry="35" stroke="currentColor" strokeWidth="2"/>
    <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2"/>
    <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="2"/>
    
    {/* Shield overlay */}
    <path d="M 50 25 L 60 30 L 60 50 Q 60 60 50 65 Q 40 60 40 50 L 40 30 Z" fill="currentColor" opacity="0.8"/>
    <path d="M 45 45 L 48 48 L 55 38" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Icon 2: Domain Security Checker
export const DomainSecurityIcon = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Server */}
    <rect x="25" y="25" width="50" height="50" rx="4" stroke="currentColor" strokeWidth="3"/>
    <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="2"/>
    <line x1="30" y1="55" x2="70" y2="55" stroke="currentColor" strokeWidth="2"/>
    <circle cx="40" cy="32" r="3" fill="currentColor"/>
    <circle cx="55" cy="32" r="3" fill="currentColor"/>
    
    {/* Lock */}
    <rect x="40" y="55" width="20" height="15" rx="2" fill="currentColor"/>
    <path d="M 45 55 L 45 50 Q 45 45 50 45 Q 55 45 55 50 L 55 55" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <circle cx="50" cy="62" r="2" fill="white"/>
  </svg>
);

// Icon 3: Password Strength Checker
export const PasswordSecurityIcon = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Key */}
    <circle cx="40" cy="40" r="12" stroke="currentColor" strokeWidth="3"/>
    <circle cx="40" cy="40" r="5" fill="currentColor"/>
    <rect x="50" y="37" width="25" height="6" fill="currentColor"/>
    <rect x="65" y="32" width="4" height="8" fill="currentColor"/>
    <rect x="70" y="32" width="4" height="8" fill="currentColor"/>
    
    {/* Strength bars */}
    <rect x="25" y="60" width="8" height="15" rx="2" fill="#ef4444"/>
    <rect x="36" y="55" width="8" height="20" rx="2" fill="#f59e0b"/>
    <rect x="47" y="50" width="8" height="25" rx="2" fill="#eab308"/>
    <rect x="58" y="45" width="8" height="30" rx="2" fill="#10b981"/>
  </svg>
);

// Icon 4: URL Safety Checker
export const URLSecurityIcon = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Link chain */}
    <path d="M 30 40 Q 25 35 25 30 Q 25 20 35 20 L 45 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M 70 60 Q 75 65 75 70 Q 75 80 65 80 L 55 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Middle link */}
    <line x1="42" y1="25" x2="58" y2="75" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Warning triangle */}
    <path d="M 50 30 L 60 48 L 40 48 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
    <line x1="50" y1="36" x2="50" y2="42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="50" cy="45" r="1.5" fill="#f59e0b"/>
  </svg>
);

// Icon 5: Security Suite (Main Logo)
export const SecuritySuiteIcon = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield outline */}
    <path d="M 50 20 L 70 28 L 70 50 Q 70 65 50 75 Q 30 65 30 50 L 30 28 Z" stroke="currentColor" strokeWidth="3"/>
    
    {/* Inner shield */}
    <path d="M 50 30 L 65 36 L 65 52 Q 65 62 50 68 Q 35 62 35 52 L 35 36 Z" fill="currentColor" opacity="0.3"/>
    
    {/* Checkmark */}
    <path d="M 42 50 L 47 55 L 58 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Corner badges */}
    <circle cx="36" cy="36" r="4" fill="#10b981"/>
    <circle cx="64" cy="36" r="4" fill="#f59e0b"/>
    <circle cx="50" cy="68" r="4" fill="#ef4444"/>
  </svg>
);

// Icon 6: Compact Favicon
export const FaviconIcon = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="6" fill="#3b82f6"/>
    <path d="M 16 8 L 24 11 L 24 18 Q 24 22 16 26 Q 8 22 8 18 L 8 11 Z" fill="white" opacity="0.9"/>
    <path d="M 13 16 L 15 18 L 19 13" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: In React Component
/*
import { BrowserSecurityIcon } from './icons';

function MyComponent() {
  return (
    <div>
      <BrowserSecurityIcon className="w-12 h-12 text-blue-600" />
    </div>
  );
}
*/

// Example 2: In HTML (inline SVG)
/*
<svg class="w-24 h-24 text-blue-600" viewBox="0 0 100 100" fill="none">
  <!-- Copy SVG content here -->
</svg>
*/

// Example 3: As favicon
/*
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
    <!-- Copy FaviconIcon SVG content here -->
  </svg>
">
*/

// ============================================
// COLOR VARIATIONS
// ============================================

// Blue theme (default)
// className="text-blue-600"

// Green theme (domain checker)
// className="text-green-600"

// Purple theme (password checker)
// className="text-purple-600"

// Orange theme (URL checker)
// className="text-orange-600"

// Custom colors
// className="text-[#your-hex-color]"

// ============================================
// SIZE VARIATIONS
// ============================================

// Small: className="w-6 h-6"
// Medium: className="w-12 h-12"
// Large: className="w-24 h-24"
// Extra Large: className="w-32 h-32"
// Custom: className="w-[80px] h-[80px]"