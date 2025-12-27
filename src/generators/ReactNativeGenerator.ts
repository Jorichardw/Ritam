import { TargetGenerator } from './TargetGenerator';
import {
    Program, ASTNode, UIView, Expression, ComponentDeclaration,
    FunctionDeclaration, IfStatement, WhileStatement, ForStatement,
    ReturnStatement, ArrayLiteral, AssignmentStatement, CallExpression,
    ImportDeclaration, ExportDeclaration, Exportable, AwaitExpression, MemberExpression
} from '../core/AST';

export class ReactNativeGenerator implements TargetGenerator {
    generate(ast: Program): string {
        const bodyContent = this.extractMainBody(ast);
        return `
/* Ritam React Native Output */
import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function App() {
    ${bodyContent.vars}

    return (
        <ScrollView contentContainerStyle={styles.container}>
            ${bodyContent.ui}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    }
});
`;
    }

    private extractMainBody(ast: Program): { vars: string, ui: string } {
        let vars = "";
        let ui = "";
        const nodesToProcess = ast.body;

        for (const node of nodesToProcess) {
            if (node.type === 'ComponentDeclaration') {
                const c = node as ComponentDeclaration;
                const inner = this.processBlock(c.body);
                vars += inner.vars;
                ui += inner.ui;
            } else {
                const res = this.visit(node);
                if (res.type === 'var' || res.type === 'none') vars += res.code + '\n';
                if (res.type === 'ui') ui += res.code + '\n';
            }
        }
        return { vars, ui };
    }

    private processBlock(nodes: ASTNode[]) {
        let vars = "";
        let ui = "";
        for (const node of nodes) {
            const res = this.visit(node);
            if (res.type === 'var' || res.type === 'none') vars += res.code + '\n';
            if (res.type === 'ui') ui += res.code + '\n';
        }
        return { vars, ui };
    }

    private visit(node: ASTNode): { type: 'var' | 'ui' | 'none', code: string } {
        switch (node.type) {
            case 'VarDeclaration':
                const v = node as any;
                const initVal = this.visitExpr(v.value);
                return { type: 'var', code: `const [${v.name}, set_${v.name}] = useState(${initVal});` };

            case 'AssignmentStatement':
                const a = node as AssignmentStatement;
                return { type: 'var', code: `set_${a.name}(${this.visitExpr(a.value)});` };

            case 'PrintStatement':
                const p = node as any;
                return { type: 'var', code: `console.log(${this.visitExpr(p.expression)});` };

            case 'FunctionDeclaration':
                const func = node as FunctionDeclaration;
                const funcParams = func.params.map(p => p.name).join(', ');
                const funcBody = this.processBlock(func.body).vars;
                return { type: 'var', code: `function ${func.name}(${funcParams}) {\n${funcBody}\n}` };

            case 'IfStatement':
                const ifStmt = node as IfStatement;
                const thenStats = this.processBlock(ifStmt.thenBranch).vars;
                let ifOut = `if (${this.visitExpr(ifStmt.condition)}) {\n${thenStats}\n}`;
                if (ifStmt.elseBranch) {
                    const elseStats = this.processBlock(ifStmt.elseBranch).vars;
                    ifOut += ` else {\n${elseStats}\n}`;
                }
                return { type: 'var', code: ifOut };

            case 'WhileStatement':
                const w = node as WhileStatement;
                const wBody = this.processBlock(w.body).vars;
                return { type: 'var', code: `while (${this.visitExpr(w.condition)}) {\n${wBody}\n}` };

            case 'ForStatement':
                const f = node as ForStatement;
                const fBody = this.processBlock(f.body).vars;
                return { type: 'var', code: `for (const ${f.iterator} of ${this.visitExpr(f.iterable)}) {\n${fBody}\n}` };

            case 'ReturnStatement':
                const r = node as ReturnStatement;
                return { type: 'var', code: r.value ? `return ${this.visitExpr(r.value)};` : `return;` };

            case 'ImportDeclaration':
                const imp = node as ImportDeclaration;
                const specifiers = imp.specifiers.join(', ');
                return { type: 'none', code: `import { ${specifiers} } from "${imp.source}";` };

            case 'ExportDeclaration':
                const exp = node as ExportDeclaration;
                const expInner = this.visit(exp.declaration);
                return { type: expInner.type, code: `export ${expInner.code}` };

            case 'UIView':
                return { type: 'ui', code: this.visitUIView(node as UIView) };

            case 'EventStatement':
                return { type: 'none', code: '' };

            case 'Expression':
                return { type: 'var', code: `${this.visitExpr(node as Expression)};` };

            default:
                return { type: 'none', code: '' };
        }
    }

    private visitUIView(node: UIView): string {
        const map: Record<string, string> = {
            'Container': 'View',
            'Text': 'Text',
            'Button': 'Button',
            'Input': 'TextInput'
        };

        const tagName = map[node.componentType] || 'View';
        const children = node.children.map(c => {
            const res = this.visit(c);
            return res.type === 'ui' ? res.code : `{/* non-ui child */}`;
        }).join('\n');

        if (node.componentType === 'Text' && node.props['text']) {
            const content = this.visitExpr(node.props['text']);
            return `<Text style={styles.text}>{${content}}</Text>`;
        }

        return `<${tagName} style={styles.text}>\n${children}\n</${tagName}>`;
    }

    private visitExpr(expr: Expression | undefined): string {
        if (!expr) return 'null';
        if (expr.kind === 'Literal') return JSON.stringify(expr.value);
        if (expr.kind === 'Identifier') {
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
