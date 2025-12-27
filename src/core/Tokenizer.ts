import { LanguageManager } from './LanguageManager';

/**
 * Sovereign Tokenizer v2.0
 * 
 * Optimized for multi-script languages and sovereign identifiers.
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

    constructor(code: string, langManager: LanguageManager) {
        this.code = code;
        this.langManager = langManager;
        this.keywordMap = new Map();
        const def = this.langManager.getCurrentDefinition();

        // Multi-word keyword support (e.g., "இல்லையேல் ஆனால்")
        Object.entries(def.keywords).forEach(([univ, native]) => {
            this.keywordMap.set(native, univ);
        });

        // Sort keywords by length descending to match longest possible candidate first
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

    /**
     * Alpha check optimized for Unicode scripts (Tamil, Hindi, etc.)
     */
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

            // 1. Whitespace
            if (this.isWhitespace(char)) {
                this.advance();
                continue;
            }

            // 2. Comments
            if (char === '/' && this.peek(1) === '/') {
                while (this.pos < this.code.length && this.peek() !== '\n') {
                    this.advance();
                }
                continue;
            }

            // 3. Keywords (including multi-word)
            let matchedKeyword = false;
            for (const kw of this.nativeKeywords) {
                if (this.code.startsWith(kw, this.pos)) {
                    const nextChar = this.peek(kw.length);
                    // Ensure the keyword is not just a prefix of a larger identifier
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

            // 4. Strings
            if (char === '"' || char === "'") {
                const quote = char;
                this.advance();
                let str = "";
                while (this.pos < this.code.length && this.peek() !== quote) {
                    str += this.peek();
                    this.advance();
                }
                this.advance(); // consume closing quote
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

            // 5. Sovereign Identifiers (Starting with #)
            if (char === '#') {
                this.advance();
                let ident = "#";
                while (this.pos < this.code.length && (this.isAlpha(this.peek()) || this.isDigit(this.peek()) || this.peek() === '.')) {
                    ident += this.peek();
                    this.advance();
                }
                tokens.push({
                    type: TokenType.Identifier,
                    value: ident,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: ident.length
                });
                continue;
            }

            // 6. Normal Identifiers
            if (this.isAlpha(char)) {
                let ident = "";
                while (this.pos < this.code.length && (this.isAlpha(this.peek()) || this.isDigit(this.peek()))) {
                    ident += this.peek();
                    this.advance();
                }
                tokens.push({
                    type: TokenType.Identifier,
                    value: ident,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: ident.length
                });
                continue;
            }

            // 7. Numbers
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

            // 8. Punctuation & Operators
            const multiOps = ['==', '!=', '>=', '<='];
            let matchedOp = false;
            for (const op of multiOps) {
                if (this.code.startsWith(op, this.pos)) {
                    tokens.push({
                        type: TokenType.Operator,
                        value: op,
                        line: startLine,
                        column: startCol,
                        offset: startOffset,
                        length: 2
                    });
                    this.advance(2);
                    matchedOp = true;
                    break;
                }
            }
            if (matchedOp) continue;

            const singleOps = ['=', '+', '-', '*', '/', '>', '<', '!'];
            if (singleOps.includes(char)) {
                tokens.push({
                    type: TokenType.Operator,
                    value: char,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: 1
                });
                this.advance();
                continue;
            }

            const punct = ['{', '}', '(', ')', '[', ']', ';', ',', '.'];
            if (punct.includes(char)) {
                tokens.push({
                    type: TokenType.Punctuation,
                    value: char,
                    line: startLine,
                    column: startCol,
                    offset: startOffset,
                    length: 1
                });
                this.advance();
                continue;
            }

            // Unrecognized character
            console.warn(`[Tokenizer] Skipping unrecognized character: ${char} at line ${this.line}, col ${this.column}`);
            this.advance();
        }

        tokens.push({
            type: TokenType.EOF,
            value: "EOF",
            line: this.line,
            column: this.column,
            offset: this.pos,
            length: 0
        });

        return tokens;
    }
}
