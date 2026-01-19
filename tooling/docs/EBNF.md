# Ritam Language Grammar (EBNF)

This document provides a formal definition of the Ritam programming language syntax using Extended Backus-Naur Form (EBNF).

## Root
```ebnf
program = { statement } ;
```

## Statements
```ebnf
statement = var_decl 
          | func_decl 
          | import_decl 
          | export_decl
          | struct_decl 
          | enum_decl
          | component_decl
          | render_stmt
          | if_stmt 
          | while_loop 
          | for_loop
          | return_stmt
          | assignment
          | print_stmt 
          | expression ;

var_decl = ( "var" | locale_var ) identifier "=" expression ;

func_decl = ( "function" | locale_function ) identifier "(" [ param_list ] ")" "{" { statement } "}" ;

param_list = identifier { "," identifier } ;

import_decl = ( "import" | locale_import ) "{" identifier { "," identifier } "}" [ ( "from" | locale_from ) ] string_literal ;

export_decl = ( "export" | locale_export ) ( var_decl | func_decl | struct_decl | enum_decl | component_decl ) ;

struct_decl = ( "struct" | locale_struct ) identifier "{" { identifier ":" identifier } "}" ;

enum_decl = ( "enum" | locale_enum ) identifier "{" identifier { "," identifier } "}" ;

component_decl = ( "component" | locale_component ) identifier "{" { statement } "}" ;

render_stmt = ( "render" | locale_render ) "(" identifier ")" ;

if_stmt = ( "if" | locale_if ) expression "{" { statement } "}" [ ( "else" | locale_else ) "{" { statement } "}" ] ;

while_loop = ( "while" | locale_while ) expression "{" { statement } "}" ;

for_loop = ( "for" | locale_for ) identifier expression "{" { statement } "}" ;

return_stmt = ( "return" | locale_return ) expression ;

assignment = identifier "=" expression ;

print_stmt = ( "print" | locale_print ) expression ;
```

## Expressions
```ebnf
expression = equality ;

equality = comparison { ( "==" | "!=" ) comparison } ;

comparison = term { ( ">" | "<" | ">=" | "<=" ) term } ;

term = factor { ( "+" | "-" ) factor } ;

factor = call { ( "*" | "/" ) call } ;

call = primary [ "(" [ arg_list ] ")" ] ;

arg_list = expression { "," expression } ;

primary = number 
        | string_literal 
        | identifier 
        | array_literal
        | "(" expression ")" ;

array_literal = "[" [ arg_list ] "]" ;
```

## Lexical Components
```ebnf
identifier = letter { letter | digit | "_" } ;
number = [ "-" ] digit { digit } [ "." digit { digit } ] ;
string_literal = '"' { any_character_except_quote } '"' ;
letter = "A"..."Z" | "a"..."z" | Unicode_Letter ;
digit = "0"..."9" ;
```

---

## Localization Tokens
The `locale_*` tokens are replaced by language-specific keywords defined in the locale files (e.g., `tamil.json`, `hindi.json`).

| Universal | Tamil | Hindi | Spanish |
|-----------|-------|-------|---------|
| `var` | மாறி | चर | variable |
| `function` | செயல் | कार्य | funcion |
| `if` | எனில் | अगर | si |
| `print` | பதிவிடு | छापो | imprimir |
| `return` | திருப்பு | लौटाओ | retornar |
| `for` | ஒவ்வொன்றாக | हर | para |
| `import` | இறக்குமதி | आयात | importar |
| `export` | ஏற்றுமதி | निर्यात | exportar |
| `from` | இருந்து | से | desde |
