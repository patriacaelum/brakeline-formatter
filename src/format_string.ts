import { inferIndent, inferLeadingSpaces } from './infer_whitespace';
import { MatchGroup, StringGroup } from './matchgroup';
import { splitAllMatchGroups } from './split_matchgroup';


function formatText(text: string): string {
	// Format text
	const paragraphs: string[] = text.split('\n');
	let result: string[] = [];

	for (let paragraph of paragraphs) {
		// Preserve existing indent
		let current: string = this.inferLeadingSpaces(paragraph);
		const trimmed: string = paragraph.trimStart();
		let indent: string = current + this.inferIndent(trimmed);

		// Split words over link formats
		let words: MatchGroup[] = [new StringGroup(trimmed)];
		words = this.splitAllMatchGroups(words);
		// const words: string[] = trimmed.split(' ');

		// Format paragraph
		for (const word of words) {
			const length: number = current.length + word.length + 1;
			if (length <= this.settings.characterLimit) {
				if (current.length > 0 && !current.match(/\s$/)) {
					current += ' ';
				}

				current += word;
			}
			else {
				result.push(current);
				current = indent + word;
			}
		}

		result.push(current);
	}

	const formatted: string = result.join('\n');

	return formatted;
}
