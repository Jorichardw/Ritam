import { Token, TokenType } from './Tokenizer';
import {
    Program, ASTNode, VarDeclaration, PrintStatement, ComponentDeclaration,
    UIView, Expression, Literal, Identifier, FunctionDeclaration, StructDeclaration,
    EnumDeclaration, IfStatement, WhileStatement, MatchExpression, AssignmentStatement, CallExpression,
    ForStatement, ReturnStatement, ArrayLiteral, ImportDeclaration, ExportDeclaration, Exportable,
    TryCatchStatement, ThrowStatement, AwaitExpression, MemberExpression, AttributeStatement,
    UnaryExpression
} from '../core/AST';
import { ErrorManager } from './ErrorManager';

export class Parser {
    private tokens: Token[];
    private current: number = 0;
    private errorManager: ErrorManager;

    constructor(tokens: Token[], errorManager: ErrorManager) {
        this.tokens = tokens;
        this.errorManager = errorManager;
    }

    public parse(): Program {
        const startToken = this.peek();
        const body: ASTNode[] = [];
        console.log("DEBUG TOKENS:", this.tokens.length);
        while (!this.isAtEnd()) {
            body.push(this.statement());
        }
        return this.attachLoc({ type: 'Program', body }, startToken, this.previous());
    }

    private attachLoc<T extends ASTNode>(node: T, start: Token, end: Token): T {
        node.line = start.line;
        node.column = start.column;
        node.length = (end.offset + end.length) - start.offset;
        return node;
    }

    private statement(): ASTNode {
        const token = this.peek();

        if (token.type === TokenType.Keyword) {
            if (token.universalValue === 'var' || token.universalValue === 'const') return this.varDeclaration();
            if (token.universalValue === 'print') return this.printStatement();
            if (token.universalValue === 'component') return this.componentDeclaration();
            if (token.universalValue === 'render' || token.universalValue === 'tag') return this.renderStatement();
            if (token.universalValue === 'text') return this.textStatement();
            if (token.universalValue === 'function' || token.universalValue === 'async') return this.functionDeclaration();
            if (token.universalValue === 'struct') return this.structDeclaration();
            if (token.universalValue === 'enum') return this.enumDeclaration();
            if (token.universalValue === 'if') return this.ifStatement();
            if (token.universalValue === 'while') return this.whileStatement();
            if (token.universalValue === 'for') return this.forStatement();
            if (token.universalValue === 'return') return this.returnStatement();
            if (token.universalValue === 'import') return this.importDeclaration();
            if (token.universalValue === 'export') return this.exportDeclaration();
            if (token.universalValue === 'try') return this.tryCatchStatement();
            if (token.universalValue === 'throw') return this.throwStatement();
            if (token.universalValue === 'match') return this.matchExpression();
            if (token.universalValue === 'click') return this.clickStatement();
            if (token.universalValue === 'attr') return this.attrStatement();
        }

        if (token.type === TokenType.Identifier) {
            const next = this.tokens[this.current + 1];
            if (next && next.type === TokenType.Operator && next.value === '=') {
                return this.assignment();
            }
        }

        const expr = this.expression();
        return expr;
    }

    private assignment(): AssignmentStatement {
        const start = this.peek();
        const nameToken = this.consume(TokenType.Identifier, "Expected Identifier");
        this.consume(TokenType.Operator, "=");
        const value = this.expression();
        return this.attachLoc({ type: 'AssignmentStatement', name: nameToken.value, value }, start, this.previous());
    }

    private varDeclaration(): VarDeclaration {
        const start = this.peek();
        const keyword = this.advance();
        const isMutable = keyword.universalValue === 'var';
        const nameToken = this.consume(TokenType.Identifier, "Identifier");

        let typeAnnotation: string | undefined;
        if (this.match(TokenType.Punctuation, ':')) {
            typeAnnotation = this.consume(TokenType.Identifier, "Expected Type Name").value;
        }

        this.consume(TokenType.Operator, "=");
        const value = this.expression();
        return this.attachLoc({ type: 'VarDeclaration', name: nameToken.value, isMutable, value, typeAnnotation }, start, this.previous());
    }

    private printStatement(): PrintStatement {
        this.advance();
        const expr = this.expression();
        return { type: 'PrintStatement', expression: expr };
    }

