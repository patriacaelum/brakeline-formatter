import { inferIndent, inferLeadingSpaces } from './infer_whitespace';
import { MatchGroup, StringGroup } from './matchgroup';
import { splitAllMatchGroups } from './split_matchgroup';


const SPACE: string = ' ';
const NEWLINE: string = '\n';
const ONLY_WHITESPACE: RegExp = /^\s*$/;
const END_WITH_WHITESPACE: RegExp = /\s$/;


export function formatString(
	text: string,
	character_limit: number = 80,
): string {
	const paragraphs: string[] = text.split(NEWLINE);
	let result: string[] = [];

	for (let paragraph of paragraphs) {
		// Preserve existing indent
		let current: string = inferLeadingSpaces(paragraph);
		const trimmed: string = paragraph.trimStart();
		let indent: string = current + inferIndent(trimmed);

		// Split paragraph into string groups
		const groups: MatchGroup[] = splitAllMatchGroups(
			[new StringGroup(trimmed)]
		);

		// Format paragraph
		let length: number = current.length;

		for (const group of groups) {
			const proposed_length: number = length + 1 + group.length;

			if (proposed_length <= character_limit) {
				if (current.length > 0 && !current.match(END_WITH_WHITESPACE)) {
					current += SPACE;
				}

				current += group.text;
				length = proposed_length;
			}
			else {
				if (!ONLY_WHITESPACE.test(current)) {
					result.push(current);
				}
				current = indent + group.text;
				length = indent.length + group.length;
			}
		}

		result.push(current);
	}

	const formatted: string = result.join(NEWLINE);

	return formatted;
}
