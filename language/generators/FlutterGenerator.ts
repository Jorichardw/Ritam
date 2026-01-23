import { TargetGenerator } from './TargetGenerator';
import {
  Program, ASTNode, UIView, Expression, FunctionDeclaration, IfStatement,
  WhileStatement, ForStatement, ReturnStatement, ArrayLiteral, AssignmentStatement, CallExpression,
  ImportDeclaration, ExportDeclaration, AwaitExpression, MemberExpression, ComponentDeclaration,
  StructDeclaration
} from '../core/AST';

/**
 * Flutter/Dart Code Generator
 * 
 * Generates Flutter applications from Ritam source code.
 * Supports cross-platform: iOS, Android, Web, macOS, Windows, Linux
 */
export class FlutterGenerator implements TargetGenerator {
  private structs: Map<string, StructDeclaration> = new Map();

  generate(ast: Program): string {
    // Reset state
    this.structs = new Map();

    // First pass: collect structs
    for (const node of ast.body) {
      if (node.type === 'StructDeclaration') {
        const s = node as StructDeclaration;
        this.structs.set(s.name, s);
      }
    }

    // Generate all code
    const body = ast.body.map((n: ASTNode) => this.visit(n)).join('\n');

    return `// Ritam Generated Flutter/Dart Code
// Cross-platform: iOS, Android, Web, macOS, Windows, Linux

import 'package:flutter/material.dart';

void main() {
  runApp(const RitamApp());
}

/// The main Ritam application widget
class RitamApp extends StatelessWidget {
  const RitamApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ritam Flutter App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      home: const MainView(),
    );
  }
}

${body}
`;
  }

  private visit(node: ASTNode): string {
    switch (node.type) {
      case 'StructDeclaration':
        return this.generateStruct(node as StructDeclaration);

      case 'ComponentDeclaration':
        return this.generateComponent(node as ComponentDeclaration);

      case 'VarDeclaration':
        const v = node as any;
        return `var ${v.name} = ${this.visitExpr(v.value)};`;

      case 'AssignmentStatement':
        const a = node as AssignmentStatement;
        return `${a.name} = ${this.visitExpr(a.value)};`;

      case 'PrintStatement':
        const p = node as any;
        return `print(${this.visitExpr(p.expression)});`;

      case 'FunctionDeclaration':
        const func = node as FunctionDeclaration;
        const params = func.params.map(param => `dynamic ${param.name}`).join(', ');
        const isAsync = func.isAsync;
        const returnType = isAsync ? 'Future<dynamic>' : 'dynamic';
        const asyncKeyword = isAsync ? 'async ' : '';
        const funcBody = func.body.map((n: ASTNode) => this.visit(n)).join('\n  ');
        return `${returnType} ${func.name}(${params}) ${asyncKeyword}{
  ${funcBody}
}`;

      case 'IfStatement':
        const ifStmt = node as IfStatement;
        const thenStats = ifStmt.thenBranch.map((n: ASTNode) => this.visit(n)).join('\n    ');
        let out = `if (${this.visitExpr(ifStmt.condition)}) {\n    ${thenStats}\n  }`;
        if (ifStmt.elseBranch) {
          const elseStats = ifStmt.elseBranch.map((n: ASTNode) => this.visit(n)).join('\n    ');
          out += ` else {\n    ${elseStats}\n  }`;
        }
        return out;

      case 'WhileStatement':
        const w = node as WhileStatement;
        const wBody = w.body.map((n: ASTNode) => this.visit(n)).join('\n    ');
        return `while (${this.visitExpr(w.condition)}) {\n    ${wBody}\n  }`;

      case 'ForStatement':
        const f = node as ForStatement;
        const fBody = f.body.map((n: ASTNode) => this.visit(n)).join('\n    ');
        return `for (var ${f.iterator} in ${this.visitExpr(f.iterable)}) {\n    ${fBody}\n  }`;

      case 'ReturnStatement':
        const r = node as ReturnStatement;
        return r.value ? `return ${this.visitExpr(r.value)};` : `return;`;

      case 'ImportDeclaration':
        const imp = node as ImportDeclaration;
        return `import '${imp.source}';`;

      case 'ExportDeclaration':
        const exp = node as ExportDeclaration;
        return this.visit(exp.declaration);

      case 'UIView':
        return this.visitUIView(node as UIView);

      case 'EventStatement':
        return `// Event handled in Flutter callbacks`;

      case 'Expression':
        return `${this.visitExpr(node as Expression)};`;

      default:
        return `// Unhandled node type: ${node.type}`;
    }
  }

