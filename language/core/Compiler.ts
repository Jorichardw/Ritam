import { LanguageManager } from './LanguageManager';
import { Tokenizer } from './Tokenizer';
import { Parser } from './Parser';
import { TargetGenerator } from '../generators/TargetGenerator';
import { WebGenerator } from '../generators/WebGenerator';
import { FlutterGenerator } from '../generators/FlutterGenerator';
import { NodeGenerator } from '../generators/NodeGenerator';
import { ReactNativeGenerator } from '../generators/ReactNativeGenerator';
import { ErrorManager } from './ErrorManager';
import { Formatter } from './Formatter';

export class RitamCompiler {
    private langManager: LanguageManager;

    constructor(langManager: LanguageManager) {
        this.langManager = langManager;
    }

    public compile(sourceCode: string, target: 'web' | 'mobile' | 'node' | 'react-native' = 'web', filename: string = "main.rvx"): string {
        const errorManager = new ErrorManager(this.langManager);
        errorManager.setSource(sourceCode);

        // 1. Tokenize
        const tokenizer = new Tokenizer(sourceCode, this.langManager);
        const tokens = tokenizer.tokenize();

        // 2. Parse
        const parser = new Parser(tokens, errorManager);
        const ast = parser.parse();

        // 3. Generate
        let generator: TargetGenerator;
        switch (target) {
            case 'mobile':
                generator = new FlutterGenerator(); // Flutter/Dart
                break;
            case 'node':
                generator = new NodeGenerator(this.langManager.getCurrentDefinition()); // Backend
                break;
            case 'react-native':
                generator = new ReactNativeGenerator(); // RN
                break;
            default:
                generator = new WebGenerator(this.langManager.getCurrentDefinition()); // Inject strict definition
                break;
        }

        return generator.generate(ast, filename);
    }

    public format(sourceCode: string): string {
        const errorManager = new ErrorManager(this.langManager);
        const tokenizer = new Tokenizer(sourceCode, this.langManager);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens, errorManager);
        const ast = parser.parse();

        const formatter = new Formatter(this.langManager.getCurrentDefinition());
        return formatter.format(ast);
    }
}
