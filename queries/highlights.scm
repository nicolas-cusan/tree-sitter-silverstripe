; Comments
(ss_comment) @comment.block

; Keywords - conditionals
(ss_if_open "if" @keyword.conditional)
(ss_else_if_clause "else_if" @keyword.conditional)
(ss_else_clause "else" @keyword.conditional)
(ss_if_close "end_if" @keyword.conditional)

; Keywords - loops
(ss_loop_open "loop" @keyword.repeat)
(ss_loop_close "end_loop" @keyword.repeat)

; Keywords - blocks
(ss_with_open "with" @keyword)
(ss_with_close "end_with" @keyword)
(ss_control_open "control" @keyword)
(ss_control_close "end_control" @keyword)
(ss_cached_open "cached" @keyword)
(ss_cached_close "end_cached" @keyword)
(ss_uncached_open "uncached" @keyword)
(ss_uncached_close "end_uncached" @keyword)

; Include/Require
(ss_include "include" @keyword.import)
(ss_require "require" @keyword.import)
(ss_template_name) @string.special
(ss_require_call
  method: (ss_identifier) @function.method
  path: (ss_string) @string)

; Translation
(ss_translation "t" @keyword)
(ss_translation
  key: (ss_translation_key) @string.special)

; Variables
(ss_variable) @variable
(ss_variable_closed) @variable

; Operators
(ss_operator) @operator

; Strings
(ss_string) @string

; Numbers
(ss_number) @number

; Identifiers in arguments
(ss_include_argument
  name: (ss_identifier) @property)
(ss_translation_arg
  (ss_identifier) @property)
