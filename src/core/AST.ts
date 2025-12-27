
export type NodeType =
    | 'Program'
    | 'VarDeclaration'
    | 'FunctionDeclaration'
    | 'ReturnStatement'
    | 'PrintStatement'
    | 'ComponentDeclaration'
    | 'UIView'
    | 'ForStatement'
    | 'WhileStatement'
    | 'StructDeclaration'
    | 'EnumDeclaration'
    | 'MatchExpression'
    | 'IfStatement'
    | 'AssignmentStatement'
    | 'ImportDeclaration'
    | 'ExportDeclaration'
    | 'TryCatchStatement'
    | 'ThrowStatement'
    | 'EventStatement'
    | 'AttributeStatement'
    | 'Expression';

export interface ASTNode {
    type: NodeType;
    line?: number;
    column?: number;
    length?: number;
}

export interface TypeParameter {
    name: string;
    constraint?: string;
}

export interface Program extends ASTNode {
    type: 'Program';
    body: ASTNode[];
}

export interface VarDeclaration extends ASTNode {
    type: 'VarDeclaration';
    name: string;
    value: Expression;
    isMutable: boolean; // var vs const
    typeAnnotation?: string;
}

export interface ComponentDeclaration extends ASTNode {
    type: 'ComponentDeclaration';
    name: string;
    body: ASTNode[];
}

export interface UIView extends ASTNode {
    type: 'UIView';
    componentType: 'Container' | 'Text' | 'Button' | 'Input' | 'Custom';
    tagName?: string;
    props: Record<string, Expression>;
    children: ASTNode[];
}

export type Expression = Literal | Identifier | BinaryExpression | CallExpression | ArrayLiteral | AwaitExpression | MemberExpression;

export interface MemberExpression extends ASTNode {
    type: 'Expression';
    kind: 'Member';
    object: Expression;
    property: string;
}

export interface Literal extends ASTNode {
    type: 'Expression';
    kind: 'Literal';
    value: any;
}

export interface Identifier extends ASTNode {
    type: 'Expression';
    kind: 'Identifier';
    name: string;
}

export interface BinaryExpression extends ASTNode {
    type: 'Expression';
    kind: 'Binary';
    left: Expression;
    operator: string;
    right: Expression;
}

export interface CallExpression extends ASTNode {
    type: 'Expression';
    kind: 'Call';
    callee: Expression;
    args: Expression[];
}

export interface PrintStatement extends ASTNode {
    type: 'PrintStatement';
    expression: Expression;
}

export interface ReturnStatement extends ASTNode {
    type: 'ReturnStatement';
    value?: Expression;
}


export interface FunctionDeclaration extends ASTNode {
    type: 'FunctionDeclaration';
    name: string;
    typeParameters?: TypeParameter[];
    params: { name: string, typeAnnotation?: string }[];
    body: ASTNode[];
    returnType?: string;
    isAsync: boolean;
}

export interface IfStatement extends ASTNode {
    type: 'IfStatement';
    condition: Expression;
    thenBranch: ASTNode[];
    elseBranch?: ASTNode[];
}

export interface WhileStatement extends ASTNode {
    type: 'WhileStatement';
    condition: Expression;
    body: ASTNode[];
}

export interface ForStatement extends ASTNode {
    type: 'ForStatement';
    iterator: string;
    iterable: Expression;
    body: ASTNode[];
}

export interface StructDeclaration extends ASTNode {
    type: 'StructDeclaration';
    name: string;
    typeParameters?: TypeParameter[];
    fields: { name: string, typeAnnotation: string }[];
}

export interface EnumDeclaration extends ASTNode {
    type: 'EnumDeclaration';
    name: string;
    cases: string[];
}

export interface MatchExpression extends ASTNode {
    type: 'MatchExpression';
    target: Expression;
    cases: { pattern: Expression, body: ASTNode[] }[];
    isExhaustive: boolean; // For Rust-like safety
}

export interface AssignmentStatement extends ASTNode {
    type: 'AssignmentStatement';
    name: string;
    value: Expression;
}

export interface ImportDeclaration extends ASTNode {
    type: 'ImportDeclaration';
    specifiers: string[];
    source: string;
}

export type Exportable =
    | VarDeclaration
    | FunctionDeclaration
    | StructDeclaration
    | EnumDeclaration
    | ComponentDeclaration;

export interface ExportDeclaration extends ASTNode {
    type: 'ExportDeclaration';
    declaration: Exportable;
}

export interface TryCatchStatement extends ASTNode {
    type: 'TryCatchStatement';
    tryBlock: ASTNode[];
    catchBlock: ASTNode[];
    errorVar: string;
}

export interface ThrowStatement extends ASTNode {
    type: 'ThrowStatement';
    argument: Expression;
}

export interface AwaitExpression extends ASTNode {
    type: 'Expression';
    kind: 'Await';
    argument: Expression;
}

export interface ArrayLiteral extends ASTNode {
    type: 'Expression';
    kind: 'Array';
    elements: Expression[];
}

export interface EventStatement extends ASTNode {
    type: 'EventStatement';
    eventName: string;
    action: string;
}

export interface AttributeStatement extends ASTNode {
    type: 'AttributeStatement';
    name: string;
    value: Expression;
}