    private functionDeclaration(): FunctionDeclaration {
        let isAsync = false;
        if (this.peek().universalValue === 'async') {
            this.advance();
            isAsync = true;
        }
        if (this.peek().universalValue === 'function') {
            this.advance();
        } else {
            this.consume(TokenType.Keyword, "Expected 'function' keyword");
        }
        const nameToken = this.consume(TokenType.Identifier, "Expected Name");

        let typeParameters: any[] | undefined;
        if (this.match(TokenType.Operator, '<')) {
            typeParameters = this.parseTypeParameters();
        }

        this.consume(TokenType.Punctuation, "(");
        const params: { name: string, typeAnnotation?: string }[] = [];
        if (!this.check(TokenType.Punctuation, ')')) {
            do {
                const paramName = this.consume(TokenType.Identifier, "Expected Param Name").value;
                let paramType: string | undefined;
                if (this.match(TokenType.Punctuation, ':')) {
                    paramType = this.consume(TokenType.Identifier, "Expected Type Name").value;
                }
                params.push({ name: paramName, typeAnnotation: paramType });
            } while (this.match(TokenType.Punctuation, ','));
        }
        this.consume(TokenType.Punctuation, ")");

        // Optional Return Type: செயல் கூட்டல்(அ, ஆ): முழு எண் { ... }
        let returnType: string | undefined;
        if (this.match(TokenType.Punctuation, ':')) {
            returnType = this.consume(TokenType.Identifier, "Expected Type Name").value;
        }

        this.consume(TokenType.Punctuation, "{");
        const body: ASTNode[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            body.push(this.statement());
        }
        this.consume(TokenType.Punctuation, "}");
        return { type: 'FunctionDeclaration', name: nameToken.value, typeParameters, params, body, isAsync, returnType };
    }

    private parseTypeParameters(): any[] {
        const params: any[] = [];
        do {
            const name = this.consume(TokenType.Identifier, "Expected Type Parameter Name").value;
            let constraint: string | undefined;
            if (this.match(TokenType.Punctuation, ':')) {
                constraint = this.consume(TokenType.Identifier, "Expected Constraint").value;
            }
            params.push({ name, constraint });
        } while (this.match(TokenType.Punctuation, ','));
        this.consume(TokenType.Operator, '>');
        return params;
    }

    private structDeclaration(): StructDeclaration {
        this.advance();
        const nameToken = this.consume(TokenType.Identifier, "Expected Struct Name");

        let typeParameters: any[] | undefined;
        if (this.match(TokenType.Operator, '<')) {
            typeParameters = this.parseTypeParameters();
        }

        this.consume(TokenType.Punctuation, "{");
        const fields: { name: string, typeAnnotation: string }[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            const fieldName = this.consume(TokenType.Identifier, "Expected Field Name").value;
            // Assume type is optional or handled simply for now.
            fields.push({ name: fieldName, typeAnnotation: 'any' });
        }
        this.consume(TokenType.Punctuation, "}");
        return { type: 'StructDeclaration', name: nameToken.value, typeParameters, fields };
    }

    private enumDeclaration(): EnumDeclaration {
        this.advance();
        const nameToken = this.consume(TokenType.Identifier, "Expected Enum Name");
        this.consume(TokenType.Punctuation, "{");
        const cases: string[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            const caseName = this.consume(TokenType.Identifier, "Expected Case Name").value;
            cases.push(caseName);
        }
        this.consume(TokenType.Punctuation, "}");
        return { type: 'EnumDeclaration', name: nameToken.value, cases };
    }

    private ifStatement(): IfStatement {
        const start = this.peek();
        this.advance();
        const condition = this.expression();
        this.consume(TokenType.Punctuation, "{");
        const thenBranch: ASTNode[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            thenBranch.push(this.statement());
        }
        this.consume(TokenType.Punctuation, "}");

        let elseBranch: ASTNode[] | undefined = undefined;
        // Check for 'else' or 'else_if'
        const next = this.peek();
        if (next.type === TokenType.Keyword) {
            if (next.universalValue === 'else_if') {
                // Return a single-item array containing the nested if statement
                elseBranch = [this.ifStatement()];
            } else if (next.universalValue === 'else') {
                this.advance();
                this.consume(TokenType.Punctuation, "{");
                elseBranch = [];
                while (!this.check(TokenType.Punctuation, '}')) {
                    elseBranch.push(this.statement());
                }
                this.consume(TokenType.Punctuation, "}");
            }
        }

        return this.attachLoc({ type: 'IfStatement', condition, thenBranch, elseBranch }, start, this.previous());
    }

