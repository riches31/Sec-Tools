# Security Tools Suite - Project Documentation

## Overview

The **Security Tools Suite** is a comprehensive, browser-based security analysis platform providing multiple tools for personal and educational security assessments. All tools run 100% client-side (no server required), prioritizing privacy and accessibility.

**Repository Focus:** This codebase contains source components and documentation for a security tools web application designed for deployment to GitHub Pages or other static hosting.

---

## Purpose & Use Cases

This suite helps users:
- Analyze their browser security posture and network information
- Assess domain security before visiting websites
- Test password strength against known breaches
- Decode and analyze URLs for phishing/malware patterns
- Conduct security audits on websites
- Learn about web security concepts

---

## Architecture & Structure

### Directory Layout

```
/mnt/c/ztemp/projects/Sec-Tools/
└── old-source/                      # All source files in single directory
    ├── *.tsx                         # React components (TypeScript JSX)
    ├── *.ts                          # TypeScript utilities
    ├── *.html                        # Standalone HTML deployments
    ├── *.svg                         # Icon assets
    ├── *.js                          # JavaScript utilities
    ├── *.md                          # Documentation files
    └── [no build files/config]       # No package.json, webpack, etc.
```

### File Organization

**Component Source Files (TypeScript/React):**
- `security-dashboard.tsx` - Main dashboard/navigation hub
- `domain-security-checker.ts` - Domain analysis component
- `password-strength-checker.tsx` - Password validation component
- `url-safety-checker.tsx` - URL analysis component
- `icon-components-code.js` - Custom SVG icon library

**HTML Deployments:**
- `browser-scanner-standalone.html` - Browser security tool (complete)
- `domain-checker-standalone.html` - Domain checker tool (complete)
- `security-tools-html.html` - Additional HTML version

**Documentation:**
- `sec-tools-project-inventory.md` - File inventory and organization guide
- `deployment-readme.md` - Deployment instructions
- `complete-deployment-package.md` - Comprehensive deployment guide
- `github-desktop-guide.md` - GitHub Desktop setup instructions
- `master-deployment-checklist.md` - Deployment checklist
- `zip-structure-visual.md` - File structure visual guide
- `favicon-package.md` - Icon/favicon documentation
- `license-file.md` - MIT License template

**Assets:**
- `security-tools-icons.svg` - Icon SVG definitions

---

## Technology Stack

### Languages & Frameworks

| Component | Technology |
|-----------|-----------|
| Components | React 18 (via CDN) |
| Styling | Tailwind CSS |
| Scripting | JavaScript/TypeScript |
| Source Transpilation | Babel (JSX → JS) |
| Icon System | SVG + React |
| Development Lang | TypeScript (`.ts`, `.tsx`) |

### Runtime Dependencies (CDN)

- **React 18:** `https://unpkg.com/react@18/umd/react.production.min.js`
- **React DOM 18:** `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`
- **Babel Standalone:** `https://unpkg.com/@babel/standalone/babel.min.js`
- **Tailwind CSS:** `https://cdn.tailwindcss.com`
- **Lucide React Icons:** (referenced but icons are custom SVG)

### External APIs

- **Have I Been Pwned API:** Password breach checking (k-anonymity mode)
  - Only first 5 characters of SHA-1 hash sent
  - Optional user-initiated check

### Build/Deployment Tools

- **No build system configured** - Components meant for:
  - Direct deployment as HTML + embedded React
  - Manual conversion from TSX to HTML
  - Or integration into a React build pipeline

---

## Core Components & Functionality

### 1. Security Dashboard (`security-dashboard.tsx`)
**Purpose:** Main navigation hub and tool launcher

**Features:**
- Four tool cards with descriptions
- Color-coded by tool type (blue/green/purple/orange)
- Feature list for each tool
- Mobile responsive navigation
- Links to individual tools

**Key Functions:**
- `getColorClasses()` - Theme color management
- `openTool()` - Tool launcher
- Mobile menu toggle

---

### 2. Domain Security Checker (`domain-security-checker.ts`)
**Purpose:** Analyze domain/website security configuration

**Security Checks:**
- HTTPS enablement
- HSTS (HTTP Strict Transport Security) preload status
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- SSL/TLS certificate validation
- CORS policy assessment

**Scoring System:**
- 0-100 scale with color coding (red/yellow/green)
- Individual point values for each security feature
- Severity warnings for low-scoring domains

**Key Functions:**
- `checkDomain()` - Main analysis entry point
- `checkHTTPS()` - Verifies HTTPS connection
- `checkHSTS()` - Checks HSTS preload list
- `checkSecurityHeaders()` - Fetches and analyzes HTTP headers
- `calculateDomainScore()` - Computes security score

