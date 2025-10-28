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
├── src/
│   ├── components/              # React components (TypeScript)
│   │   ├── security-dashboard.tsx
│   │   ├── domain-security-checker.ts
│   │   ├── password-strength-checker.tsx
│   │   ├── url-safety-checker.tsx
│   │   ├── ssl-certificate-analyzer.tsx
│   │   ├── email-header-analyzer.tsx
│   │   ├── hash-validator.tsx
│   │   ├── browser-security-scanner.tsx
│   │   ├── theme-context.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── history-manager.ts
│   │   ├── history-panel.tsx
│   │   └── export-utils.ts
│   ├── App.tsx                  # Main app component with routing
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Tailwind CSS imports
├── dist/                        # Production build output (generated)
├── node_modules/                # Dependencies (generated)
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Main documentation
```

### File Organization

**Source Components (in `/src/components/`):**
- `security-dashboard.tsx` - Main dashboard with 7 tool cards
- `domain-security-checker.ts` - Domain analysis with HTTPS, HSTS, headers, WHOIS, CT logs
- `password-strength-checker.tsx` - Password validation, breach checking, generator
- `url-safety-checker.tsx` - URL decoding, phishing detection, bulk analysis
- `ssl-certificate-analyzer.tsx` - Certificate analysis and trust scoring
- `email-header-analyzer.tsx` - Email header parsing, SPF/DKIM/DMARC validation
- `hash-validator.tsx` - Hash generation and validation (MD5, SHA-1, SHA-256, SHA-512)
- `browser-security-scanner.tsx` - Browser security posture assessment
- `theme-context.tsx` - Dark/light mode context provider
- `theme-toggle.tsx` - Theme switching component
- `loading-spinner.tsx` - Loading indicator component
- `history-manager.ts` - History tracking utility
- `history-panel.tsx` - History display component
- `export-utils.ts` - JSON and PDF export functionality

**Configuration Files:**
- `package.json` - Dependencies (React, TypeScript, Vite, Tailwind, Lucide, jsPDF)
- `vite.config.ts` - Vite build configuration with base path for GitHub Pages
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler configuration
- `postcss.config.js` - PostCSS plugins for Tailwind

**Documentation:**
- `README.md` - Comprehensive user and developer documentation
- `QUICKSTART.md` - 2-step quick start guide
- `CLAUDE.md` - Detailed project architecture and reference (this file)

---

## Technology Stack

### Languages & Frameworks

| Component | Technology |
|-----------|-----------|
| UI Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Icon System | Lucide React |
| PDF Export | jsPDF |
| Package Manager | npm |

### NPM Dependencies

**Production:**
- `react@^18.3.1` - UI library
- `react-dom@^18.3.1` - React rendering
- `lucide-react@^0.462.0` - Icon components
- `jspdf@^2.5.2` - PDF generation

**Development:**
- `@vitejs/plugin-react@^4.3.4` - React support for Vite
- `typescript@~5.6.2` - Type checking
- `tailwindcss@^3.4.17` - Utility-first CSS
- `postcss@^8.4.49` - CSS processing
- `autoprefixer@^10.4.20` - CSS vendor prefixes
- `gh-pages@^6.2.0` - GitHub Pages deployment

### External APIs

- **Have I Been Pwned API:** Password breach checking (k-anonymity mode)
  - Only first 5 characters of SHA-1 hash sent
  - Optional user-initiated check
- **crt.sh:** Certificate Transparency log checks
- **ipify.org:** Public IP address detection

### Build System

**Modern Vite-based Pipeline:**
- **Development:** `npm run dev` - Hot module reload on `localhost:5173`
- **Production Build:** `npm run build` - Optimized bundle in `/dist`
- **Preview:** `npm run preview` - Test production build locally
- **Deployment:** `npm run deploy` - Deploy to GitHub Pages via gh-pages

**Build Output:**
- TypeScript → JavaScript compilation
- JSX → React.createElement calls
- Tailwind CSS → Optimized CSS bundle
- Tree-shaking and minification
- Source maps for debugging

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

### 5. Theme System (`theme-context.tsx`, `theme-toggle.tsx`)
**Purpose:** Dark/light mode management across the application

**Features:**
- Context-based theme state management
- Persistent theme preference in localStorage
- Smooth transitions between themes
- Toggle button with sun/moon icons
- Glassmorphic styling adapted to theme

**Key Functions:**
- `ThemeProvider` - Context provider component
- `useTheme()` - Hook to access/toggle theme
- Theme-specific CSS classes for all components

---

## Deployment Architecture

### Current Deployment: GitHub Pages

**Automated Deployment Process:**
```bash
npm run deploy
```

This command:
1. Runs `npm run build` to create optimized production bundle in `/dist`
2. Uses `gh-pages` package to push `/dist` contents to `gh-pages` branch
3. GitHub automatically serves from `gh-pages` branch

**Live URL:** `https://riches31.github.io/Sec-Tools/`

