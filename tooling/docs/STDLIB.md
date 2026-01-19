# Ritam Standard Library (#std)

The Ritam standard library provides a core set of functions available in every module via the `#std` namespace. Consistent with Ritam's design philosophy, all system operations require the `#` prefix.

---

## 🏗️ Implementation Status
- ✅ **Core Logic**: Production
- ✅ **Math**: Production (20+ functions)
- ✅ **String**: Production (13 functions)
- ✅ **List**: Production (17 functions)
- ✅ **Time**: Production (10 functions)
- ✅ **Crypto**: Production (6 functions)
- ✅ **JSON**: Production
- ✅ **Test**: Production
- 🧪 **File I/O**: Node.js target only
- 🧪 **Network**: Fetch support

---

## 1. Math Functions (`#std.math.*`)
Comprehensive mathematical toolkit.
- `add(a, b)`: Sum.
- `sub(a, b)`: Difference.
- `mul(a, b)`: Product.
- `div(a, b)`: Quotient.
- `pow(base, exp)`: Power.
- `sqrt(n)`: Square root.
- `abs(n)`, `floor(n)`, `ceil(n)`, `round(n)`
- `sin(n)`, `cos(n)`, `tan(n)`
- `PI`, `E`

## 2. String Functions (`#std.str.*`)
- `len(s)`: Get length.
- `concat(a, b)`: Join strings.
- `upper(s)` / `lower(s)`: Change case.
- `trim(s)`: Remove whitespace.
- `split(s, delimiter)`: String to List.
- `includes(s, search)`: Boolean check.
- `replace(s, old, new)`: Replace text.
- `substring(s, start, end)`

## 3. List Functions (`#std.list.*`)
- `push(list, item)`: Append (returns new list).
- `pop(list)`: Remove last.
- `len(list)`: Size.
- `get(list, index)`: Access element.
- `set(list, index, val)`: Update element.
- `filter(list, fn)`, `map(list, fn)`, `reduce(list, fn, init)`
- `sort(list)`, `reverse(list)`

## 4. File I/O (`#std.file.*`)
*Availability: Node.js Target only.*
- `read(path)`: Read UTF-8 content.
- `write(path, data)`: Write content.
- `exists(path)`: Check presence.
- `append(path, data)`: Add content to end.

## 5. Time (`#std.time.*`)
- `now()`: Current timestamp.
- `date()`: ISO string.
- `year()`, `month()`, `day()`
- `sleep(ms)`: Async delay (requires `await`).

## 6. Networking (`#std.net.*`)
- `fetch(url, options)`: standard fetch (async).
- `get(url)` / `post(url, body)`: shorthand methods.

## 7. Security & Crypto (`#std.crypto.*`)
- `hash(s)`: Faster non-cryptographic hash.
- `random()`: Float 0-1.
- `randomInt(min, max)`: Random integer.
- `uuid()`: Unique identifier.
- `base64Encode(s)` / `base64Decode(s)`

## 8. Test Runner (`#std.test.*`)
- `describe(name, fn)`: Define test block.
- `assert(condition, msg)`: Basic assertion.
- `assertEqual(a, b)`, `assertTrue(val)`, `assertNull(val)`

## 9. JSON (`#std.json.*`)
- `parse(string)`: String to Object.
- `stringify(object)`: Object to String.
- `prettyPrint(object)`: Formatted JSON.

---

*Note: The `#std` namespace is protected. Attempting to redeclare `#std` will result in a Sovereign Security Error.*
