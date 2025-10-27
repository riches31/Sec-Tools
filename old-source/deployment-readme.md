# Security Tools Suite 🛡️

A comprehensive collection of browser-based security analysis tools. All tools run 100% client-side for maximum privacy.

## 📋 Overview

This suite includes 5 files:

1. **index.html** - Main dashboard (complete, ready to deploy)
2. **BrowserSecurityScanner.tsx** - Browser security & IP checker
3. **DomainSecurityChecker.tsx** - Domain security analyzer
4. **PasswordStrengthChecker.tsx** - Password strength & breach checker
5. **URLSafetyChecker.tsx** - URL decoder & phishing detector

## 🚀 Quick Start

### Option 1: Deploy Dashboard Only (Easiest)

1. Download `index.html`
2. Open it in your browser or upload to any web host
3. The dashboard shows all 4 tools with descriptions

### Option 2: Deploy Individual Tools

Each TSX file can be used standalone or hosted separately:

```bash
# For each tool, create an HTML wrapper
# Example: BrowserSecurityScanner.tsx
```

See "Individual Tool Deployment" section below for HTML wrappers.

## 🛠️ Features

### 1. Browser Security Scanner
- ✅ Local & External IP detection
- ✅ HTTPS connection status
- ✅ DNS over HTTPS check
- ✅ HSTS verification
- ✅ Security API availability
- ✅ Overall security score

### 2. Domain Security Checker
- ✅ HTTPS verification
- ✅ HSTS preload status
- ✅ Security headers analysis
- ✅ SSL/TLS certificate check
- ✅ Risk scoring (0-100)

### 3. Password Strength Checker
- ✅ Real-time strength analysis
- ✅ Entropy calculation
- ✅ Breach database check (Have I Been Pwned)
- ✅ Secure password generator
- ✅ Time-to-crack estimation

### 4. URL Safety Checker
- ✅ Multi-level URL decoder
- ✅ Phishing pattern detection
- ✅ Homoglyph attack detection
- ✅ URL structure breakdown
- ✅ Risk assessment

## 📦 Hosting Options

### GitHub Pages (Recommended - FREE)

1. Create a GitHub repository
2. Upload `index.html`
3. Go to Settings → Pages
4. Select main branch as source
5. Access at: `https://yourusername.github.io/repo-name`

**Step-by-step:**
```bash
# 1. Create repo on GitHub
# 2. Clone locally
git clone https://github.com/yourusername/security-tools.git
cd security-tools

# 3. Add files
cp /path/to/index.html .

# 4. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 5. Enable GitHub Pages in repo settings
```

### Netlify Drop (Easiest - FREE)

1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop `index.html`
3. Get instant URL like `random-name.netlify.app`

### Vercel (FREE)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project folder
3. Follow prompts

### Cloudflare Pages (FREE)

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create new project
3. Upload `index.html`
4. Deploy with global CDN

### Traditional Web Hosting

Upload `index.html` via FTP to any web server:
- Shared hosting (cPanel, etc.)
- VPS/Cloud server
- Your own domain

## 🔧 Individual Tool Deployment

To host each tool separately, wrap the TSX file in HTML:

### Browser Security Scanner

Create `browser-scanner.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browser Security Scanner</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // Paste BrowserSecurityScanner.tsx content here
        // Replace 'export default' with just the function
        // Add at the end: ReactDOM.createRoot(document.getElementById('root')).render(<BrowserSecurityScanner />);
    </script>
</body>
</html>
```

### Domain Security Checker

Create `domain-checker.html`:
- Same structure as above
- Paste `DomainSecurityChecker.tsx` content

### Password Strength Checker

Create `password-checker.html`:
- Same structure as above
- Paste `PasswordStrengthChecker.tsx` content

### URL Safety Checker

Create `url-checker.html`:
- Same structure as above
- Paste `URLSafetyChecker.tsx` content

## 🔐 Security & Privacy

### What's Private
- ✅ All analysis runs in your browser
- ✅ No data sent to servers (except breach check)
- ✅ No tracking or analytics
- ✅ No cookies stored
- ✅ Open source - verify the code

### External API Used
- **Have I Been Pwned API** (Password breach check)
  - Uses k-Anonymity (only first 5 chars of hash sent)
  - Completely private and secure
  - Optional - you choose when to check

## 📱 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

### Change Colors

Edit Tailwind classes in the HTML:
```javascript
// Find color classes like:
'bg-blue-600' → 'bg-purple-600'
'text-green-500' → 'text-red-500'
```

### Add Your Logo

Replace the Shield icon in the header:
```html
<Shield className="w-8 h-8 text-blue-600" />
<!-- with -->
<img src="your-logo.png" alt="Logo" className="w-8 h-8" />
```

### Modify Layout

The dashboard uses Tailwind CSS - edit grid classes:
```html
<!-- Change from 2 columns to 3 -->
<div className="grid md:grid-cols-2 gap-6">
<!-- to -->
<div className="grid md:grid-cols-3 gap-6">
```

## 🐛 Troubleshooting

### Tools Not Loading
- Check browser console for errors
- Ensure you're viewing via HTTP/HTTPS (not file://)
- Verify all CDN scripts loaded

### IP Detection Fails
- WebRTC might be blocked by browser/extension
- VPN may affect external IP detection

### Breach Check Fails
- Check internet connection
- Have I Been Pwned API might be rate-limited

## 📄 License

These tools are provided as-is for educational and personal use. Feel free to modify and host on your own server.

## 🤝 Contributing

To improve these tools:
1. Download the TSX files
2. Make your changes
3. Test thoroughly
4. Share improvements

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify you're using a modern browser
3. Ensure JavaScript is enabled
4. Try in incognito/private mode

## 🎯 Use Cases

- **Personal Use**: Check your own security before entering sensitive data
- **Education**: Teach security concepts with hands-on tools
- **IT Teams**: Quick security checks for users
- **Security Audits**: Analyze domains and URLs before visiting

## ⚡ Performance

- Loads in < 2 seconds on average connection
- No backend required
- Minimal bandwidth usage
- Works offline (after initial load)

## 🔄 Updates

To update your deployment:
1. Download the latest version
2. Replace your hosted HTML file
3. Clear browser cache if needed

---

**Made with ❤️ for a more secure web**

*Remember: These tools are aids, not replacements for good security practices. Always stay vigilant online!*