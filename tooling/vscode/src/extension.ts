import * as path from 'path';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    console.log('Ritam extension activated');

    // Server options - path to the LSP binary
    const serverModule = context.asAbsolutePath(
        path.join('..', '..', 'dist', 'tooling', 'lsp', 'index.js')
    );

    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.stdio },
        debug: { module: serverModule, transport: TransportKind.stdio }
    };

    // Client options
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'ritam' }],
        synchronize: {
            fileEvents: vscode.workspace.createFileSystemWatcher('**/*.rvx')
        }
    };

    // Check if LSP is enabled
    const config = vscode.workspace.getConfiguration('ritam');
    if (config.get('enableLSP')) {
        client = new LanguageClient(
            'ritamLanguageServer',
            'Ritam Language Server',
            serverOptions,
            clientOptions
        );
        client.start();
    }

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('ritam.compile', compileCurrentFile),
        vscode.commands.registerCommand('ritam.run', runCurrentFile),
        vscode.commands.registerCommand('ritam.init', initProject)
    );

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = '$(code) Ritam';
    statusBarItem.tooltip = 'Ritam Programming Language';
    statusBarItem.command = 'ritam.compile';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

async function compileCurrentFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active file');
        return;
    }

    const filePath = editor.document.fileName;
    if (!filePath.endsWith('.rvx')) {
        vscode.window.showErrorMessage('Not a Ritam file (.rvx)');
        return;
    }

    const config = vscode.workspace.getConfiguration('ritam');
    const target = config.get('compilationTarget') || 'node';
    const language = config.get('language') || 'Tamil';

    const terminal = vscode.window.createTerminal('Ritam Compiler');
    terminal.show();
    terminal.sendText(`ritam compile "${filePath}" -t ${target} --lang ${language}`);
}

async function runCurrentFile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active file');
        return;
    }

    const filePath = editor.document.fileName;
    if (!filePath.endsWith('.rvx')) {
        vscode.window.showErrorMessage('Not a Ritam file (.rvx)');
        return;
    }

    const config = vscode.workspace.getConfiguration('ritam');
    const language = config.get('language') || 'Tamil';

    const terminal = vscode.window.createTerminal('Ritam Runner');
    terminal.show();
    terminal.sendText(`ritam run "${filePath}" --lang ${language}`);
}

async function initProject() {
    const terminal = vscode.window.createTerminal('Ritam Init');
    terminal.show();
    terminal.sendText('ritam init');
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
