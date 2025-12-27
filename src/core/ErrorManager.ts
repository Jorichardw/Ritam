import { LanguageManager } from './LanguageManager';

export class RitamError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RitamError";
    }
}

export class ErrorManager {
    private langManager: LanguageManager;

    constructor(langManager: LanguageManager) {
        this.langManager = langManager;
    }

    private format(template: string, ...args: any[]): string {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match;
        });
    }

    public throw(key: string, ...args: any[]) {
        const msg = this.langManager.getMessage(key);
        // Fallback if key not found?
        const finalMsg = this.format(msg || key, ...args);
        throw new RitamError(finalMsg);
    }
}