**Configuration:**
- `vite.config.ts` sets `base: '/Sec-Tools/'` for correct asset paths
- GitHub Pages enabled in repository settings
- Serves from `gh-pages` branch automatically

### Alternative Deployment Options

#### Option 1: Netlify
```bash
npm run build
# Drag /dist folder to netlify.com/drop
```
- Instant CDN distribution
- Free tier with custom domain support
- Automatic HTTPS

#### Option 2: Vercel
```bash
npm run build
vercel --prod
```
- Zero-config deployment
- Edge network distribution
- Free tier available

#### Option 3: Traditional Hosting
```bash
npm run build
# Upload /dist folder contents via FTP/SFTP
```
- Any static web server
- Apache, Nginx, etc.
- Shared hosting compatible

### Build Output Structure

After `npm run build`, the `/dist` directory contains:
```
dist/
├── index.html                    # Entry point
├── assets/
│   ├── index-[hash].js          # Bundled JavaScript
│   ├── index-[hash].css         # Bundled CSS
│   └── [other assets]           # Fonts, images, etc.
└── vite.svg                     # Favicon
```

**Optimizations Applied:**
- Minified JavaScript and CSS
- Tree-shaken dependencies (unused code removed)
- Hashed filenames for cache busting
- Compressed assets
- Single-page application (SPA) routing

---

## Development Workflow

### Local Development

**Setup:**
```bash
# Clone the repository
git clone https://github.com/riches31/Sec-Tools.git
cd Sec-Tools

# Install dependencies
npm install

# Start development server
npm run dev
```

**Development Server:**
- Runs on `http://localhost:5173`
- Hot Module Replacement (HMR) - instant updates on file save
- TypeScript type checking in real-time
- Tailwind CSS classes processed on-the-fly

### Creating New Components

**Step 1:** Create component file in `/src/components/`
```typescript
// src/components/new-feature.tsx
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useTheme } from './theme-context';

export const NewFeature: React.FC = () => {
  const { theme } = useTheme();
  const [result, setResult] = useState<string>('');

  // Component logic here

  return (
    <div className={/* glassmorphic styles */}>
      {/* Component JSX */}
    </div>
  );
};
```

**Step 2:** Add route in `/src/App.tsx`
```typescript
import { NewFeature } from './components/new-feature';

// Add to tool cards and routing logic
```

**Step 3:** Test locally with `npm run dev`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### Code Style & Conventions

- **TypeScript:** Strict mode enabled, explicit types preferred
- **Components:** Functional components with hooks
- **Styling:** Tailwind utility classes, glassmorphic design pattern
- **State:** useState for local state, Context for global theme
- **Icons:** Lucide React icons (consistent sizing and styling)
- **Naming:** PascalCase for components, camelCase for functions/variables

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

### Installation Required

**Install all dependencies:**
```bash
npm install
```

This installs:

| Package | Purpose | Version |
|---------|---------|---------|
| react | UI library | ^18.3.1 |
| react-dom | React rendering | ^18.3.1 |
| lucide-react | Icon components | ^0.462.0 |
| jspdf | PDF generation | ^2.5.2 |
| vite | Build tool | ^6.0.5 |
| typescript | Type checking | ~5.6.2 |
| tailwindcss | Styling | ^3.4.17 |
| @vitejs/plugin-react | Vite React plugin | ^4.3.4 |
| gh-pages | Deployment | ^6.2.0 |

**Total installed size:** ~162MB (includes all dependencies)
**Install time:** ~30 seconds on average connection

### Runtime Characteristics

- **Client-side only:** No backend server needed
- **Build process:** Required for deployment (generates optimized bundle)
- **Development:** npm packages required for local dev server
- **Production:** Serves static files from `/dist`

---

## Common Modifications & Extensions

### Adding a New Tool

1. **Create component** in `/src/components/new-tool.tsx`:
   ```typescript
   export const NewTool: React.FC = () => {
     const { theme } = useTheme();
     // Component implementation
   };
   ```

2. **Add to dashboard** in `/src/components/security-dashboard.tsx`:
   - Add new tool card with icon, description, features
   - Update tool count if displayed

3. **Add routing** in `/src/App.tsx`:
   ```typescript
   import { NewTool } from './components/new-tool';
   // Add to route switch/if statement
   ```

4. **Test locally:**
   ```bash
   npm run dev
   ```

5. **Deploy:**
   ```bash
   npm run deploy
   ```

### Adding New Security Checks

1. **Create check function:**
   ```typescript
   const checkNewThing = async (input: string): Promise<CheckResult> => {
     try {
       // Analysis logic
       return { success: true, data: result };
     } catch (error) {
       return { success: false, error: error.message };
     }
   };
   ```

2. **Integrate into component:**
   - Call from analysis function
   - Update results state
   - Display in results UI
   - Update scoring/risk calculation