    private whileStatement(): WhileStatement {
        const start = this.peek();
        this.advance();
        const condition = this.expression();
        this.consume(TokenType.Punctuation, "{");
        const body: ASTNode[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            body.push(this.statement());
        }
        this.consume(TokenType.Punctuation, "}");
        return this.attachLoc({ type: 'WhileStatement', condition, body }, start, this.previous());
    }

    private forStatement(): ForStatement {
        this.advance();
        const iterator = this.consume(TokenType.Identifier, "Expected Iterator").value;
        // Check for 'in' keyword - now properly checking as a Keyword with universalValue
        const current = this.peek();
        if ((current.type === TokenType.Keyword && current.universalValue === 'in') ||
            (current.type === TokenType.Identifier && current.value === 'in')) {
            this.advance();
        }
        const iterable = this.expression();
        this.consume(TokenType.Punctuation, "{");
        const body: ASTNode[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            body.push(this.statement());
        }
        this.consume(TokenType.Punctuation, "}");
        return { type: 'ForStatement', iterator, iterable, body };
    }

    private returnStatement(): ReturnStatement {
        const start = this.peek();
        this.advance();
        let value: Expression | undefined;
        if (!this.check(TokenType.Punctuation, '}') && !this.check(TokenType.Punctuation, ';')) {
            value = this.expression();
        }
        return this.attachLoc({ type: 'ReturnStatement', value }, start, this.previous());
    }

    private importDeclaration(): ImportDeclaration {
        this.advance(); // import
        this.consume(TokenType.Punctuation, "{");
        const specifiers: string[] = [];
        if (!this.check(TokenType.Punctuation, '}')) {
            do {
                specifiers.push(this.consume(TokenType.Identifier, "Expected Identifier").value);
            } while (this.match(TokenType.Punctuation, ','));
        }
        this.consume(TokenType.Punctuation, "}");

        // Check for 'from'
        const next = this.peek();
        if (next.type === TokenType.Keyword && next.universalValue === 'from') {
            this.advance();
        }

        const source = this.consume(TokenType.String, "Expected Source String").value;
        return { type: 'ImportDeclaration', specifiers, source };
    }

    private exportDeclaration(): ExportDeclaration {
        this.advance(); // export
        const decl = this.statement();
        const exportableTypes = ['VarDeclaration', 'FunctionDeclaration', 'StructDeclaration', 'EnumDeclaration', 'ComponentDeclaration'];
        if (!exportableTypes.includes(decl.type)) {
            throw new Error(`Cannot export ${decl.type}`);
        }
        return { type: 'ExportDeclaration', declaration: decl as Exportable };
    }

    private matchExpression(): MatchExpression {
        const start = this.peek();
        this.advance();
        const target = this.expression();
        this.consume(TokenType.Punctuation, "{");
        const cases: { pattern: Expression, body: ASTNode[] }[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            const pattern = this.expression();
            this.consume(TokenType.Punctuation, "{");
            const body: ASTNode[] = [];
            while (!this.check(TokenType.Punctuation, '}')) {
                body.push(this.statement());
            }
            this.consume(TokenType.Punctuation, "}");
            cases.push({ pattern, body });
        }
        this.consume(TokenType.Punctuation, "}");
        return this.attachLoc({ type: 'MatchExpression', target, cases, isExhaustive: true }, start, this.previous());
    }

    private tryCatchStatement(): TryCatchStatement {
        this.advance(); // try
        this.consume(TokenType.Punctuation, "{");
        const tryBlock: ASTNode[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            tryBlock.push(this.statement());
        }
        this.consume(TokenType.Punctuation, "}");

        if (this.peek().universalValue === 'catch') {
            this.advance();
        } else {
            this.consume(TokenType.Keyword, "Expected 'catch' keyword");
        }
        this.consume(TokenType.Punctuation, "(");
        const errorVar = this.consume(TokenType.Identifier, "Expected error variable name").value;
        this.consume(TokenType.Punctuation, ")");

        this.consume(TokenType.Punctuation, "{");
        const catchBlock: ASTNode[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            catchBlock.push(this.statement());
        }
        this.consume(TokenType.Punctuation, "}");

        return { type: 'TryCatchStatement', tryBlock, catchBlock, errorVar };
    }

    private throwStatement(): ThrowStatement {
        this.advance(); // throw
        const argument = this.expression();
        return { type: 'ThrowStatement', argument };
    }

