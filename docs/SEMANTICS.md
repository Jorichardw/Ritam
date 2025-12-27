# Ritam Core Semantics (v1.0)

This document provides the definitive semantic rules for the Ritam programming language.

## 1. Evaluation Order
Ritam follows a **strict left-to-right, eager evaluation** model.
- **Expressions**: In `a() + b()`, `a()` is guaranteed to execute and complete before `b()` is called.
- **Function Arguments**: Arguments are evaluated from left to right before the function is invoked.

## 2. Short-Circuit Semantics
Logical operators follow short-circuit rules:
- `A மற்றும் B` (A and B): If A is false, B is NOT evaluated.
- `A அல்லது B` (A or B): If A is true, B is NOT evaluated.

## 3. Variable Lifetimes & Scoping
- **Lexical Scoping**: Ritam uses block scoping. A variable declared inside `{}` is invisible outside.
- **Variable Shadowing**: Inner scopes can shadow outer scope names.
- **Lifetime**: Variables live as long as their containing scope. In the Web/Node targets, the underlying engine (V8) handles garbage collection, but Ritam semantics forbid accessing a variable after its scope exits.

## 4. Mutability Model
Ritam distinguishes between mutable and immutable bindings:
- **`var` (மாறி/चर)**: Reassignable.
- **`const` (நிலையான/स्थिर)**: Immutable. Once assigned, it cannot be changed.
- **Reassignment**: `x = 10` is only valid if `x` was declared with `var`.

## 5. Closure Semantics
Ritam functions are **lexical closures**.
- **Capture**: Functions capture variables from their outer scope by **reference** (they see updates to the variable).
- **First-Class Functions**: Functions can be assigned to variables, passed as arguments, and returned from other functions.

## 6. Temporary Values
Expressions like `(a + b) * c` create temporary intermediate values. These are anonymous and are destroyed immediately after the outer expression is evaluated.

## 7. Function Evaluation
When a function is called:
1. A new **Environment Frame** is created.
2. Arguments are evaluated and bound to parameters.
3. The body is executed.
4. On `return` (திருப்பு), the frame is destroyed and control returns to the caller.

## 8. Reactivity (Web Target Only)
In Web mode, `var` declarations create **observable signals**. Accessing a signal inside a `print` or `UIView` registers the calling block as a subscriber, ensuring the UI/output updates automatically when the variable changes.
