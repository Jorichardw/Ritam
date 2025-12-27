# Changelog

All notable changes to this project will be documented in this file.

## [0.1.2] - 2025-12-27
### Added
- Multi-word keyword support for complex native language expressions.
- Reactive UI System with `signal`, `effect`, and `createElement` in `RitamRuntime`.
- Native language support for Hindi and Kannada.
- New example programs: `kannada_counter.rvx` and `hindi_logic.rvx`.
- Added the `click` keyword for UI event binding.
- Added the `--lang` flag to CLI `compile` and `run` commands.

### Changed
- Standardized the sovereign prefix to `#` across the entire ecosystem.
- Refactored `Parser` to support advanced UI nodes and better error recovery.
- Updated `WebGenerator` to produce semantic HTML elements.
- Renamed internal environment variables from `$` to `_` for better safety and readability.

### Fixed
- Fixed `else_if` (localized) not being recognized in certain control flows.
- Resolved "Unexpected Token" errors in generated web code.
- Cleaned up internal analysis reports and junk files for GitHub release.
- Added `in` keyword support to all 7 locales for `for...in` loop syntax.
- Fixed Parser to recognize match statements properly.
- Fixed Telugu, Tamil, Malayalam, and Spanish example files to use correct locale keywords.
- Fixed version inconsistency across CLI and package.json (now unified at 0.1.2).
- Updated repository URLs in package.json to point to actual repository.

## [0.1.1] - 2025-12-24
### Changed
- Initial project structure setup.
- Basic support for Tamil and English.
- Transpilation logic for Node.js and basic Web.

## [0.1.0] - Initial Release
- Core Tokenizer and Parser implementation.
- Basic AST structure.
