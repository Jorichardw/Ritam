import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    InitializeResult,
    Hover,
    Definition
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { LanguageManager } from '@language/core/LanguageManager';
import { RitamCompiler } from '@language/core/Compiler';
import * as path from 'path';
import * as fs from 'fs';

/**
 * RitamLSP - Language Server Protocol implementation for Ritam
 */
export class RitamLSP {
    private connection = createConnection(ProposedFeatures.all);
    private documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
    private langManager: LanguageManager;
    private compiler: RitamCompiler;
    private hasConfigurationCapability = false;

    constructor(langManager: LanguageManager) {
        this.langManager = langManager;
        this.compiler = new RitamCompiler(langManager);
        this.setupHandlers();
    }

    private setupHandlers() {
        this.connection.onInitialize((params: InitializeParams) => {
            const capabilities = params.capabilities;

            // Attempt to load project settings to determine primary language
            const rootPath = params.rootPath || (params.workspaceFolders && params.workspaceFolders[0]?.uri.replace('file://', ''));
            if (rootPath) {
                const configPath = path.join(rootPath, 'ritam.json');
                if (fs.existsSync(configPath)) {
                    try {
                        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                        if (config.language) {
                            this.langManager.setLanguage(config.language);
                            this.compiler = new RitamCompiler(this.langManager);
                        }
                    } catch (e) { }
                }
            }

            this.hasConfigurationCapability = !!(
                capabilities.workspace && !!capabilities.workspace.configuration
            );

            const result: InitializeResult = {
                capabilities: {
                    textDocumentSync: TextDocumentSyncKind.Incremental,
                    completionProvider: {
                        resolveProvider: true,
                        triggerCharacters: ['.', '#']
                    },
                    hoverProvider: true,
                    definitionProvider: true
                }
            };
            return result;
        });

        this.connection.onInitialized(() => {
            if (this.hasConfigurationCapability) {
                this.connection.client.register(DidChangeConfigurationNotification.type, undefined);
            }
        });

        this.documents.onDidChangeContent(change => {
            this.validateTextDocument(change.document);
        });

        this.connection.onHover((params: TextDocumentPositionParams): Hover | null => {
            return this.handleHover(params);
        });

        this.connection.onCompletion((params: TextDocumentPositionParams): CompletionItem[] => {
            return this.handleCompletion();
        });

        this.connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
            return item;
        });

        this.connection.onDefinition((): Definition | null => {
            return null;
        });

        this.documents.listen(this.connection);
    }

    private async validateTextDocument(textDocument: TextDocument): Promise<void> {
        const text = textDocument.getText();
        const diagnostics: Diagnostic[] = [];

        try {
            this.compiler.compile(text, 'node', 'lsp_temp.rvx');
        } catch (e: any) {
            if (e.line) {
                const diagnostic: Diagnostic = {
                    severity: DiagnosticSeverity.Error,
                    range: {
                        start: { line: e.line - 1, character: e.column ? e.column - 1 : 0 },
                        end: { line: e.line - 1, character: e.column ? e.column : 100 }
                    },
                    message: e.message,
                    source: 'ritam'
                };
                diagnostics.push(diagnostic);
            }
        }

        this.connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    }

    private handleHover(params: TextDocumentPositionParams): Hover | null {
        const doc = this.documents.get(params.textDocument.uri);
        if (!doc) return null;

        const text = doc.getText();
        const offset = doc.offsetAt(params.position);

        // Find word at cursor (supports Unicode for native language keywords)
        const before = text.slice(0, offset).split(/[^a-zA-Z0-9_\u0B80-\u0D7F#.]/).pop() || "";
        const after = text.slice(offset).split(/[^a-zA-Z0-9_\u0B80-\u0D7F#.]/)[0] || "";
        const word = before + after;

        if (!word) return null;

        // Check if it's a sovereign keyword
        if (word.startsWith('#')) {
            return {
                contents: {
                    kind: 'markdown',
                    value: `**Ritam Standard Library**\n\nNamespace: \`${word}\`\n\nThis is a sovereign identifier protected by Ritam.`
                }
            };
        }

        // Check if it's a keyword
        const def = this.langManager.getCurrentDefinition();
        for (const [univ, native] of Object.entries(def.keywords)) {
            if (native === word) {
                return {
                    contents: {
                        kind: 'markdown',
                        value: `**Keyword**: \`${native}\`\n\nUniversal equivalent: \`${univ}\``
                    }
                };
            }
        }

        return null;
    }

    private handleCompletion(): CompletionItem[] {
        const def = this.langManager.getCurrentDefinition();
        const items: CompletionItem[] = [];

        // 1. Native Keywords
        Object.entries(def.keywords).forEach(([univ, native]) => {
            items.push({
                label: native,
                kind: CompletionItemKind.Keyword,
                detail: `Keyword (${univ})`,
                documentation: `Ritam ${univ} keyword in ${def.meta.name}.`
            });
        });

        // 2. Builtins & Stdlib
        if (def.builtins) {
            Object.entries(def.builtins).forEach(([univ, native]) => {
                items.push({
                    label: native,
                    kind: CompletionItemKind.Function,
                    detail: `Standard Function (${univ})`,
                    documentation: `Ritam built-in function #${univ}.`
                });
            });
        }

        // 3. Common Stdlib Namespaces
        const namespaces = ['math', 'str', 'list', 'file', 'time', 'net', 'crypto', 'test', 'json'];
        namespaces.forEach(ns => {
            items.push({
                label: `#std.${ns}`,
                kind: CompletionItemKind.Module,
                detail: `Standard Library: ${ns}`
            });
        });

        return items;
    }

    public listen() {
        this.connection.listen();
    }
}