---

### 3. Password Strength Checker (`password-strength-checker.tsx`)
**Purpose:** Assess password security and generate strong passwords

**Analysis Features:**
- Length validation
- Character variety detection (upper, lower, numbers, symbols)
- Entropy calculation
- Common pattern detection (sequential, repeated, dictionary words)
- Breach database check (Have I Been Pwned)
- Time-to-crack estimation

**Password Generator:**
- Customizable length (default 16)
- Configurable character set inclusion
- Copy-to-clipboard functionality
- Real-time strength feedback

**Scoring Criteria:**
- Length bonuses (8+, 12+, 16+, 20+ chars)
- Character variety points
- Entropy bonus threshold
- Pattern penalties
- Max score: 100, Min: 0

**Key Functions:**
- `analyzePassword()` - Main analysis
- `calculateScore()` - Scoring algorithm
- `checkCommonPatterns()` - Pattern detection
- `calculateEntropy()` - Information entropy calculation
- `generatePassword()` - Secure password generation
- `checkPwnedPassword()` - Breach check via API
- `estimatecrackTime()` - Time estimation

---

### 4. URL Safety Checker (`url-safety-checker.tsx`)
**Purpose:** Decode, parse, and assess URL safety

**Decoding Features:**
- Multi-level URL decoding (handles double/triple encoding)
- Max 10 iterations to prevent infinite loops
- Error handling for invalid sequences

**Safety Checks:**
- HTTPS verification
- Suspicious character detection
- IP address validation
- Suspicious TLD identification
- URL shortener detection
- Phishing pattern matching
- Homoglyph attack detection
- Data URI detection
- URL length assessment
- Redirect pattern detection
- Subdomain analysis

**URL Parsing:**
- Protocol extraction
- Hostname/domain parsing
- Port identification
- Path, query, hash separation
- Origin detection

**Risk Scoring:**
- Multi-factor assessment
- Visual warning system
- Detailed breakdown of risks

**Key Functions:**
- `analyzeURL()` - Main security analysis
- `encodeURL()` - URL encoding
- `decodeURL()` - Multi-level decoding
- `parseURL()` - URL structure breakdown
- Various check functions (`checkHTTPS`, `checkSuspiciousCharacters`, etc.)
- `calculateRiskScore()` - Risk assessment

---

### 5. Icon System (`icon-components-code.js`)
**Purpose:** Reusable SVG icon components

**Included Icons:**
- `BrowserSecurityIcon` - Globe with security shield
- `DomainSecurityIcon` - Server with lock
- `PasswordSecurityIcon` - Key with strength bars
- `URLSecurityIcon` - Link chain with warning
- `SecuritySuiteIcon` - Main shield logo
- Individual lucide icons (Shield, Globe, Lock, etc.)

---

## Deployment Architecture

### Deployment Options

#### Option 1: GitHub Pages (Recommended)
- **Static hosting:** No backend required
- **URL:** `https://yourusername.github.io/security-tools-suite/`
- **Setup time:** 20 minutes
- **Tools ready:** Browser Scanner + Domain Checker

#### Option 2: Netlify Drop
- Drag-and-drop deployment
- Instant CDN distribution
- Free tier available

#### Option 3: Vercel
- CLI-based deployment
- Zero-config option
- Free tier available

#### Option 4: Traditional Hosting
- FTP/SFTP upload to any server
- Shared hosting compatible
- Custom domain support

### File Structure for Deployment

```
security-tools-suite/
├── index.html                    (Main dashboard)
├── README.md                     (Documentation)
├── LICENSE                       (MIT License)
│
├── tools/
│   ├── browser-scanner.html     (Standalone tool)
│   ├── domain-checker.html      (Standalone tool)
│   ├── password-checker.html    (Optional)
│   └── url-checker.html         (Optional)
│
└── docs/
    └── screenshots/
        └── .gitkeep
```

---

## Development Workflow

### Converting TSX to HTML

The project uses a **browser-based React approach** without build tools:

1. **Original:** TypeScript/React components (`.tsx` files)
2. **Conversion:** Embed component code in HTML `<script type="text/babel">`
3. **Dependencies:** Load React/Babel/Tailwind from CDN
4. **Deployment:** Single HTML file with embedded logic

**Example Structure:**
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // Component code here (from .tsx file)
        ReactDOM.createRoot(document.getElementById('root')).render(<Component />);
    </script>
