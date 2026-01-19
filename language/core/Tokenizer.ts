import { LanguageManager } from './LanguageManager';

/**
 * Sovereign Tokenizer v2.1
 * 
 * Optimized for multi-script languages and sovereign identifiers.
 * Supports absolute script purity by mapping native descriptors to universal symbols.
 */
export enum TokenType {
    Keyword, Identifier, String, Number, Operator, Punctuation, EOF, Sovereign
}

export interface Token {
    type: TokenType;
    value: string;
    universalValue?: string;
    line: number;
    column: number;
    offset: number;
    length: number;
}

export class Tokenizer {
    private code: string;
    private pos: number = 0;
    private line: number = 1;
    private column: number = 1;
    private langManager: LanguageManager;
    private keywordMap: Map<string, string>;
    private nativeKeywords: string[];
    private builtinMap: Map<string, string>;

    constructor(code: string, langManager: LanguageManager) {
        this.code = code;
        this.langManager = langManager;
        this.keywordMap = new Map();
        this.builtinMap = new Map();
        const def = this.langManager.getCurrentDefinition();

        // 1. Map keywords (including multi-word)
        Object.entries(def.keywords).forEach(([univ, native]) => {
            this.keywordMap.set(native, univ);
        });

        // 2. Map builtins (standard library namespaces/functions)
        if (def.builtins) {
            Object.entries(def.builtins).forEach(([univ, native]) => {
                this.builtinMap.set(native, univ);
            });
        }

        // Sort keywords for longest-match matching
        this.nativeKeywords = Array.from(this.keywordMap.keys()).sort((a, b) => b.length - a.length);
    }

    private peek(offset: number = 0): string {
        return this.code[this.pos + offset] || '';
    }

    private advance(n: number = 1) {
        for (let i = 0; i < n; i++) {
            if (this.code[this.pos] === '\n') {
                this.line++;
                this.column = 1;
            } else {
                this.column++;
            }
            this.pos++;
        }
    }

    private isWhitespace(char: string) { return /\s/.test(char); }
    private isDigit(char: string) { return /[0-9]/.test(char); }
    private isAlpha(char: string) {
        return (char >= 'a' && char <= 'z') ||
            (char >= 'A' && char <= 'Z') ||
            (char === '_') ||
            (char.charCodeAt(0) > 127);
    }

    public tokenize(): Token[] {
        const tokens: Token[] = [];

        while (this.pos < this.code.length) {
            const char = this.peek();
            const startOffset = this.pos;
            const startLine = this.line;
            const startCol = this.column;

            if (this.isWhitespace(char)) {
                this.advance();
                continue;
            }

            if (char === '/' && this.peek(1) === '/') {
                while (this.pos < this.code.length && this.peek() !== '\n') {
                    this.advance();
                }
                continue;
            }

            // Keyword match
            let matchedKeyword = false;
            for (const kw of this.nativeKeywords) {
                if (this.code.startsWith(kw, this.pos)) {
                    const nextChar = this.peek(kw.length);
                    const kwEndsAlpha = this.isAlpha(kw[kw.length - 1]) || this.isDigit(kw[kw.length - 1]);
                    if (!kwEndsAlpha || !this.isAlpha(nextChar)) {
                        tokens.push({
                            type: TokenType.Keyword,
                            value: kw,
                            universalValue: this.keywordMap.get(kw),
                            line: startLine,
                            column: startCol,
                            offset: startOffset,
                            length: kw.length
                        });
                        this.advance(kw.length);
                        matchedKeyword = true;
                        break;
                    }
                }
            }
            if (matchedKeyword) continue;

            if (char === '"' || char === "'") {
                const quote = char;
                this.advance();
                let str = "";
                while (this.pos < this.code.length && this.peek() !== quote) {
                    str += this.peek();
                    this.advance();
                }
                this.advance();
                tokens.push({
                    type: TokenType.String,
                    value: str,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: this.pos - startOffset
                });
                continue;
            }

            if (char === '#') {
                this.advance();
                let identValue = "";
                while (this.pos < this.code.length && (this.isAlpha(this.peek()) || this.isDigit(this.peek()) || this.peek() === '.')) {
                    identValue += this.peek();
                    this.advance();
                }

                // Map parts of sovereign identifier
                // Example: #അടിസ്ഥാനം.രേഖപ്പെടുത്തുക -> #std.print
                const parts = identValue.split('.');
                const mappedParts = parts.map(p => this.builtinMap.get(p) || p);
                const universal = "#" + mappedParts.join('.');

                tokens.push({
                    type: TokenType.Identifier,
                    value: "#" + identValue,
                    universalValue: universal,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: identValue.length + 1
                });
                continue;
            }

            if (this.isAlpha(char)) {
                let ident = "";
                while (this.pos < this.code.length && (this.isAlpha(this.peek()) || this.isDigit(this.peek()))) {
                    ident += this.peek();
                    this.advance();
                }

                // Check if this identifier has a universal builtin mapping
                const univ = this.builtinMap.get(ident);
                tokens.push({
                    type: TokenType.Identifier,
                    value: ident,
                    universalValue: univ,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: ident.length
                });
                continue;
            }

            if (this.isDigit(char)) {
                let num = "";
                while (this.pos < this.code.length && this.isDigit(this.peek())) {
                    num += this.peek();
                    this.advance();
                }
                tokens.push({
                    type: TokenType.Number,
                    value: num,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: num.length
                });
                continue;
            }

            const multiOps = ['==', '!=', '>=', '<='];
            let matchedOp = false;
            for (const op of multiOps) {
                if (this.code.startsWith(op, this.pos)) {
                    tokens.push({ type: TokenType.Operator, value: op, line: startLine, column: startCol, offset: startOffset, length: 2 });
                    this.advance(2);
                    matchedOp = true;
                    break;
                }
            }
            if (matchedOp) continue;

            const singleOps = ['=', '+', '-', '*', '/', '>', '<', '!'];
            if (singleOps.includes(char)) {
                tokens.push({ type: TokenType.Operator, value: char, line: startLine, column: startCol, offset: startOffset, length: 1 });
                this.advance();
                continue;
            }

            const punct = ['{', '}', '(', ')', '[', ']', ';', ',', '.'];
            if (punct.includes(char)) {
                tokens.push({ type: TokenType.Punctuation, value: char, line: startLine, column: startCol, offset: startOffset, length: 1 });
                this.advance();
                continue;
            }

            this.advance();
        }

        tokens.push({ type: TokenType.EOF, value: "EOF", line: this.line, column: this.column, offset: this.pos, length: 0 });
        return tokens;
    }
}
