# Contributing to Ritam

Thank you for your interest in contributing to Ritam! 🙏

Ritam is the world's first multilingual programming language with full support for 6 languages (Tamil, Hindi, Telugu, Kannada, Malayalam, Spanish). We welcome contributions from developers around the world.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding a New Language](#adding-a-new-language)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## How Can I Contribute?

### 🌍 Add a New Language

One of the most impactful contributions is adding support for a new language. See [Adding a New Language](#adding-a-new-language).

### 🐛 Report Bugs

Found a bug? Please open an issue with:
- A clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Your Ritam version (`ritam --version`)
- Your OS and Node.js version

### 💡 Suggest Features

Have an idea? Open an issue with:
- A clear title starting with `[Feature]`
- Detailed description of the feature
- Use cases and benefits
- (Optional) Implementation suggestions

### 📝 Improve Documentation

- Fix typos or unclear explanations
- Add examples in different languages
- Translate documentation to other languages
- Write tutorials or blog posts

### 💻 Submit Code

- Fix bugs
- Implement new features
- Improve performance
- Add tests

## Getting Started

### Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ritam.git
   cd ritam
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build the project:
   ```bash
   npm run build
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Development Workflow

1. Create a branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run the linter:
   ```bash
   npm run lint
   ```

4. Run tests:
   ```bash
   npm run test:all
   ```

5. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request

## Adding a New Language

To add support for a new language:

### 1. Create the locale file

Create a new JSON file in `src/locales/`:

```json
{
    "meta": {
        "name": "YourLanguage",
        "code": "xx",
        "direction": "ltr"  // or "rtl" for right-to-left
    },
    "keywords": {
        "var": "your_word_for_variable",
        "const": "your_word_for_constant",
        "print": "your_word_for_print",
        "if": "your_word_for_if",
        "else": "your_word_for_else",
        "else_if": "your_word_for_else_if",
        "function": "your_word_for_function",
        "return": "your_word_for_return",
        "struct": "your_word_for_struct",
        "enum": "your_word_for_enum",
        "while": "your_word_for_while",
        "for": "your_word_for_for",
        "in": "your_word_for_in",
        "match": "your_word_for_match",
        "true": "your_word_for_true",
        "false": "your_word_for_false",
        "null": "your_word_for_null",
        "component": "your_word_for_component",
        "render": "your_word_for_render",
        "click": "your_word_for_click",
        "tag": "your_word_for_tag",
        "text": "your_word_for_text",
        "attr": "your_word_for_attr",
        "import": "your_word_for_import",
        "export": "your_word_for_export",
        "from": "your_word_for_from",
        "async": "your_word_for_async",
        "await": "your_word_for_await",
        "try": "your_word_for_try",
        "catch": "your_word_for_catch",
        "throw": "your_word_for_throw"
    },
    "builtins": {
        "std": "your_word_for_standard",
        "math": "your_word_for_math",
        "crypto": "your_word_for_crypto",
        "net": "your_word_for_network",
        "json": "your_word_for_data",
        "test": "your_word_for_test",
        "random": "your_word_for_random",
        "hash": "your_word_for_hash",
        "fetch": "your_word_for_fetch",
        "sqrt": "your_word_for_sqrt",
        "add": "your_word_for_add",
        "sub": "your_word_for_subtract",
        "mul": "your_word_for_multiply",
        "div": "your_word_for_divide",
        "print": "your_word_for_print"
    },
    "messages": {
        "welcome": "Welcome to Ritam in your language!",
        "project_created": "Project created successfully.",
        "error_syntax": "Syntax error",
        "error_variable_undefined": "Variable not defined",
        "error_unexpected_token": "Unexpected token '{0}' at line {1}",
        "error_expected_token": "'{0}' expected but '{1}' found (line {2})"
    }
}
```

### 2. Create an example file

Add an example in `examples/your_language_logic.rvx`:

```ritam
// Your Language Example
your_var_keyword name = "Ritam"
your_print_keyword "Hello, " + name

your_function_keyword add(a, b) {
    your_return_keyword a + b
}

your_var_keyword result = add(10, 20)
#std.print("Result: " + result)
```

### 3. Test your language

```bash
npm run build
node dist/cli.js run examples/your_language_logic.rvx --lang YourLanguage
```

### 4. Update documentation

- Add your language to `README.md`
- Add your language to `docs/LANGUAGES.md`
- Add your language to `docs/ROADMAP.md`

### 5. Submit a Pull Request

Include:
- The locale JSON file
- Example file
- Documentation updates
- Your name for contributor credits

## Submitting Changes

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add Bengali language support
fix: resolve tokenizer issue with multi-word keywords
docs: update Malayalam example in README
```

### Pull Request Process

1. Update the README.md if needed
2. Update CHANGELOG.md
3. Ensure all tests pass
4. Request review from maintainers

## Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Add type annotations
- Use meaningful variable names
- Add comments for complex logic

### Code Formatting

- Use 4 spaces for indentation
- Maximum line length: 100 characters
- Use single quotes for strings
- Add trailing semicolons

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test with multiple languages

## Questions?

- Open an issue with `[Question]` prefix
- Email: dank2joe@gmail.com

---

Thank you for contributing to Ritam! Together, we're making programming accessible to everyone, in every language. 🌏

*Ritam — Programming in Your Language* 🇮🇳
