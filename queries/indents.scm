; Indent after opening block directives
(ss_if_open) @indent
(ss_else_clause) @indent @outdent
(ss_else_if_clause) @indent @outdent
(ss_loop_open) @indent
(ss_with_open) @indent
(ss_control_open) @indent
(ss_cached_open) @indent
(ss_uncached_open) @indent

; Dedent on end blocks
(ss_if_close) @outdent
(ss_loop_close) @outdent
(ss_with_close) @outdent
(ss_control_close) @outdent
(ss_cached_close) @outdent
(ss_uncached_close) @outdent
