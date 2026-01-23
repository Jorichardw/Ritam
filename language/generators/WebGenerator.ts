import { TargetGenerator } from './TargetGenerator';
import {
    Program, ASTNode, UIView, Expression, ComponentDeclaration,
    FunctionDeclaration, IfStatement, WhileStatement, ForStatement,
    ReturnStatement, ArrayLiteral, MatchExpression, AssignmentStatement, CallExpression,
    ImportDeclaration, ExportDeclaration, VarDeclaration, TryCatchStatement, ThrowStatement,
    AwaitExpression, MemberExpression, AttributeStatement
} from '../core/AST';
import { RitamRuntimeSource } from '../runtime/RitamRuntime';
import { LanguageDef } from '../core/LanguageManager';

export class WebGenerator implements TargetGenerator {
    private langDef: LanguageDef;
    private keywordReverseMap: Map<string, string>;
    private builtinReverseMap: Map<string, string>;

    constructor(langDef: LanguageDef) {
        this.langDef = langDef;
        this.keywordReverseMap = new Map();
        this.builtinReverseMap = new Map();

        Object.entries(langDef.keywords).forEach(([univ, native]) => {
            this.keywordReverseMap.set(native, univ);
        });

        if (langDef.builtins) {
            Object.entries(langDef.builtins).forEach(([univ, native]) => {
                this.builtinReverseMap.set(native, univ);
            });
        }
    }

    generate(ast: Program, filename: string = "web.rvx"): string {
        const body = ast.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
        const msgsJson = JSON.stringify(this.langDef.messages);

        return `
/* Ritam Sovereign Web Runtime */
${RitamRuntimeSource}

/* Initialize Runtime Localization */
const _msgs = ${msgsJson};

/* Tailwind Support */
if (typeof document !== 'undefined') {
    const s = document.createElement('script');
    s.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(s);
}

/* Generated App Code */
try {
    _rt.pushFrame("web_root", "${filename}", ${ast.line || 1});
    ${body}
    _rt.popFrame();
} catch (e) {
    _rt.panic(e);
}
`;
    }

    private visit(node: ASTNode, filename: string): string {
        switch (node.type) {
            case 'VarDeclaration':
                const v = node as VarDeclaration;
                const kw = v.isMutable ? 'let' : 'const';
                return `${kw} ${v.name} = _rt.signal(${this.visitExpr(v.value)});`;

            case 'AssignmentStatement':
                const a = node as AssignmentStatement;
                return `${a.name}.value = ${this.visitExpr(a.value)};`;

            case 'PrintStatement':
                const p = node as any;
                return `_rt.effect(() => { _std.print(${this.visitExpr(p.expression)}); });`;

            case 'FunctionDeclaration':
                const func = node as FunctionDeclaration;
                const params = func.params.map(p => p.name).join(', ');
                const funcBody = func.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                const asyncPrefix = func.isAsync ? 'async ' : '';
                return `${asyncPrefix}function ${func.name}(${params}) {\n    _rt.pushFrame("${func.name}", "${filename}", ${func.line || 0});\n    try {\n        ${funcBody}\n    } finally {\n        _rt.popFrame();\n    }\n}`;

            case 'IfStatement':
                const ifStmt = node as IfStatement;
                const thenStats = ifStmt.thenBranch.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                let out = `if (${this.visitExpr(ifStmt.condition)}) {\n${thenStats}\n}`;
                if (ifStmt.elseBranch) {
                    const elseStats = ifStmt.elseBranch.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                    out += ` else {\n${elseStats}\n}`;
                }
                return out;

            case 'WhileStatement':
                const w = node as WhileStatement;
                const wBody = w.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                return `while (${this.visitExpr(w.condition)}) {\n${wBody}\n}`;

            case 'ForStatement':
                const f = node as ForStatement;
                const fBody = f.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                return `for (const ${f.iterator} of ${this.visitExpr(f.iterable)}) {\n${fBody}\n}`;

            case 'ReturnStatement':
                const r = node as ReturnStatement;
                return r.value ? `return ${this.visitExpr(r.value)};` : `return;`;

            case 'ImportDeclaration':
                const imp = node as ImportDeclaration;
                const specifiers = imp.specifiers.join(', ');
                return `import { ${specifiers} } from "${imp.source}";`;

            case 'ExportDeclaration':
                const exp = node as ExportDeclaration;
                const inner = this.visit(exp.declaration, filename);
                return `export ${inner}`;

            case 'TryCatchStatement':
                const tc = node as TryCatchStatement;
                const tryB = tc.tryBlock.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                const catchB = tc.catchBlock.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                return `try {\n${tryB}\n} catch (${tc.errorVar}) {\n${catchB}\n}`;

            case 'ThrowStatement':
                const th = node as ThrowStatement;
                return `throw ${this.visitExpr(th.argument)};`;

            case 'MatchExpression':
                const m = node as MatchExpression;
                const targetVar = `_match_target_${Math.floor(Math.random() * 10000)}`;
                let matchOut = `{\nconst ${targetVar} = ${this.visitExpr(m.target)};\n`;
                m.cases.forEach((c: any, idx: number) => {
                    const pattern = this.visitExpr(c.pattern);
                    const caseBody = c.body.map((cn: ASTNode) => this.visit(cn, filename)).join('\n');
                    const k = idx === 0 ? 'if' : 'else if';
                    matchOut += `${k} (${targetVar} === ${pattern}) {\n${caseBody}\n}\n`;
                });
                matchOut += `}\n`;
                return matchOut;

            case 'ComponentDeclaration':
                const comp = node as ComponentDeclaration;
                const compBody = comp.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                return `function ${comp.name}() {\n${compBody}\n}\n${comp.name}();`;

            case 'UIView':
                return this.visitUIView(node as UIView, filename);

            case 'EventStatement':
                const ev = node as any;
                return `// Event: ${ev.eventName} handled by children logic`;

            case 'Expression':
                return `${this.visitExpr(node as Expression)};`;

            default:
                return `// Unhandled node type: ${node.type}`;
        }
    }

