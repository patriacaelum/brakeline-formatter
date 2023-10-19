const REGEXP_LIST: RegExp = /^([-\*\+] )/;
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
	let indent: number = 0;

	if (text.search(REGEXP_LIST) === 0) {
		// Add indent for lists
		indent += 2;
	}
	else {
		// Add indent for numbered lists
		const match = text.match(REGEXP_NUMBERED_LIST);

		if (match) {
			indent += match[0].length;
		}
	}

	return ' '.repeat(indent);
}


/**
 * Infers the number of leading spaces at the beginning of the line of text.
 */
export function inferLeadingSpaces(text: string): string {
	const match = text.match(REGEXP_LEADING_SPACES);

	if (match) {
		return match[0];
	}

	return '';
}
