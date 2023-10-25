import { EMPTY } from './global_strings';


export class MatchGroupError extends Error {}


export abstract class MatchGroup {
	// The regular expression used to find this MatchGroup in a string
	static readonly regexp: RegExp;

	// The raw string value
	text: string;
	// The nominal length of the formatted string value, not the length of the
	// raw string value
	length: number;
	
	constructor(text: string) {
		this.verifyGroup(text);

		this.text = text;
		this.length = text.length;
	}

	verifyGroup(text: string): void {}
}


/**
 * This is a general MatchGroup for strings without any special formatting.
 */
export class StringGroup extends MatchGroup {
	static override readonly regexp: RegExp = /.*?/;

	// Characters for strikethrough, bold, italic, and highlighted text are
	// ignored unless preceded by a backslash, in which case, count the
	// preceding backslash
	static readonly ignored_chars: RegExp = /~~|\*|_|==/g;

	constructor(text: string) {
		super(text);

		const nominal = text.replaceAll(StringGroup.ignored_chars, EMPTY);
		this.length = nominal.length;
	}
}


/**
 * This is a general MatchGroup for strings with special formatting used to
 * differentiate from the general StringGroups.
 */
export class CaptureGroup extends MatchGroup {
	static readonly regexp_display: RegExp;
}


/**
 * A CaptureGroup for inline code as text between backticks.
 */
export class InlineCodeGroup extends CaptureGroup {
	// Capture inline code
	static override readonly regexp: RegExp = /`.*?`/;
	static override readonly regexp_display: RegExp = /`(.*)`/;

	constructor(text: string) {
		super(text);

		const match = text.match(InlineCodeGroup.regexp_display);

		if (match) {
			this.length = Math.max(match[1].length, 2);
		}
	}

	override verifyGroup(text: string): void {
		if (text.search(InlineCodeGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not inline code`);
		}
	}
}


/**
 * A CaptureGroup for Markdown style external links and external images in the
 * format `![displayed text](https://link.com)`, with the optional `!`.
 */
export class ExternalLinkGroup extends CaptureGroup {
	// Capture external link while ignoring backslashes
	static override readonly regexp: RegExp =
		/(?<!\\)!?(?<!\\)\[.*?(?<!\\)\](?<!\\)\(.*?(?<!\\)\)/;
	// Match display text between square brackets
	static override readonly regexp_display: RegExp =
		/(?<!\\)\[(.*?)(?<!\\)\]/;

	constructor(text: string) {
		super(text);

		const match = text.match(ExternalLinkGroup.regexp_display);

		if (match) {
			this.length = Math.max(match[1].length, 2);
		}
	}

	override verifyGroup(text: string): void {
		if (text.search(ExternalLinkGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not an external link`);
		}
	}
}


/**
 * A CaptureGroup for Obsidian flavored Markdown internal links and embedded
 * files in the format `![[link#header|displayed text]]`, with the optional `!`.
 */
export class InternalLinkGroup extends CaptureGroup {
	// Capture internal link while ignoring backslashes
	static override readonly regexp: RegExp =
		/(?<!\\)!?(?<!\\)\[(?<!\\)\[.*?(?<!\\)\](?<!\\)\]/;
	// Match text between square brackets and (optionally) after separator
	static override readonly regexp_display: RegExp =
		/\[\[(?:.*?(?<!\\)\|)?(.+)\]\]/;

	constructor(text: string) {
		super(text);

		const match = text.match(InternalLinkGroup.regexp_display);

		if (match) {
			this.length = match[1].length;
		}
	}

	override verifyGroup(text: string): void {
		if (text.search(InternalLinkGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not an internal link`);
		}
	}
}


/**
 * A CaptureGroup for inline MathJax expressions in the format
 * `$e^{2i\pi} = 1$`.
 * 
 * The length of expressions are difficult to calculate, so they are given the
 * conservative length of the expression without spaces. Especially long or
 * complex expressions should be using MathJax with double dollar signs.
 */
export class InlineMathJaxGroup extends CaptureGroup {
	// Capture inline MathJax expressions while ignoring backslashes
	static override readonly regexp: RegExp = /(?<!\\)\$.*?(?<!\\)\$/;
	// Match text between dollar signs
	static override readonly regexp_display: RegExp = /\$(.*)\$/;

	constructor(text: string) {
		super(text);

		const match = text.match(InlineMathJaxGroup.regexp_display);

		if (match) {
			this.length = match[1].replaceAll(' ', '').length;
		}
	}

	override verifyGroup(text: string): void {
		if (text.search(InlineMathJaxGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not a MathJax expression`);
		}
	}
}
