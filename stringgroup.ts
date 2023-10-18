export class StringGroupError extends Error {};


export class StringGroup {
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

	verifyGroup(text: string): void {
	};
}


export class MarkdownLinkGroup extends StringGroup {
	constructor(text: string) {
		super(text);

		// Find text in format [this is text](http://link)
		const match = text.match(/\[(.*?)\]/);

		if (match) {
			this.length = Math.max(match[1].length, 2);
		}
	}

	verifyGroup(text: string): void {
		if (text.search(/\[.*\]\(.*\)/) === -1) {
			throw new StringGroupError(`${text} is not a markdown link`);
		}
	}
}

export class WikilinkGroup extends StringGroup {
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
		if (text.search(/\[\[.*\]\]/) === -1) {
			throw new StringGroupError(`${text} is not a wikilink`);
		}
	}
}
