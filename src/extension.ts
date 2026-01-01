import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { convertMarkdownToPdf } from './converter';

export function activate(context: vscode.ExtensionContext) {
    console.log('Markdown to PDF extension is now active');

    const disposable = vscode.commands.registerCommand('markdown-to-pdf.export', async (uri?: vscode.Uri) => {
        // Get the file URI - either from context menu or active editor
        let fileUri: vscode.Uri | undefined = uri;

        if (!fileUri) {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && activeEditor.document.languageId === 'markdown') {
                fileUri = activeEditor.document.uri;
            }
        }

        if (!fileUri) {
            vscode.window.showErrorMessage('No Markdown file selected. Please open or select a Markdown file.');
            return;
        }

        // Check if it's a markdown file
        const filePath = fileUri.fsPath;
        if (!filePath.toLowerCase().endsWith('.md') && !filePath.toLowerCase().endsWith('.markdown')) {
            vscode.window.showErrorMessage('Please select a Markdown file (.md or .markdown)');
            return;
        }

        // Get output path
        const defaultOutputPath = filePath.replace(/\.(md|markdown)$/i, '.pdf');
        const outputUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(defaultOutputPath),
            filters: {
                'PDF files': ['pdf']
            },
            title: 'Save PDF as'
        });

        if (!outputUri) {
            return; // User cancelled
        }

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Converting Markdown to PDF...',
            cancellable: false
        }, async (progress) => {
            try {
                progress.report({ increment: 0, message: 'Reading Markdown file...' });

                // Read the markdown content
                const markdownContent = fs.readFileSync(filePath, 'utf-8');

                progress.report({ increment: 30, message: 'Converting to PDF...' });

                // Get configuration
                const config = vscode.workspace.getConfiguration('markdown-to-pdf');

                // Convert to PDF
                await convertMarkdownToPdf(markdownContent, outputUri.fsPath, {
                    headerTemplate: config.get('headerTemplate', ''),
                    footerTemplate: config.get('footerTemplate', '<div style="font-size: 10px; text-align: center; width: 100%;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'),
                    displayHeaderFooter: config.get('displayHeaderFooter', true),
                    margin: config.get('margin', { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }),
                    format: config.get('format', 'A4') as 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid',
                    basePath: path.dirname(filePath)
                });

                progress.report({ increment: 70, message: 'Done!' });

                // Show success message with option to open the file
                const openFile = await vscode.window.showInformationMessage(
                    `PDF exported successfully: ${path.basename(outputUri.fsPath)}`,
                    'Open PDF',
                    'Open Folder'
                );

                if (openFile === 'Open PDF') {
                    vscode.env.openExternal(outputUri);
                } else if (openFile === 'Open Folder') {
                    vscode.env.openExternal(vscode.Uri.file(path.dirname(outputUri.fsPath)));
                }

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                vscode.window.showErrorMessage(`Failed to convert Markdown to PDF: ${errorMessage}`);
                console.error('Markdown to PDF conversion error:', error);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
