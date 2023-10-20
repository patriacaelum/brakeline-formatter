export class MatchGroupError extends Error {};


export abstract class MatchGroup {
	// The regular expression used to find this MatchGroup in a string
	static regexp: RegExp = /.*?/;

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

	verifyGroup(text: string): void {};
};


/**
 * This is a general MatchGroup for strings without any special formatting.
 */
export class StringGroup extends MatchGroup {};


/**
 * This is a general MatchGroup for strings with special formatting used to
 * differentiate from the general StringGroups.
 */
export class CaptureGroup extends MatchGroup {};


/**
 * A CaptureGroup for Markdown style external links and external images in the
 * format `![displayed text](https://link.com)`, with the optional `!`.
 */
export class ExternalLinkGroup extends CaptureGroup {
	// Capture external link while ignoring backslashes
	static regexp: RegExp = /(?<!\\)!?(?<!\\)\[.*?(?<!\\)\](?<!\\)\(.*?(?<!\\)\)/;
	// Match display text between square brackets
	static regexp_display: RegExp = /(?<!\\)\[(.*?)(?<!\\)\]/;

	constructor(text: string) {
		super(text);

		// Find text between square brackets
		const match = text.match(ExternalLinkGroup.regexp_display);

		if (match) {
			this.length = Math.max(match[1].length, 2);
		}
	}

	verifyGroup(text: string): void {
		if (text.search(ExternalLinkGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not an external link`);
		}
	}
};


/**
 * A CaptureGroup for Obsidian flavored Markdown internal links and embedded
 * files in the format `![[link#header|displayed text]]`, with the optional `!`.
 */
export class InternalLinkGroup extends CaptureGroup {
	// Capture internal link while ignoring backslashes
	static regexp: RegExp = /(?<!\\)!?(?<!\\)\[(?<!\\)\[.*?(?<!\\)\](?<!\\)\]/;
	// Match text between square brackets and (optionally) after separator
	static regexp_display: RegExp = /\[\[(?:.*?(?<!\\)\|)?(.+)\]\]/;

	constructor(text: string) {
		super(text);

		// Find text between square brackets and (optionally) after separator
		const match = text.match(InternalLinkGroup.regexp_display);

		if (match) {
			this.length = match[1].length;
		}
	}

	verifyGroup(text: string): void {
		if (text.search(InternalLinkGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not an internal link`);
		}
	}
};
