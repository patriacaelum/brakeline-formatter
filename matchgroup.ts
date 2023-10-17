export abstract class MatchGroup {
	// The raw string value
	text: string;
	// The nominal length of the formatted string value, not the length of the
	// raw string value
	length: number;

	constructor() {
		this.text = "";
		this.length = 0;
	}
}


export class StringGroup extends MatchGroup {
	constructor(text: string) {
		super();

		this.text = text;
		this.length = text.length;
	}
}


export class MarkdownLinkGroup extends MatchGroup {
	constructor(text: string) {
		super();

		// TODO: check this regex
		const match = text.match(/\[(.*?)\]/);

		this.text = text;

		if (match) {
			this.length = match.length;
		}
	}
}

export class WikilinkGroup extends MatchGroup {
	constructor(text: string) {
		super();

		// TODO: check this regex
		const match = text.match(/\[.*?|(.*?)\]/);

		this.text = text;

		if (match) {
			this.length = match.length;
		}
	}
}
