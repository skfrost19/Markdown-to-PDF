import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

export interface PdfOptions {
    headerTemplate: string;
    footerTemplate: string;
    displayHeaderFooter: boolean;
    margin: {
        top: string;
        bottom: string;
        left: string;
        right: string;
    };
    format: 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid';
    basePath: string;
}

// Highlight function for markdown-it
function highlightCode(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
        try {
            return '<pre class="hljs"><code>' +
                hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                '</code></pre>';
        } catch (__) {
            // Fall through to default
        }
    }
    return '<pre class="hljs"><code>' + escapeHtml(str) + '</code></pre>';
}

// Simple HTML escape function
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Initialize markdown-it with syntax highlighting
const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: highlightCode
});

function getStyles(): string {
    return `
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
                padding: 0;
                margin: 0;
            }
            
            h1, h2, h3, h4, h5, h6 {
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-weight: 600;
                line-height: 1.25;
            }
            
            h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h3 { font-size: 1.25em; }
            h4 { font-size: 1em; }
            h5 { font-size: 0.875em; }
            h6 { font-size: 0.85em; color: #6a737d; }
            
            p {
                margin-top: 0;
                margin-bottom: 1em;
            }
            
            a {
                color: #0366d6;
                text-decoration: none;
            }
            
            a:hover {
                text-decoration: underline;
            }
            
            code {
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
                font-size: 0.875em;
                background-color: rgba(27, 31, 35, 0.05);
                padding: 0.2em 0.4em;
                border-radius: 3px;
            }
            
            pre {
                background-color: #f6f8fa;
                border-radius: 6px;
                padding: 16px;
                overflow: auto;
                font-size: 0.875em;
                line-height: 1.45;
            }
            
            pre code {
                background-color: transparent;
                padding: 0;
                border-radius: 0;
            }
            
            blockquote {
                margin: 0;
                padding: 0 1em;
                color: #6a737d;
                border-left: 0.25em solid #dfe2e5;
            }
            
            ul, ol {
                padding-left: 2em;
                margin-top: 0;
                margin-bottom: 1em;
            }
            
            ul {
                list-style-type: disc;
            }
            
            ol {
                list-style-type: decimal;
            }
            
            li {
                margin-bottom: 0.5em;
                display: list-item;
            }
            
            /* Fix: Keep paragraph text inline with bullet point */
            li > p {
                display: inline;
                margin: 0;
            }
            
            li > p:first-child {
                display: inline;
            }
            
            li > p + p {
                display: block;
                margin-top: 0.5em;
            }
            
            /* Nested lists */
            ul ul, ol ul {
                list-style-type: circle;
                margin-top: 0.5em;
                margin-bottom: 0;
            }
            
            ul ul ul, ol ul ul, ul ol ul, ol ol ul {
                list-style-type: square;
            }
            
            ol ol, ul ol {
                list-style-type: lower-roman;
                margin-top: 0.5em;
                margin-bottom: 0;
            }
            
            ol ol ol, ul ol ol, ol ul ol, ul ul ol {
                list-style-type: lower-alpha;
            }
            
            /* Ensure list markers are visible */
            li::marker {
                color: #333;
            }
            
            table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 1em;
            }
            
            table th, table td {
                padding: 6px 13px;
                border: 1px solid #dfe2e5;
            }
            
            table tr:nth-child(2n) {
                background-color: #f6f8fa;
            }
            
            table th {
                font-weight: 600;
                background-color: #f1f3f5;
            }
            
            img {
                max-width: 100%;
                height: auto;
            }
            
            hr {
                height: 0.25em;
                padding: 0;
                margin: 24px 0;
                background-color: #e1e4e8;
                border: 0;
            }
            
            /* Highlight.js theme (GitHub style) */
            .hljs {
                color: #24292e;
                background: #f6f8fa;
            }
            .hljs-comment,
            .hljs-quote {
                color: #6a737d;
                font-style: italic;
            }
            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-subst {
                color: #d73a49;
            }
            .hljs-number,
            .hljs-literal,
            .hljs-variable,
            .hljs-template-variable,
            .hljs-tag .hljs-attr {
                color: #005cc5;
            }
            .hljs-string,
            .hljs-doctag {
                color: #032f62;
            }
            .hljs-title,
            .hljs-section,
            .hljs-selector-id {
                color: #6f42c1;
                font-weight: bold;
            }
            .hljs-type,
            .hljs-class .hljs-title {
                color: #6f42c1;
            }
            .hljs-tag,
            .hljs-name,
            .hljs-attribute {
                color: #22863a;
            }
            .hljs-regexp,
            .hljs-link {
                color: #032f62;
            }
            .hljs-symbol,
            .hljs-bullet {
                color: #e36209;
            }
            .hljs-built_in,
            .hljs-builtin-name {
                color: #005cc5;
            }
            .hljs-meta {
                color: #735c0f;
                font-weight: bold;
            }
            .hljs-deletion {
                color: #b31d28;
                background-color: #ffeef0;
            }
            .hljs-addition {
                color: #22863a;
                background-color: #f0fff4;
            }
            .hljs-emphasis {
                font-style: italic;
            }
            .hljs-strong {
                font-weight: bold;
            }

            /* Task list styling */
            .task-list-item {
                list-style-type: none;
            }
            .task-list-item input {
                margin-right: 0.5em;
            }
        </style>
    `;
}

function getImageMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.jfif': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff'
    };
    return mimeTypes[ext] || 'image/png';
}

function imageToBase64(imagePath: string): string | null {
    try {
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            const base64 = imageBuffer.toString('base64');
            const mimeType = getImageMimeType(imagePath);
            return `data:${mimeType};base64,${base64}`;
        }
    } catch (error) {
        console.error(`Failed to read image: ${imagePath}`, error);
    }
    return null;
}

function resolveImagePaths(html: string, basePath: string): string {
    // Replace relative image paths with base64 data URIs
    return html.replace(/(<img[^>]+src=["'])(?!https?:\/\/|data:)([^"']+)(["'])/gi, (match, prefix, src, suffix) => {
        // Decode URL-encoded characters in the path
        const decodedSrc = decodeURIComponent(src);
        const absolutePath = path.resolve(basePath, decodedSrc);

        const base64DataUri = imageToBase64(absolutePath);
        if (base64DataUri) {
            return prefix + base64DataUri + suffix;
        }

        // If base64 conversion fails, try file:// URL as fallback
        if (fs.existsSync(absolutePath)) {
            const fileUrl = 'file:///' + absolutePath.replace(/\\/g, '/');
            return prefix + fileUrl + suffix;
        }

        return match;
    });
}

function fixListItems(html: string): string {
    // Fix: Remove <p> tags that wrap content directly inside <li> tags
    // This prevents bullet points from appearing on separate lines from their content
    // Match <li> followed by optional whitespace, then <p>, capture content, </p>, optional whitespace, </li>
    // Also handle cases where <li> has <p> as first child but may have other content after

    // First, handle simple cases: <li><p>content</p></li>
    html = html.replace(/<li>\s*<p>([\s\S]*?)<\/p>\s*<\/li>/gi, '<li>$1</li>');

    // Handle cases where <li> starts with <p> but has more content (like nested lists)
    // <li><p>content</p> more stuff </li> -> <li>content more stuff </li>
    html = html.replace(/<li>\s*<p>([\s\S]*?)<\/p>/gi, '<li>$1');

    return html;
}

export async function convertMarkdownToPdf(markdown: string, outputPath: string, options: PdfOptions): Promise<void> {
    // Convert markdown to HTML
    let htmlContent = md.render(markdown);

    // Fix list items - remove paragraph tags inside list items
    htmlContent = fixListItems(htmlContent);

    // Resolve relative image paths
    htmlContent = resolveImagePaths(htmlContent, options.basePath);

    // Create full HTML document
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${getStyles()}
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>
    `;

    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--allow-file-access-from-files',
            '--disable-web-security'
        ]
    });

    try {
        const page = await browser.newPage();

        // Allow loading local files
        await page.setBypassCSP(true);

        // Set content and wait for images to load
        await page.setContent(fullHtml, {
            waitUntil: ['networkidle0', 'load', 'domcontentloaded']
        });

        // Wait a bit more for any remaining images to render
        await page.evaluate(() => {
            return Promise.all(
                Array.from(document.images)
                    .filter(img => !img.complete)
                    .map(img => new Promise(resolve => {
                        img.onload = img.onerror = resolve;
                    }))
            );
        });

        // Generate PDF
        await page.pdf({
            path: outputPath,
            format: options.format,
            margin: options.margin,
            displayHeaderFooter: options.displayHeaderFooter,
            headerTemplate: options.headerTemplate,
            footerTemplate: options.footerTemplate,
            printBackground: true
        });
    } finally {
        await browser.close();
    }
}
