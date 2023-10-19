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
}


/**
 * This is a general MatchGroup for strings without any special formatting.
 */
export class StringGroup extends MatchGroup {}


/**
 * This is a general MatchGroup for strings with special formatting used to
 * differentiate from the general StringGroups.
 */
export class CaptureGroup extends MatchGroup {};


export class ExternalLinkGroup extends CaptureGroup {
	static regexp: RegExp = /!?\[.*\]\(.*\)/;

	constructor(text: string) {
		super(text);

		// Find text in between square brackets
		const match = text.match(/\[(.*?)\]/);

		if (match) {
			this.length = Math.max(match[1].length, 2);
		}
	}

	verifyGroup(text: string): void {
		if (text.search(ExternalLinkGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not an external link`);
		}
	}
}

export class InternalLinkGroup extends CaptureGroup {
	static regexp: RegExp = /!?\[\[.*\]\]/;

	constructor(text: string) {
		super(text);

		// Find text in format [[#link|this is text]]
		const match = text.match(/\[\[.*?\|(.*?)\]\]/);

		if (match) {
			this.length = match[1].length;
		}
		else if (text.search(/\[\[.+\]\]/) !== -1){
			this.length = text.length - 4;
		}
	}

	verifyGroup(text: string): void {
		if (text.search(InternalLinkGroup.regexp) === -1) {
			throw new MatchGroupError(`${text} is not an internal link`);
		}
	}
}
