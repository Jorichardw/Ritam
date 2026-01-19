# Ritam Runtime Authority & Sovereignty

Ritam is not a guest on its target platforms; it is the sovereign authority. This document defines the execution model, stack management, and capability-based security.

## 1. The Virtual Stack Model
Every function call in Ritam pushes a frame onto the `#runtime` stack.
- **Frame Structure**: `{ name, timestamp, locals }`.
- **Stack Limit**: 1,000 frames (Hard limit for recursion safety).
- **Error Propagation**: Unhandled exceptions trigger a "Ritam Panic" which generates a sovereign stack trace independent of the JS host.

## 2. Error Taxonomy
Ritam uses a standardized error code system for deterministic debugging:
- `R_001`: Stack Overflow
- `R_002`: Null Pointer Reference
- `R_003`: Type Mismatch (Runtime)
- `R_004`: Async/Await Timeout
- `R_005`: Permission Denied (Capability Violation)
- `R_006`: Uncaught Exception

## 3. Capability-Based Security
Ritam follows a "Least Privilege" model. Code cannot access dangerous side-effects (File System, Network) unless the module declares the requirement or the runtime permits the capability.
- **Core Capabilities**: `io.print`, `math.base`, `time.read`.
- **Restricted Capabilities**: `fs.read`, `fs.write`, `net.http`.

## 4. Execution Scheduling
Ritam's async/await system uses a prioritized task queue.
- **Eager Evaluation**: Expressions are evaluated strictly left-to-right.
- **Reactive Signals**: Variables declared in Web/UI targets are wrapped in sovereign signals (`#runtime.signal`), ensuring Ritam manages its own reactivity.

## 5. Host Interoperability (FFI)
External functions are called through a restricted Foreign Function Interface (FFI) wrapper to ensure the Ritam stack model is preserved even when calling native platform code.
