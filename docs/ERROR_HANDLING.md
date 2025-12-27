# Ritam Error Handling

Ritam uses an **Exception Model** for handling errors, ensuring that failures are explicit and cannot be silently ignored.

## 1. Try-Catch Blocks
| Keyword | Tamil | Hindi | Spanish |
|---------|-------|-------|---------|
| `try` | முயற்சி | प्रयास | intentar |
| `catch` | பிடி | पकड़े | atrapar |
| `throw` | எறி | फेंकना | lanzar |

## 2. Rule of Propagation
1. Errors propagate up the call stack until they hit a `try-catch` block.
2. If no handler is found, the program performs a **Panic** (Runtime termination with error report).

## 3. Runtime vs Compile-time Errors
- **Compile-time**: Syntax errors, unclosed blocks, invalid keyword usage.
- **Runtime**: Division by zero, accessing `null` properties, network failures.

## 4. Stack Traces
Ritam ensures that runtime errors include localized stack traces showing the file name and line number in the source native language.
