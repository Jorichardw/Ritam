# Ritam Programming Language

[![Build Status](https://github.com/RichardWilliyam/ritam/actions/workflows/ci.yml/badge.svg)](https://github.com/RichardWilliyam/ritam/actions)
[![npm version](https://img.shields.io/npm/v/ritam.svg)](https://www.npmjs.com/package/ritam)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/ritam.svg)](https://www.npmjs.com/package/ritam)

Ritam is a universal, full-stack, cross-platform web development language designed to let developers code entirely in their native human language.

## 🚀 Why Ritam?
- **Native-First Sovereignty**: Code directly in your thought language. Ritam is not a translation layer; it is a native-language compiler.
- **Universal Reach**: Build for Web, Backend, and Mobile from a single sovereign source.
- **Security by Design**: Explicit `#std` prefixing ensures system-level operations are always visible and secure.

## 🌏 Supported Languages

| Language | Flag | Status |
|----------|------|--------|
| Tamil (தமிழ்) | 🇮🇳 | ✅ Production |
| Hindi (हिंदी) | 🇮🇳 | ✅ Production |
| Telugu (తెలుగు) | 🇮🇳 | ✅ Production |
| Kannada (ಕನ್ನಡ) | 🇮🇳 | ✅ Production |
| Malayalam (മലയാളം) | 🇮🇳 | ✅ Production |
| Spanish (Español) | 🇪🇸 | ✅ Production |

> **Note:** All listed languages support core syntax and native error messages. Advanced features (mobile targets, pattern matching depth, `#std` coverage) may vary slightly by language during the current stable release phase.

## Key Features

- **Native Language Support**: Code in Tamil, Hindi, Telugu, Kannada, Malayalam, and Spanish.
- **100% Script Purity**: Not a single English letter is required in the source code (Sovereign mode).
- **Multi-Target Compilation**: Transpiles Ritam source code into high-performance JavaScript (Node.js/Web), Swift (iOS), and JSX (React Native).
- **Modern Syntax**:
  - Structs & Enums (`கட்டமைப்பு`, `பட்டியல்` / `संरचना`, `गणना`)
  - Pattern Matching (`பொருத்து` / `मिलाओ`)
  - Loops (`சுழற்சி` / `जबतक`)
  - Functions & Components
- **Sovereign Standard Library**: Secure `#std` library with built-in math, string, list, and file operations.
- **Minimal Language Philosophy**: A clean, keyword-minimal core that prioritizes developer intent over syntax boilerplate.
- **Sovereign Mapping**: Internal 1:1 mapping between native descriptors and universal symbols.

## 💎 100% Script Purity

Ritam is arguably the only programming language that allows for **100% script purity**. Not a single English letter is required in your source code (excluding standard punctuation).

**Example (100% Tamil):**
```ritam
செயல் வணக்கம்() {
    பதிவிடு "வணக்கம் உலகம்!"
    மாறி சோதனை = மெய்
    எனில் (சோதனை) {
        #அடித்தளம்.பதிவிடு("இது ஒரு சோதனை.")
    }
}
```

## Installation

```bash
npm install -g ritam

# Verify installation
ritam --version
```

## Quick Start

```bash
# Initialize a new project
ritam init

# Compile your code
ritam compile main.rvx -t node
```

## Language Support

Ritam handles keywords, console output, and **Error Messages** in the native language.

**Example Error (Tamil):**
```
'=' எதிர்பார்க்கப்பட்டது ஆனால் 'EOF' கிடைத்தது (வரி 2)
```

## Compilation Targets

| Target | Command | Status | Output |
|--------|---------|--------|--------|
| Web/Browser | `ritam compile app.rvx -t web` | ✅ Production | `.js` |
| Node.js | `ritam compile app.rvx -t node` | ✅ Production | `.js` |
| Mobile (Swift) | `ritam compile app.rvx -t mobile` | 🧪 Alpha | `.swift` |
| React Native | `ritam compile app.rvx -t react-native` | 🧪 Alpha | `.jsx` |

## Example Code

### Tamil (தமிழ்)
```ritam
கூறு முதன்மை {
  காண்பி "h1" "வணக்கம் உலகம்"
}
```

### Hindi (हिंदी)
```ritam
अंग मुख्य {
  प्रस्तुत "h1" "नमस्ते दुनिया"
}
```

### Telugu (తెలుగు)
```ritam
అంగం ప్రధాన {
  ప్రదర్శించు "h1" "నమస్కారం ప్రపంచం"
}
```

## Stability Guarantees

Ritam is currently in **Version 0.1.x**. While the core syntax for Tamil and Hindi is stable, the Standard Library (#std) and Mobile targets are undergoing active development. We guarantee:
- **Zero-Dependency Core**: The compiler remains lightweight and portable.
- **Native Error Parity**: Errors will always match the language of the source code.
- **Sovereign Isolation**: All privileged system and IO operations require explicit `#std` or `#`-prefixed access.

## Documentation

- [docs/LANGUAGES.md](docs/LANGUAGES.md) — Full keyword reference for all languages
- [docs/QUICKSTART.md](docs/QUICKSTART.md) — Getting started guide
- [docs/ROADMAP.md](docs/ROADMAP.md) — Planned language support

## License

MIT © The Ritam Project

---

*Ritam — Programming in Your Own Language* 🇮🇳

*ரிதம் — உங்கள் சொந்த மொழியில் நிரலாக்கம்*

*रितम — आपकी अपनी भाषा में प्रोग्रामिंग