    private visitUIView(node: UIView, filename: string): string {
        const map: Record<string, string> = {
            'Container': 'div',
            'Text': 'span',
            'Button': 'button',
            'Input': 'input'
        };

        const tagName = (node as any).tagName || map[node.componentType] || 'div';

        const props: Record<string, any> = { ...node.props };
        const childrenNodes: ASTNode[] = [];

        node.children.forEach(c => {
            if (c.type === 'EventStatement') {
                const ev = c as any;
                props[ev.eventName] = { type: 'Expression', kind: 'Identifier', name: ev.action };
            } else if (c.type === 'AttributeStatement') {
                const at = c as any;
                props[at.name] = at.value;
            } else {
                childrenNodes.push(c);
            }
        });

        // Wrap children in arrow functions for reactivity
        const children = childrenNodes.map((c: ASTNode) => {
            if (c.type === 'Expression') {
                return `() => ${this.visitExpr(c as Expression)}`;
            } else if (c.type === 'UIView') {
                return `() => ${this.visitUIView(c as UIView, filename)}`;
            }
            return `() => ${this.visit(c, filename)}`;
        }).join(', ');

        // Wrap props in arrow functions for reactivity
        const propsObj = Object.entries(props)
            .map(([k, v]) => {
                if (k.startsWith('on')) {
                    return `"${k}": ${this.visitExpr(v as any)}`;
                }
                return `"${k}": () => ${this.visitExpr(v as any)}`;
            })
            .join(', ');

        return `_rt.createElement("${tagName}", {${propsObj}}, [${children}])`;
    }

    private visitExpr(expr: Expression | undefined): string {
        if (!expr) return '';
        if (expr.kind === 'Literal') return JSON.stringify(expr.value);
        if (expr.kind === 'Identifier') {
            const name = expr.universalName || expr.name;
            if (name.startsWith('#')) {
                return '_' + name.slice(1);
            }
            return expr.name;
        }
        if (expr.kind === 'Binary') {
            return `(${this.getExprValue(expr.left)} ${expr.operator} ${this.getExprValue(expr.right)})`;
        }
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
            return `(await ${this.visitExpr(aw.argument)})`;
        }
        return 'null';
    }

    private getExprValue(expr: Expression): string {
        const val = this.visitExpr(expr);
        if (expr.kind === 'Identifier' && !expr.name.startsWith('#')) return `${val}.value`;
        return val;
    }
}
