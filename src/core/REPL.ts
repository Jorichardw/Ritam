import * as readline from 'readline';
import { RitamCompiler } from './Compiler';
import { LanguageManager } from './LanguageManager';

export class RitamREPL {
    private compiler: RitamCompiler;
    private langManager: LanguageManager;

    constructor(langManager: LanguageManager) {
        this.langManager = langManager;
        this.compiler = new RitamCompiler(langManager);
    }

    public start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'ritam> '
        });

        const welcome = this.langManager.getCurrentDefinition().messages.welcome;
        console.log(`${welcome}\nRitam REPL (v1.0). Type "exit" or "விடு" to quit.`);

        rl.prompt();

        rl.on('line', (line) => {
            const input = line.trim();
            if (input === 'exit' || input === 'exit;' || input === 'விடு') {
                rl.close();
                return;
            }

            if (input === '') {
                rl.prompt();
                return;
            }

            try {
                // Compile to single-run JS
                const js = this.compiler.compile(input, 'node');

                // Execute using eval (wrapped to capture output)
                // We'll expose _std to the eval context
                eval(js);

            } catch (e: any) {
                console.error(`REPL Error: ${e.message}`);
            }

            rl.prompt();
        }).on('close', () => {
            console.log('Exiting Ritam REPL.');
            process.exit(0);
        });
    }
}
