# Security Tools Suite 🛡️

A comprehensive, privacy-first collection of security analysis tools with a modern glassmorphic design.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages (~150MB, takes about 30 seconds).

### 2. Start Development Server

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:5173`

### 3. That's It!

You now have access to all 7 security tools:
- ✅ **Domain Security Checker** - Analyze domains with HTTPS, HSTS, headers, WHOIS, Certificate Transparency
- ✅ **Password Strength Checker** - Test passwords, check breaches, generate passwords & passphrases
- ✅ **URL Safety Checker** - Decode URLs, detect phishing, bulk URL analysis
- ✅ **SSL/TLS Certificate Analyzer** - Analyze certificates, check expiry, trust scoring
- ✅ **Email Header Analyzer** - Parse headers, check SPF/DKIM/DMARC, spam scoring
- ✅ **Hash & Checksum Validator** - Generate/validate hashes (MD5, SHA-1, SHA-256, SHA-512)
- ✅ **Browser Security Scanner** - Check IP, HTTPS, DNS over HTTPS, security APIs

## 🎨 Features

### Core Features
- 🌓 **Dark/Light Mode** - Toggle with the theme button in the header
- 💾 **Export Results** - Export analysis to JSON or PDF
- 📜 **History Tracking** - Last 10 checks saved per tool with search
- 🔒 **100% Client-Side** - No data sent to servers, complete privacy
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Glassmorphism UI** - Modern, clean aesthetic with cool color tones

### Enhanced Tools
- **Passphrase Generator** - Create memorable, secure passphrases (e.g., "Correct-Horse-Battery-Staple")
- **Bulk URL Checker** - Analyze multiple URLs at once with summary statistics
- **WHOIS Data** - Domain registration and expiry information
- **Certificate Transparency** - Check CT log status for domains

## 📦 Project Structure

```
Sec-Tools/
├── src/
│   ├── components/        # All React components
│   │   ├── security-dashboard.tsx
│   │   ├── domain-security-checker.ts
│   │   ├── password-strength-checker.tsx
│   │   ├── url-safety-checker.tsx
│   │   ├── ssl-certificate-analyzer.tsx
│   │   ├── email-header-analyzer.tsx
│   │   ├── hash-validator.tsx
│   │   ├── theme-context.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── history-manager.ts
│   │   ├── history-panel.tsx
│   │   └── export-utils.ts
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Tailwind CSS imports
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔧 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Lightning-fast dev server and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **jsPDF** - PDF export functionality

## 🌐 Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled and modern browser APIs (Web Crypto, localStorage, fetch).

## 📝 Notes

- All processing happens in your browser - no backend required
- History is stored in localStorage (persists across sessions)
- Dark mode preference is remembered
- Export functionality works offline

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Kill the process using port 5173
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -ti:5173 | xargs kill
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Tailwind styles not loading:**
```bash
# Make sure you ran npm install and the dev server is running
npm run dev
```

## 📄 License

This project is open source and available for use in personal and commercial projects.

---

**Enjoy your Security Tools Suite!** 🛡️
