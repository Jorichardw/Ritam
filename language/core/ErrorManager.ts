import { LanguageManager } from './LanguageManager';
import * as chalk from 'chalk';

export class RitamError extends Error {
    public line?: number;
    public column?: number;
    public snippet?: string;

    constructor(message: string, line?: number, column?: number, snippet?: string) {
        super(message);
        this.name = "RitamError";
        this.line = line;
        this.column = column;
        this.snippet = snippet;
    }
}

export class ErrorManager {
    private langManager: LanguageManager;
    private sourceCode: string = "";

    constructor(langManager: LanguageManager) {
        this.langManager = langManager;
    }

    public setSource(code: string) {
        this.sourceCode = code;
    }

    private format(template: string, ...args: any[]): string {
        return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match;
        });
    }

    public throw(key: string, line?: number, column?: number, ...args: any[]) {
        const msg = this.langManager.getMessage(key) || key;
        const formattedMsg = this.format(msg, ...args);

        let snippet = "";
        if (this.sourceCode && line) {
            const lines = this.sourceCode.split('\n');
            const targetLine = lines[line - 1];
            if (targetLine) {
                const pointer = ' '.repeat(column ? column - 1 : 0) + '^';
                snippet = `\n${line} | ${targetLine}\n${' '.repeat(String(line).length)} | ${pointer}`;
            }
        }

        const finalMsg = line
            ? `${formattedMsg} (line ${line}${column ? `, column ${column}` : ''})${snippet}`
            : formattedMsg;

        throw new RitamError(finalMsg, line, column, snippet);
    }

    public suggest(typo: string, possibilities: string[]): string | null {
        // Simple Levenshtein distance for "did you mean?"
        const distance = (a: string, b: string) => {
            const matrix = Array.from({ length: a.length + 1 }, () =>
                Array.from({ length: b.length + 1 }, () => 0)
            );
            for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
            for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
            for (let i = 1; i <= a.length; i++) {
                for (let j = 1; j <= b.length; j++) {
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + cost
                    );
                }
            }
            return matrix[a.length][b.length];
        };

        let bestMatch = null;
        let minDistance = 3; // Threshold

        for (const p of possibilities) {
            const d = distance(typo, p);
            if (d < minDistance) {
                minDistance = d;
                bestMatch = p;
            }
        }

        return bestMatch;
    }
}
