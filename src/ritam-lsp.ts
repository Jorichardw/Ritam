#!/usr/bin/env node
import { RitamLSP } from './lsp/index';
import { LanguageManager } from './core/LanguageManager';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Ritam LSP Binary Entry Point
 */

const langManager = new LanguageManager();

// Attempt to load language from project root ritam.json
const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, 'ritam.json');

if (fs.existsSync(manifestPath)) {
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        if (manifest.language) {
            langManager.setLanguage(manifest.language);
        }
    } catch (e) {
        // Fallback to default
    }
}

const server = new RitamLSP(langManager);
server.listen();
