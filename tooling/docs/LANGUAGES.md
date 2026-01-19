# 🌍 Ritam Language Support

Ritam is a **multilingual programming language** that allows developers to write code in their **native human language**. This document details the supported languages and how Ritam differs from other programming languages.

---

## 📚 Currently Supported Languages

| Language | Code | Script | Keywords | Error Messages | Status |
|----------|------|--------|----------|----------------|--------|
| 🇮🇳 **Tamil** (தமிழ்) | `ta` | Tamil | ✅ Full | ✅ Full | Production |
| 🇮🇳 **Hindi** (हिंदी) | `hi` | Devanagari | ✅ Full | ✅ Full | Production |
| 🇮🇳 **Telugu** (తెలుగు) | `te` | Telugu | ✅ Full | ✅ Full | Production |
| 🇮🇳 **Kannada** (ಕನ್ನಡ) | `kn` | Kannada | ✅ Full | ✅ Full | Production |
| 🇮🇳 **Malayalam** (മലയാളം) | `ml` | Malayalam | ✅ Full | ✅ Full | Production |
| 🇪🇸 **Spanish** (Español) | `es` | Latin | ✅ Full | ✅ Full | Production |

---

## 🗣️ Keyword Comparison Across Languages

### Basic Keywords

| Concept | Tamil | Hindi | Telugu | Kannada | Malayalam | Spanish |
|---------|-------|-------|--------|---------|-----------|--------|
| Variable | `மாறி` | `चर` | `చరరాశి` | `ಅಸ್ಥಿರ` | `ചരം` | `variable` |
| Constant | `நிலையான` | `स्थिर` | `స్థిరం` | `ಸ್ಥಿರ` | `സ്ഥിരം` | `constante` |
| Print | `பதிவிடு` | `छापो` | `ముద్రించు` | `ಮುದ್ರಿಸು` | `അച്ചടിക്കുക` | `imprimir` |
| If | `எனில்` | `अगर` | `ఒకవేళ` | `ಆದರೆ` | `എങ്കിൽ` | `si` |
| Else | `இல்லையேல்` | `वरना` | `లేకపోతే` | `ಇಲ್ಲದಿದ್ದರೆ` | `അല്ലെങ്കിൽ` | `sino` |
| Function | `செயல்` | `कार्य` | `పనితీరు` | `ಕಾರ್ಯ` | `ഫങ്ഷൻ` | `funcion` |
| Return | `திருப்பு` | `लौटाओ` | `తిరిగివ్వు` | `ಹಿಂತಿರುಗಿಸು` | `തിരികെ` | `retornar` |

### Advanced Keywords

| Concept | Tamil | Hindi | Telugu | Kannada | Malayalam | Spanish |
|---------|-------|-------|--------|---------|-----------|--------|
| Struct | `கட்டமைப்பு` | `संरचना` | `నిర్మాణం` | `ರಚನೆ` | `ഘടന` | `estructura` |
| Enum | `பட்டியல்` | `गणना` | `లెక్కింపు` | `ಎಣಿಕೆ` | `എണ്ണൽ` | `enumeracion` |
| While | `சுழற்சி` | `जबतक` | `అయ్యేవరకు` | `ವರೆಗೆ` | `ആകുമ്പോൾ` | `mientras` |
| For | `ஒவ்வொன்றாக` | `हर` | `ప్రతి` | `ಪ್ರತಿ` | `ഓരോ` | `para` |
| Match | `பொருத்து` | `मिलाओ` | `సరిపోల్చు` | `ಹೊಂದಿಸು` | `പൊരൂத்தപ്പെടൂத்தുക` | `coincidir` |
| True | `true` | `सत्य` | `నిజం` | `ನಿಜ` | `ശരി` | `verdadero` |
| False | `false` | `असत्य` | `తప్పు` | `ಸುಳ್ಳು` | `തെറ്റ്` | `falso` |
| Null | `வெற்று` | `शून्य` | `శూన్యం` | `ಶೂನ್ಯ` | `ശൂന്യം` | `nulo` |

### UI/Component Keywords

| Concept | Tamil | Hindi | Telugu | Kannada | Malayalam | Spanish |
|---------|-------|-------|--------|---------|-----------|--------|
| Component | `கூறு` | `अंग` | `భాగం` | `ಘಟಕ` | `ഘടകം` | `componente` |
| Render | `காண்பி` | `प्रस्तुत` | `ప్రదర్శించు` | `ಪ್ರದರ್ಶಿಸು` | `പ്രദർശിപ്പിക്കുക` | `renderizar` |
| Click | `சுடுக்கு` | `क्लिक` | `క్లిక్` | `ಕ್ಲಿಕ್` | `ക്ലികക്` | `clic` |

