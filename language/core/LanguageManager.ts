import * as fs from 'fs';
import * as path from 'path';

export interface LanguageDef {
    meta: {
        name: string;
        code: string;
        direction: string;
    };
    keywords: Record<string, string>;
    builtins?: Record<string, string>;
    messages: Record<string, string>;
}

export class LanguageManager {
    private availableLanguages: Map<string, string> = new Map(); // Name -> FilePath
    private currentLangDef: LanguageDef | null = null;
    private currentLangName: string = 'Tamil';

    constructor() {
        this.scanLanguages();
        this.setLanguage('Tamil'); // Default
    }

    private scanLanguages() {
        // Path resolution for both development (ts-node) and production (dist)
        const possiblePaths = [
            path.join(__dirname, '../../locales'), // Production: dist/language/core -> dist/locales
            path.join(__dirname, '../../../assets/locales'), // Development: language/core -> assets/locales
            path.join(process.cwd(), 'assets/locales'), // Fallback 1
            path.join(process.cwd(), 'dist/locales') // Fallback 2
        ];

        let localesDir = '';
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                localesDir = p;
                break;
            }
        }

        if (localesDir) {
            const files = fs.readdirSync(localesDir);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    try {
                        const filePath = path.join(localesDir, file);
                        // We read file here to get the name for registry
                        // Optimization: In production, read a manifest.json instead
                        const content = fs.readFileSync(filePath, 'utf-8');
                        const langDef: LanguageDef = JSON.parse(content);
                        this.availableLanguages.set(langDef.meta.name, filePath);
                    } catch (e) {
                        console.error(`Failed to load language file ${file}:`, e);
                    }
                }
            });
        }
    }

    public getAvailableLanguages(): string[] {
        return Array.from(this.availableLanguages.keys());
    }

    public setLanguage(name: string) {
        const filePath = this.availableLanguages.get(name);
        if (filePath) {
            const content = fs.readFileSync(filePath, 'utf-8');
            this.currentLangDef = JSON.parse(content);
            this.currentLangName = name;
        } else {
            // If Tamil isn't available, we might have an issue, but we assume it is scanned.
            // console.warn(`Language ${name} not found in registry.`);
        }
    }

    public getCurrentDefinition(): LanguageDef {
        if (!this.currentLangDef) {
            throw new Error("No language currently selected.");
        }
        return this.currentLangDef;
    }

    public getKeyword(universalKey: string): string {
        const lang = this.getCurrentDefinition();
        return lang.keywords[universalKey] || universalKey;
    }

    public getMessage(key: string): string {
        const lang = this.getCurrentDefinition();
        return lang.messages[key] || key;
    }
}
