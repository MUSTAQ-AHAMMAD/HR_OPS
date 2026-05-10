# Screenshots Directory

This directory contains screenshots of the HR Operations Platform application modules.

## How to Add Screenshots

To help users visualize how the application works, please add screenshots following these steps:

### 1. Run the Application

```bash
npm install
npm run dev
```

Navigate to http://localhost:3000

### 2. Capture Screenshots

Use your browser's screenshot tool or a tool like:
- **Windows**: Windows Snipping Tool or Win + Shift + S
- **macOS**: Cmd + Shift + 4
- **Linux**: Screenshot tool or Flameshot

### 3. Name Screenshots

Save screenshots with descriptive names matching the pages:

- `01-landing-page.png` - Home page (/)
- `02-register-page.png` - Registration page (/register)
- `03-login-page.png` - Login page (/login)
- `04-dashboard-page.png` - Dashboard page (/dashboard)

### 4. Image Requirements

- **Format**: PNG or JPG
- **Resolution**: 1920x1080 or higher recommended
- **File size**: Keep under 500KB per image (compress if needed)
- **Content**: Show the full page or relevant sections

### 5. Add to Repository

After capturing screenshots:

```bash
git add screenshots/
git commit -m "Add application screenshots"
git push
```

## Missing Screenshots

The following screenshots are referenced in SCREENSHOTS.md but not yet added:

1. ✅ `01-landing-page.png` - Landing/Home page
2. ✅ `02-register-page.png` - User registration form
3. ✅ `03-login-page.png` - Login page with demo credentials
4. ✅ `04-dashboard-page.png` - Main dashboard with stats and quick actions

## Tips for Great Screenshots

1. **Use Demo Data**: Run `npm run db:seed` to populate with sample data
2. **Clear Browser Cache**: Ensure fresh load of styles
3. **Full Window**: Capture the full browser window for context
4. **Consistent Size**: Use the same browser window size for all screenshots
5. **Light Mode**: Capture in light mode (default theme) for consistency

## Tools for Screenshots

- [Flameshot](https://flameshot.org/) - Cross-platform screenshot tool
- [ShareX](https://getsharex.com/) - Windows screenshot and recording tool
- [Ksnip](https://github.com/ksnip/ksnip) - Cross-platform screenshot tool
- Browser DevTools - Most browsers have built-in screenshot tools

## Automated Screenshots (Optional)

You can use Playwright or Puppeteer to automate screenshot capture:

```javascript
// example-screenshot.js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto('http://localhost:3000');
  await page.screenshot({ path: 'screenshots/01-landing-page.png' });

  await browser.close();
})();
```