---

## 💬 Hello World in Every Language

### Tamil (தமிழ்)
```ritam
பதிவிடு "வணக்கம் உலகம்"
```

### Hindi (हिंदी)
```ritam
छापो "नमस्ते दुनिया"
```

### Telugu (తెలుగు)
```ritam
ముద్రించు "నమస్కారం ప్రపంచం"
```

### Kannada (ಕನ್ನಡ)
```ritam
ಮುದ್ರಿಸು "ನಮಸ್ಕಾರ ಪ್ರಪಂಚ"
```

### Malayalam (മലയാളം)
```ritam
അച്ചടിക്കുക "നമസ്കാരം ലോകം"
```

### Spanish (Español)
```ritam
imprimir "Hola Mundo"
```

---

## 🆚 How Ritam Differs from Other Languages

### 1. **Native Language Keywords**

| Feature | JavaScript/Python | Ritam |
|---------|-------------------|-------|
| Keywords | English only | 6 languages (5 Indian + Spanish) |
| Error Messages | English only | Localized in user's language |
| Learning Curve | Requires English | Code in your mother tongue |

### 2. **Universal Compilation Targets**

| Target | Other Languages | Ritam |
|--------|-----------------|-------|
| Web Browser | Separate tools needed | ✅ Built-in (`-t web`) |
| Node.js Backend | Native (JS) | ✅ Built-in (`-t node`) |
| iOS (Swift) | Requires Swift knowledge | ✅ Built-in (`-t mobile`) |
| React Native | Requires React knowledge | ✅ Built-in (`-t react-native`) |

**One source code → Multiple platforms!**

### 3. **Comparison with Similar Projects**

| Feature | Ritam | Qalb (Arabic) | Wenyan (Chinese) | Hedy |
|---------|-------|---------------|------------------|------|
| Multi-language support | ✅ 7 languages | Arabic only | Chinese only | 20+ (simplified) |
| Indian language support | ✅ 5 languages | No | No | No |
| Full programming features | ✅ Yes | Limited | Limited | Learning-focused |
| Cross-platform output | ✅ 4 targets | JavaScript only | JavaScript only | Python only |
| UI/Component system | ✅ Yes | No | No | No |

### 4. **Localized Error Messages**

When errors occur, Ritam displays them in the user's selected language:

**Tamil:**
```
'=' எதிர்பார்க்கப்பட்டது ஆனால் 'EOF' கிடைத்தது (வரி 2)
```
```
'=' अपेक्षित था लेकिन 'EOF' मिला (पंक्ति 2)
```

**Tamil:**
```
'=' எதிர்பார்க்கப்பட்டது ஆனால் 'EOF' கிடைத்தது (வரி 2)
```

**Telugu:**
```
'=' ఊహించారు కానీ 'EOF' కనుగొన్నారు (వరుస 2)
```

---

## 🎯 Target Audience

1. **Non-English Speaking Developers** — Write code in your native language
2. **Students Learning Programming** — Understand concepts without English barrier
3. **Indian Developers** — First language with comprehensive support for 5 Indian languages
4. **Cross-Platform Developers** — One codebase, multiple outputs
5. **Localization Teams** — Build apps with native language support from day one

---

## 🚀 Quick Start

```bash
# Install Ritam
npm install -g ritam

# Initialize a project
ritam init

# Select your language (Tamil, Hindi, Telugu, Kannada, Malayalam, Spanish)
# Write code in your native language
# Compile to any platform!

ritam compile main.rvx -t web
ritam compile main.rvx -t node
ritam compile main.rvx -t mobile
ritam compile main.rvx -t react-native
```

---

## 📊 Key Differentiators Summary

| What Makes Ritam Unique |
|------------------------|
| ✅ Code in 6 languages (5 Indian + Spanish) |
| ✅ First programming language with Tamil, Telugu, Kannada, Malayalam support |
| ✅ Localized error messages in every language |
| ✅ Single codebase → Web, Mobile, Backend, React Native |
| ✅ Modern programming features (structs, enums, pattern matching) |
| ✅ Reactive UI system with signals |
| ✅ Open source and extensible |

---

## 🔮 Coming Soon

See `ROADMAP.md` for planned languages including:
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Punjabi (ਪੰਜਾਬੀ)
- And 30+ international languages!

---

*Ritam — Programming in Your Language, For Every Platform* 🌏

*ரிதம் — உங்கள் மொழியில் நிரலாக்கம்* 🇮🇳

*रितम — आपकी भाषा में प्रोग्रामिंग* 🇮🇳
