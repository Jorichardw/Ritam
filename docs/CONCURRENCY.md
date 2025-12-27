# Ritam Concurrency & Async Model

Ritam is designed for the modern web and mobile world where asynchronous operations (API calls, File I/O) are the norm.

## 1. Key Concepts
Ritam uses the **Async/Await** model, which is transpiled to Promises in JS/TS and Concurrency (Tasks) in Swift.

## 2. Keywords
| Universal | Tamil | Hindi | Spanish |
|-----------|-------|-------|---------|
| `async` | ஒத்திசைவற்ற | असमकालिक | asincrono |
| `await` | காத்திரு | प्रतीक्षा | esperar |

## 3. Async Functions
An `async` function always returns a **Future** (Promise). 
```ritam
ஒத்திசைவற்ற செயல் தரவு_பெறு() {
    மாறி முடிவு = காத்திரு தரவு_அழைப்பு()
    திருப்பு முடிவு
}
```

## 4. Event Loop Semantics
Ritam programs run on an event loop.
- Blocking the event loop is discouraged.
- Long-running tasks must be `async`.

## 5. Async Error Propagation
If an `await` call fails, the error is thrown as an exception. If not caught, it propagates to the nearest `try/catch` block.
