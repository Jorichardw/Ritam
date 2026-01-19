# 🗺️ Ritam Language Roadmap

This document outlines the planned language support and development roadmap for Ritam.

---

## ✅ Currently Supported Languages (v0.1.2)

| Language | Script | Code | Status |
|----------|--------|------|--------|
| 🇮🇳 Tamil | Tamil | `ta` | ✅ Production |
| 🇮🇳 Hindi | Devanagari | `hi` | ✅ Production |
| 🇮🇳 Telugu | Telugu | `te` | ✅ Production |
| 🇮🇳 Kannada | Kannada | `kn` | ✅ Production |
| 🇮🇳 Malayalam | Malayalam | `ml` | ✅ Production |
| 🇪🇸 Spanish | Latin | `es` | ✅ Production |
| 🇺🇸 English | Latin | `en` | ✅ Production |

---

## 🇮🇳 Indian Languages Roadmap

### Phase 1: South Indian Languages (v0.0.1) ✅ COMPLETE
- [x] Tamil (தமிழ்)
- [x] Telugu (తెలుగు)
- [x] Kannada (ಕನ್ನಡ)
- [x] Malayalam (മലയാളം)

### Phase 2: North Indian Languages (v0.1.0) 
- [x] Hindi (हिंदी) ✅
- [ ] Bengali (বাংলা) - `bn`
- [ ] Marathi (मराठी) - `mr`
- [ ] Gujarati (ગુજરાતી) - `gu`
- [ ] Punjabi (ਪੰਜਾਬੀ) - `pa`

### Phase 3: Other Indian Languages (v0.2.0)
- [ ] Odia (ଓଡ଼ିଆ) - `or`
- [ ] Assamese (অসমীয়া) - `as`
- [ ] Urdu (اردو) - `ur` (RTL support needed)
- [ ] Sanskrit (संस्कृतम्) - `sa`
- [ ] Konkani (कोंकणी) - `kok`
- [ ] Manipuri (মৈতৈলোন্) - `mni`
- [ ] Kashmiri (कॉशुर) - `ks`

### Phase 4: Regional/Tribal Languages (v0.3.0)
- [ ] Bhojpuri (भोजपुरी)
- [ ] Maithili (मैथिली)
- [ ] Santali (ᱥᱟᱱᱛᱟᱲᱤ)
- [ ] Dogri (डोगरी)
- [ ] Sindhi (سنڌي) (RTL support needed)

---

## 🌍 International Languages Roadmap

### Phase 5: European Languages (v0.4.0)
- [ ] French (Français) - `fr`
- [ ] German (Deutsch) - `de`
- [ ] Portuguese (Português) - `pt`
- [ ] Italian (Italiano) - `it`
- [ ] Dutch (Nederlands) - `nl`
- [ ] Russian (Русский) - `ru` (Cyrillic)

### Phase 6: Asian Languages (v0.5.0)
- [ ] Japanese (日本語) - `ja`
- [ ] Korean (한국어) - `ko`
- [ ] Chinese Simplified (简体中文) - `zh-CN`
- [ ] Chinese Traditional (繁體中文) - `zh-TW`
- [ ] Thai (ภาษาไทย) - `th`
- [ ] Vietnamese (Tiếng Việt) - `vi`
- [ ] Indonesian (Bahasa Indonesia) - `id`

### Phase 7: Middle Eastern Languages (v0.6.0)
- [ ] Arabic (العربية) - `ar` (RTL support)
- [ ] Persian (فارسی) - `fa` (RTL support)
- [ ] Hebrew (עברית) - `he` (RTL support)
- [ ] Turkish (Türkçe) - `tr`

### Phase 8: African Languages (v0.7.0)
- [ ] Swahili (Kiswahili) - `sw`
- [ ] Amharic (አማርኛ) - `am`
- [ ] Hausa (Hausa) - `ha`
- [ ] Yoruba (Yorùbá) - `yo`

---

## 📋 Language File Template

When adding a new language, create a JSON file in `src/locales/` with this structure:

```json
{
    "meta": {
        "name": "Language Name",
        "code": "xx",
        "direction": "ltr"  // or "rtl" for right-to-left languages
    },
    "keywords": {
        "var": "...",
        "const": "...",
        "print": "...",
        "if": "...",
        "else": "...",
        "else_if": "...",
        "function": "...",
        "return": "...",
        "struct": "...",
        "enum": "...",
        "while": "...",
        "match": "...",
        "true": "...",
        "false": "...",
        "null": "...",
        "component": "...",
        "render": "...",
        "click": "...",
        "tag": "...",
        "text": "...",
        "attr": "..."
    },
    "messages": {
        "welcome": "...",
        "project_created": "...",
        "error_syntax": "...",
        "error_variable_undefined": "...",
        "error_unexpected_token": "...",
        "error_expected_token": "..."
    }
}
```

---

## 🔧 Technical Requirements for Future Languages

### RTL (Right-to-Left) Language Support
For languages like Arabic, Hebrew, Urdu, and Persian:
- [ ] Add RTL rendering support in WebGenerator
- [ ] Update CLI for RTL terminal output
- [ ] Add RTL code editor support documentation

### Complex Script Support
For languages like Thai, Khmer, Myanmar:
- [ ] Test tokenizer with complex scripts
- [ ] Ensure proper Unicode handling
- [ ] Test variable names in these scripts

### Multi-Script Languages
For languages like Japanese (Kanji, Hiragana, Katakana):
- [ ] Allow mixed script keywords
- [ ] Document recommended keyword choices

---

## 🤝 Contributing Languages

We welcome contributions! To add a new language:

1. Fork the repository
2. Create a new locale file in `src/locales/[language].json`
3. Follow the template above
4. Test with `npm run build` and `node dist/cli.js init`
5. Submit a Pull Request

### Contributor Credits

| Language | Contributor | Version Added |
|----------|-------------|---------------|
| Tamil | Core Team | v0.0.1 |
| Hindi | Core Team | v0.0.1 |
| Telugu | Core Team | v0.0.1 |
| Kannada | Core Team | v0.0.1 |
| Malayalam | Core Team | v0.0.1 |
| Spanish | Core Team | v0.0.1 |

---

## 📅 Release Schedule

| Version | Focus | Target Date |
|---------|-------|-------------|
| v0.0.1 | Initial release + South Indian + Hindi | ✅ Released |
| v0.1.0 | Bengali, Marathi, Gujarati, Punjabi | Q1 2026 |
| v0.2.0 | Remaining Indian languages | Q2 2026 |
| v0.3.0 | Regional languages + RTL support engine | Q3 2026 |
| v0.4.0 | Major European languages | Q4 2026 |
| v0.5.0 | Major Asian languages | Q1 2026-2027 |
| v1.0.0 | Stable release with 30+ languages | Q2 2027 |

---

*Together, let's make programming accessible to everyone, in every language!* 🌏

---

## 📞 Contact

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Email: [dank2joe@gmail]

*Ritam — இணையான மொழி, हर भाषा में, For Everyone* 🇮🇳
