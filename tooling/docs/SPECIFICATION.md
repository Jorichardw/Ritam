# Ritam Language Specification (v1.0)

Ritam is a multilingual, full-stack, cross-platform programming language designed for humans who want to code in their native tongue.

## 1. Design Goals
- **Accessibility**: Lower the barrier to entry by using native languages.
- **Portability**: Write once, run on Node, Web, iOS, and Android.
- **Reactivity**: Built-in signal-based reactivity for modern UIs.
- **Safety**: Robust error handling and gradual typing.

## 2. Grammar (EBNF)
*See [EBNF.md](EBNF.md) for the complete grammar.*

## 3. Type System
*See [TYPES.md](TYPES.md) for the type specification.*

## 4. Semantics
- **Execution**: Eager, left-to-right.
- **Scope**: Lexical block scoping.
- **Concurrency**: First-class async/await.
*See [SEMANTICS.md](SEMANTICS.md) for details.*

## 5. Module System
Ritam uses a file-based module system. Each `.rvx` file is a module.
- **Resolution**: Relative paths (`./math`) or package identifiers (`@std/math`).
- **Visibility**: Items are private by default; use `export` to make them public.

## 6. Error Model
- **Mechanism**: Try-Catch exceptions.
- **Panic**: Unhandled exceptions terminate the process.
*See [ERROR_HANDLING.md](ERROR_HANDLING.md) for details.*

## 7. Standard Library
Ritam ships with a stable, versioned standard library (`$std`) covering:
- `math`, `str`, `list`, `file`, `io`, `time`, `json`, `net`.
*See [STDLIB.md](STDLIB.md) for the API reference.*

## 8. Interoperability
Ritam can seamlessly interoperate with the target platform (e.g., JavaScript).
- **External Calls**: Can call global JS functions and import npm packages via `import`.
- **Foreign Interfaces**: Support for mapping external types to Ritam structs.

## 9. Tooling
- **CLI**: `ritam init`, `ritam compile`, `ritam format`, `ritam repl`.
- **LSP**: Language Server Protocol support (In development).
- **Theme**: TextMate grammar for syntax highlighting.
