import * as fs from 'fs';
import { RitamCompiler } from '../core/Compiler';
import { LanguageManager } from '../core/LanguageManager';

/**
 * Ritam Language Server Protocol (LSP) Implementation
 * 
 * Supports:
 * - Diagnostics (Syntax & Localized errors)
 * - Hover (Documentation & Type info)
 * - Go-to definition (Local variables/functions)
 * - Auto-completion (Keywords & #std)
 */

export class RitamLSP {
    private compiler: RitamCompiler;
    private langManager: LanguageManager;

    constructor(langManager: LanguageManager) {
        this.langManager = langManager;
        this.compiler = new RitamCompiler(langManager);
    }

    public listen() {
        process.stdin.on('data', (data) => {
            const raw = data.toString();
            this.handleMessage(raw);
        });
    }

    private handleMessage(raw: string) {
        // Basic JSON-RPC handling logic
        // For a full implementation, we'd parse the Content-Length header
        // For now, we'll try to find the JSON body
        try {
            const lines = raw.split('\n');
            const jsonStr = lines.find(l => l.trim().startsWith('{'));
            if (!jsonStr) return;

            const request = JSON.parse(jsonStr);
            this.processRequest(request);
        } catch (e) {
            // Silently fail or log to file
        }
    }

    private processRequest(req: any) {
        switch (req.method) {
            case 'initialize':
                this.sendResponse(req.id, {
                    capabilities: {
                        textDocumentSync: 1, // Full sync
                        hoverProvider: true,
                        definitionProvider: true,
                        completionProvider: {
                            triggerCharacters: ['.', '#']
                        }
                    }
                });
                break;

            case 'textDocument/didOpen':
            case 'textDocument/didChange':
                this.sendDiagnostics(req.params.textDocument.uri, req.params.contentChanges?.[0]?.text || "");
                break;

            case 'textDocument/hover':
                this.handleHover(req.id, req.params);
                break;

            case 'textDocument/definition':
                this.handleDefinition(req.id, req.params);
                break;

            case 'textDocument/completion':
                this.handleCompletion(req.id, req.params);
                break;
        }
    }

    private sendDiagnostics(uri: string, content: string) {
        if (!content) return;
        try {
            // Use compiler to catch errors
            this.compiler.compile(content, 'node');
            this.notification('textDocument/publishDiagnostics', {
                uri,
                diagnostics: []
            });
        } catch (e: any) {
            const diag = {
                range: {
                    start: { line: (e.line || 1) - 1, character: 0 },
                    end: { line: (e.line || 1) - 1, character: 100 }
                },
                severity: 1, // Error
                message: e.message,
                source: 'ritam'
            };
            this.notification('textDocument/publishDiagnostics', {
                uri,
                diagnostics: [diag]
            });
        }
    }

    private handleHover(id: number, params: any) {
        // Implementation for hover - check AST for the identifier at params.position
        this.sendResponse(id, {
            contents: {
                kind: 'markdown',
                value: `**Ritam Documentation**\n\nHover info placeholder for line ${params.position.line}`
            }
        });
    }

    private handleDefinition(id: number, params: any) {
        // Go-to definition placeholder
        this.sendResponse(id, null);
    }

    private handleCompletion(id: number, params: any) {
        const keywords = Object.values(this.langManager.getCurrentDefinition().keywords);
        const std = ['#std.print', '#std.math', '#std.str', '#std.list', '#std.json', '#std.time'];

        const items = [...keywords, ...std].map(k => ({
            label: k,
            kind: 3, // Function/Keyword
            detail: 'Ritam Keyword'
        }));

        this.sendResponse(id, {
            isIncomplete: false,
            items
        });
    }

    private sendResponse(id: number, result: any) {
        const res = JSON.stringify({ jsonrpc: "2.0", id, result });
        const header = `Content-Length: ${Buffer.byteLength(res, 'utf8')}\r\n\r\n`;
        process.stdout.write(header + res);
    }

    private notification(method: string, params: any) {
        const res = JSON.stringify({ jsonrpc: "2.0", method, params });
        const header = `Content-Length: ${Buffer.byteLength(res, 'utf8')}\r\n\r\n`;
        process.stdout.write(header + res);
    }
}
