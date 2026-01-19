/**
 * Ritam Runtime Authority (v1.1)
 * 
 * This module defines the sovereignty of Ritam over its host environment.
 * It provides the Error Taxonomy, Task Scheduling, Stack Management,
 * and the complete Standard Library.
 */

export enum RitamErrorCode {
    STACK_OVERFLOW = "R_001",
    NULL_POINTER = "R_002",
    TYPE_MISMATCH = "R_003",
    ASYNC_TIMEOUT = "R_004",
    PERMISSION_DENIED = "R_005",
    UNCAUGHT_EXCEPTION = "R_006",
    FILE_NOT_FOUND = "R_007",
    INDEX_OUT_OF_BOUNDS = "R_008"
}

export class RitamRuntimeError extends Error {
    constructor(public code: RitamErrorCode, message: string, public stackTrace?: string) {
        super(`[${code}] Ritam Runtime Error: ${message}`);
        this.name = "RitamRuntimeError";
    }
}

export const RitamRuntimeSource = `
class RitamRuntime {
    constructor() {
        this.stack = [];
        this.locals = new Map();
        this.signals = new Map();
        this.activeEffect = null;
        this.mountRoot = null;
        this.sourceMap = new Map(); // For error mapping
        this.permissions = new Set([
            "io.print", 
            "io.file",
            "math.base", 
            "str.base",
            "list.base",
            "net.fetch", 
            "crypto.base", 
            "test.base",
            "time.base"
        ]);
    }

    pushFrame(name, file = "unknown", line = 0) {
        this.stack.push({ name, file, line, timestamp: Date.now() });
        if (this.stack.length > 1000) {
            throw new Error("[R_001] Stack Overflow");
        }
    }

    popFrame() {
        this.stack.pop();
    }

    getStackTrace() {
        let trace = "";
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const f = this.stack[i];
            trace += \`  at \${f.name} (\${f.file}:\${f.line})\\n\`;
        }
        return trace;
    }

    panic(e) {
        console.error("\\n[Ritam Panic] " + e.message);
        console.error("Stack Trace:");
        console.error(this.getStackTrace());
    }

    signal(val) {
        const runtime = this;
        return {
            _val: val,
            _subscribers: new Set(),
            get value() {
                if (runtime.activeEffect) {
                    this._subscribers.add(runtime.activeEffect);
                }
                return this._val;
            },
            set value(v) {
                this._val = v;
                this._subscribers.forEach(s => s());
            }
        };
    }

    effect(fn) {
        const effectFn = () => {
            const prev = this.activeEffect;
            this.activeEffect = effectFn;
            try {
                fn();
            } finally {
                this.activeEffect = prev;
            }
        };
        effectFn();
    }

    createElement(tag, props, children) {
        const el = document.createElement(tag);
        
        Object.entries(props).forEach(([k, v]) => {
            if (k === 'text') {
                this.effect(() => {
                    let val = (typeof v === 'function') ? v() : v;
                    val = (val && typeof val === 'object' && 'value' in val) ? val.value : val;
                    el.textContent = val;
                });
            } else if (k.startsWith('on')) {
                const event = k.toLowerCase().substring(2);
                el.addEventListener(event, v);
            } else {
                this.effect(() => {
                    let val = (typeof v === 'function') ? v() : v;
                    val = (val && typeof val === 'object' && 'value' in val) ? val.value : val;
                    el.setAttribute(k, val);
                });
            }
        });

        if (children) {
            children.forEach(c => {
                const textNode = document.createTextNode("");
                this.effect(() => {
                    let val = (typeof c === 'function') ? c() : c;
                    
                    if (val instanceof HTMLElement) {
                        if (textNode.parentElement === el) el.removeChild(textNode);
                        if (val.parentElement !== el) el.appendChild(val);
                    } else if (val !== undefined && val !== null) {
                        val = (val && typeof val === 'object' && 'value' in val) ? val.value : val;
                        textNode.textContent = val;
                        if (textNode.parentElement !== el) el.appendChild(textNode);
                    }
                });
            });
        }

        // Auto-mount if root (simple heuristic for now)
        if (typeof document !== 'undefined' && !el.parentElement && tag !== 'body') {
            const root = this.mountRoot || document.body;
            root.appendChild(el);
        }
        
        return el;
    }

    checkPermission(p) {
        if (!this.permissions.has(p)) {
            throw new Error("[R_005] Permission Denied: " + p);
        }
    }

    get std() {
        const runtime = this;
        return {
            // ============ I/O Functions ============
            print: (v) => {
                runtime.checkPermission("io.print");
                console.log(v);
            },

            // ============ Math Functions ============
            math: {
                add: (a, b) => a + b,
                sub: (a, b) => a - b,
                mul: (a, b) => a * b,
                div: (a, b) => {
                    if (b === 0) throw new Error("[R_003] Division by zero");
                    return a / b;
                },
                pow: (base, exp) => Math.pow(base, exp),
                sqrt: (n) => {
                    if (n < 0) throw new Error("[R_003] Cannot take square root of negative number");
                    return Math.sqrt(n);
                },
                abs: (n) => Math.abs(n),
                floor: (n) => Math.floor(n),
                ceil: (n) => Math.ceil(n),
                round: (n) => Math.round(n),
                min: (...args) => Math.min(...args),
                max: (...args) => Math.max(...args),
                sin: (n) => Math.sin(n),
                cos: (n) => Math.cos(n),
                tan: (n) => Math.tan(n),
                log: (n) => Math.log(n),
                PI: Math.PI,
                E: Math.E
            },

            // ============ String Functions ============
            str: {
                len: (s) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.length;
                },
                concat: (a, b) => {
                    runtime.checkPermission("str.base");
                    return String(a) + String(b);
                },
                upper: (s) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.toUpperCase();
                },
                lower: (s) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.toLowerCase();
                },
                trim: (s) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.trim();
                },
                split: (s, delimiter) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.split(delimiter);
                },
                join: (arr, delimiter) => {
                    runtime.checkPermission("str.base");
                    if (!Array.isArray(arr)) throw new Error("[R_003] Expected array");
                    return arr.join(delimiter);
                },
                includes: (s, search) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.includes(search);
                },
                replace: (s, search, replacement) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.replace(search, replacement);
                },
                charAt: (s, index) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    if (index < 0 || index >= s.length) throw new Error("[R_008] Index out of bounds");
                    return s.charAt(index);
                },
                substring: (s, start, end) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.substring(start, end);
                },
                startsWith: (s, prefix) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.startsWith(prefix);
                },
                endsWith: (s, suffix) => {
                    runtime.checkPermission("str.base");
                    if (typeof s !== 'string') throw new Error("[R_003] Expected string");
                    return s.endsWith(suffix);
                }
            },

            // ============ List (Array) Functions ============
            list: {
                push: (list, item) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return [...list, item];
                },
                pop: (list) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.slice(0, -1);
                },
                len: (list) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.length;
                },
                get: (list, index) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    if (index < 0 || index >= list.length) throw new Error("[R_008] Index out of bounds");
                    return list[index];
                },
                set: (list, index, value) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    const newList = [...list];
                    newList[index] = value;
                    return newList;
                },
                first: (list) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    if (list.length === 0) throw new Error("[R_008] List is empty");
                    return list[0];
                },
                last: (list) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    if (list.length === 0) throw new Error("[R_008] List is empty");
                    return list[list.length - 1];
                },
                reverse: (list) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return [...list].reverse();
                },
                sort: (list) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return [...list].sort();
                },
                filter: (list, fn) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.filter(fn);
                },
                map: (list, fn) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.map(fn);
                },
                reduce: (list, fn, initial) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.reduce(fn, initial);
                },
                includes: (list, item) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.includes(item);
                },
                indexOf: (list, item) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.indexOf(item);
                },
                concat: (list1, list2) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list1) || !Array.isArray(list2)) throw new Error("[R_003] Expected arrays");
                    return [...list1, ...list2];
                },
                slice: (list, start, end) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.slice(start, end);
                },
                isEmpty: (list) => {
                    runtime.checkPermission("list.base");
                    if (!Array.isArray(list)) throw new Error("[R_003] Expected array");
                    return list.length === 0;
                }
            },

            // ============ File I/O Functions (Node.js only) ============
            file: {
                read: (path) => {
                    runtime.checkPermission("io.file");
                    if (typeof require !== 'undefined') {
                        const fs = require('fs');
                        if (!fs.existsSync(path)) throw new Error("[R_007] File not found: " + path);
                        return fs.readFileSync(path, 'utf-8');
                    } else {
                        throw new Error("[R_005] File I/O not available in browser");
                    }
                },
                write: (path, data) => {
                    runtime.checkPermission("io.file");
                    if (typeof require !== 'undefined') {
                        const fs = require('fs');
                        fs.writeFileSync(path, data, 'utf-8');
                        return true;
                    } else {
                        throw new Error("[R_005] File I/O not available in browser");
                    }
                },
                exists: (path) => {
                    runtime.checkPermission("io.file");
                    if (typeof require !== 'undefined') {
                        const fs = require('fs');
                        return fs.existsSync(path);
                    } else {
                        throw new Error("[R_005] File I/O not available in browser");
                    }
                },
                delete: (path) => {
                    runtime.checkPermission("io.file");
                    if (typeof require !== 'undefined') {
                        const fs = require('fs');
                        if (!fs.existsSync(path)) throw new Error("[R_007] File not found: " + path);
                        fs.unlinkSync(path);
                        return true;
                    } else {
                        throw new Error("[R_005] File I/O not available in browser");
                    }
                },
                append: (path, data) => {
                    runtime.checkPermission("io.file");
                    if (typeof require !== 'undefined') {
                        const fs = require('fs');
                        fs.appendFileSync(path, data, 'utf-8');
                        return true;
                    } else {
                        throw new Error("[R_005] File I/O not available in browser");
                    }
                }
            },

            // ============ Time Functions ============
            time: {
                now: () => {
                    runtime.checkPermission("time.base");
                    return Date.now();
                },
                date: () => {
                    runtime.checkPermission("time.base");
                    return new Date().toISOString();
                },
                year: () => {
                    runtime.checkPermission("time.base");
                    return new Date().getFullYear();
                },
                month: () => {
                    runtime.checkPermission("time.base");
                    return new Date().getMonth() + 1;
                },
                day: () => {
                    runtime.checkPermission("time.base");
                    return new Date().getDate();
                },
                hour: () => {
                    runtime.checkPermission("time.base");
                    return new Date().getHours();
                },
                minute: () => {
                    runtime.checkPermission("time.base");
                    return new Date().getMinutes();
                },
                second: () => {
                    runtime.checkPermission("time.base");
                    return new Date().getSeconds();
                },
                format: (timestamp, format) => {
                    runtime.checkPermission("time.base");
                    const d = new Date(timestamp);
                    // Simple format implementation
                    return d.toLocaleString();
                },
                sleep: async (ms) => {
                    runtime.checkPermission("time.base");
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
            },

            // ============ Network Functions ============
            net: {
                fetch: async (url, opts) => {
                    runtime.checkPermission("net.fetch");
                    const res = await fetch(url, opts);
                    return await res.json();
                },
                get: async (url) => {
                    runtime.checkPermission("net.fetch");
                    const res = await fetch(url);
                    return await res.json();
                },
                post: async (url, body) => {
                    runtime.checkPermission("net.fetch");
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    return await res.json();
                },
                getText: async (url) => {
                    runtime.checkPermission("net.fetch");
                    const res = await fetch(url);
                    return await res.text();
                }
            },

            // ============ Crypto Functions ============
            crypto: {
                hash: (s) => {
                    runtime.checkPermission("crypto.base");
                    // Simple hash for demonstration
                    let hash = 0;
                    for (let i = 0; i < s.length; i++) {
                        hash = ((hash << 5) - hash) + s.charCodeAt(i);
                        hash |= 0;
                    }
                    return hash.toString(16);
                },
                random: () => {
                    runtime.checkPermission("crypto.base");
                    return Math.random();
                },
                randomInt: (min, max) => {
                    runtime.checkPermission("crypto.base");
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                },
                uuid: () => {
                    runtime.checkPermission("crypto.base");
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                },
                base64Encode: (s) => {
                    runtime.checkPermission("crypto.base");
                    if (typeof btoa !== 'undefined') {
                        return btoa(s);
                    } else {
                        return Buffer.from(s).toString('base64');
                    }
                },
                base64Decode: (s) => {
                    runtime.checkPermission("crypto.base");
                    if (typeof atob !== 'undefined') {
                        return atob(s);
                    } else {
                        return Buffer.from(s, 'base64').toString('utf-8');
                    }
                }
            },

            // ============ Test Functions ============
            test: {
                describe: async (name, fn) => {
                    runtime.checkPermission("test.base");
                    console.log("Testing: " + name);
                    try { 
                        await fn(); 
                        console.log("✅ " + name + " passed");
                    } catch(e) { 
                        console.error("❌ Test Failed: " + e.message);
                        console.error(runtime.getStackTrace());
                    }
                },
                assert: (cond, msg) => {
                    runtime.checkPermission("test.base");
                    if (!cond) {
                        const err = new Error(msg || "Assertion Failed");
                        throw err;
                    }
                },
                assertEqual: (actual, expected, msg) => {
                    runtime.checkPermission("test.base");
                    if (actual !== expected) {
                        throw new Error(msg || \`Expected \${expected} but got \${actual}\`);
                    }
                },
                assertNotEqual: (actual, notExpected, msg) => {
                    runtime.checkPermission("test.base");
                    if (actual === notExpected) {
                        throw new Error(msg || \`Expected values to be different, but both were \${actual}\`);
                    }
                },
                assertTrue: (cond, msg) => {
                    runtime.checkPermission("test.base");
                    if (cond !== true) {
                        throw new Error(msg || "Expected true");
                    }
                },
                assertFalse: (cond, msg) => {
                    runtime.checkPermission("test.base");
                    if (cond !== false) {
                        throw new Error(msg || "Expected false");
                    }
                },
                assertNull: (val, msg) => {
                    runtime.checkPermission("test.base");
                    if (val !== null && val !== undefined) {
                        throw new Error(msg || "Expected null or undefined");
                    }
                }
            },

            // ============ JSON Functions ============
            json: {
                parse: (s) => JSON.parse(s),
                stringify: (o) => JSON.stringify(o),
                prettyPrint: (o) => JSON.stringify(o, null, 2)
            },

            // ============ Console Functions ============
            console: {
                log: (...args) => console.log(...args),
                error: (...args) => console.error(...args),
                warn: (...args) => console.warn(...args),
                info: (...args) => console.info(...args),
                debug: (...args) => console.debug(...args),
                table: (data) => console.table(data),
                clear: () => console.clear()
            },

            // ============ Type Checking Functions ============
            type: {
                of: (val) => typeof val,
                isString: (val) => typeof val === 'string',
                isNumber: (val) => typeof val === 'number',
                isBoolean: (val) => typeof val === 'boolean',
                isArray: (val) => Array.isArray(val),
                isObject: (val) => typeof val === 'object' && val !== null && !Array.isArray(val),
                isFunction: (val) => typeof val === 'function',
                isNull: (val) => val === null,
                isUndefined: (val) => val === undefined,
                isNaN: (val) => Number.isNaN(val),
                toNumber: (val) => Number(val),
                toString: (val) => String(val),
                toBoolean: (val) => Boolean(val)
            }
        };
    }
}

const _rt = new RitamRuntime();
const _std = _rt.std;
`;
