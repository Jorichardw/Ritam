import { Program } from '../core/AST';

export interface TargetGenerator {
    generate(ast: Program, filename?: string): string;
}
