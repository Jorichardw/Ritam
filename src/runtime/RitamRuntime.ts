/**
 * Ritam Runtime Authority (v1.0)
 * 
 * This module defines the sovereignty of Ritam over its host environment.
 * It provides the Error Taxonomy, Task Scheduling, and Stack Management.
 */

export enum RitamErrorCode {
    STACK_OVERFLOW = "R_001",
    NULL_POINTER = "R_002",
    TYPE_MISMATCH = "R_003",
    ASYNC_TIMEOUT = "R_004",
    PERMISSION_DENIED = "R_005",
    UNCAUGHT_EXCEPTION = "R_006"
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
        this.permissions = new Set([
            "io.print", 
            "math.base", 
            "net.fetch", 
            "crypto.base", 
            "test.base"
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

    panic(e) {
        console.error("\\n[Ritam Panic] " + e.message);
        console.error("Stack Trace:");
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const f = this.stack[i];
            console.error(\`  at \${f.name} (\${f.file}:\${f.line})\`);
        }
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
        return {
            print: (v) => {
                this.checkPermission("io.print");
                console.log(v);
            },
            math: {
                add: (a, b) => a + b,
                sub: (a, b) => a - b,
                mul: (a, b) => a * b,
                div: (a, b) => a / b,
                sqrt: (n) => Math.sqrt(n)
            },
            net: {
                fetch: async (url, opts) => {
                    this.checkPermission("net.fetch");
                    const res = await fetch(url, opts);
                    return await res.json();
                }
            },
            crypto: {
                hash: (s) => {
                    this.checkPermission("crypto.base");
                    // Simple hash for demonstration
                    let hash = 0;
                    for (let i = 0; i < s.length; i++) {
                        hash = ((hash << 5) - hash) + s.charCodeAt(i);
                        hash |= 0;
                    }
                    return hash.toString(16);
                },
                random: () => Math.random()
            },
            test: {
                describe: async (name, fn) => {
                    this.checkPermission("test.base");
                    console.log("Testing: " + name);
                    try { await fn(); } catch(e) { console.error("Test Failed: " + e.message); }
                },
                assert: (cond, msg) => {
                    if (!cond) {
                        const err = new Error(msg || "Assertion Failed");
                        throw err;
                    }
                }
            },
            json: {
                parse: (s) => JSON.parse(s),
                stringify: (o) => JSON.stringify(o)
            }
        };
    }
}

const _rt = new RitamRuntime();
const _std = _rt.std;
`;
