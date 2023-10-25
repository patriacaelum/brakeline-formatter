import {
	EMPTY,
	SPACE,
	NEWLINE,
	DASH3,
	CODEBLOCK_PREFIX,
} from './global_strings';
import { inferIndent, inferLeadingSpaces } from './infer_whitespace';
import { MatchGroup, StringGroup } from './matchgroup';
import { splitAllMatchGroups } from './split_matchgroup';


const HEADER_PREFIX = /^#+ /;
const ONLY_WHITESPACE = /^\s*$/;
const END_WITH_WHITESPACE = /\s$/;


export class StringFormatter {
	text: string;
	character_limit: number;
	result: string[] = [];
	formatted: string = EMPTY;
	
	ignore_external_links: boolean;
	ignore_internal_links: boolean;
	ignore_mathjax_expressions: boolean;

	newlines_before_header: number;
	newlines_after_header: number;

	/**
	 * The StringFormatter takes a string and formats it according to the
	 * following guidelines:
	 * 
	 */
	constructor(
		text: string,
		character_limit = 80,
		ignore_external_links = true,
		ignore_internal_links = true,
		ignore_mathjax_expressions = true,
		newlines_before_header = 1,
		newlines_after_header = 1,
	) {
		this.text = text;
		this.character_limit = character_limit;

		this.ignore_external_links = ignore_external_links;
		this.ignore_internal_links = ignore_internal_links;
		this.ignore_mathjax_expressions = ignore_mathjax_expressions;

		this.newlines_before_header = newlines_before_header;
		this.newlines_after_header = newlines_after_header;
	}

	/**
	 * The main method for this class.
	 * 
	 * This method takes the stored text and splits up the string into an array
	 * of MatchGroups and joined so that each line does not exceed
	 * `this.character_limit`. Each line is then stored in `this.result`. Once
	 * the entire text has been formatted, `this.result` is joined together with
	 * newlines, stored in `this.formatted`, and returned.
	 */
	format(): string {
		const paragraphs: string[] = this.text.split(NEWLINE);
		let is_frontmatter: boolean = paragraphs[0] === DASH3;
		let is_codeblock = false;
		let newlines = 0;

		for (let i = 0; i < paragraphs.length; i++) {
			const paragraph: string = paragraphs[i];
			let ignore = false;

			// Ignore frontmatter
			if (i > 0 && paragraph === DASH3) {
				is_frontmatter = false;
			}

			if (is_frontmatter) {
				this.result.push(paragraph);

				continue;
			}

			// Ignore codeblock
			[is_codeblock, ignore] = this.formatIfCodeblock(
				paragraph,
				is_codeblock,
			);

			if (ignore) {
				continue;
			}

			// Continue as usual
			const is_header: boolean = paragraph.search(HEADER_PREFIX) !== -1;

			// Add newlines that need to be added to the begining of this
			// paragraph
			newlines = this.inferNewlinesBeforeLine(newlines, is_header);
			this.result[this.result.length-1] += NEWLINE.repeat(newlines);

			if (is_header) {
				// Headers ignore character limit
				this.result.push(paragraph);

				continue;
			}

			this.formatParagraph(paragraph);

			newlines = this.inferNewlinesAfterLine(is_header);
		}

		this.formatted = this.result.join(NEWLINE);

		return this.formatted;
	}

	/**
	 * Formats the paragraph depending on if it's a codeblock.
	 *
	 * Codeblocks, including the opening and closing line, ignore the character
	 * limit.
	 *
	 * @returns the first value determines if the paragraph is entering or
	 *     exiting a codeblock, the second value determines if the paragraph
	 *     was ignored and no further formatting is required.
	 */
	formatIfCodeblock(
		paragraph: string,
		is_codeblock: boolean,
	): [boolean, boolean] {
		if (paragraph.startsWith(CODEBLOCK_PREFIX)) {
			is_codeblock = !is_codeblock;

			// Special case for closing codeblock
			if (!is_codeblock) {
				this.result.push(paragraph);

				return [is_codeblock, true];
			}
		}

		if (is_codeblock) {
			this.result.push(paragraph);

			return [is_codeblock, true];
		}


		return [is_codeblock, false];
	}

	/**
	 * Formats a single paragraph of text.
	 * 
	 * This method is used by `this.format()` and not intended to be called
	 * directly.
	 * 
	 * This method takes a block of text that has already been stripped of
	 * newlines, splits it up into an array of MatchGroups, and joins them back
	 * together so that each line of text does not exceed
	 * `this.character_limit`. The formatted text is appended to `this.result`.
	 */
	formatParagraph(paragraph: string): void {
		// Preserve existing indent
		let current: string = inferLeadingSpaces(paragraph);
		const trimmed: string = paragraph.trimStart();
		const indent: string = current + inferIndent(trimmed);

		// Split paragraph into string groups
		const groups: MatchGroup[] = splitAllMatchGroups(
			[new StringGroup(trimmed)]
		);

		// Format paragraph
		let length: number = current.length;

		for (let i = 0; i < groups.length; i++) {
			const group: MatchGroup = groups[i];
			const proposed_length: number = length + 1 + group.length;

			// Add group text to current line
			if (proposed_length <= this.character_limit) {
				if (current.length > 0 && !current.match(END_WITH_WHITESPACE)) {
					current += SPACE;
				}

				current += group.text;
				length = proposed_length;
			}
			else {
				if (!ONLY_WHITESPACE.test(current)) {
					this.result.push(current);
				}
				current = indent + group.text;
				length = indent.length + group.length;
			}
		}

		this.result.push(current);
	}

	/**
	 * Infers the number of newlines that need to be inserted before this line.
	 * 
	 * There is no difference if the line is not a header. If the line is a
	 * header, then this method looks at the end of `this.result` and infers the
	 * number of additional newlines that need to added to satisfy
	 * `this.newlines_before_header`.
	 * 
	 * @param newlines: the number of newlines that are required after the
	 *     previous line.
	 */
	inferNewlinesBeforeLine(newlines: number, is_header: boolean): number {
		const n_lines: number = this.result.length;

		if (is_header && n_lines > 0) {
			// Find the number of existing newlines before header
			let existing_newlines = 0;
			const lookback_min: number = Math.max(
				n_lines - this.newlines_before_header,
				0
			);

			for (let i = n_lines; i >= lookback_min; i--) {
				if (!this.result[i-1].match(ONLY_WHITESPACE)) {
					existing_newlines = n_lines - i;

					break;
				}
			}
	
			newlines = Math.max(newlines, this.newlines_before_header)
				- existing_newlines;
		}

		return newlines;
	}

	/**
	 * Infers the number of newlines that need to be inserted after this line.
	 */
	inferNewlinesAfterLine(is_header: boolean): number {
		if (is_header) {
			return this.newlines_after_header;
		}

		return 0;
	}
}

