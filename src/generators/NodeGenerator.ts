import { TargetGenerator } from './TargetGenerator';
import {
    Program, ASTNode, Expression, FunctionDeclaration, StructDeclaration,
    EnumDeclaration, IfStatement, WhileStatement, MatchExpression, AssignmentStatement, CallExpression,
    ForStatement, ReturnStatement, ArrayLiteral, ImportDeclaration, ExportDeclaration,
    TryCatchStatement, ThrowStatement, AwaitExpression, VarDeclaration, ComponentDeclaration,
    MemberExpression
} from '../core/AST';
import { RitamRuntimeSource } from '../runtime/RitamRuntime';

export class NodeGenerator implements TargetGenerator {
    generate(ast: Program, filename: string = "main.rvx"): string {
        const body = ast.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
        return `
/* Ritam Sovereign Runtime Output (Node.js) */
const process = require('process');
const fs = require('fs');

${RitamRuntimeSource}

/* Generated Logic */
(async () => {
    try {
        _rt.pushFrame("main", "${filename}", ${ast.line || 1});
        ${body}
        _rt.popFrame();
    } catch (e) {
        _rt.panic(e);
        process.exit(1);
    }
})();
`;
    }

    private visit(node: ASTNode, filename: string): string {
        switch (node.type) {
            case 'VarDeclaration':
                const v = node as VarDeclaration;
                const kw = v.isMutable ? 'let' : 'const';
                return `${kw} ${v.name} = ${this.visitExpr(v.value)};`;

            case 'AssignmentStatement':
                const a = node as AssignmentStatement;
                return `${a.name} = ${this.visitExpr(a.value)};`;

            case 'PrintStatement':
                const p = node as any;
                return `_std.print(${this.visitExpr(p.expression)});`;

            case 'FunctionDeclaration':
                const func = node as FunctionDeclaration;
                const params = func.params.map(p => p.name).join(', ');
                const funcBody = func.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
                const asyncPrefix = func.isAsync ? 'async ' : '';
                return `${asyncPrefix}function ${func.name}(${params}) {\n    _rt.pushFrame("${func.name}", "${filename}", ${func.line || 0});\n    try {\n        ${funcBody}\n    } finally {\n        _rt.popFrame();\n    }\n}`;

            case 'StructDeclaration':
                const s = node as StructDeclaration;
                const fieldArgs = s.fields.map((f: any) => f.name).join(', ');
                const fieldAssigns = s.fields.map((f: any) => `${f.name}: ${f.name}`).join(', ');
                return `function ${s.name}(${fieldArgs}) { return { __type: "${s.name}", ${fieldAssigns} }; }`;

            case 'EnumDeclaration':
                const e = node as EnumDeclaration;
                const enumObj = e.cases.map((c: string, i: number) => `${c}: ${i}`).join(',\n    ');
                return `const ${e.name} = {\n    ${enumObj}\n};`;

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
                return `const { ${specifiers} } = require("${imp.source}");`;

            case 'ExportDeclaration':
                const exp = node as ExportDeclaration;
                const expInner = this.visit(exp.declaration, filename);
                const expName = (exp.declaration as any).name;
                return `${expInner}\nexports.${expName} = ${expName};`;

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
                    const caseBody = c.body.map((n: ASTNode) => this.visit(n, filename)).join('\n');
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
                return `// UI Component ignored in Backend target`;

            case 'EventStatement':
                const ev = node as any;
                return `// Event: ${ev.eventName} handled by ${ev.action}`;

            case 'Expression':
                return `${this.visitExpr(node as Expression)};`;

            default:
                return `// Unhandled node type: ${node.type}`;
        }
    }

    private visitExpr(expr: Expression | undefined): string {
        if (!expr) return '';
        if (expr.kind === 'Literal') return typeof expr.value === 'string' ? `"${expr.value}"` : String(expr.value);
        if (expr.kind === 'Identifier') {
            // Check for sovereign identifier (#) and map to _ in JS
            if (expr.name.startsWith('#')) {
                return '_' + expr.name.slice(1);
            }
            return expr.name;
        }
        if (expr.kind === 'Binary') return `(${this.visitExpr(expr.left)} ${expr.operator} ${this.visitExpr(expr.right)})`;
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
}
