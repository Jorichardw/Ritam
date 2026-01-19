# Ritam Standard Library v1 (Sovereign Set)

This document defines the stable APIs for Ritam v1.0. These modules are accessible via the `#std` namespace.

## 1. Networking (`#std.net`)
- `#std.net.fetch(url, options)`: Asynchronous fetch. Returns a promise that resolves to JSON.
  - *Capability required*: `net.fetch`

## 2. Cryptography (`#std.crypto`)
- `#std.crypto.hash(string)`: Returns a hex hash of the input string.
- `#std.crypto.random()`: Returns a random float between 0 and 1.
  - *Capability required*: `crypto.base`

## 3. Testing (`#std.test`)
- `#std.test.describe(name, function)`: Groups tests together and logs results.
- `#std.test.assert(condition, message?)`: Throws an error if the condition is false.
  - *Capability required*: `test.base`

## 4. System & I/O
- `#std.print(value)`: Prints to the sovereign standard output.
- `#std.json.parse(string)`: Parses JSON string to Ritam objects.
- `#std.json.stringify(object)`: Serializes Ritam objects to JSON.
- `#std.time.now()`: Returns current timestamp in milliseconds.

## 5. Math (`#std.math`)
- `#std.math.add`, `sub`, `mul`, `div`, `sqrt`, `pow`
- Standard arithmetic operators are also supported natively.

---
*Note: All modules require permission checks performed by the #runtime sovereign core.*
