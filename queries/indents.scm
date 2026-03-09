; Indent after opening block directives
(ss_if_open) @indent
(ss_else_clause) @indent @dedent
(ss_else_if_clause) @indent @dedent
(ss_loop_open) @indent
(ss_with_open) @indent
(ss_control_open) @indent
(ss_cached_open) @indent
(ss_uncached_open) @indent

; Dedent on end blocks
(ss_if_close) @dedent
(ss_loop_close) @dedent
(ss_with_close) @dedent
(ss_control_close) @dedent
(ss_cached_close) @dedent
(ss_uncached_close) @dedent
