# Ritam Typology & Data Model

Ritam uses a **Gradual Type System**. It is dynamically typed by default but supports optional static type annotations for scale and safety.

## 1. Primitive Types
| Type | Name (Tamil) | Name (Hindi) | Description |
|------|--------------|--------------|-------------|
| `Int` | முழு எண் | पूर्णांक | 64-bit signed integer |
| `Float` | தசம எண் | दशमलव | 64-bit IEEE 754 floating point |
| `Bool` | தருக்க | तार्किक | `true` or `false` |
| `String` | உரை | पाठ | UTF-8 encoded string |
| `Null` | வெற்று | शून्य | Represents absence of value |

## 2. Composite Types
- **Array (பட்டியல்/सूची)**: Ordered, growable collection of elements. Indexed from 0.
- **Map (வரைபடம்/मानचित्र)**: Key-value pairs (Object style).
- **Struct (கட்டமைப்பு/संरचना)**: Named fields with specific types.

## 3. Type Annotations (Optional)
Syntax: `மாறி [பெயர்]: [வகை] = [மதிப்பு]`
Example:
```ritam
மாறி வயது: முழு எண் = 25
```

## 4. Null Semantics
Ritam follows **Null Safety**. Variables are non-nullable by default unless explicitly marked (future feature). Accessing a property on `Null` results in a runtime error.

## 5. Inference
If no type is provided, Ritam infers the type from the initial assignment.
```ritam
மாறி பெயர் = "Ritam" // Inferred as String
```
