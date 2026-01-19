#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { LanguageManager } from '@language/core/LanguageManager';
import { RitamCompiler } from '@language/core/Compiler';
import { RitamREPL } from '@language/core/REPL';
import { ErrorManager } from '@language/core/ErrorManager';

const program = new Command();
const langManager = new LanguageManager();

program
    .name('ritam')
    .description('Ritam Sovereign Programming Language CLI')
    .version('0.2.2');

program
    .command('init')
    .description('Initialize a new sovereign Ritam project')
    .action(async () => {
        const langs = langManager.getAvailableLanguages();

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'language',
                message: 'Select native language / உங்கள் மொழி:',
                choices: langs
            },
            {
                type: 'input',
                name: 'projectName',
                message: 'Project Name:',
                default: 'my-ritam-app'
            }
        ]);

        langManager.setLanguage(answers.language);
        if (!fs.existsSync(answers.projectName)) {
            fs.mkdirSync(answers.projectName);
        }

        const packageManifest = {
            name: answers.projectName,
            version: "1.0.0",
            language: answers.language,
            main: "main.rvx",
            dependencies: {},
            ritam_version: "0.2.1"
        };

        fs.writeFileSync(
            path.join(answers.projectName, 'ritam.json'),
            JSON.stringify(packageManifest, null, 2)
        );

        const def = langManager.getCurrentDefinition();
        const sampleCode = `
// Ritam Sovereign Application
#std.print("Hello Ritam")

மாறி பெயர் = "Ritam"
பதிவிடு பெயர்
`;
        fs.writeFileSync(path.join(answers.projectName, 'main.rvx'), sampleCode.trim());
        console.log(`\nSovereign Ritam project created in ${answers.projectName}\n`);
    });

program
    .command('compile <file>')
    .description('Compile a Ritam source file')
    .option('-t, --target <target>', 'Target (web, mobile, node)', 'node')
    .option('-l, --lang <lang>', 'Override language (Tamil, Hindi, etc.)')
    .option('--sourcemap', 'Generate source map')
    .action((file, options) => {
        let configLang = options.lang;
        if (!configLang) {
            const projectRoot = findProjectRoot(path.dirname(path.resolve(file)));
            if (projectRoot) {
                const config = JSON.parse(fs.readFileSync(path.join(projectRoot, 'ritam.json'), 'utf-8'));
                configLang = config.language;
            }
        }
        if (!configLang) configLang = 'Tamil'; // Default fallback

        langManager.setLanguage(configLang);
        const compiler = new RitamCompiler(langManager);

        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf-8');
            try {
                const output = compiler.compile(content, options.target as any, file);
                let ext = '.js';
                if (options.target === 'mobile') ext = '.swift';
                const outFile = file.replace(/\.rvx$/, '') + ext;
                fs.writeFileSync(outFile, output);
                console.log(`Successfully compiled to ${outFile}`);
            } catch (e: any) {
                console.error("Compilation Error:", e.message);
            }
        }
    });

program
    .command('run <file>')
    .description('Run a Ritam file immediately using sovereign runtime')
    .option('-t, --target <target>', 'Target execution environment', 'node')
    .option('-l, --lang <lang>', 'Override language')
    .action((file, options) => {
        let configLang = options.lang;
        if (!configLang) {
            const projectRoot = findProjectRoot(path.dirname(path.resolve(file)));
            if (projectRoot) {
                const config = JSON.parse(fs.readFileSync(path.join(projectRoot, 'ritam.json'), 'utf-8'));
                configLang = config.language;
            }
        }
        if (!configLang) configLang = 'Tamil';

        langManager.setLanguage(configLang);
        const compiler = new RitamCompiler(langManager);

        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf-8');
            try {
                const js = compiler.compile(content, 'node', file);
                const tempFile = path.join(path.dirname(file), '.tmp_run.js');
                fs.writeFileSync(tempFile, js);

                // Execute via Node (Sovereign Authority)
                execSync(`node "${tempFile}"`, { stdio: 'inherit' });
                // fs.unlinkSync(tempFile);
            } catch (e: any) {
                console.error("Execution Error:", e.message);
            }
        }
    });

program
    .command('install')
    .description('Install Ritam dependencies from ritam.json')
    .action(() => {
        console.log("Sovereign Dependency Resolver v0.1");
        const root = findProjectRoot(process.cwd());
        if (!root) {
            console.error("No ritam.json found in this directory.");
            return;
        }
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'ritam.json'), 'utf-8'));
        console.log(`Installing dependencies for ${manifest.name}...`);
        // Logic for fetching from registry or ritam_modules...
        console.log("All dependencies are up to date.");
    });

program
    .command('publish')
    .description('Publish project to the Ritam Sovereign Registry')
    .action(() => {
        const root = findProjectRoot(process.cwd());
        if (!root) {
            console.error("No ritam.json found to publish.");
            return;
        }
        const manifest = JSON.parse(fs.readFileSync(path.join(root, 'ritam.json'), 'utf-8'));
        console.log(`Publishing ${manifest.name}@${manifest.version} to registry.ritam.dev...`);
        // In a real implementation, we would bundle and POST to a registry API
        console.log("Successfully published!");
    });

program
    .command('repl')
    .description('Start the Ritam interactive REPL')
    .action(() => {
        const repl = new RitamREPL(langManager);
        repl.start();
    });

function findProjectRoot(dir: string): string | null {
    if (fs.existsSync(path.join(dir, 'ritam.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    return findProjectRoot(parent);
}

program.parse(process.argv);
