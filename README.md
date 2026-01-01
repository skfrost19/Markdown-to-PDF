# Markdown to PDF Export

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/ShahilKumar.md-to-pdf-export.svg)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/ShahilKumar.md-to-pdf-export)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/ShahilKumar.md-to-pdf-export.svg)
![License](https://img.shields.io/github/license/skfrost19/Markdown-to-PDF.svg)

Convert Markdown files to beautiful PDF documents with a single click in Visual Studio Code.

## ✨ Features

### 📄 One-Click Export
- **Right-click context menu** - Export directly from the editor or file explorer
- **Editor title button** - Quick access from the editor toolbar
- **Save dialog** - Choose where to save your PDF

### 🎨 Beautiful Output
- **GitHub-style formatting** - Clean, professional-looking PDFs
- **Syntax highlighting** - Code blocks with proper highlighting using highlight.js
- **Image embedding** - Local images are automatically embedded in the PDF
- **Table support** - Properly formatted tables with borders

### ⚙️ Configurable Options
- **Paper formats** - A3, A4, A5, Legal, Letter, Tabloid
- **Custom margins** - Configure top, bottom, left, and right margins
- **Headers & footers** - Add page numbers or custom HTML templates

## 🚀 Installation

1. Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ShahilKumar.md-to-pdf-export)
2. Open any `.md` or `.markdown` file
3. Right-click and select **"Export as PDF"**

## 🎯 Usage

### Export a Markdown File

**Method 1: Context Menu**
1. Open a Markdown file in VS Code
2. Right-click in the editor
3. Select **"Export as PDF"**
4. Choose the save location

**Method 2: Editor Title Bar**
1. Open a Markdown file
2. Click the PDF icon in the editor title bar
3. Choose the save location

**Method 3: File Explorer**
1. Right-click any `.md` file in the Explorer
2. Select **"Export as PDF"**

## ⚙️ Configuration

Access settings via `File → Preferences → Settings` and search for "Markdown to PDF".

### Available Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `markdown-to-pdf.format` | Paper format | `A4` |
| `markdown-to-pdf.margin` | Page margins (top, bottom, left, right) | `20mm, 20mm, 15mm, 15mm` |
| `markdown-to-pdf.displayHeaderFooter` | Show header and footer | `true` |
| `markdown-to-pdf.headerTemplate` | Custom HTML header template | `""` |
| `markdown-to-pdf.footerTemplate` | Custom HTML footer template | Page numbers |

### Example Configuration

```json
{
    "markdown-to-pdf.format": "Letter",
    "markdown-to-pdf.margin": {
        "top": "25mm",
        "bottom": "25mm",
        "left": "20mm",
        "right": "20mm"
    },
    "markdown-to-pdf.displayHeaderFooter": true,
    "markdown-to-pdf.footerTemplate": "<div style=\"font-size: 10px; text-align: center; width: 100%;\">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div>"
}
```

### Header/Footer Template Variables

You can use these classes in your header/footer templates:
- `pageNumber` - Current page number
- `totalPages` - Total number of pages
- `date` - Formatted print date
- `title` - Document title
- `url` - Document URL

## 🛠️ Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/skfrost19/Markdown-to-PDF.git
cd Markdown-to-PDF

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Launch development version
# Press F5 in VS Code
```

### Technology Stack
- **TypeScript** - Type-safe JavaScript
- **VS Code API** - Extension integration
- **markdown-it** - Markdown parsing
- **highlight.js** - Syntax highlighting
- **Puppeteer** - PDF generation

## 🐛 Troubleshooting

### Common Issues

**PDF generation fails:**
- Ensure you have a stable internet connection (Puppeteer downloads Chromium on first use)
- Check if the Markdown file is saved
- Verify file permissions for the output location

**Images not appearing:**
- Ensure image paths are relative to the Markdown file
- Check that image files exist at the specified paths
- Supported formats: PNG, JPG, JPEG, GIF, BMP, WebP, SVG, JFIF

**Styling issues:**
- The extension uses GitHub-style formatting
- Custom CSS is not currently supported

### Getting Help

1. Check existing [Issues](https://github.com/skfrost19/Markdown-to-PDF/issues)
2. Create a new issue with:
   - VS Code version
   - Extension version
   - Sample Markdown file (if possible)
   - Error messages from the Output panel

## 📝 Changelog

### Version 1.0.0
- ✨ Initial release
- ✨ One-click PDF export from context menu and editor toolbar
- ✨ Syntax highlighting for code blocks
- ✨ Image embedding with base64 encoding
- ✨ GitHub-style formatting
- ✨ Configurable paper format, margins, and headers/footers
- ✨ Support for tables, lists, blockquotes, and more

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Areas for Contribution
- Additional styling themes
- Custom CSS support
- Table of contents generation
- Performance optimizations
- Bug fixes and testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown parsing
- [highlight.js](https://highlightjs.org/) for syntax highlighting
- [Puppeteer](https://pptr.dev/) for PDF generation
- VS Code team for the excellent extension API

---

**Made with ❤️ by [Shahil Kumar](https://github.com/skfrost19)**