    private componentDeclaration(): ComponentDeclaration {
        this.advance();
        const nameToken = this.consume(TokenType.Identifier, "Expected Name");
        this.consume(TokenType.Punctuation, "Expected {");

        const body: ASTNode[] = [];
        while (!this.check(TokenType.Punctuation, '}')) {
            body.push(this.statement());
        }
        this.consume(TokenType.Punctuation, "}");
        return { type: 'ComponentDeclaration', name: nameToken.value, body };
    }

    private clickStatement(): ASTNode {
        const start = this.peek();
        this.advance(); // click
        const action = this.consume(TokenType.Identifier, "Expected handler function name").value;
        return this.attachLoc({ type: 'EventStatement', eventName: 'onclick', action } as any, start, this.previous());
    }

    private attrStatement(): ASTNode {
        const start = this.peek();
        this.advance(); // attr
        const nameToken = this.consume(TokenType.String, "Expected attribute name");
        const value = this.expression();
        return this.attachLoc({ type: 'AttributeStatement', name: nameToken.value, value } as any, start, this.previous());
    }

    private textStatement(): ASTNode {
        const start = this.peek();
        this.advance(); // text
        const value = this.expression();
        return this.attachLoc({ type: 'AttributeStatement', name: 'text', value } as any, start, this.previous());
    }

    private renderStatement(): UIView {
        const start = this.peek();
        this.advance(); // render or tag

        let tag = "div";
        if (this.check(TokenType.String)) {
            tag = this.advance().value;
        }

        let type: UIView['componentType'] = 'Container';
        if (['h1', 'p', 'span', 'text', 'Text'].includes(tag)) type = 'Text';
        if (['button', 'Button'].includes(tag)) type = 'Button';
        if (['input', 'Input', 'TextField'].includes(tag)) type = 'Input';
        if (['VStack', 'HStack', 'Column', 'Row'].includes(tag)) type = 'Container';

        let props: Record<string, Expression> = {};
        const children: ASTNode[] = [];

        // 1. Optional shorthand content: render "h1" "Hello"
        if (!this.check(TokenType.Punctuation, '{')) {
            props['text'] = this.expression();
        }

        // 2. Nested Block { ... }
        if (this.check(TokenType.Punctuation, '{')) {
            this.advance(); // consume {
            while (!this.check(TokenType.Punctuation, '}') && !this.isAtEnd()) {
                const child = this.statement();
                if (child.type === 'AttributeStatement') {
                    const attr = child as any;
                    props[attr.name] = attr.value;
                } else if (child.type === 'EventStatement') {
                    const ev = child as any;
                    props[ev.eventName.replace('on', '')] = { type: 'Expression', kind: 'Identifier', name: ev.action } as any;
                } else {
                    children.push(child);
                }
            }
            this.consume(TokenType.Punctuation, '}');
        }

        return this.attachLoc({
            type: 'UIView',
            componentType: type,
            tagName: tag,
            props,
            children
        }, start, this.previous());
    }

    // Expression Parsing (Recursive Descent)
    private expression(): Expression {
        return this.logicalOr();
    }

