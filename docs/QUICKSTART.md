# Ritam Quickstart Guide

Ritam is now installed and ready. Follow these steps to use it or extend it.

## 1. Running the CLI

To create a new project in your native language:

```bash
ritam init
# or if running locally:
node dist/cli.js init
```

Select your language (e.g., Tamil, Hindi, Telugu) and give your project a name.

## 2. Writing Code (Examples in Different Languages)

Create a file named `demo.rvx`:

### Tamil (தமிழ்)
```ritam
மாறி என்_பெயர் = "Ritam User"
பதிவிடு "வணக்கம் "
பதிவிடு என்_பெயர்
```

### Hindi (हिंदी)
```ritam
चर मेरा_नाम = "Ritam User"
छापो "नमस्ते "
छापो मेरा_नाम
```

### Telugu (తెలుగు)
```ritam
చరరాశి నా_పేరు = "Ritam User"
ముద్రించు "నమస్కారం "
ముద్రించు నా_పేరు
```

### Kannada (ಕನ್ನಡ)
```ritam
ಅಸ್ಥಿರ ನನ್ನ_ಹೆಸರು = "Ritam User"
ಮುದ್ರಿಸು "ನಮಸ್ಕಾರ "
ಮುದ್ರಿಸು ನನ್ನ_ಹೆಸರು
```

### Malayalam (മലയാളം)
```ritam
ചരം എന്റെ_പേര് = "Ritam User"
അച്ചടിക്കുക "നമസ്കാരം "
അച്ചടിക്കുക എന്റെ_പേര്
```

## 3. Compiling Code

```bash
# Compile to Web
ritam compile demo.rvx -t web

# Compile to Node.js
ritam compile demo.rvx -t node

# Compile to iOS (Swift)
ritam compile demo.rvx -t mobile

# Compile to React Native
ritam compile demo.rvx -t react-native
```

## 4. Adding a New Language

Create a new JSON file in `src/locales/` (e.g., `bengali.json`):

```json
{
    "meta": {
        "name": "Bengali",
        "code": "bn",
        "direction": "ltr"
    },
    "keywords": {
        "var": "চলক",
        "print": "মুদ্রণ",
        "if": "যদি",
        "else": "নতুবা",
        "function": "ফাংশন",
        "return": "ফেরত"
    },
    "messages": {
        "welcome": "Ritam-এ স্বাগতম!",
        "project_created": "প্রকল্প সফলভাবে তৈরি হয়েছে।"
    }
}
```

Then rebuild with `npm run build`. Ritam will automatically detect the new language!

## 5. Supported Languages

Currently supported:
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Malayalam (മലയാളം)
- 🇪🇸 Spanish (Español)

See `LANGUAGES.md` for the full keyword reference and `ROADMAP.md` for planned languages.