3. **Add to history tracking** (if applicable)

4. **Add export support** in results display

### Customizing Theme Colors

**Option 1: Modify Tailwind Config**
Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#your-color',
      },
    },
  },
};
```

**Option 2: Update Component Classes**
Find and replace in component files:
- `bg-blue-500/10` → `bg-custom-blue-500/10`
- `text-blue-400` → `text-custom-blue-400`
- `border-blue-500/20` → `border-custom-blue-500/20`

### Adding New NPM Packages

```bash
# Install production dependency
npm install package-name

# Install dev dependency
npm install -D package-name

# Update imports in components
import { Something } from 'package-name';
```

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

- [ ] All dependencies installed (`npm install`)
- [ ] Local development server working (`npm run dev`)
- [ ] All 7 tools tested and functional
- [ ] No TypeScript errors (`npm run build` succeeds)
- [ ] Theme toggle works (dark/light mode)
- [ ] History tracking works
- [ ] Export functionality works (JSON/PDF)
- [ ] Mobile responsiveness verified
- [ ] All external APIs functional (HIBP, crt.sh, ipify)

### Deployment

- [ ] Repository created on GitHub
- [ ] Source code pushed to `main` branch
- [ ] `vite.config.ts` has correct `base` path
- [ ] Run `npm run deploy` successfully
- [ ] GitHub Pages enabled in repository settings
- [ ] Source set to `gh-pages` branch
- [ ] Wait 2-3 minutes for GitHub Pages to build

### Post-Deployment Verification

- [ ] Visit live URL (`https://yourusername.github.io/repo-name/`)
- [ ] Dashboard loads with all tool cards
- [ ] Test each tool individually:
  - [ ] Domain Security Checker
  - [ ] Password Strength Checker
  - [ ] URL Safety Checker
  - [ ] SSL/TLS Certificate Analyzer
  - [ ] Email Header Analyzer
  - [ ] Hash & Checksum Validator
  - [ ] Browser Security Scanner
- [ ] Navigation between tools works
- [ ] Back button returns to dashboard
- [ ] Theme toggle persists across page reloads
- [ ] History saves and loads correctly
- [ ] Export buttons work
- [ ] Mobile layout works (test on phone/tablet)
- [ ] No console errors (F12 → Console)

### Maintenance

- [ ] Monitor GitHub Issues for bug reports
- [ ] Update dependencies periodically (`npm update`)
- [ ] Add new features based on user feedback
- [ ] Keep documentation up to date
- [ ] Redeploy after changes (`npm run deploy`)

---

## Contact & Support

- **Issues:** Check browser console for error messages
- **Feature Requests:** File GitHub issues
- **Security:** Use tools to test your own security
- **Contributing:** Open pull requests with improvements

---

## Quick Start Commands

### For Development

```bash
# Clone repository
git clone https://github.com/riches31/Sec-Tools.git
cd Sec-Tools

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### For Deployment

```bash
# Build and deploy to GitHub Pages
npm run deploy

# Or manually:
npm run build           # Creates /dist folder
npm run preview         # Test production build locally

# Deploy /dist to GitHub Pages
git add dist -f         # Force add (usually gitignored)
git commit -m "Build"
git subtree push --prefix dist origin gh-pages
```

### For New Repository Setup

```bash
# Create new repository on GitHub first, then:
git clone https://github.com/yourusername/new-repo.git
cd new-repo

# Copy source files from this project
# Then:
npm install
npm run dev              # Test locally
npm run deploy           # Deploy to GitHub Pages

# Enable GitHub Pages in repository settings:
# Settings → Pages → Source: gh-pages branch
```

---

## Summary

This is a **modern, privacy-focused security tools suite** built with React, TypeScript, and Tailwind CSS. The architecture emphasizes:

- **Modern build system** - Vite for lightning-fast development and optimized production builds
- **Type safety** - Full TypeScript support for robust code
- **No backend required** - Pure client-side processing (runs in browser)
- **Easy deployment** - One command to deploy to GitHub Pages (`npm run deploy`)
- **Privacy-first** - Minimal external API usage, data stays in browser
- **Feature-rich** - 7 comprehensive security tools with export and history
- **Beautiful UI** - Glassmorphic design with dark/light mode
- **Educational value** - Learn about web security concepts
- **Extensible** - Easy to add new tools and features
- **Developer-friendly** - Hot reload, TypeScript, modern tooling

Perfect for:
- Personal security assessments
- Educational demonstrations
- Portfolio projects
- Security research
- Open-source contributions
- Learning modern web development

**Tech Highlights:**
- React 18 with functional components and hooks
- TypeScript for type safety
- Vite 6 for blazing-fast development
- Tailwind CSS 3 for modern styling
- Lucide React for beautiful icons
- jsPDF for report generation
- localStorage for persistent history
- Context API for theme management

