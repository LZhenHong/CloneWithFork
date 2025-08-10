# Clone with Fork

A cross-platform browser extension that adds an "Open with Fork" button to GitHub repository pages, allowing you to quickly open repositories in the [Fork](https://fork.dev/) Git client application.

**Supported Browsers:**
- ✅ Chrome (Manifest V3)
- ✅ Safari (Manifest V2)

## Features

- Adds "Open with Fork" option to GitHub repository "Code" button dropdown menu
- Automatically opens the current repository in Fork application when clicked
- Cross-platform support for Chrome and Safari browsers
- Lightweight with minimal permissions required

## How to Use

<img src="snapshot.png">

1. Navigate to any GitHub repository page
2. Click the green "Code" button
3. Find the "Open with Fork" option in the dropdown menu
4. Click to open the repository in Fork application

## Prerequisites

Make sure you have the [Fork](https://fork.dev/) Git client installed on your system.

## Development Setup

```bash
# Install dependencies
npm install
```

## Build Instructions

### Build Chrome Version
```bash
npm run build:chrome
```

### Build Safari Version
```bash
npm run build:safari
```

All built files will be output to the `dist` folder.

## Chrome Installation Guide

### 1. Build the Extension
```bash
npm run build:chrome
```

### 2. Load the Extension
1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the project's `dist` folder

### 3. Enable the Extension
The extension will be automatically enabled after loading. You can see "Clone with Fork" in the extensions management page.

## Safari Installation Guide

### Prerequisites
- macOS 10.14 or later
- Safari browser

### 1. Build the Extension
```bash
npm run build:safari
```

### 2. Enable Safari Developer Features
1. Open Safari browser
2. Go to **Safari > Preferences** (or press `Cmd + ,`)
3. Click the **Advanced** tab
4. Check **"Show Develop menu in menu bar"**

### 3. Allow Unsigned Extensions
1. In Safari menu bar, select **Develop > Allow Unsigned Extensions**
2. Enter your administrator password when prompted

### 4. Load the Extension
1. In Safari menu bar, select **Safari > Preferences**
2. Click the **Extensions** tab
3. Click the **"+"** button in the bottom left
4. Navigate to and select the project's `dist` folder
5. Click **"Choose Folder"**

### 5. Enable the Extension
1. Find "Clone with Fork" in the extensions list
2. Check the checkbox next to the extension name to enable it
3. If prompted for permissions, click **"Always Allow"**

## Troubleshooting

### Chrome Issues

**Extension won't load:**
- Ensure Developer mode is enabled
- Check that `dist` folder contains `manifest.json` and `index.js`
- Try rebuilding: `npm run build:chrome`

**Extension not working:**
- Open Developer Tools (F12) and check console for errors
- Ensure Fork application is properly installed
- Refresh the GitHub page and try again

### Safari Issues

**Extension doesn't appear:**
- Ensure you've completed the developer features and unsigned extensions steps
- Restart Safari browser
- Check Safari > Preferences > Extensions for the extension list

**Extension not working:**
- Check Safari > Develop > Show JavaScript Console for error messages
- Ensure Fork application is installed
- Go to Safari > Preferences > Websites > Extensions and ensure the extension is enabled for GitHub

**Permission issues:**
- If Safari blocks the extension, go to Safari > Preferences > Websites > Extensions
- Ensure the extension is enabled for `github.com`

## Development

### Rebuilding After Code Changes
```bash
# After modifying src/index.ts
npm run build:chrome  # Rebuild Chrome version
npm run build:safari  # Rebuild Safari version
```

### Debugging
- **Chrome**: Click "Inspect views" in the extensions management page
- **Safari**: Use Safari > Develop > Show JavaScript Console

## License

See the [LICENSE](./LICENSE) file for license information.

## Contributing

Issues and Pull Requests are welcome to improve this project.

## Notes

- Safari version is a development build; you may need to re-allow unsigned extensions after Safari updates
- For distribution to other users, consider publishing through respective app stores
- Chrome version can be packaged as .crx file for distribution
- Safari version should be code-signed through Apple Developer Program for wider distribution
