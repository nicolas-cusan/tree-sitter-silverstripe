/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const htmlGrammar = require('tree-sitter-html/grammar');

module.exports = grammar(htmlGrammar, {
  name: 'silverstripe',

  externals: ($, previous) => previous.concat([
    $.ss_delimiter_start,    // <%
    $.ss_delimiter_end,      // %>
    $.ss_comment_start,      // <%--
    $.ss_comment_end,        // --%>
  ]),

  conflicts: ($, previous) => previous.concat([
    [$.ss_else_if_clause],
    [$.ss_else_clause],
  ]),

  rules: {
    // Extend _node to include SilverStripe constructs
    _node: ($, previous) => choice(
      previous,
      $.ss_comment,
      $.ss_if_statement,
      $.ss_loop_statement,
      $.ss_with_statement,
      $.ss_control_statement,
      $.ss_cached_statement,
      $.ss_uncached_statement,
      $.ss_include,
      $.ss_require,
      $.ss_translation,
      $.ss_variable_closed,
      $.ss_variable,
    ),

    // ---- Comments ----
    ss_comment: $ => seq(
      $.ss_comment_start,
      optional($.ss_comment_content),
      $.ss_comment_end,
    ),

    ss_comment_content: _ => /([^-]|-[^-]|--[^%]|--%-[^>])*/,

    // ---- Block Statements ----

    ss_if_statement: $ => seq(
      $.ss_if_open,
      repeat($._node),
      repeat($.ss_else_if_clause),
      optional($.ss_else_clause),
      $.ss_if_close,
    ),

    ss_if_open: $ => seq(
      $.ss_delimiter_start,
      'if',
      $.ss_expression,
      $.ss_delimiter_end,
    ),

    ss_else_if_clause: $ => seq(
      $.ss_delimiter_start,
      'else_if',
      $.ss_expression,
      $.ss_delimiter_end,
      repeat($._node),
    ),

    ss_else_clause: $ => seq(
      $.ss_delimiter_start,
      'else',
      $.ss_delimiter_end,
      repeat($._node),
    ),

    ss_if_close: $ => seq(
      $.ss_delimiter_start,
      'end_if',
      $.ss_delimiter_end,
    ),

    ss_loop_statement: $ => seq(
      $.ss_loop_open,
      repeat($._node),
      $.ss_loop_close,
    ),

    ss_loop_open: $ => seq(
      $.ss_delimiter_start,
      'loop',
      $.ss_expression,
      $.ss_delimiter_end,
    ),

    ss_loop_close: $ => seq(
      $.ss_delimiter_start,
      'end_loop',
      $.ss_delimiter_end,
    ),

    ss_with_statement: $ => seq(
      $.ss_with_open,
      repeat($._node),
      $.ss_with_close,
    ),

    ss_with_open: $ => seq(
      $.ss_delimiter_start,
      'with',
      $.ss_expression,
      $.ss_delimiter_end,
    ),

    ss_with_close: $ => seq(
      $.ss_delimiter_start,
      'end_with',
      $.ss_delimiter_end,
    ),

    ss_control_statement: $ => seq(
      $.ss_control_open,
      repeat($._node),
      $.ss_control_close,
    ),

    ss_control_open: $ => seq(
      $.ss_delimiter_start,
      'control',
      $.ss_expression,
      $.ss_delimiter_end,
    ),

    ss_control_close: $ => seq(
      $.ss_delimiter_start,
      'end_control',
      $.ss_delimiter_end,
    ),

    ss_cached_statement: $ => seq(
      $.ss_cached_open,
      repeat($._node),
      $.ss_cached_close,
    ),

    ss_cached_open: $ => seq(
      $.ss_delimiter_start,
      'cached',
      optional($.ss_expression),
      $.ss_delimiter_end,
    ),

    ss_cached_close: $ => seq(
      $.ss_delimiter_start,
      'end_cached',
      $.ss_delimiter_end,
    ),

    ss_uncached_statement: $ => seq(
      $.ss_uncached_open,
      repeat($._node),
      $.ss_uncached_close,
    ),

    ss_uncached_open: $ => seq(
      $.ss_delimiter_start,
      'uncached',
      $.ss_delimiter_end,
    ),

    ss_uncached_close: $ => seq(
      $.ss_delimiter_start,
      'end_uncached',
      $.ss_delimiter_end,
    ),

    // ---- Include ----
    ss_include: $ => seq(
      $.ss_delimiter_start,
      'include',
      field('template', $.ss_template_name),
      optional($.ss_include_arguments),
      $.ss_delimiter_end,
    ),

    ss_template_name: _ => /[\w\/\\]+/,

    ss_include_arguments: $ => repeat1($.ss_include_argument),

    ss_include_argument: $ => seq(
      field('name', $.ss_identifier),
      '=',
      field('value', choice($.ss_string, $.ss_variable)),
    ),

    // ---- Require ----
    ss_require: $ => seq(
      $.ss_delimiter_start,
      'require',
      $.ss_require_call,
      $.ss_delimiter_end,
    ),

    ss_require_call: $ => seq(
      field('method', $.ss_identifier),
      '(',
      field('path', $.ss_string),
      ')',
    ),

    // ---- Translation ----
    ss_translation: $ => seq(
      $.ss_delimiter_start,
      token(prec(1, 't')),
      field('key', $.ss_translation_key),
      optional(field('default', $.ss_string)),
      optional($.ss_translation_args),
      $.ss_delimiter_end,
    ),

    ss_translation_key: _ => /[\w.]+/,

    ss_translation_args: $ => repeat1($.ss_translation_arg),

    ss_translation_arg: $ => seq(
      $.ss_identifier,
      '=',
      choice($.ss_string, $.ss_variable),
    ),

    // ---- Variables ----

    // {$Var.Method} style
    ss_variable_closed: $ => seq(
      '{$',
      $.ss_variable_chain,
      '}',
    ),

    // $Var.Method style
    ss_variable: _ => token(prec(1, /\$[\w]+(\.\w+(\([^)]*\))?)*/)),

    // Chain of property/method accesses used inside {$ }
    ss_variable_chain: _ => /[\w]+(\.\w+(\([^)]*\))?)*/,

    // ---- Expressions (used in if, loop, with, etc.) ----
    ss_expression: $ => repeat1(
      choice(
        $.ss_variable,
        $.ss_string,
        $.ss_identifier,
        $.ss_operator,
        $.ss_number,
        $.ss_parenthesized_expression,
      ),
    ),

    ss_parenthesized_expression: $ => seq(
      '(',
      $.ss_expression,
      ')',
    ),

    ss_operator: _ => choice('==', '!=', '&&', '||', '!', '<', '>', '<=', '>='),

    ss_string: _ => token(choice(
      seq("'", /[^']*/, "'"),
      seq('"', /[^"]*/, '"'),
    )),

    ss_identifier: _ => /[a-zA-Z_]\w*/,

    ss_number: _ => /\d+/,

    // Override quoted_attribute_value to support SS variables inside HTML attributes
    // e.g. <a href="$Link" title="{$Title}">
    quoted_attribute_value: $ => choice(
      seq("'", repeat(choice(
        $.ss_variable,
        $.ss_variable_closed,
        alias(/[^'$\{]+|\{/, $.attribute_value),
      )), "'"),
      seq('"', repeat(choice(
        $.ss_variable,
        $.ss_variable_closed,
        alias(/[^"$\{]+|\{/, $.attribute_value),
      )), '"'),
    ),

    // Override HTML text to exclude $ and {$ which are SilverStripe variables
    text: _ => /[^<>&\s$\{]([^<>&$\{]*[^<>&\s$\{])?/,
  },
});
