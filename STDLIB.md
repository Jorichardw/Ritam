# Ritam Standard Library ($std)

The Ritam standard library provides a core set of functions available in every module via the `$std` namespace.

## 1. I/O Functions
- `$std.print(val)`: Prints the value to the standard output.

## 2. Math Functions
| Function | Description |
|----------|-------------|
| `$std.math.add(a, b)` | Sum of two numbers |
| `$std.math.sub(a, b)` | Difference of two numbers |
| `$std.math.mul(a, b)` | Product of two numbers |
| `$std.math.div(a, b)` | Quotient (throws on divide by zero) |
| `$std.math.pow(base, exp)` | Power of base to exponent |
| `$std.math.sqrt(n)` | Square root (throws on negative) |
| `$std.math.abs(n)` | Absolute value |
| `$std.math.floor(n)` | Floor rounding |
| `$std.math.ceil(n)` | Ceiling rounding |
| `$std.math.round(n)` | Standard rounding |
| `$std.math.min(...args)` | Minimum of values |
| `$std.math.max(...args)` | Maximum of values |
| `$std.math.sin(n)` | Sine |
| `$std.math.cos(n)` | Cosine |
| `$std.math.tan(n)` | Tangent |
| `$std.math.log(n)` | Natural logarithm |
| `$std.math.PI` | Mathematical constant π |
| `$std.math.E` | Mathematical constant e |

## 3. String Functions
| Function | Description |
|----------|-------------|
| `$std.str.len(s)` | Length of string s |
| `$std.str.concat(a, b)` | Concatenates two strings |
| `$std.str.upper(s)` | Converts s to UPPERCASE |
| `$std.str.lower(s)` | Converts s to lowercase |
| `$std.str.trim(s)` | Removes leading/trailing whitespace |
| `$std.str.split(s, delimiter)` | Split string into array |
| `$std.str.join(arr, delimiter)` | Join array into string |
| `$std.str.includes(s, search)` | Check if string contains substring |
| `$std.str.replace(s, search, replacement)` | Replace substring |
| `$std.str.charAt(s, index)` | Get character at index |
| `$std.str.substring(s, start, end)` | Extract substring |
| `$std.str.startsWith(s, prefix)` | Check string prefix |
| `$std.str.endsWith(s, suffix)` | Check string suffix |

## 4. List (Array) Functions
| Function | Description |
|----------|-------------|
| `$std.list.push(list, item)` | Returns new list with item added |
| `$std.list.pop(list)` | Returns new list without last item |
| `$std.list.len(list)` | Number of items |
| `$std.list.get(list, index)` | Get item at index |
| `$std.list.set(list, index, value)` | Returns new list with updated item |
| `$std.list.first(list)` | Get first item |
| `$std.list.last(list)` | Get last item |
| `$std.list.reverse(list)` | Returns reversed list |
| `$std.list.sort(list)` | Returns sorted list |
| `$std.list.filter(list, fn)` | Filter list by predicate |
| `$std.list.map(list, fn)` | Transform list items |
| `$std.list.reduce(list, fn, initial)` | Reduce list to single value |
| `$std.list.includes(list, item)` | Check if list contains item |
| `$std.list.indexOf(list, item)` | Get index of item |
| `$std.list.concat(list1, list2)` | Concatenate two lists |
| `$std.list.slice(list, start, end)` | Extract sublist |
| `$std.list.isEmpty(list)` | Check if list is empty |

## 5. File I/O (Node Target Only)
| Function | Description |
|----------|-------------|
| `$std.file.read(path)` | Read file contents as UTF-8 |
| `$std.file.write(path, data)` | Write data to file |
| `$std.file.exists(path)` | Check if file exists |
| `$std.file.delete(path)` | Delete file |
| `$std.file.append(path, data)` | Append data to file |

## 6. Time Functions
| Function | Description |
|----------|-------------|
| `$std.time.now()` | Current timestamp in milliseconds |
| `$std.time.date()` | Current date in ISO format |
| `$std.time.year()` | Current year |
| `$std.time.month()` | Current month (1-12) |
| `$std.time.day()` | Current day of month |
| `$std.time.hour()` | Current hour |
| `$std.time.minute()` | Current minute |
| `$std.time.second()` | Current second |
| `$std.time.format(timestamp, format)` | Format timestamp |
| `$std.time.sleep(ms)` | Async sleep for milliseconds |

## 7. Network Functions
| Function | Description |
|----------|-------------|
| `$std.net.fetch(url, opts)` | Fetch with options, returns JSON |
| `$std.net.get(url)` | HTTP GET, returns JSON |
| `$std.net.post(url, body)` | HTTP POST with JSON body |
| `$std.net.getText(url)` | HTTP GET, returns text |

## 8. Crypto Functions
| Function | Description |
|----------|-------------|
| `$std.crypto.hash(s)` | Generate hash of string |
| `$std.crypto.random()` | Random float 0-1 |
| `$std.crypto.randomInt(min, max)` | Random integer in range |
| `$std.crypto.uuid()` | Generate UUID v4 |
| `$std.crypto.base64Encode(s)` | Encode string to Base64 |
| `$std.crypto.base64Decode(s)` | Decode Base64 to string |

## 9. Test Functions
| Function | Description |
|----------|-------------|
| `$std.test.describe(name, fn)` | Run test with description |
| `$std.test.assert(cond, msg)` | Assert condition is truthy |
| `$std.test.assertEqual(actual, expected, msg)` | Assert strict equality |
| `$std.test.assertNotEqual(actual, notExpected, msg)` | Assert inequality |
| `$std.test.assertTrue(cond, msg)` | Assert is `true` |
| `$std.test.assertFalse(cond, msg)` | Assert is `false` |
| `$std.test.assertNull(val, msg)` | Assert is null/undefined |

## 10. JSON Functions
| Function | Description |
|----------|-------------|
| `$std.json.parse(s)` | Parse JSON string |
| `$std.json.stringify(o)` | Convert to JSON string |
| `$std.json.prettyPrint(o)` | Convert to formatted JSON |

## 11. Console Functions
| Function | Description |
|----------|-------------|
| `$std.console.log(...args)` | Log to console |
| `$std.console.error(...args)` | Log error |
| `$std.console.warn(...args)` | Log warning |
| `$std.console.info(...args)` | Log info |
| `$std.console.debug(...args)` | Log debug |
| `$std.console.table(data)` | Display as table |
| `$std.console.clear()` | Clear console |

## 12. Type Functions
| Function | Description |
|----------|-------------|
| `$std.type.of(val)` | Get type as string |
| `$std.type.isString(val)` | Check if string |
| `$std.type.isNumber(val)` | Check if number |
| `$std.type.isBoolean(val)` | Check if boolean |
| `$std.type.isArray(val)` | Check if array |
| `$std.type.isObject(val)` | Check if object |
| `$std.type.isFunction(val)` | Check if function |
| `$std.type.isNull(val)` | Check if null |
| `$std.type.isUndefined(val)` | Check if undefined |
| `$std.type.isNaN(val)` | Check if NaN |
| `$std.type.toNumber(val)` | Convert to number |
| `$std.type.toString(val)` | Convert to string |
| `$std.type.toBoolean(val)` | Convert to boolean |

---

*Ritam — Making programming accessible in every language* 🇮🇳
