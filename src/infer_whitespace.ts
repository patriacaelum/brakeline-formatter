import {
	EMPTY,
	SPACE,
	COMMENT_PREFIX,
} from './global_strings';


const REGEXP_CALLOUT: RegExp = /^(?:> )+/;
const REGEXP_COMMENT: RegExp = /^%% /;
const REGEXP_LIST: RegExp = /^([-|\*|\+] (?:\[[ ?|.?]\] )?)/;
const REGEXP_NUMBERED_LIST: RegExp = /^(\d+)\. /;
const REGEXP_LEADING_SPACES: RegExp = /^\s+/;


/**
 * Infers the number of spaces in the indent for following lines of text based
 * on the first few characters. The string should already be stripped of
 * leading spaces.
 *
 * Lists can start with characters '- ', '* ', or '+ ', with an inferred indent
 * of two.
 *
 * Numbered lists have an inferred indent based on the number of digits in the
 * number equal to `n + 2`, where `n` is the number of digits.
 */
export function inferIndent(text: string): string {
	// Indent for comments
	if (text.search(REGEXP_COMMENT) === 0) {
		return COMMENT_PREFIX;
	}

	// Indent for callouts
	const match_callout = text.match(REGEXP_CALLOUT);

	if (match_callout) {
		return match_callout[0];
	}

	// Indent for lists and task lists
	const match_list = text.match(REGEXP_LIST);

	if (match_list) {
		return SPACE.repeat(match_list[0].length);
	}

	// Indent for numbered lists
	const match_numbered_list = text.match(REGEXP_NUMBERED_LIST);

	if (match_numbered_list) {
		return SPACE.repeat(match_numbered_list[0].length);
	}

	return EMPTY;
}


/**
 * Infers the number of leading spaces at the beginning of the line of text.
 */
export function inferLeadingSpaces(text: string): string {
	const match = text.match(REGEXP_LEADING_SPACES);

	if (match) {
		return match[0];
	}

	return EMPTY;
}
