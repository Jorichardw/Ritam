import { ASTNode, Program, VarDeclaration, FunctionDeclaration, IfStatement, WhileStatement, ForStatement, ReturnStatement, ImportDeclaration, ExportDeclaration, AssignmentStatement, PrintStatement, Expression, CallExpression, ArrayLiteral, AwaitExpression, MemberExpression, ComponentDeclaration, UIView } from './AST';
import { LanguageDef } from './LanguageManager';

export class Formatter {
    private lang: LanguageDef;
    private indentLevel: number = 0;

    constructor(lang: LanguageDef) {
        this.lang = lang;
    }

    public format(ast: Program): string {
        return ast.body.map(node => this.visit(node)).join('\n');
    }

    private visit(node: ASTNode): string {
        const indent = '    '.repeat(this.indentLevel);

        switch (node.type) {
            case 'VarDeclaration':
                const v = node as VarDeclaration;
                return `${indent}${this.kw(v.isMutable ? 'var' : 'const')} ${v.name} = ${this.visitExpr(v.value)}`;

            case 'FunctionDeclaration':
                const f = node as FunctionDeclaration;
                const params = f.params.map(p => p.name).join(', ');
                let fOut = `${indent}${f.isAsync ? this.kw('async') + ' ' : ''}${this.kw('function')} ${f.name}(${params}) {\n`;
                this.indentLevel++;
                fOut += f.body.map(n => this.visit(n)).join('\n');
                this.indentLevel--;
                fOut += `\n${indent}}`;
                return fOut;

            case 'ImportDeclaration':
                const imp = node as ImportDeclaration;
                const specs = imp.specifiers.join(', ');
                return `${indent}${this.kw('import')} { ${specs} } ${this.kw('from')} "${imp.source}"`;

            case 'ExportDeclaration':
                const exp = node as ExportDeclaration;
                const inner = this.visit(exp.declaration).trim();
                return `${indent}${this.kw('export')} ${inner}`;

            case 'IfStatement':
                const ifS = node as IfStatement;
                let ifOut = `${indent}${this.kw('if')} ${this.visitExpr(ifS.condition)} {\n`;
                this.indentLevel++;
                ifOut += ifS.thenBranch.map(n => this.visit(n)).join('\n');
                this.indentLevel--;
                ifOut += `\n${indent}}`;
                if (ifS.elseBranch) {
                    ifOut += ` ${this.kw('else')} {\n`;
                    this.indentLevel++;
                    ifOut += ifS.elseBranch.map(n => this.visit(n)).join('\n');
                    this.indentLevel--;
                    ifOut += `\n${indent}}`;
                }
                return ifOut;

            case 'WhileStatement':
                const w = node as WhileStatement;
                let wOut = `${indent}${this.kw('while')} ${this.visitExpr(w.condition)} {\n`;
                this.indentLevel++;
                wOut += w.body.map(n => this.visit(n)).join('\n');
                this.indentLevel--;
                wOut += `\n${indent}}`;
                return wOut;

            case 'ForStatement':
                const forS = node as ForStatement;
                let forOut = `${indent}${this.kw('for')} ${forS.iterator} ${this.visitExpr(forS.iterable)} {\n`;
                this.indentLevel++;
                forOut += forS.body.map(n => this.visit(n)).join('\n');
                this.indentLevel--;
                forOut += `\n${indent}}`;
                return forOut;

            case 'ReturnStatement':
                const r = node as ReturnStatement;
                return `${indent}${this.kw('return')}${r.value ? ' ' + this.visitExpr(r.value) : ''}`;

            case 'PrintStatement':
                const p = node as PrintStatement;
                return `${indent}${this.kw('print')} ${this.visitExpr(p.expression)}`;

            case 'AssignmentStatement':
                const a = node as AssignmentStatement;
                return `${indent}${a.name} = ${this.visitExpr(a.value)}`;

            case 'ComponentDeclaration':
                const c = node as ComponentDeclaration;
                let cOut = `${indent}${this.kw('component')} ${c.name} {\n`;
                this.indentLevel++;
                cOut += c.body.map(n => this.visit(n)).join('\n');
                this.indentLevel--;
                cOut += `\n${indent}}`;
                return cOut;

            case 'UIView':
                const ui = node as UIView;
                const uiProps = Object.entries(ui.props).map(([k, v]) => `${this.visitExpr(v)}`).join(' ');
                let uiOut = `${indent}${this.kw('render')} "${ui.componentType.toLowerCase()}" ${uiProps}`;
                if (ui.children.length > 0) {
                    uiOut += ` {\n`;
                    this.indentLevel++;
                    uiOut += ui.children.map(n => this.visit(n)).join('\n');
                    this.indentLevel--;
                    uiOut += `\n${indent}}`;
                }
                return uiOut;

            case 'EventStatement':
                const ev = node as any;
                const evKw = ev.eventName === 'onclick' ? 'click' : ev.eventName;
                return `${indent}${this.kw(evKw)} ${ev.action}`;

            case 'Expression':
                return `${indent}${this.visitExpr(node as Expression)}`;

            default:
                return `${indent}// Missing formatting for ${node.type}`;
        }
    }

    private visitExpr(expr: Expression | undefined): string {
        if (!expr) return '';
        if (expr.kind === 'Literal') return typeof expr.value === 'string' ? `"${expr.value}"` : String(expr.value);
        if (expr.kind === 'Identifier') return expr.name;
        if (expr.kind === 'Binary') return `${this.visitExpr(expr.left)} ${expr.operator} ${this.visitExpr(expr.right)}`;
        if (expr.kind === 'Call') {
            const c = expr as CallExpression;
            const args = c.args.map(a => this.visitExpr(a)).join(', ');
            return `${this.visitExpr(c.callee)}(${args})`;
        }
        if (expr.kind === 'Member') {
            const m = expr as MemberExpression;
            return `${this.visitExpr(m.object)}.${m.property}`;
        }
        if (expr.kind === 'Array') {
            const arr = expr as ArrayLiteral;
            const elements = arr.elements.map(e => this.visitExpr(e)).join(', ');
            return `[${elements}]`;
        }
        if (expr.kind === 'Await') {
            const aw = expr as AwaitExpression;
            return `${this.kw('await')} ${this.visitExpr(aw.argument)}`;
        }
        return 'null';
    }

    private kw(key: string): string {
        return this.lang.keywords[key] || key;
    }
}