  private generateStruct(struct: StructDeclaration): string {
    const fieldNames = struct.fields.map(f => f.name);
    const fields = fieldNames.map(f => `  final dynamic ${f};`).join('\n');
    const constructorParams = fieldNames.map(f => `required this.${f}`).join(', ');
    const toJsonFields = fieldNames.map(f => `'${f}': ${f}`).join(', ');
    const fromJsonAssigns = fieldNames.map(f => `${f}: json['${f}']`).join(', ');

    return `
/// Ritam Struct: ${struct.name}
class ${struct.name} {
${fields}

  const ${struct.name}({${constructorParams}});

  Map<String, dynamic> toJson() => {${toJsonFields}};
  
  factory ${struct.name}.fromJson(Map<String, dynamic> json) {
    return ${struct.name}(${fromJsonAssigns});
  }
  
  @override
  String toString() => '${struct.name}(${fieldNames.map(f => `${f}: \$${f}`).join(', ')})';
}
`;
  }

  private generateComponent(comp: ComponentDeclaration): string {
    // Extract state variables, methods, and UI
    const stateVars: { name: string; value: string }[] = [];
    const methods: string[] = [];
    const uiNodes: ASTNode[] = [];

    for (const node of comp.body) {
      if (node.type === 'VarDeclaration') {
        const v = node as any;
        stateVars.push({ name: v.name, value: this.visitExpr(v.value) });
      } else if (node.type === 'FunctionDeclaration') {
        const f = node as FunctionDeclaration;
        methods.push(this.generateMethod(f));
      } else if (node.type === 'UIView') {
        uiNodes.push(node);
      }
    }

    const stateDeclarations = stateVars
      .map(v => `  ${this.inferDartType(v.value)} _${v.name} = ${v.value};`)
      .join('\n');

    const stateGetters = stateVars
      .map(v => `  ${this.inferDartType(v.value)} get ${v.name} => _${v.name};`)
      .join('\n');

    const stateSetters = stateVars
      .map(v => `  set ${v.name}(${this.inferDartType(v.value)} value) {
    setState(() { _${v.name} = value; });
  }`)
      .join('\n');

    // Generate render body
    const uiCode = uiNodes.map(n => this.visitUIView(n as UIView)).join(',\n          ');
    const renderBody = uiCode
      ? `Scaffold(
      appBar: AppBar(title: const Text('Ritam App'), centerTitle: true),
      body: SafeArea(
        child: Center(
          child: ${uiCode},
        ),
      ),
    )`
      : 'const SizedBox.shrink()';

    return `
/// Ritam Component: ${comp.name}
class ${comp.name} extends StatefulWidget {
  const ${comp.name}({super.key});

  @override
  State<${comp.name}> createState() => _${comp.name}State();
}

class _${comp.name}State extends State<${comp.name}> {
${stateDeclarations}

${stateGetters}

${stateSetters}

${methods.join('\n')}

  @override
  Widget build(BuildContext context) {
    return ${renderBody};
  }
}
`;
  }

  private generateMethod(func: FunctionDeclaration): string {
    const params = func.params.map(p => `dynamic ${p.name}`).join(', ');
    const isAsync = func.isAsync;
    const returnType = isAsync ? 'Future<dynamic>' : 'dynamic';
    const asyncKeyword = isAsync ? 'async ' : '';

    const body = func.body.map(n => this.visit(n)).join('\n    ');

    return `  ${returnType} ${func.name}(${params}) ${asyncKeyword}{
    ${body}
  }`;
  }

