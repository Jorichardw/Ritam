import { TargetGenerator } from './TargetGenerator';
import {
    Program, ASTNode, UIView, Expression, FunctionDeclaration, IfStatement,
    WhileStatement, ForStatement, ReturnStatement, ArrayLiteral, AssignmentStatement, CallExpression,
    ImportDeclaration, ExportDeclaration, AwaitExpression, MemberExpression
} from '../core/AST';

export class MobileGenerator implements TargetGenerator {
    generate(ast: Program): string {
        const body = ast.body.map((n: ASTNode) => this.visit(n)).join('\n');
        return `
// Ritam Generated Swift UI Code
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            ${body}
        }
    }
}
`;
    }

    private visit(node: ASTNode): string {
        switch (node.type) {
            case 'VarDeclaration':
                const v = node as any;
                return `var ${v.name} = ${this.visitExpr(v.value)}`;

            case 'AssignmentStatement':
                const a = node as AssignmentStatement;
                return `${a.name} = ${this.visitExpr(a.value)}`;

            case 'PrintStatement':
                const p = node as any;
                return `print(${this.visitExpr(p.expression)})`;

            case 'FunctionDeclaration':
                const func = node as FunctionDeclaration;
                const params = func.params.map(p => p.name + ": Any").join(', ');
                const funcBody = func.body.map((n: ASTNode) => this.visit(n)).join('\n');
                return `func ${func.name}(${params}) {\n${funcBody}\n}`;

            case 'IfStatement':
                const ifStmt = node as IfStatement;
                const thenStats = ifStmt.thenBranch.map((n: ASTNode) => this.visit(n)).join('\n');
                let out = `if (${this.visitExpr(ifStmt.condition)}) {\n${thenStats}\n}`;
                if (ifStmt.elseBranch) {
                    const elseStats = ifStmt.elseBranch.map((n: ASTNode) => this.visit(n)).join('\n');
                    out += ` else {\n${elseStats}\n}`;
                }
                return out;

            case 'WhileStatement':
                const w = node as WhileStatement;
                const wBody = w.body.map((n: ASTNode) => this.visit(n)).join('\n');
                return `while (${this.visitExpr(w.condition)}) {\n${wBody}\n}`;

            case 'ForStatement':
                const f = node as ForStatement;
                const fBody = f.body.map((n: ASTNode) => this.visit(n)).join('\n');
                return `for ${f.iterator} in ${this.visitExpr(f.iterable)} {\n${fBody}\n}`;

            case 'ReturnStatement':
                const r = node as ReturnStatement;
                return r.value ? `return ${this.visitExpr(r.value)}` : `return`;

            case 'ImportDeclaration':
                const imp = node as ImportDeclaration;
                return `import ${imp.source}`;

            case 'ExportDeclaration':
                const exp = node as ExportDeclaration;
                const inner = this.visit(exp.declaration);
                return `public ${inner}`;

            case 'UIView':
                return this.visitUIView(node as UIView);

            case 'EventStatement':
                return `// Event handled in SwiftUI logic`;

            case 'Expression':
                return `${this.visitExpr(node as Expression)}`;

            default:
                return `// Unhandled node type: ${node.type}`;
        }
    }

    private visitUIView(node: UIView): string {
        const map: Record<string, string> = {
            'Container': 'VStack',
            'Text': 'Text',
            'Button': 'Button',
            'Input': 'TextField'
        };

        const viewName = map[node.componentType] || 'VStack';

        let args = "";
        let content = "";

        if (node.componentType === 'Text') {
            if (node.props['text']) {
                args = `(${this.visitExpr(node.props['text'])})`;
            }
        } else if (node.componentType === 'Button') {
            args = `(action: {})`;
            content = node.children.map((c: ASTNode) => this.visit(c)).join('\n');
        } else {
            content = node.children.map((c: ASTNode) => this.visit(c)).join('\n');
        }

        if (content) {
            return `${viewName}${args} {\n${content}\n}`;
        } else {
            return `${viewName}${args}`;
        }
    }

    private visitExpr(expr: Expression | undefined): string {
        if (!expr) return 'nil';
        if (expr.kind === 'Literal') return JSON.stringify(expr.value);
        if (expr.kind === 'Identifier') {
            if (expr.name.startsWith('#')) {
                return "RitamStd"; // Placeholder for Swift StdLib
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
            return `await ${this.visitExpr((expr as AwaitExpression).argument)}`;
        }
        return 'nil';
    }
}
