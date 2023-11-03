import { EMPTY, SPACE, NEWLINE, DASH3, CODEBLOCK_PREFIX } from './global_strings';
import { inferIndent, inferLeadingSpaces } from './infer_whitespace';
import { MatchGroup, StringGroup, CaptureGroup, MathJaxGroup } from './matchgroup';
import { splitAllMatchGroups } from './split_matchgroup';


const HEADER_PREFIX = /^#+ /;
const HTML_OPEN = /(?<!\\)<(\w+?)/;
const HTML_CLOSE = /(?<!\\)<\/(\w+?)/;
const ONLY_WHITESPACE = /^\s*$/;
const TABLE_ROW = /(?<!\[\[.*?)(?<!\\)\|(?!.*?\]\])/;


export class StringFormatter {
	text: string;
	character_limit: number;
	result: string[] = [];
	formatted: string = EMPTY;
	
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
		newlines_before_header = 1,
		newlines_after_header = 1,
	) {
		this.text = text;
		this.character_limit = character_limit;
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
		let is_table = false;
		let is_html = false;
		let html_tag: string = EMPTY;
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
			[is_codeblock, ignore] = this.formatIfCodeblock(paragraph, is_codeblock);

			if (ignore) {
				continue;
			}

			// Ignore table
			[is_table, ignore] = this.formatIfTable(
				paragraph,
				paragraphs[i+1],
				is_table,
			);

			if (ignore) {
				continue;
			}

			// Ignore HTML
			if (!is_html) {
				const match_open = paragraph.match(HTML_OPEN);

				if (match_open) {
					is_html = true;
					html_tag = match_open[1];
				}
			}

			if (is_html) {
				const match_close = paragraph.match(HTML_CLOSE);

				if (match_close && match_close[1] === html_tag) {
					is_html = false;
				}

				this.result.push(paragraph);

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
			}
			else {
				this.formatParagraph(paragraph);
			}

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
	formatIfCodeblock(paragraph: string, is_codeblock: boolean): [boolean, boolean] {
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
	 * Formats the paragraph depending on if it's a table.
	 *
	 * Tables start with a line with at least one pipe "|", followed by a line
	 * with at least a dash "-" and pipe "|". Each subsequent line is a table
	 * row if it contains at least one pipe "|".
	 *
	 * @returns the first value determines if the paragraph is entering or
	 *     exiting a table, the second values determines if the paragraph was
	 *     ignored and no further formatting is required.
	 */
	formatIfTable(
		paragraph: string,
		next_paragraph: string | undefined,
		is_table: boolean,
	): [boolean, boolean] {
		const match = paragraph.match(TABLE_ROW);

		if (match) {
			let match_header_row = false;

			if (next_paragraph !== undefined) {
				match_header_row = next_paragraph.includes('-')
					&& next_paragraph.includes('|');
			}

			if (match_header_row) {
				is_table = true;
			}

			if (is_table) {
				this.result.push(paragraph);
				return [true, true];
			}
		}

		return [false, false];
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
		const groups: MatchGroup[] = splitAllMatchGroups([new StringGroup(trimmed)]);

		// Format paragraph
		let length: number = current.length;

		for (let i = 0; i < groups.length; i++) {
			const group: MatchGroup = groups[i];

			// Special rule for MathJax expression on its own line
			if (group instanceof MathJaxGroup) {
				if (current !== indent) {
					this.result.push(current.trimEnd());
				}

				this.result.push(group.text.trimEnd());

				current = indent;
				length = indent.length;

				continue;
			}

			// Add group text to current line
			const proposed_length: number = length + 1 + group.length;

			if (proposed_length <= this.character_limit) {
				const requires_space: boolean = this.requiresSpace(
					groups[i-1],
					groups[i],
				);

				if (current.length > 0 && !current.endsWith(SPACE) && requires_space) {
					current += SPACE;
				}

				current += group.text;
				length = proposed_length;
			}
			else {
				if (!ONLY_WHITESPACE.test(current)) {
					this.result.push(current.trimEnd());
				}

				current = indent + group.text;
				length = indent.length + group.length;
			}
		}

		if (current === EMPTY || !ONLY_WHITESPACE.test(current)) {
			this.result.push(current.trimEnd());
		}
	}

	requiresSpace(prior: MatchGroup | undefined, current: MatchGroup): boolean {
		if (prior === undefined) {
			return false;
		}

		const string_to_string: boolean = (prior instanceof StringGroup)
			&& (current instanceof StringGroup);
		const string_to_capture: boolean = (prior instanceof CaptureGroup)
			&& (current.text === EMPTY);
		const capture_to_string: boolean = (prior.text === EMPTY)
			&& (current instanceof CaptureGroup);

		return string_to_string || string_to_capture || capture_to_string;
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