  private visitUIView(node: UIView): string {
    const map: Record<string, string> = {
      'Container': 'Container',
      'VStack': 'Column',
      'HStack': 'Row',
      'Text': 'Text',
      'Button': 'ElevatedButton',
      'Input': 'TextField',
      'List': 'ListView',
      'Image': 'Image.network',
      'ScrollView': 'SingleChildScrollView'
    };

    const tagName = node.componentType;
    const widgetName = map[tagName] || (node as any).tagName || 'Container';

    // Generate children
    const children = node.children
      .filter(c => c.type === 'UIView')
      .map((c: ASTNode) => this.visitUIView(c as UIView));

    // Handle different widget types
    switch (widgetName) {
      case 'Text':
        const textContent = node.props['text']
          ? this.visitExpr(node.props['text'])
          : '""';
        const hasStyle = (node.props['style'] as any)?.value === 'title';
        const textStyle = hasStyle
          ? 'style: Theme.of(context).textTheme.headlineMedium'
          : '';
        return `Text(${textContent}${textStyle ? `, ${textStyle}` : ''})`;

      case 'ElevatedButton':
        const onPressed = node.props['click'] ? this.visitExpr(node.props['click']) : 'null';
        const buttonChild = children.length > 0
          ? children[0]
          : `Text(${node.props['text'] ? this.visitExpr(node.props['text']) : '"Button"'})`;
        return `ElevatedButton(
              onPressed: () => ${onPressed}(),
              child: ${buttonChild},
            )`;

      case 'TextField':
        const placeholder = node.props['placeholder']
          ? `hintText: ${this.visitExpr(node.props['placeholder'])}`
          : '';
        return `TextField(
              decoration: InputDecoration(${placeholder}),
            )`;

      case 'Column':
        return `Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ${children.join(',\n                ')},
              ],
            )`;

      case 'Row':
        return `Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ${children.join(',\n                ')},
              ],
            )`;

      case 'ListView':
        return `ListView(
              shrinkWrap: true,
              children: [
                ${children.join(',\n                ')},
              ],
            )`;

      case 'SingleChildScrollView':
        return `SingleChildScrollView(
              child: Column(
                children: [
                  ${children.join(',\n                  ')},
                ],
              ),
            )`;

      case 'Container':
      default:
        if (children.length === 0) {
          return `Container()`;
        } else if (children.length === 1) {
          return `Container(child: ${children[0]})`;
        } else {
          return `Container(
              child: Column(
                children: [
                  ${children.join(',\n                  ')},
                ],
              ),
            )`;
        }
    }
  }

  private visitExpr(expr: Expression | undefined): string {
    if (!expr) return 'null';

    if (expr.kind === 'Literal') {
      if (typeof expr.value === 'string') {
        return `"${expr.value}"`;
      }
      if (typeof expr.value === 'boolean') {
        return expr.value ? 'true' : 'false';
      }
      return JSON.stringify(expr.value);
    }

    if (expr.kind === 'Identifier') {
      const name = expr.universalName || expr.name;
      if (name.startsWith('$std') || name.startsWith('#std')) {
        const cleanName = name.replace(/^\$std\.?|^#std\.?/, '');
        if (cleanName === '') return 'RitamStd';
        return `RitamStd.${cleanName}`;
      }
      return name;
    }

    if (expr.kind === 'Binary') {
      const left = this.visitExpr(expr.left);
      const right = this.visitExpr(expr.right);
      return `(${left} ${expr.operator} ${right})`;
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
      return `await ${this.visitExpr((expr as AwaitExpression).argument)}`;
    }

    return 'null';
  }

  private inferDartType(value: string): string {
    if (value === 'true' || value === 'false') return 'bool';
    if (value.startsWith('"') || value.startsWith("'")) return 'String';
    if (value.startsWith('[')) return 'List<dynamic>';
    if (value.startsWith('{')) return 'Map<String, dynamic>';
    if (!isNaN(Number(value))) {
      return value.includes('.') ? 'double' : 'int';
    }
    return 'dynamic';
  }
}