</body>
</html>
```

### No Build System

- **No:** webpack, parcel, esbuild, vite
- **No:** package.json, node_modules
- **No:** npm/yarn scripts
- **No:** TypeScript compilation step
- **Approach:** Direct code inclusion + CDN dependencies

---

## Key Features & Security Considerations

### Privacy-First Design

- **100% client-side processing** for most checks
- **No data storage** on servers
- **No analytics** or tracking
- **No cookies** stored
- **Optional API:** Only Have I Been Pwned breach check requires network

### Security Implementation

**Domain Checker:**
- Checks actual HTTPS certificates (when possible)
- Validates security headers via CORS-safe fetch
- HSTS preload verification against known domains
- Risk scoring with visual warnings

**Password Checker:**
- k-Anonymity for breach checks (never sends full hash)
- Entropy calculation (Shannon entropy in bits)
- Pattern detection against common weak passwords
- Estimated crack time using standard calculations

**URL Analyzer:**
- Multiple phishing pattern detections
- Homoglyph attack detection (lookalike domains)
- Shortener detection (bit.ly, tinyurl, etc.)
- IP address blocking/detection
- Data URI and JavaScript URI detection
- Suspicious character identification

**Browser Scanner:**
- WebRTC leak detection
- Public IP detection (via external APIs)
- HTTPS status validation
- DNS-over-HTTPS availability check
- Security API detection

---

## Configuration & Customization

### Theming

All color schemes use **Tailwind CSS classes**:
- Blue (default): `bg-blue-600`, `text-blue-600`
- Green: `bg-green-600`, `text-green-600`
- Purple: `bg-purple-600`, `text-purple-600`
- Orange: `bg-orange-600`, `text-orange-600`

Colors easily customizable by find/replace in HTML files.

### Icon Customization

Replace lucide icons with custom SVG by modifying icon components:
```javascript
const CustomIcon = ({ className }) => (
    <svg className={className} ...>...</svg>
);
```

### Layout Modification

Dashboard uses Tailwind grid system:
- Mobile: `grid md:grid-cols-1`
- Desktop: `md:grid-cols-2` or `md:grid-cols-3`

---

## Documentation Files

### For Users/Deployers

- **deployment-readme.md** - Quick start guide
- **github-desktop-guide.md** - Step-by-step GitHub Desktop setup
- **complete-deployment-package.md** - Comprehensive deployment instructions
- **master-deployment-checklist.md** - Pre-flight and deployment checklist
- **sec-tools-project-inventory.md** - File organization and reference
- **zip-structure-visual.md** - Visual file structure guide

### For Developers

- **icon-components-code.js** - Icon component reference
- **favicon-package.md** - Icon/favicon setup
- **license-file.md** - MIT License

---

## Browser Compatibility

**Tested & Supported:**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- JavaScript enabled
- Modern ES6+ support
- CSS Grid support
- Fetch API support
- WebRTC support (for IP detection)

---

## Testing & Validation

### Manual Testing Checklist

- [ ] Dashboard loads with all tool cards
- [ ] Navigation between tools works
- [ ] Browser scanner displays security info
- [ ] Domain checker validates domains
- [ ] Password generator creates passwords
- [ ] URL decoder handles encoded URLs
- [ ] Mobile responsive on small screens
- [ ] Back buttons navigate correctly
- [ ] All icons render properly
- [ ] Tailwind styling applies correctly
- [ ] External API calls (breach check) work
- [ ] Error handling displays appropriate messages

### Common Issues & Solutions

**Tools Not Loading:**
- Check browser console for errors
- Verify serving via HTTP/HTTPS (not file://)
- Ensure CDN scripts are accessible
- Clear browser cache (Ctrl+F5)

**IP Detection Fails:**
- WebRTC may be blocked by extensions
- VPN/proxy affects detection
- Some browsers have privacy modes that block it

**Breach Check Fails:**
- Internet connection required for this check only
- Have I Been Pwned API rate limits
- Check API endpoint availability

---

## Performance Characteristics

- **Initial Load:** <2 seconds on average connection
- **Tool Startup:** <100ms (cached assets)
- **Memory Usage:** ~20-50MB per tool
- **Bandwidth:** <100KB per tool view
- **Offline Support:** Partial (after initial load)

---

## Source Code Patterns & Conventions

### React Hooks Usage

```javascript
const [state, setState] = useState(initialValue);
const [result, setResult] = useState(null);
useEffect(() => { /* effect */ }, [dependency]);
```

### Error Handling Pattern

```javascript
try {
    // operation
} catch (e) {
    setResults({
        error: true,
        message: 'User-friendly error message'
    });
}
```

### Async Check Pattern

```javascript
const checkSomething = async (input) => {
    setChecking(true);
    try {
        const result = await performCheck(input);
        setResults(result);
    } finally {
        setChecking(false);
    }
};
```

### Scoring Pattern

```javascript
const calculateScore = (factors) => {
    let score = 0;
    if (factors.hasA) score += 20;
    if (factors.hasB) score += 15;
    return Math.max(0, Math.min(100, score));
};
```

---

## Dependencies Summary

### Runtime (No Installation Required - CDN)

| Package | Purpose | Version |
|---------|---------|---------|
| React | UI library | 18+ |
| React DOM | React rendering | 18+ |
| Babel Standalone | JSX transpilation | Latest |
| Tailwind CSS | Styling framework | Latest |

### No External Packages

- No npm packages required
- No node_modules
- No build step needed
- Pure client-side application

---

## Common Modifications & Extensions

### Adding a New Tool

1. Create `new-tool-checker.tsx` component
2. Convert to HTML wrapper following existing patterns
3. Add route to dashboard
4. Create HTML file in `tools/` directory
5. Update README with new tool

### Adding New Security Checks

1. Create check function following pattern:
   ```javascript
   const checkNewThing = async (input) => {
       try { /* logic */ }
       catch (e) { /* error handling */ }
   };
   ```
2. Call from main analysis function
3. Include in results display
4. Update scoring if applicable

### Changing Color Scheme

Find and replace in all HTML files:
- `bg-blue-600` → `bg-custom-color-600`
- `text-blue-600` → `text-custom-color-600`
- `border-blue-200` → `border-custom-color-200`

---

## Known Limitations & Future Improvements

### Current Limitations

- HSTS checking uses only common domain list (not full preload)
- CORS blocks some security header checks on non-cooperative domains
- IP detection may fail with VPN/proxy
- No persistent storage of results
- No dark mode toggle
- No multilingual support
- No browser extension version

### Potential Enhancements

**Short Term:**
- [ ] Add loading animations
- [ ] Improve mobile UI
- [ ] Add FAQ page
- [ ] Create video tutorials

**Medium Term:**
- [ ] Browser fingerprint checker
- [ ] Cookie analyzer
- [ ] Network speed test
- [ ] SSL certificate viewer
- [ ] Dark mode toggle

**Long Term:**
- [ ] Browser extension version
- [ ] Mobile app version
- [ ] API for developers
- [ ] Community contributions framework
- [ ] Multilingual support

---

## Licensing

**MIT License** - See included license-file.md
- Free to use, modify, and distribute
- Include copyright notice
- No warranty provided
- Commercial use allowed

---

## Deployment Checklist

### Pre-Deployment

- [ ] All HTML files created from TSX components
- [ ] File structure organized correctly
- [ ] README customized with your username
- [ ] LICENSE updated with your name
- [ ] All links tested locally
- [ ] Mobile responsiveness verified
- [ ] All external APIs functional

### Deployment

- [ ] Repository created on GitHub
- [ ] Files pushed to main branch
- [ ] GitHub Pages enabled
- [ ] Site published at correct URL
- [ ] Tools load without errors
- [ ] Back navigation works
- [ ] Images/icons display correctly

### Post-Deployment

- [ ] Visit live URL
- [ ] Test all tools
- [ ] Share on social media
- [ ] Add to GitHub profile
- [ ] Monitor for issues
- [ ] Plan additional features

---

## Contact & Support

- **Issues:** Check browser console for error messages
- **Feature Requests:** File GitHub issues
- **Security:** Use tools to test your own security
- **Contributing:** Open pull requests with improvements

---

## Quick Start Commands

### For Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/security-tools-suite.git
cd security-tools-suite

# Create structure
mkdir -p tools docs/screenshots
touch docs/screenshots/.gitkeep

# Copy files to correct locations
# index.html → root
# browser-scanner.html → tools/
# domain-checker.html → tools/

# Commit and push
git add .
git commit -m "Initial commit: Add security tools suite"
git push origin main

# Enable GitHub Pages in repository settings
```

---

## Summary

This is a **lightweight, privacy-focused security tools suite** built with React and Tailwind CSS. The architecture emphasizes:

- **No backend required** - Pure client-side processing
- **Easy deployment** - Static files to any web host
- **No build tools** - Works directly in browser
- **Privacy-first** - Minimal external API usage
- **Educational value** - Learn about web security
- **Extensible** - Easy to add new tools

Perfect for personal use, portfolio projects, educational demonstrations, and open-source contributions to internet security.