    private logicalOr(): Expression {
        let expr = this.logicalAnd();
        while (this.match(TokenType.Operator, '||')) {
            const operator = this.previous().value;
            const right = this.logicalAnd();
            expr = { type: 'Expression', kind: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    private logicalAnd(): Expression {
        let expr = this.equality();
        while (this.match(TokenType.Operator, '&&')) {
            const operator = this.previous().value;
            const right = this.equality();
            expr = { type: 'Expression', kind: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    private equality(): Expression {
        let expr = this.comparison();
        while (this.match(TokenType.Operator, '==', '!=')) {
            const operator = this.previous().value;
            const right = this.comparison();
            expr = { type: 'Expression', kind: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    private comparison(): Expression {
        let expr = this.term();
        while (this.match(TokenType.Operator, '>', '<', '>=', '<=')) {
            const operator = this.previous().value;
            const right = this.term();
            expr = { type: 'Expression', kind: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    private term(): Expression {
        let expr = this.factor();
        while (this.match(TokenType.Operator, '-', '+')) {
            const operator = this.previous().value;
            const right = this.factor();
            expr = { type: 'Expression', kind: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    private factor(): Expression {
        let expr = this.unary();
        while (this.match(TokenType.Operator, '/', '*')) {
            const operator = this.previous().value;
            const right = this.unary();
            expr = { type: 'Expression', kind: 'Binary', left: expr, operator, right };
        }
        return expr;
    }

    private unary(): Expression {
        if (this.match(TokenType.Operator, '-', '!')) {
            const operator = this.previous().value;
            const start = this.previous();
            const right = this.unary();
            return this.attachLoc({ type: 'Expression', kind: 'Unary', operator, right } as UnaryExpression, start, this.previous());
        }
        return this.primary();
    }

    private primary(): Expression {
        const startToken = this.peek();
        let expr = this.basePrimary();

        while (true) {
            if (this.match(TokenType.Punctuation, '.')) {
                const propertyToken = this.consume(TokenType.Identifier, "Expected property name");
                const member: MemberExpression = {
                    type: 'Expression',
                    kind: 'Member',
                    object: expr,
                    property: propertyToken.value
                };
                expr = this.attachLoc(member, startToken, propertyToken);
            } else if (this.match(TokenType.Punctuation, '(')) {
                expr = this.finishCall(expr, startToken);
            } else {
                break;
            }
        }
        return expr;
    }

    private basePrimary(): Expression {
        const token = this.peek();
        if (token.type === TokenType.Number) {
            this.advance();
            return this.attachLoc({ type: 'Expression', kind: 'Literal', value: Number(token.value) }, token, token);
        }
        if (token.type === TokenType.String) {
            this.advance();
            return this.attachLoc({ type: 'Expression', kind: 'Literal', value: token.value }, token, token);
        }
        if (token.type === TokenType.Identifier) {
            this.advance();
            return this.attachLoc({ type: 'Expression', kind: 'Identifier', name: token.value, universalName: token.universalValue }, token, token);
        }
        if (this.match(TokenType.Punctuation, '(')) {
            const expr = this.expression();
            this.consume(TokenType.Punctuation, ')');
            return expr;
        }
        if (this.match(TokenType.Punctuation, '[')) {
            const start = this.previous();
            const elements: Expression[] = [];
            if (!this.check(TokenType.Punctuation, ']')) {
                do {
                    elements.push(this.expression());
                } while (this.match(TokenType.Punctuation, ','));
            }
            this.consume(TokenType.Punctuation, ']');
            return this.attachLoc({ type: 'Expression', kind: 'Array', elements }, start, this.previous());
        }

        const kw = this.peek();
        if (kw.type === TokenType.Keyword) {
            if (kw.universalValue === 'true') {
                this.advance();
                return this.attachLoc({ type: 'Expression', kind: 'Literal', value: true }, kw, kw);
            }
            if (kw.universalValue === 'false') {
                this.advance();
                return this.attachLoc({ type: 'Expression', kind: 'Literal', value: false }, kw, kw);
            }
            if (kw.universalValue === 'null') {
                this.advance();
                return this.attachLoc({ type: 'Expression', kind: 'Literal', value: null }, kw, kw);
            }
            if (kw.universalValue === 'await') {
                this.advance();
                const argument = this.expression();
                return this.attachLoc({ type: 'Expression', kind: 'Await', argument } as AwaitExpression, kw, this.previous());
            }
        }

        const suggestion = this.errorManager.suggest(token.value, this.tokens.filter(t => t.type === TokenType.Keyword).map(t => t.value));
        const extra = suggestion ? ` Did you mean "${suggestion}"?` : "";

        this.errorManager.throw('error_unexpected_token', token.line, token.column, token.value + extra, token.line);
        throw new Error("Unreachable");
    }

    private finishCall(callee: Expression, startToken: Token): CallExpression {
        const args: Expression[] = [];
        if (!this.check(TokenType.Punctuation, ')')) {
            do {
                args.push(this.expression());
            } while (this.match(TokenType.Punctuation, ','));
        }
        this.consume(TokenType.Punctuation, ")");
        return this.attachLoc({ type: 'Expression', kind: 'Call', callee, args }, startToken, this.previous());
    }

    private match(type: TokenType, ...values: string[]): boolean {
        for (const val of values) {
            if (this.check(type, val)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    private previous() { return this.tokens[this.current - 1]; }

    // callExpression is now handled by finishCall and primary loop

    private peek() { return this.tokens[this.current]; }
    private isAtEnd() { return this.peek().type === TokenType.EOF; }
    private advance() { if (!this.isAtEnd()) this.current++; return this.tokens[this.current - 1]; }
    private check(type: TokenType, val?: string) {
        if (this.isAtEnd()) return false;
        const t = this.peek();
        return t.type === type && (!val || t.value === val);
    }
    private consume(type: TokenType, error: string) {
        if (this.check(type)) return this.advance();
        const found = this.peek();
        this.errorManager.throw('error_expected_token', found.line, found.column, error, found.value, found.line);
        throw new Error("Unreachable");
    }
}
