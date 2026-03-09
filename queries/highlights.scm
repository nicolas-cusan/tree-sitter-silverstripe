; ---- HTML (inherited from tree-sitter-html) ----

(tag_name) @tag
(erroneous_end_tag_name) @tag
(doctype) @constant
(attribute_name) @attribute
(attribute_value) @string
(comment) @comment

["<" ">" "</" "/>"] @punctuation.bracket

; ---- SilverStripe comments (<%-- --%> colored as comment, not punctuation) ----

(ss_comment_start) @comment
(ss_comment_end) @comment
(ss_comment_content) @comment.doc

; ---- SilverStripe delimiters (<% %>) ----

(ss_delimiter_start) @punctuation.special
(ss_delimiter_end) @punctuation.special

; ---- Keywords - conditionals (including attribute-level) ----

(ss_if_open "if" @keyword)
(ss_else_if_clause "else_if" @keyword)
(ss_else_clause "else" @keyword)
(ss_attr_else_if_clause "else_if" @keyword)
(ss_attr_else_clause "else" @keyword)
(ss_if_close "end_if" @keyword)

; ---- Keywords - loops ----

(ss_loop_open "loop" @keyword)
(ss_loop_close "end_loop" @keyword)

; ---- Keywords - blocks ----

(ss_with_open "with" @keyword)
(ss_with_close "end_with" @keyword)
(ss_control_open "control" @keyword)
(ss_control_close "end_control" @keyword)
(ss_cached_open "cached" @keyword)
(ss_cached_close "end_cached" @keyword)
(ss_uncached_open "uncached" @keyword)
(ss_uncached_close "end_uncached" @keyword)

; ---- Include/Require ----

(ss_include "include" @keyword)
(ss_require "require" @keyword)
(ss_template_name) @string.special
(ss_require_call
  method: (ss_identifier) @function
  path: (ss_string) @string)

; ---- Translation ----

(ss_translation "t" @keyword)
(ss_translation
  key: (ss_translation_key) @string.special)

; ---- Variables ----

(ss_variable) @constant
(ss_variable_closed) @constant

; ---- Operators ----

(ss_operator) @operator

; ---- Strings ----

(ss_string) @string

; ---- Numbers ----

(ss_number) @number

; ---- Identifiers in arguments ----

(ss_include_argument
  name: (ss_identifier) @property)
(ss_translation_arg
  (ss_identifier) @property)
