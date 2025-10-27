# 🖥️ GitHub Desktop Setup Guide

Complete step-by-step guide for deploying your Security Tools Suite using GitHub Desktop.

---

## 📋 Prerequisites

- [ ] GitHub Desktop installed ([Download here](https://desktop.github.com/))
- [ ] GitHub account created ([Sign up here](https://github.com/signup))
- [ ] All project files ready

---

## 🚀 Step-by-Step Guide

### Step 1: Create a New Repository on GitHub.com

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in the details:
   - **Repository name:** `security-tools-suite`
   - **Description:** `Comprehensive browser-based security analysis tools`
   - **Visibility:** Choose **Public** (for GitHub Pages to work)
   - ✅ Check **"Add a README file"** (optional, we'll replace it)
   - **Add .gitignore:** None
   - **Choose a license:** MIT License
4. Click **"Create repository"**

---

### Step 2: Clone Repository in GitHub Desktop

1. Open **GitHub Desktop**
2. Click **File** → **Clone Repository** (or `Ctrl+Shift+O` / `Cmd+Shift+O`)
3. Go to **GitHub.com** tab
4. Find `security-tools-suite` in the list
5. Choose where to save it locally:
   ```
   C:\Users\YourName\Documents\GitHub\security-tools-suite
   ```
6. Click **Clone**

---

### Step 3: Organize Your Project Files

Now you need to create this folder structure in your cloned repository:

```
security-tools-suite/
├── index.html
├── README.md
├── LICENSE
├── tools/
│   ├── browser-scanner.html
│   ├── domain-checker.html
│   ├── password-checker.html
│   └── url-checker.html
└── docs/
    └── screenshots/
        └── .gitkeep
```

#### How to do this:

1. Open File Explorer / Finder
2. Navigate to your cloned repository folder
3. Create the folders:
   - Create `tools` folder
   - Create `docs` folder
   - Create `screenshots` folder inside `docs`
4. Copy your files:
   - Copy `index.html` to root
   - Replace `README.md` with the new one
   - `LICENSE` should already exist (if you selected MIT)
   - Copy the 4 tool HTML files to the `tools/` folder

---

### Step 4: Create Missing Files

You need to create empty placeholders for screenshots and the individual tool HTML files.

#### Create `.gitkeep` for Screenshots Folder

1. Open Notepad (Windows) or TextEdit (Mac)
2. Save empty file as `.gitkeep` in `docs/screenshots/`
   - This keeps the folder in Git even when empty

#### Create Individual Tool HTML Files

**I'll provide these in the next artifacts**, but for now create empty files:
- `tools/browser-scanner.html`
- `tools/domain-checker.html`
- `tools/password-checker.html`
- `tools/url-checker.html`

---

### Step 5: Commit Changes in GitHub Desktop

1. Open **GitHub Desktop**
2. You should see all your new files in the left panel under "Changes"
3. Review the changes (they should all be green/new)
4. In the bottom left:
   - **Summary:** `Initial commit: Add security tools suite`
   - **Description:** (optional)
   ```
   - Add main dashboard (index.html)
   - Add 4 security tool pages
   - Add README with documentation
   - Add MIT License
   - Set up project structure
   ```
5. Click **"Commit to main"**

---

### Step 6: Push to GitHub

1. After committing, click **"Push origin"** button (top right)
2. Wait for upload to complete (progress bar appears)
3. When done, you'll see "Last fetched just now"

---

### Step 7: Enable GitHub Pages

1. Go to your repository on GitHub.com:
   ```
   https://github.com/yourusername/security-tools-suite
   ```
2. Click **Settings** tab (top navigation)
3. Scroll down to **Pages** section (left sidebar)
4. Under **"Source"**:
   - Select: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
5. Click **Save**
6. Wait 1-2 minutes
7. Refresh the page - you'll see a message:
   ```
   Your site is live at https://yourusername.github.io/security-tools-suite/
   ```

---

### Step 8: Test Your Site

Visit your live site:
```
https://yourusername.github.io/security-tools-suite/
```

Test each tool page:
- `https://yourusername.github.io/security-tools-suite/tools/browser-scanner.html`
- `https://yourusername.github.io/security-tools-suite/tools/domain-checker.html`
- `https://yourusername.github.io/security-tools-suite/tools/password-checker.html`
- `https://yourusername.github.io/security-tools-suite/tools/url-checker.html`

---

## 🔄 Making Updates

### Updating Files

1. Make changes to any file locally
2. Save the file
3. Open **GitHub Desktop**
4. You'll see changed files in "Changes" panel
5. Write commit message
6. Click **"Commit to main"**
7. Click **"Push origin"**
8. Wait 1-2 minutes for GitHub Pages to update

---

## 📸 Adding Screenshots

### How to Add Screenshots

1. Take screenshots of your tools:
   - Dashboard
   - Browser Scanner
   - Domain Checker
   - Password Checker
   - URL Checker

2. Name them:
   ```
   dashboard.png
   browser-scanner.png
   domain-checker.png
   password-checker.png
   url-checker.png
   ```

3. Save to: `docs/screenshots/`

4. Commit and push in GitHub Desktop

5. Update README.md to point to actual screenshots:
   ```markdown
   ![Dashboard](./docs/screenshots/dashboard.png)
   ```

---

## 🎯 Project Checklist

Before making your repo public, ensure:

- [ ] `index.html` works locally
- [ ] All 4 tool HTML files work locally
- [ ] README.md has correct username/links
- [ ] LICENSE file exists
- [ ] Screenshots added (or placeholder images)
- [ ] GitHub Pages is enabled
- [ ] Site loads correctly online
- [ ] All navigation links work
- [ ] Tools function properly

---

## 🐛 Troubleshooting

### GitHub Desktop Not Showing Changes

- Make sure files are saved
- Check you're in the correct repository
- Try clicking **Repository** → **Refresh**

### GitHub Pages Not Working

- Wait 2-5 minutes after first setup
- Check Settings → Pages shows "Your site is published"
- Ensure repository is Public
- Verify `index.html` is in root folder

### 404 Error on Tool Pages

- Check file names match exactly (case-sensitive)
- Verify files are in `tools/` folder
- Check links in `index.html` use correct paths

### Changes Not Appearing Online

- Allow 1-2 minutes for GitHub Pages to rebuild
- Clear browser cache (`Ctrl+F5` / `Cmd+Shift+R`)
- Check you pushed changes (in GitHub Desktop)

---

## 📱 GitHub Desktop Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Clone Repository | `Ctrl+Shift+O` | `Cmd+Shift+O` |
| Create Branch | `Ctrl+Shift+N` | `Cmd+Shift+N` |
| Commit | `Ctrl+Enter` | `Cmd+Enter` |
| Push | `Ctrl+P` | `Cmd+P` |
| Pull | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| View on GitHub | `Ctrl+Shift+G` | `Cmd+Shift+G` |

---

## 🎓 Git Concepts Explained

### Repository (Repo)
Your project folder that Git tracks

### Commit
A snapshot of your project at a point in time

### Push
Upload your commits to GitHub.com

### Pull
Download changes from GitHub.com

### Branch
A parallel version of your code (main is default)

### Clone
Download a copy of a repository to your computer

---

## 🔐 Best Practices

### Commit Messages

**Good:**
```
Add password strength checker
Fix mobile navigation bug
Update README with deployment guide
```

**Bad:**
```
update
fix stuff
changes
```

### Commit Frequency

- Commit after each feature/fix
- Don't commit broken code
- Push commits at least daily

### File Organization

- Keep related files together
- Use consistent naming
- Don't commit large binary files

---

## 🆘 Getting Help

### GitHub Desktop Help
- Help menu → **Documentation**
- Help menu → **Show Logs**
- [GitHub Desktop Docs](https://docs.github.com/en/desktop)

### GitHub Pages Help
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Community](https://github.community/)

### Project Specific
- Open an issue on your repo
- Check existing issues for solutions

---

## ✅ Next Steps

After setup is complete:

1. [ ] Add screenshots to README
2. [ ] Customize colors/theme
3. [ ] Add your email/social links
4. [ ] Share your project!
5. [ ] Consider adding:
   - [ ] CONTRIBUTING.md
   - [ ] Code of Conduct
   - [ ] Issue templates
   - [ ] PR templates

---

## 🎉 Congratulations!

Your Security Tools Suite is now live on GitHub Pages! 🚀

**Share your project:**
- Tweet the link
- Post on LinkedIn
- Share in developer communities
- Add to your portfolio

**Keep improving:**
- Monitor issues
- Add new features
- Update documentation
- Engage with users

---

<p align="center">
  <b>Need help? Open an issue or discussion on GitHub!</b>
</p>