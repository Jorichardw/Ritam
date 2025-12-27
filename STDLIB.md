# Ritam Standard Library ($std)

The Ritam standard library provides a core set of functions available in every module via the `$std` namespace.

## 1. Math Functions
- `#std.math.add(a, b)`: Sum of two numbers.
- `#std.math.sub(a, b)`: Difference of two numbers.
- `#std.math.mul(a, b)`: Product of two numbers.
- `#std.math.div(a, b)`: Quotient of two numbers.
- `#std.math.pow(base, exp)`: Power of base to exponent.
- `#std.math.sqrt(n)`: Square root of n.

## 2. String Functions
- `#std.str.len(s)`: Length of string s.
- `#std.str.concat(a, b)`: Concatenates two strings.
- `#std.str.upper(s)`: Converts s to UPPERCASE.
- `#std.str.lower(s)`: Converts s to lowercase.

## 3. List (Array) Functions
- `#std.list.push(list, item)`: Returns a new list with the item added.
- `#std.list.len(list)`: Number of items in the list.
- `#std.list.get(list, index)`: Retrieves item at index.

## 4. File I/O (Node Target)
- `#std.file.read(path)`: Returns contents of files as UTF-8 string.
- `#std.file.write(path, data)`: Writes data to file at path.

## 5. System
- `#std.print(val)`: Prints the value to the standard output.
- `#std.time.now()`: Returns current timestamp (planned).

## 6. Networking (Planned)
- `#std.net.get(url)`: Perform HTTP GET request.
- `#std.net.post(url, body)`: Perform HTTP POST request.
